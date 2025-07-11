const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

// Configuración
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Función mejorada para ejecutar Prolog
function ejecutarProlog(res, consulta) {
    const cmd = `swipl -q -s prolog/facts/database.pl -s prolog/rules/scheduling.pl -g "${consulta}" -t halt`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error('Error en Prolog:', {error, stdout, stderr});
            return res.status(500).json({ 
                error: 'Error en el servidor Prolog',
                details: stderr || error.message
            });
        }
        
        try {
            // Asegura que siempre sea un array
            let resultado = stdout.trim() === '' ? [] : JSON.parse(stdout);
            if (!Array.isArray(resultado)) {
                resultado = [resultado];
            }
            res.json(resultado);
        } catch (e) {
            console.error('Error parseando JSON:', e, '\nRespuesta:', stdout);
            res.status(500).json({
                error: 'Error procesando respuesta',
                raw: stdout
            });
        }
    });
}

// API Docentes
app.get('/api/docentes', (req, res) => ejecutarProlog(res, "consultar_docentes"));
app.post('/api/docentes', (req, res) => {
    const { nombre, categoria, experiencia } = req.body;
    ejecutarProlog(res, `agregar_docente('${nombre}', '${categoria}', ${experiencia})`);
});
app.delete('/api/docentes/:id', (req, res) => ejecutarProlog(res, `eliminar_docente(${req.params.id})`));

// API Cursos
app.get('/api/cursos', (req, res) => ejecutarProlog(res, "consultar_cursos"));
app.post('/api/cursos', (req, res) => {
    const { nombre, creditos, ciclo } = req.body;
    ejecutarProlog(res, `agregar_curso('${nombre}', ${creditos}, ${ciclo})`);
});
app.delete('/api/cursos/:id', (req, res) => ejecutarProlog(res, `eliminar_curso(${req.params.id})`));

// API Disponibilidad
app.get('/api/disponibilidad', (req, res) => ejecutarProlog(res, "consultar_disponibilidad"));
app.post('/api/disponibilidad', (req, res) => {
    const { id_docente, dia, turno, inicio, fin } = req.body;
    ejecutarProlog(res, `agregar_disponibilidad(${id_docente}, '${dia}', '${turno}', ${inicio}, ${fin})`);
});
app.delete('/api/disponibilidad', (req, res) => {
    const { id_docente, dia, turno, inicio, fin } = req.body;
    ejecutarProlog(res, `eliminar_disponibilidad(${id_docente}, '${dia}', '${turno}', ${inicio}, ${fin})`);
});

// API Cronograma
app.get('/api/cronograma', (req, res) => ejecutarProlog(res, "consultar_cronograma"));
app.post('/api/asignaciones', (req, res) => {
    const { id_curso, id_docente, dia, turno, inicio, fin } = req.body;
    ejecutarProlog(res, `agregar_asignacion(${id_curso}, ${id_docente}, '${dia}', '${turno}', ${inicio}, ${fin})`);
});
app.delete('/api/cronograma', (req, res) => ejecutarProlog(res, "limpiar_cronograma"));

// Manejo de errores
app.use((req, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Ruta base: ${__dirname}`);
});