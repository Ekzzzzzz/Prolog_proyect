const express = require('express');
const { spawn, exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ruta principal para servir la interfaz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Función para ejecutar Prolog y obtener resultados
function ejecutarProlog() {
    return new Promise((resolve, reject) => {
        // Comando para ejecutar SWI-Prolog
        const comando = 'swipl -q -t "ejecutar_sistema,halt." academic_system.pl';
        
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.error('Error ejecutando Prolog:', error);
                reject(`Error ejecutando Prolog: ${error.message}`);
                return;
            }
            
            if (stderr) {
                console.error('Error en Prolog:', stderr);
                reject(`Error en Prolog: ${stderr}`);
                return;
            }
            
            // Procesar la salida de Prolog
            const resultado = procesarSalidaProlog(stdout);
            resolve(resultado);
        });
    });
}

// Función para procesar la salida de Prolog
function procesarSalidaProlog(salida) {
    const lineas = salida.split('\n').filter(linea => linea.trim() !== '');
    
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
            resultado.mensaje = 'Cronograma generado exitosamente sin conflictos';
            continue;
        }
        
        if (linea.includes('CRONOGRAMA INVALIDO')) {
            resultado.estado = 'invalido';
            resultado.mensaje = 'Cronograma generado con conflictos detectados';
            procesandoConflictos = true;
            continue;
        }
        
        if (linea.includes('ERROR:')) {
            resultado.estado = 'error';
            resultado.mensaje = linea.replace('ERROR:', '').trim();
            continue;
        }
        
        if (procesandoCronograma && linea.includes('ASIGNACION:')) {
            const asignacion = procesarAsignacion(linea);
            if (asignacion) {
                resultado.cronograma.push(asignacion);
            }
        }
        
        if (procesandoConflictos && linea.includes('CONFLICTO:')) {
            const conflicto = linea.replace('CONFLICTO:', '').trim();
            resultado.conflictos.push(conflicto);
        }
    }
    
    return resultado;
}

// Función para procesar una línea de asignación
function procesarAsignacion(linea) {
    try {
        // Formato: "ASIGNACION: curso | profesor | horario | aula"
        const partes = linea.replace('ASIGNACION:', '').split('|').map(p => p.trim());
        
        if (partes.length === 4) {
            return {
                curso: partes[0],
                profesor: partes[1],
                horario: partes[2],
                aula: partes[3]
            };
        }
    } catch (error) {
        console.error('Error procesando asignación:', error);
    }
    return null;
}

