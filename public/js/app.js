let cronogramaActual = null;
let estadisticasActuales = null;

// Función para mostrar loading
function mostrarLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Procesando con Prolog...</p>
                </div>
            `;
}

function ocultarLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = ''; // Limpia el contenido
}

// Función para mostrar error
function mostrarError(elementId, mensaje) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
                <div class="error">
                    <strong>Error:</strong> ${mensaje}
                </div>
            `;
}

// Función para actualizar el estado
function actualizarEstado(estado, mensaje, detalles = '') {
    const indicator = document.getElementById('statusIndicator');
    const text = document.getElementById('statusText');
    const messageEl = document.getElementById('statusMessage');

    indicator.className = `status-indicator ${estado}`;
    text.textContent = mensaje;
    messageEl.textContent = detalles;
}

// Función principal para generar cronograma
async function generarCronograma() {
    try {
        actualizarEstado('cargando', 'Generando cronograma...', 'Ejecutando lógica de Prolog con backtracking');
        mostrarLoading('cronogramaContent');
        mostrarLoading('conflictosContent');

        const response = await fetch('/api/generar-cronograma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            cronogramaActual = data.data;
            mostrarCronograma(data.data);
            mostrarConflictos(data.data);

            if (data.data.estado === 'valido') {
                actualizarEstado('valido', 'Cronograma válido generado', data.data.mensaje);
            } else {
                actualizarEstado('invalido', 'Cronograma con conflictos', data.data.mensaje);
            }
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error:', error);
        actualizarEstado('invalido', 'Error al generar cronograma', error.message);
        mostrarError('cronogramaContent', error.message);
        mostrarError('conflictosContent', 'No se pudieron detectar conflictos');
    }
}

// Función para mostrar cronograma
function mostrarCronograma(data) {
    const container = document.getElementById('cronogramaContent');

    if (!data.cronograma || data.cronograma.length === 0) {
        container.innerHTML = '<p>No se generaron asignaciones.</p>';
        return;
    }

    let html = `
                <table class="cronograma-table">
                    <thead>
                        <tr>
                            <th>Curso</th>
                            <th>Profesor</th>
                            <th>Horario</th>
                            <th>Aula</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    data.cronograma.forEach(asignacion => {
        html += `
                    <tr>
                        <td><strong>${asignacion.curso}</strong></td>
                        <td>${asignacion.profesor}</td>
                        <td>${asignacion.horario}</td>
                        <td>${asignacion.aula}</td>
                    </tr>
                `;
    });

    html += `
                    </tbody>
                </table>
                <p style="margin-top: 15px; color: #7f8c8d;">
                    <strong>Total de asignaciones:</strong> ${data.cronograma.length}
                </p>
            `;

    container.innerHTML = html;
}

// Función para mostrar conflictos
function mostrarConflictos(data) {
    const container = document.getElementById('conflictosContent');

    if (!data.conflictos || data.conflictos.length === 0) {
        container.innerHTML = `
                    <div class="success">
                        <strong>✅ Sin conflictos detectados</strong><br>
                        El cronograma cumple con todas las restricciones.
                    </div>
                `;
        return;
    }

    let html = '<ul class="conflictos-list">';
    data.conflictos.forEach(conflicto => {
        html += `<li>❌ ${conflicto}</li>`;
    });
    html += '</ul>';

    html += `
                <p style="margin-top: 15px; color: #e74c3c;">
                    <strong>Total de conflictos:</strong> ${data.conflictos.length}
                </p>
            `;

    container.innerHTML = html;
}

// Función para obtener estadísticas
async function obtenerEstadisticas() {
    try {
        actualizarEstado('cargando', 'Obteniendo estadísticas...', 'Analizando datos del cronograma');
        mostrarLoading('estadisticasContent');

        const response = await fetch('/api/estadisticas');
        const data = await response.json();

        if (data.success) {
            estadisticasActuales = data.data;
            mostrarEstadisticas(data.data);
            actualizarEstado('valido', 'Estadísticas actualizadas', 'Datos del sistema obtenidos correctamente');
        } else {
            throw new Error(data.error || 'Error obteniendo estadísticas');
        }
    } catch (error) {
        console.error('Error:', error);
        actualizarEstado('invalido', 'Error obteniendo estadísticas', error.message);
        mostrarError('estadisticasContent', error.message);
    }
}

// Función para mostrar estadísticas
function mostrarEstadisticas(stats) {
    const container = document.getElementById('estadisticasContent');

    const html = `
                <div class="estadisticas">
                    <div class="estadistica">
                        <h4>${stats.totalCursos}</h4>
                        <p>Cursos Asignados</p>
                    </div>
                    <div class="estadistica">
                        <h4>${stats.totalProfesores}</h4>
                        <p>Profesores Activos</p>
                    </div>
                    <div class="estadistica">
                        <h4>${stats.totalAulas}</h4>
                        <p>Aulas Utilizadas</p>
                    </div>
                    <div class="estadistica">
                        <h4>${stats.totalHorarios}</h4>
                        <p>Horarios Ocupados</p>
                    </div>
                    <div class="estadistica">
                        <h4>${stats.conflictos}</h4>
                        <p>Conflictos Detectados</p>
                    </div>
                    <div class="estadistica">
                        <h4>${stats.estado.toUpperCase()}</h4>
                        <p>Estado del Sistema</p>
                    </div>
                </div>
            `;

    container.innerHTML = html;
}

// Función para consultar información del sistema
async function consultarInfo() {
    try {
        actualizarEstado('cargando', 'Consultando información...', 'Obteniendo datos del sistema');

        const response = await fetch('/api/info');
        const data = await response.json();

        if (data.success) {
            const info = data.data;
            actualizarEstado('valido', 'Información del sistema',
                `${info.sistema} v${info.version} - ${info.descripcion}`);
        } else {
            throw new Error(data.error || 'Error consultando información');
        }
    } catch (error) {
        console.error('Error:', error);
        actualizarEstado('invalido', 'Error consultando información', error.message);
    }
}

// Función para consultar profesor específico
async function consultarProfesor(nombreProfesor) {
    try {
        const response = await fetch(`/api/profesor/${nombreProfesor}`);
        const data = await response.json();

        if (data.success) {
            const info = data.data;
            console.log(`Profesor ${info.profesor}: ${info.total} asignaciones`, info.asignaciones);
        } else {
            throw new Error(data.error || 'Error consultando profesor');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para consultar aula específica
async function consultarAula(nombreAula) {
    try {
        const response = await fetch(`/api/aula/${nombreAula}`);
        const data = await response.json();

        if (data.success) {
            const info = data.data;
            console.log(`Aula ${info.aula}: ${info.total} ocupaciones`, info.ocupacion);
        } else {
            throw new Error(data.error || 'Error consultando aula');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    console.log('=== SISTEMA DE ASIGNACIÓN ACADÉMICA ===');
    console.log('Interfaz web cargada correctamente');
    console.log('Esperando instrucciones del coordinador académico...');

    // Obtener información del sistema al cargar
    consultarInfo();
});

// Manejo de errores globales
window.addEventListener('error', function (e) {
    console.error('Error global:', e.error);
    actualizarEstado('invalido', 'Error del sistema', e.error.message);
});

// Funciones de utilidad para el coordinador
function exportarCronograma() {
    if (!cronogramaActual) {
        alert('No hay cronograma para exportar. Genera uno primero.');
        return;
    }

    const dataStr = JSON.stringify(cronogramaActual, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'cronograma_academico.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function imprimirCronograma() {
    if (!cronogramaActual) {
        alert('No hay cronograma para imprimir. Genera uno primero.');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
                <html>
                    <head>
                        <title>Cronograma Académico</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h1 { color: #333; }
                        </style>
                    </head>
                    <body>
                        <h1>Sistema de Asignación Académica</h1>
                        <h2>Cronograma Generado</h2>
                        <p>Estado: ${cronogramaActual.estado}</p>
                        <p>Fecha: ${new Date().toLocaleDateString()}</p>
                        
                        <table>
                            <tr>
                                <th>Curso</th>
                                <th>Profesor</th>
                                <th>Horario</th>
                                <th>Aula</th>
                            </tr>
                            ${cronogramaActual.cronograma.map(a => `
                                <tr>
                                    <td>${a.curso}</td>
                                    <td>${a.profesor}</td>
                                    <td>${a.horario}</td>
                                    <td>${a.aula}</td>
                                </tr>
                            `).join('')}
                        </table>
                        
                        ${cronogramaActual.conflictos.length > 0 ? `
                            <h3>Conflictos Detectados:</h3>
                            <ul>
                                ${cronogramaActual.conflictos.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        ` : '<p>Sin conflictos detectados.</p>'}
                    </body>
                </html>
            `);
    printWindow.document.close();
    printWindow.print();
}
async function getProfesores() {
    try {
        const response = await fetch('/api/profesores');
        const profesores = await response.json();

        const contenedor = document.getElementById('profesoresContent');
        contenedor.innerHTML = `
            <h3>👨‍🏫 Profesores</h3>
            <table class="tabla-datos">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Disponibilidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${profesores.map(prof => `
                        <tr>
                            <td>${prof.nombre}</td>
                            <td>${prof.disponibilidad.join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error obteniendo profesores:', error);
        document.getElementById('profesoresContent').innerHTML = `
            <h3>👨‍🏫 Profesores</h3>
            <p>Error al cargar los datos de profesores.</p>
        `;
    }
}

async function getCursosInfo() {
    try {
        const response = await fetch('/api/cursos-info'); 
        const cursos = await response.json();

        const contenedor = document.getElementById('cursosContent');
        contenedor.innerHTML = `
            <h3>📚 Cursos</h3>
            <table class="tabla-datos">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Ciclo</th>
                    </tr>
                </thead>
                <tbody>
                    ${cursos.map(curso => `
                        <tr>
                            <td>${curso.nombre}</td>
                            <td>${curso.tipo}</td>
                            <td>${curso.ciclo}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error obteniendo cursos:', error);
        document.getElementById('cursosContent').innerHTML = `
            <h3>📚 Cursos</h3>
            <p>Error al cargar los cursos.</p>
        `;
    }
}

