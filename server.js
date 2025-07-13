const express = require('express');
const { exec } = require('child_process');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ejecutar Prolog para generar cronograma
function ejecutarProlog(ciclo, turno) {
    return new Promise((resolve, reject) => {
        const comando = `swipl -q -t "ejecutar_sistema(${ciclo},'${turno}'),halt." academic_system.pl`;
        console.log('Ejecutando comando:', comando);
        exec(comando, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(stderr || error.message);
                return;
            }
            resolve(procesarSalidaProlog(stdout));
        });
    });
}

// Procesar salida del Prolog
function procesarSalidaProlog(salida) {
    const lineas = salida.split('\n').filter(linea => linea.trim());
    const resultado = {
        cronograma: [],
        estado: 'desconocido',
        conflictos: [],
        mensaje: ''
    };

    let procesandoCronograma = false;
    let procesandoConflictos = false;

    for (const linea of lineas) {
        if (linea.includes('CRONOGRAMA_GENERADO:')) {
            procesandoCronograma = true;
            procesandoConflictos = false;
            continue;
        }
        if (linea.includes('ESTADO_CRONOGRAMA:')) {
            procesandoCronograma = false;
            continue;
        }
        if (linea.includes('CRONOGRAMA VALIDO')) {
            resultado.estado = 'valido';
            resultado.mensaje = 'Cronograma sin conflictos';
            continue;
        }
        if (linea.includes('CRONOGRAMA INVALIDO')) {
            resultado.estado = 'invalido';
            resultado.mensaje = 'Cronograma con conflictos';
            procesandoConflictos = true;
            continue;
        }
        if (linea.includes('ERROR:')) {
            resultado.estado = 'error';
            resultado.mensaje = linea.replace('ERROR:', '').trim();
            continue;
        }
        if (procesandoCronograma && linea.includes('ASIGNACION:')) {
            const partes = linea.replace('ASIGNACION:', '').split('|').map(p => p.trim());
            if (partes.length === 8) {
                resultado.cronograma.push({
                    curso: partes[0].replace(/_/g, ' ').toUpperCase(),
                    seccion: partes[1],
                    profesor: partes[2].replace(/_/g, ' ').toUpperCase(),
                    pabellon: partes[3].toUpperCase(),
                    piso: partes[4],
                    aula: partes[5],
                    horario: partes[6],
                    turno: partes[7].toUpperCase()
                });
            }
        }
        if (procesandoConflictos && linea.includes('CONFLICTO:')) {
            resultado.conflictos.push(linea.replace('CONFLICTO:', '').trim());
        }
    }
    return resultado;
}

// Generar cronograma
app.post('/api/generar-cronograma', async (req, res) => {
    const { ciclo, turno } = req.body;
    if (!ciclo || !['m', 't', 'n'].includes(turno.toLowerCase())) {
        return res.status(400).json({ success: false, error: 'Ciclo o turno inválido' });
    }
    try {
        const resultado = await ejecutarProlog(ciclo, turno.toLowerCase());
        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error('Error en /api/generar-cronograma:', error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// Obtener profesores
app.get('/api/profesores', (req, res) => {
    const comando = 'swipl -q -s academic_system.pl -g "listar_profesores,halt."';
    exec(comando, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Error en /api/profesores:', stderr || error.message);
            return res.status(500).json({ success: false, error: 'Error al obtener profesores' });
        }
        try {
            const match = stdout.match(/PROFESORES:\[(.*?)\]/);
            if (!match) throw new Error('Formato de salida inválido');

            const profesoresRaw = match[1].split(',').map(p => p.trim()).filter(Boolean);
            const profesores = profesoresRaw.map(prof => ({
                id: prof.split('_')[1] || prof,
                nombre: prof.replace(/_/g, ' ').toUpperCase(),
                disponibilidad: ['Todos los horarios'] // Dummy info, mejora si tu Prolog devuelve disponibilidad real
            }));

            res.json({ success: true, data: profesores });
        } catch (err) {
            console.error('Error procesando profesores:', err);
            res.status(500).json({ success: false, error: 'Error procesando profesores' });
        }
    });
});

// Obtener cursos
app.get('/api/cursos-info', (req, res) => {
    const comando = 'swipl -q -s academic_system.pl -g "listar_cursos,halt."';
    exec(comando, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Error en /api/cursos-info:', stderr || error.message);
            return res.status(500).json({ success: false, error: 'Error al obtener cursos' });
        }
        try {
            const match = stdout.match(/CURSOS:\[(.*?)\]/);
            if (!match) throw new Error('Formato de salida inválido');

            const cursosRaw = match[1].split(',').map(c => c.trim()).filter(Boolean);
            const cursos = cursosRaw.map(curso => {
                const [nombre, tipo, ciclo, horas] = curso.split(';').map(s => s.trim());
                return {
                    id: nombre.split('_')[1] || nombre,
                    nombre: nombre.replace(/_/g, ' ').toUpperCase(),
                    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
                    ciclo,
                    horas
                };
            });

            res.json({ success: true, data: cursos });
        } catch (err) {
            console.error('Error procesando cursos:', err);
            res.status(500).json({ success: false, error: 'Error procesando cursos' });
        }
    });
});

// Exportar a Google Sheets
app.post('/api/exportar-sheets', async (req, res) => {
    try {
        const cronograma = req.body.cronograma;
        const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Reemplaza con el ID real

        const turnos = { M: [], T: [], N: [] };
        cronograma.forEach(a => {
            turnos[a.turno].push([
                a.curso,
                a.seccion,
                a.profesor,
                a.pabellon,
                a.piso,
                a.aula,
                a.horario
            ]);
        });

        const sheetTitles = ['Mañana', 'Tarde', 'Noche'];
        for (const [index, title] of sheetTitles.entries()) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{ addSheet: { properties: { title } } }]
                }
            }).catch(() => {}); // Si ya existe, lo ignora

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${title}!A1:G`,
                valueInputOption: 'RAW',
                resource: {
                    values: [
                        ['Curso', 'Sección', 'Docente', 'Pabellón', 'Piso', 'Aula', 'Horario'],
                        ...turnos[['M', 'T', 'N'][index]]
                    ]
                }
            });
        }

        res.json({ success: true, spreadsheetId, message: 'Cronograma exportado correctamente' });
    } catch (error) {
        console.error('Error en /api/exportar-sheets:', error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