// Endpoint para generar cronograma
app.post('/api/generar-cronograma', async (req, res) => {
    try {
        console.log('Iniciando generación de cronograma...');
        const resultado = await ejecutarProlog();
        
        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        console.error('Error generando cronograma:', error);
        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

// Endpoint para obtener estadísticas del cronograma
app.get('/api/estadisticas', async (req, res) => {
    try {
        const resultado = await ejecutarProlog();
        
        const estadisticas = {
            totalCursos: resultado.cronograma.length,
            totalProfesores: [...new Set(resultado.cronograma.map(a => a.profesor))].length,
            totalAulas: [...new Set(resultado.cronograma.map(a => a.aula))].length,
            totalHorarios: [...new Set(resultado.cronograma.map(a => a.horario))].length,
            estado: resultado.estado,
            conflictos: resultado.conflictos.length
        };
        
        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

// Endpoint para consultar asignaciones por profesor
app.get('/api/profesor/:nombre', async (req, res) => {
    try {
        const nombreProfesor = req.params.nombre;
        const resultado = await ejecutarProlog();
        
        const asignacionesProfesor = resultado.cronograma.filter(
            asignacion => asignacion.profesor === nombreProfesor
        );
        
        res.json({
            success: true,
            data: {
                profesor: nombreProfesor,
                asignaciones: asignacionesProfesor,
                total: asignacionesProfesor.length
            }
        });
    } catch (error) {
        console.error('Error consultando profesor:', error);
        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

// Endpoint para consultar ocupación de aulas
app.get('/api/aula/:nombre', async (req, res) => {
    try {
        const nombreAula = req.params.nombre;
        const resultado = await ejecutarProlog();
        
        const ocupacionAula = resultado.cronograma.filter(
            asignacion => asignacion.aula === nombreAula
        );
        
        res.json({
            success: true,
            data: {
                aula: nombreAula,
                ocupacion: ocupacionAula,
                total: ocupacionAula.length
            }
        });
    } catch (error) {
        console.error('Error consultando aula:', error);
        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

// Endpoint para obtener información del sistema
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        data: {
            sistema: 'Sistema de Asignación Académica Automatizado',
            version: '1.0.0',
            tecnologias: ['Node.js', 'Express', 'SWI-Prolog'],
            descripcion: 'Sistema automatizado para asignación de cursos usando backtracking en Prolog'
        }
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`=== SISTEMA DE ASIGNACIÓN ACADÉMICA ===`);
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Presiona Ctrl+C para detener el servidor`);
    
    // Verificar si existe el archivo de Prolog
    if (fs.existsSync('academic_system.pl')) {
        console.log('✓ Archivo Prolog encontrado: academic_system.pl');
    } else {
        console.log('✗ ADVERTENCIA: No se encontró academic_system.pl');
    }
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n=== CERRANDO SERVIDOR ===');
    process.exit(0);
});

app.get('/api/profesores', (req, res) => {
    const comando = 'swipl -q -s academic_system.pl -g "findall(X, profesor(X), L), write(L), halt."';

    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error('Error al ejecutar Prolog:', error);
            res.status(500).json({ error: 'Error al obtener profesores' });
            return;
        }

        console.log('Salida de Prolog:', stdout);

        try {
            const profesores = stdout.trim()
                .replace(/\[|\]/g, '')                     // quitar corchetes
                .split(',')                               // separar por coma
                .map(p => p.trim())                       // quitar espacios
                .filter(p => p);                          // eliminar vacíos

            const profesoresConDisponibilidad = profesores.map(prof => {
                // comando para obtener disponibilidad de cada profesor
                const comandoDisp = `swipl -q -s academic_system.pl -g "findall(H, disponible(${prof}, H), L), write(L), halt."`;

                try {
                    const salidaDisp = execSync(comandoDisp).toString();
                    const horarios = salidaDisp
                        .trim()
                        .replace(/\[|\]/g, '')
                        .split(',')
                        .map(h => h.trim().replace(/_/g, ' '))
                        .filter(h => h); // eliminar vacíos

                    return {
                        id: prof.split('_')[1] || prof,
                        nombre: prof.replace(/_/g, ' '),
                        disponibilidad: horarios
                    };
                } catch (err) {
                    console.error(`Error obteniendo disponibilidad de ${prof}:`, err);
                    return {
                        id: prof.split('_')[1] || prof,
                        nombre: prof.replace(/_/g, ' '),
                        disponibilidad: []
                    };
                }
            });

            res.json(profesoresConDisponibilidad);
        } catch (err) {
            console.error('Error procesando datos de profesores:', err);
            res.status(500).json({ error: 'Error procesando datos de profesores' });
        }
    });
});

app.get('/api/cursos-info', (req, res) => {
  const comando = 'swipl -q -s academic_system.pl -g "listar_cursos, halt."';
  
  exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error('Error ejecutando Prolog:', error);
      res.status(500).json({ error: 'Error al obtener cursos' });
      return;
    }

    try {
      const rawCursos = stdout.trim().match(/curso\(([^)]+)\)/g);
      if (!rawCursos) {
        throw new Error('No se encontraron cursos en la salida de Prolog');
      }

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
      console.error('Error procesando datos de cursos:', err);
      res.status(500).json({ error: 'Error procesando datos de cursos' });
    }
  });
});


module.exports = app;