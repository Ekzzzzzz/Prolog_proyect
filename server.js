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

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ejecutar Prolog
function ejecutarProlog() {
    return new Promise((resolve, reject) => {
        const comando = 'swipl -q -t "ejecutar_sistema,halt." academic_system.pl';
        exec(comando, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
                return;
            }
            resolve(procesarSalidaProlog(stdout));
        });
    });
}

// Procesar salida de Prolog
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
            if (partes.length === 4) {
                resultado.cronograma.push({
                    curso: partes[0],
                    profesor: partes[1],
                    horario: partes[2],
                    aula: partes[3]
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
    try {
        const resultado = await ejecutarProlog();
        res.json({ success: true, data: resultado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// Obtener profesores
app.get('/api/profesores', (req, res) => {
    const comando = 'swipl -q -s academic_system.pl -g "findall(X, profesor(X), L), write(L), halt."';
    exec(comando, (error, stdout, stderr) => {
        if (error || stderr) {
            res.status(500).json({ error: 'Error al obtener profesores' });
            return;
        }
        try {
            const profesores = stdout.trim().replace(/\[|\]/g, '').split(',').map(p => p.trim()).filter(p => p);
            const profesoresConDisponibilidad = profesores.map(prof => {
                const comandoDisp = `swipl -q -s academic_system.pl -g "findall(H, disponible(${prof}, H), L), write(L), halt."`;
                try {
                    const salidaDisp = require('child_process').execSync(comandoDisp).toString();
                    const horarios = salidaDisp.trim().replace(/\[|\]/g, '').split(',').map(h => h.trim().replace(/_/g, ' ')).filter(h => h);
                    return {
                        id: prof.split('_')[1] || prof,
                        nombre: prof.replace(/_/g, ' '),
                        disponibilidad: horarios
                    };
                } catch (err) {
                    return {
                        id: prof.split('_')[1] || prof,
                        nombre: prof.replace(/_/g, ' '),
                        disponibilidad: []
                    };
                }
            });
            res.json(profesoresConDisponibilidad);
        } catch (err) {
            res.status(500).json({ error: 'Error procesando profesores' });
        }
    });
});

// Obtener cursos
app.get('/api/cursos-info', (req, res) => {
    const comando = 'swipl -q -s academic_system.pl -g "listar_cursos, halt."';
    exec(comando, (error, stdout, stderr) => {
        if (error || stderr) {
            res.status(500).json({ error: 'Error al obtener cursos' });
            return;
        }
        try {
            const rawCursos = stdout.trim().match(/curso\(([^)]+)\)/g);
            const cursos = rawCursos.map(curso => {
                const [nombre, tipo, ciclo] = curso.replace(/curso\(|\)/g, '').split(',').map(s => s.trim());
                return {
                    id: nombre.split('_')[1] || nombre,
                    nombre: nombre.replace(/_/g, ' '),
                    tipo,
                    ciclo
                };
            });
            res.json(cursos);
        } catch (err) {
            res.status(500).json({ error: 'Error procesando cursos' });
        }
    });
});

// Exportar a Google Sheets
app.post('/api/exportar-sheets', async (req, res) => {
    try {
        const cronograma = req.body.cronograma;
        const spreadsheetId = '1xkxwzInJ6uDK2ENAHYKljQiqDYG8m903dGvXaqYGTtA'; // Replace with your Google Sheet ID

        const shiftMap = {
            'lunes_8': 'Morning', 'martes_8': 'Morning', 'miercoles_8': 'Morning', 'jueves_8': 'Morning', 'viernes_8': 'Morning',
            'lunes_14': 'Afternoon', 'martes_14': 'Afternoon', 'miercoles_14': 'Afternoon', 'jueves_14': 'Afternoon', 'viernes_14': 'Afternoon',
            'lunes_18': 'Evening', 'martes_18': 'Evening', 'miercoles_18': 'Evening', 'jueves_18': 'Evening', 'viernes_18': 'Evening'
        };

        // Group by shift
        const shifts = { Morning: [], Afternoon: [], Evening: [] };
        cronograma.forEach(a => {
            const shift = shiftMap[a.horario] || 'Morning';
            shifts[shift].push([a.curso, a.profesor, a.horario, a.aula]);
        });

        // Create or update sheets
        const sheetTitles = ['Morning', 'Afternoon', 'Evening'];
        for (const title of sheetTitles) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{
                        addSheet: { properties: { title } }
                    }]
                }
            }).catch(() => {}); // Ignore if sheet exists

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${title}!A1:D`,
                valueInputOption: 'RAW',
                resource: { values: [['Curso', 'Profesor', 'Horario', 'Aula'], ...shifts[title]] }
            });
        }

        res.json({ success: true, spreadsheetId, message: 'Cronograma exportado a Google Sheets' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

app.get('/api/test-sheets', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: '1xkxwzInJ6uDK2ENAHYKljQiqDYG8m903dGvXaqYGTtA'
        });
        res.json({ success: true, message: 'Conexión exitosa', title: response.data.properties.title });
    } catch (error) {
        res.status(500).json({ success: false, error: error.toString() });
    }
});