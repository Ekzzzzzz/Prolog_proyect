let cronogramaActual = null;

// Mostrar loading
function mostrarLoading(elementId) {
    document.getElementById(elementId).innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Procesando...</p>
        </div>
    `;
}

// Ocultar loading
function ocultarLoading(elementId) {
    document.getElementById(elementId).innerHTML = '';
}

// Mostrar error
function mostrarError(elementId, mensaje) {
    document.getElementById(elementId).innerHTML = `
        <div class="error">
            <strong>Error:</strong> ${mensaje}
        </div>
    `;
}

// Actualizar estado visual
function actualizarEstado(estado, mensaje, detalles = '') {
    const indicator = document.getElementById('statusIndicator');
    const text = document.getElementById('statusText');
    const messageEl = document.getElementById('statusMessage');

    indicator.className = `status-indicator ${estado}`;
    text.textContent = mensaje;
    messageEl.textContent = detalles;
}

// Generar cronograma
async function generarCronograma() {
    const ciclo = document.getElementById('cicloSelect').value;
    const turno = document.getElementById('turnoSelect').value;

    if (!ciclo || !turno) {
        alert('Por favor selecciona un ciclo y un turno.');
        return;
    }

    try {
        actualizarEstado('cargando', 'Generando cronograma...', 'Ejecutando en Prolog...');
        mostrarLoading('cronogramaContent');
        mostrarLoading('conflictosContent');

        const response = await fetch('/api/generar-cronograma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ciclo, turno })
        });

        const data = await response.json();

        if (data.success) {
            cronogramaActual = data.data;
            mostrarCronograma(data.data);
            mostrarConflictos(data.data);
            actualizarEstado(
                data.data.estado === 'valido' ? 'valido' : 'invalido',
                data.data.estado === 'valido' ? 'Cronograma válido' : 'Cronograma con conflictos',
                data.data.mensaje
            );
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

// Mostrar cronograma en tabla
function mostrarCronograma(data) {
    const container = document.getElementById('cronogramaContent');

    if (!data.cronograma || data.cronograma.length === 0) {
        container.innerHTML = '<p>No hay asignaciones para este ciclo y turno.</p>';
        return;
    }

    let html = `
        <table class="cronograma-table">
            <thead>
                <tr>
                    <th>Curso</th>
                    <th>Sección</th>
                    <th>Docente</th>
                    <th>Pabellón</th>
                    <th>Piso</th>
                    <th>Aula</th>
                    <th>Horario</th>
                    <th>Turno</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.cronograma.forEach(a => {
        html += `
            <tr>
                <td>${a.curso}</td>
                <td>${a.seccion}</td>
                <td>${a.profesor}</td>
                <td>${a.pabellon}</td>
                <td>${a.piso}</td>
                <td>${a.aula}</td>
                <td>${a.horario}</td>
                <td>${a.turno}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
        <p>Total de asignaciones: ${data.cronograma.length}</p>
    `;
    container.innerHTML = html;
}

// Mostrar conflictos detectados
function mostrarConflictos(data) {
    const container = document.getElementById('conflictosContent');

    if (!data.conflictos || data.conflictos.length === 0) {
        container.innerHTML = '<p>✅ Sin conflictos detectados.</p>';
        return;
    }

    let html = '<ul class="conflictos-list">';
    data.conflictos.forEach(conflicto => {
        html += `<li>❌ ${conflicto}</li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Obtener profesores desde API
async function getProfesores() {
    try {
        mostrarLoading('profesoresContent');

        const response = await fetch('/api/profesores');
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Error al cargar profesores');
        }

        const profesores = result.data || [];
        let html = `
            <table class="cronograma-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Disponibilidad</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (profesores.length === 0) {
            html += '<tr><td colspan="2">No hay profesores disponibles.</td></tr>';
        } else {
            profesores.forEach(prof => {
                html += `
                    <tr>
                        <td>${prof.nombre}</td>
                        <td>${prof.disponibilidad.join(', ')}</td>
                    </tr>
                `;
            });
        }
        html += '</tbody></table>';
        document.getElementById('profesoresContent').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        mostrarError('profesoresContent', 'Error al cargar profesores: ' + error.message);
    }
}

// Obtener cursos desde API
async function getCursosInfo() {
    try {
        mostrarLoading('cursosContent');

        const response = await fetch('/api/cursos-info');
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Error al cargar cursos');
        }

        const cursos = result.data || [];
        let html = `
            <table class="cronograma-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Ciclo</th>
                        <th>Horas</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (cursos.length === 0) {
            html += '<tr><td colspan="4">No hay cursos disponibles.</td></tr>';
        } else {
            cursos.forEach(curso => {
                html += `
                    <tr>
                        <td>${curso.nombre}</td>
                        <td>${curso.tipo}</td>
                        <td>${curso.ciclo}</td>
                        <td>${curso.horas}</td>
                    </tr>
                `;
            });
        }
        html += '</tbody></table>';
        document.getElementById('cursosContent').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        mostrarError('cursosContent', 'Error al cargar cursos: ' + error.message);
    }
}

// Exportar a Google Sheets
async function exportarGoogleSheets() {
    if (!cronogramaActual) {
        alert('Primero genera un cronograma.');
        return;
    }

    try {
        actualizarEstado('cargando', 'Exportando a Google Sheets...', 'Enviando datos...');

        const response = await fetch('/api/exportar-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cronogramaActual)
        });

        const data = await response.json();

        if (data.success) {
            actualizarEstado('valido', 'Exportación exitosa', `Cronograma exportado (ID: ${data.spreadsheetId})`);
            alert('Exportado correctamente a Google Sheets.');
        } else {
            throw new Error(data.error || 'Error desconocido al exportar');
        }
    } catch (error) {
        console.error('Error:', error);
        actualizarEstado('invalido', 'Error en exportación', error.message);
    }
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Asignación Académica cargado');
    // Puedes llamar automáticamente si quieres:
    // getProfesores();
    // getCursosInfo();
});
