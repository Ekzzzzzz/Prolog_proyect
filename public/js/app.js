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

// Actualizar estado
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
    try {
        actualizarEstado('cargando', 'Generando cronograma...', 'Ejecutando backtracking en Prolog');
        mostrarLoading('cronogramaMorning');
        mostrarLoading('cronogramaAfternoon');
        mostrarLoading('cronogramaEvening');
        mostrarLoading('conflictosContent');

        const response = await fetch('/api/generar-cronograma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.success) {
            cronogramaActual = data.data;
            mostrarCronogramaPorTurno(data.data);
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
        mostrarError('cronogramaMorning', error.message);
        mostrarError('cronogramaAfternoon', error.message);
        mostrarError('cronogramaEvening', error.message);
        mostrarError('conflictosContent', 'No se pudieron detectar conflictos');
    }
}

// Mostrar cronograma por turno
function mostrarCronogramaPorTurno(data) {
    const containers = {
        morning: document.getElementById('cronogramaMorning'),
        afternoon: document.getElementById('cronogramaAfternoon'),
        evening: document.getElementById('cronogramaEvening')
    };

    const shiftMap = {
        'lunes_8': 'morning', 'martes_8': 'morning', 'miercoles_8': 'morning', 'jueves_8': 'morning', 'viernes_8': 'morning',
        'lunes_14': 'afternoon', 'martes_14': 'afternoon', 'miercoles_14': 'afternoon', 'jueves_14': 'afternoon', 'viernes_14': 'afternoon',
        'lunes_18': 'evening', 'martes_18': 'evening', 'miercoles_18': 'evening', 'jueves_18': 'evening', 'viernes_18': 'evening'
    };

    // Initialize empty arrays for each shift
    const cronogramas = { morning: [], afternoon: [], evening: [] };
    data.cronograma.forEach(asignacion => {
        const shift = shiftMap[asignacion.horario] || 'morning';
        cronogramas[shift].push(asignacion);
    });

    // Render each shift's table
    Object.keys(containers).forEach(shift => {
        const container = containers[shift];
        const asignaciones = cronogramas[shift];

        if (!asignaciones || asignaciones.length === 0) {
            container.innerHTML = '<p>No hay asignaciones para este turno.</p>';
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
        asignaciones.forEach(a => {
            html += `
                <tr>
                    <td>${a.curso}</td>
                    <td>${a.profesor}</td>
                    <td>${a.horario}</td>
                    <td>${a.aula}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
            <p>Total asignaciones: ${asignaciones.length}</p>
        `;
        container.innerHTML = html;
    });
}

// Mostrar conflictos
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

// Obtener profesores
async function getProfesores() {
    try {
        mostrarLoading('profesoresContent');
        const response = await fetch('/api/profesores');
        const profesores = await response.json();

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
        profesores.forEach(prof => {
            html += `
                <tr>
                    <td>${prof.nombre}</td>
                    <td>${prof.disponibilidad.join(', ')}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        document.getElementById('profesoresContent').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        mostrarError('profesoresContent', 'Error al cargar profesores');
    }
}

// Obtener cursos
async function getCursosInfo() {
    try {
        mostrarLoading('cursosContent');
        const response = await fetch('/api/cursos-info');
        const cursos = await response.json();

        let html = `
            <table class="cronograma-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Ciclo</th>
                    </tr>
                </thead>
                <tbody>
        `;
        cursos.forEach(curso => {
            html += `
                <tr>
                    <td>${curso.nombre}</td>
                    <td>${curso.tipo}</td>
                    <td>${curso.ciclo}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        document.getElementById('cursosContent').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        mostrarError('cursosContent', 'Error al cargar cursos');
    }
}

// Exportar a Google Sheets
async function exportarGoogleSheets() {
    if (!cronogramaActual) {
        alert('Genera un cronograma primero.');
        return;
    }
    console.log('Cronograma a exportar:', cronogramaActual);

    try {
        actualizarEstado('cargando', 'Exportando a Google Sheets...', 'Enviando datos');
        const response = await fetch('/api/exportar-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cronogramaActual)
        });

        const data = await response.json();

        if (data.success) {
            actualizarEstado('valido', 'Exportación exitosa', `Cronograma exportado a Google Sheets (ID: ${data.spreadsheetId})`);
            alert('Cronograma exportado a Google Sheets.');
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error:', error);
        actualizarEstado('invalido', 'Error en exportación', error.message);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Asignación Académica cargado');
});