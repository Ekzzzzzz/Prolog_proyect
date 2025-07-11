// Variables globales
let currentTab = 'docentes';
const salida = document.getElementById("salida");
const loading = document.getElementById("loading");

// Funciones para mostrar/ocultar loading
function mostrarLoading(mostrar) {
    loading.classList.toggle('active', mostrar);
    if (mostrar) {
        salida.innerHTML = "";
    }
}

// Funciones para traducir valores
function traducirTurno(turno) {
    const traducciones = {
        'manana': 'Mañana',
        'tarde': 'Tarde',
        'noche': 'Noche'
    };
    return traducciones[turno] || turno;
}

function traducirDia(dia) {
    const traducciones = {
        'lunes': 'Lunes',
        'martes': 'Martes',
        'miercoles': 'Miércoles',
        'jueves': 'Jueves',
        'viernes': 'Viernes',
        'sabado': 'Sábado'
    };
    return traducciones[dia] || dia;
}

// Funciones para mostrar mensajes
function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    elemento.innerHTML = `<div class="${tipo}-message">${mensaje}</div>`;
    setTimeout(() => {
        elemento.innerHTML = '';
    }, 5000);
}

// Funciones para crear tablas
function crearTablaDocentes(datos) {
    const tabla = `
        <div class="results-container">
            <div class="section-header">Registro de Docentes</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Categoría</th>
                            <th>Años de Experiencia</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(docente => `
                            <tr>
                                <td>${docente.id}</td>
                                <td>${docente.nombre}</td>
                                <td>${docente.categoria}</td>
                                <td>${docente.experiencia}</td>
                                <td><button class="btn btn-delete" onclick="eliminarDocente(${docente.id})">Eliminar</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return tabla;
}

function crearTablaCursos(datos) {
    const tabla = `
        <div class="results-container">
            <div class="section-header">Catálogo de Cursos</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre del Curso</th>
                            <th>Créditos</th>
                            <th>Ciclo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(curso => `
                            <tr>
                                <td>${curso.id}</td>
                                <td>${curso.nombre}</td>
                                <td>${curso.creditos}</td>
                                <td>${curso.ciclo}</td>
                                <td><button class="btn btn-delete" onclick="eliminarCurso(${curso.id})">Eliminar</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return tabla;
}

function crearTablaDisponibilidad(datos) {
    const tabla = `
        <div class="results-container">
            <div class="section-header">Disponibilidad Horaria de Docentes</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID Docente</th>
                            <th>Día</th>
                            <th>Turno</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(disp => `
                            <tr>
                                <td>${disp.id}</td>
                                <td>${traducirDia(disp.dia)}</td>
                                <td>${traducirTurno(disp.turno)}</td>
                                <td>${disp.inicio}:00</td>
                                <td>${disp.fin}:00</td>
                                <td><button class="btn btn-delete" onclick="eliminarDisponibilidad(${disp.id}, '${disp.dia}', '${disp.turno}', ${disp.inicio}, ${disp.fin})">Eliminar</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return tabla;
}

function crearCronograma(datos) {
    console.log("Datos recibidos del servidor:", JSON.stringify(datos, null, 2));
    
    // Verifica si los datos son un array
    const datosArray = Array.isArray(datos) ? datos : [datos];
    
    if (datosArray.length === 0 || !datosArray[0].nombre_curso) {
        console.error("Datos faltantes o estructura incorrecta:", datos);
        return '<div class="error-message">Error al cargar el cronograma. Ver consola para detalles.</div>';
    }

    const diasOrdenados = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const horasPosibles = Array.from({ length: 17 }, (_, i) => i + 6); // Horas de 6 a 22

    const asignacionesPorDiaHora = {};
    diasOrdenados.forEach(dia => {
        asignacionesPorDiaHora[dia] = {};
        horasPosibles.forEach(hora => {
            asignacionesPorDiaHora[dia][hora] = null;
        });
    });

    datosArray.forEach(asignacion => {
        const inicio = parseInt(asignacion.inicio);
        const fin = parseInt(asignacion.fin);

        // Usamos nombre_curso y nombre_docente con valores por defecto
        const nombreCurso = asignacion.nombre_curso || 'Curso no disponible';
        const nombreDocente = asignacion.nombre_docente || 'Docente no disponible';
        
        // Creamos un objeto con los datos normalizados
        const asignacionNormalizada = {
            ...asignacion,
            nombre_curso: nombreCurso,
            nombre_docente: nombreDocente,
            inicio,
            fin
        };

        for (let hora = inicio; hora <= fin; hora++) {
            if (hora >= 6 && hora <= 22) {
                asignacionesPorDiaHora[asignacion.dia][hora] = asignacionNormalizada;
            }
        }
    });

    let tablaHTML = `
        <div class="results-container">
            <div class="section-header">Cronograma de Asignaciones</div>
            <div class="table-container">
                <table class="cronograma-table">
                    <thead>
                        <tr>
                            <th>Hora</th>
                            ${diasOrdenados.map(dia => `<th>${traducirDia(dia)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
    `;

    horasPosibles.forEach(hora => {
        tablaHTML += `<tr><td>${hora}:00</td>`;

        diasOrdenados.forEach(dia => {
            const asignacion = asignacionesPorDiaHora[dia][hora];

            if (asignacion) {
                if (parseInt(asignacion.inicio) === hora) {
                    const duracion = parseInt(asignacion.fin) - parseInt(asignacion.inicio);
                    tablaHTML += `
                        <td class="asignacion-cell" rowspan="${duracion + 1}"> 
                            <div class="asignacion-info">
                                <strong>${asignacion.nombre_curso}</strong>
                                <div>${asignacion.nombre_docente}</div>
                                <div>${traducirTurno(asignacion.turno)}</div>
                                <div>${asignacion.inicio}:00-${asignacion.fin}:00</div>
                            </div>
                        </td>
                    `;
                }
            } else {
                if (!diasOrdenados.some(d => {
                    const a = asignacionesPorDiaHora[d][hora];
                    return a && parseInt(a.inicio) < hora;
                })) {
                    tablaHTML += '<td></td>';
                }
            }
        });

        tablaHTML += '</tr>';
    });

    tablaHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return tablaHTML;
}

// Funciones para mostrar formularios
function mostrarFormularios() {
    const formularios = `
        <div class="form-container">
            <div class="form-tabs">
                <button class="form-tab active" onclick="cambiarTab('docentes')">Agregar Docente</button>
                <button class="form-tab" onclick="cambiarTab('cursos')">Agregar Curso</button>
                <button class="form-tab" onclick="cambiarTab('disponibilidad')">Agregar Disponibilidad</button>
                <button class="form-tab" onclick="cambiarTab('asignacion')">Agregar Asignación</button>
            </div>
            <div id="form-docentes" class="form-content active">
                <h3>Registrar Nuevo Docente</h3>
                <div id="mensaje-docente"></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="nombre-docente" placeholder="Dr. Ejemplo Apellido" required>
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="categoria-docente" required>
                            <option value="">Seleccionar...</option>
                            <option value="titular">Titular</option>
                            <option value="auxiliar">Auxiliar</option>
                            <option value="asociado">Asociado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Años de Experiencia</label>
                        <input type="number" id="experiencia-docente" min="0" max="50" placeholder="15" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="cancelarFormulario()">Cancelar</button>
                    <button class="btn-submit" onclick="insertarDocente()">Registrar Docente</button>
                </div>
            </div>
            <div id="form-cursos" class="form-content">
                <h3>Registrar Nuevo Curso</h3>
                <div id="mensaje-curso"></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nombre del Curso</label>
                        <input type="text" id="nombre-curso" placeholder="Matemáticas I" required>
                    </div>
                    <div class="form-group">
                        <label>Créditos</label>
                        <input type="number" id="creditos-curso" min="1" max="6" placeholder="4" required>
                    </div>
                    <div class="form-group">
                        <label>Ciclo</label>
                        <input type="number" id="ciclo-curso" min="1" max="10" placeholder="1" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="cancelarFormulario()">Cancelar</button>
                    <button class="btn-submit" onclick="insertarCurso()">Registrar Curso</button>
                </div>
            </div>
            <div id="form-disponibilidad" class="form-content">
                <h3>Registrar Disponibilidad</h3>
                <div id="mensaje-disponibilidad"></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>ID Docente</label>
                        <input type="number" id="id-docente-disp" min="1" placeholder="1" required>
                    </div>
                    <div class="form-group">
                        <label>Día</label>
                        <select id="dia-disponibilidad" required>
                            <option value="">Seleccionar...</option>
                            <option value="lunes">Lunes</option>
                            <option value="martes">Martes</option>
                            <option value="miercoles">Miércoles</option>
                            <option value="jueves">Jueves</option>
                            <option value="viernes">Viernes</option>
                            <option value="sabado">Sábado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Turno</label>
                        <select id="turno-disponibilidad" required>
                            <option value="">Seleccionar...</option>
                            <option value="manana">Mañana</option>
                            <option value="tarde">Tarde</option>
                            <option value="noche">Noche</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Hora Inicio</label>
                        <input type="number" id="inicio-disponibilidad" min="6" max="22" placeholder="8" required>
                    </div>
                    <div class="form-group">
                        <label>Hora Fin</label>
                        <input type="number" id="fin-disponibilidad" min="7" max="23" placeholder="12" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="cancelarFormulario()">Cancelar</button>
                    <button class="btn-submit" onclick="insertarDisponibilidad()">Registrar Disponibilidad</button>
                </div>
            </div>
            <div id="form-asignacion" class="form-content">
                <h3>Registrar Asignación</h3>
                <div id="mensaje-asignacion"></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>ID Curso</label>
                        <input type="number" id="id-curso-asig" min="100" placeholder="101" required>
                    </div>
                    <div class="form-group">
                        <label>ID Docente</label>
                        <input type="number" id="id-docente-asig" min="1" placeholder="1" required>
                    </div>
                    <div class="form-group">
                        <label>Día</label>
                        <select id="dia-asignacion" required>
                            <option value="">Seleccionar...</option>
                            <option value="lunes">Lunes</option>
                            <option value="martes">Martes</option>
                            <option value="miercoles">Miércoles</option>
                            <option value="jueves">Jueves</option>
                            <option value="viernes">Viernes</option>
                            <option value="sabado">Sábado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Turno</label>
                        <select id="turno-asignacion" required>
                            <option value="">Seleccionar...</option>
                            <option value="manana">Mañana</option>
                            <option value="tarde">Tarde</option>
                            <option value="noche">Noche</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Hora Inicio</label>
                        <input type="number" id="inicio-asignacion" min="6" max="22" placeholder="8" required>
                    </div>
                    <div class="form-group">
                        <label>Hora Fin</label>
                        <input type="number" id="fin-asignacion" min="7" max="23" placeholder="12" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="cancelarFormulario()">Cancelar</button>
                    <button class="btn-submit" onclick="insertarAsignacion()">Registrar Asignación</button>
                </div>
            </div>
        </div>
    `;
    salida.innerHTML = formularios;
}

function cambiarTab(tabName) {
    document.querySelectorAll('.form-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`form-${tabName}`).classList.add('active');
    event.target.classList.add('active');
    currentTab = tabName;
}

function cancelarFormulario() {
    salida.innerHTML = '<div class="no-results">Seleccione una opción para consultar la información</div>';
}

// Funciones de la API
async function getDocentes() {
    mostrarLoading(true);
    try {
        const response = await fetch('/api/docentes');
        const data = await response.json();
        
        if (data.error) {
            salida.innerHTML = `<div class="error-message">${data.error}</div>`;
        } else {
            salida.innerHTML = crearTablaDocentes(data);
        }
    } catch (error) {
        console.error('Error al obtener docentes:', error);
        salida.innerHTML = '<div class="error-message">Error al cargar los docentes</div>';
    } finally {
        mostrarLoading(false);
    }
}

async function insertarDocente() {
    const nombre = document.getElementById('nombre-docente').value.trim();
    const categoria = document.getElementById('categoria-docente').value;
    const experiencia = document.getElementById('experiencia-docente').value;
    
    if (!nombre || !categoria || !experiencia) {
        mostrarMensaje('mensaje-docente', 'Por favor, complete todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch('/api/docentes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                categoria,
                experiencia: parseInt(experiencia)
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            mostrarMensaje('mensaje-docente', data.error, 'error');
        } else {
            mostrarMensaje('mensaje-docente', `Docente "${nombre}" registrado correctamente con ID ${data.id}`);
            document.getElementById('nombre-docente').value = '';
            document.getElementById('categoria-docente').value = '';
            document.getElementById('experiencia-docente').value = '';
            getDocentes();
        }
    } catch (error) {
        console.error('Error al registrar docente:', error);
        mostrarMensaje('mensaje-docente', 'Error al registrar docente', 'error');
    }
}

async function eliminarDocente(id) {
    try {
        const result = await Swal.fire({
            title: '¿Eliminar definitivamente?',
            text: "Esta acción borrará al docente y todos sus datos asociados",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar todo',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/docentes/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.error) {
                Swal.fire('Error', data.error, 'error');
            } else {
                Swal.fire(
                    '¡Eliminación completa!',
                    'Docente y todos sus datos asociados fueron borrados permanentemente.',
                    'success'
                );
                getDocentes();
                getDisponibilidad();
                getCronograma();
            }
        }
    } catch (error) {
        console.error('Error al eliminar docente:', error);
        Swal.fire('Error', 'No se pudo completar la eliminación', 'error');
    }
}

async function getCursos() {
    mostrarLoading(true);
    try {
        const response = await fetch('/api/cursos');
        const data = await response.json();
        
        if (data.error) {
            salida.innerHTML = `<div class="error-message">${data.error}</div>`;
        } else {
            salida.innerHTML = crearTablaCursos(data);
        }
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        salida.innerHTML = '<div class="error-message">Error al cargar los cursos</div>';
    } finally {
        mostrarLoading(false);
    }
}

async function insertarCurso() {
    const nombre = document.getElementById('nombre-curso').value.trim();
    const creditos = document.getElementById('creditos-curso').value;
    const ciclo = document.getElementById('ciclo-curso').value;
    
    if (!nombre || !creditos || !ciclo) {
        mostrarMensaje('mensaje-curso', 'Por favor, complete todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch('/api/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                creditos: parseInt(creditos),
                ciclo: parseInt(ciclo)
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            mostrarMensaje('mensaje-curso', data.error, 'error');
        } else {
            mostrarMensaje('mensaje-curso', `Curso "${nombre}" registrado correctamente con ID ${data.id}`);
            document.getElementById('nombre-curso').value = '';
            document.getElementById('creditos-curso').value = '';
            document.getElementById('ciclo-curso').value = '';
            getCursos();
        }
    } catch (error) {
        console.error('Error al registrar curso:', error);
        mostrarMensaje('mensaje-curso', 'Error al registrar curso', 'error');
    }
}

async function eliminarCurso(id) {
    try {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción eliminará el curso y todas sus asignaciones",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/cursos/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.error) {
                Swal.fire('Error', data.error, 'error');
            } else {
                Swal.fire('Eliminado!', 'Curso y asignaciones eliminadas.', 'success');
                getCursos();
                getCronograma();
            }
        }
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        Swal.fire('Error', 'No se pudo completar la eliminación', 'error');
    }
}

async function getDisponibilidad() {
    mostrarLoading(true);
    try {
        const response = await fetch('/api/disponibilidad');
        const data = await response.json();
        
        if (data.error) {
            salida.innerHTML = `<div class="error-message">${data.error}</div>`;
        } else {
            salida.innerHTML = crearTablaDisponibilidad(data);
        }
    } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        salida.innerHTML = '<div class="error-message">Error al cargar la disponibilidad</div>';
    } finally {
        mostrarLoading(false);
    }
}

async function insertarDisponibilidad() {
    const idDocente = document.getElementById('id-docente-disp').value;
    const dia = document.getElementById('dia-disponibilidad').value;
    const turno = document.getElementById('turno-disponibilidad').value;
    const inicio = document.getElementById('inicio-disponibilidad').value;
    const fin = document.getElementById('fin-disponibilidad').value;
    
    if (!idDocente || !dia || !turno || !inicio || !fin) {
        mostrarMensaje('mensaje-disponibilidad', 'Por favor, complete todos los campos', 'error');
        return;
    }

    if (parseInt(inicio) >= parseInt(fin)) {
        mostrarMensaje('mensaje-disponibilidad', 'La hora de inicio debe ser menor que la hora de fin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/disponibilidad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_docente: parseInt(idDocente),
                dia,
                turno,
                inicio: parseInt(inicio),
                fin: parseInt(fin)
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            mostrarMensaje('mensaje-disponibilidad', data.error, 'error');
        } else {
            mostrarMensaje('mensaje-disponibilidad', `Disponibilidad registrada correctamente para el docente ${idDocente}`);
            document.getElementById('id-docente-disp').value = '';
            document.getElementById('dia-disponibilidad').value = '';
            document.getElementById('turno-disponibilidad').value = '';
            document.getElementById('inicio-disponibilidad').value = '';
            document.getElementById('fin-disponibilidad').value = '';
            getDisponibilidad();
        }
    } catch (error) {
        console.error('Error al registrar disponibilidad:', error);
        mostrarMensaje('mensaje-disponibilidad', 'Error al registrar disponibilidad', 'error');
    }
}

async function eliminarDisponibilidad(id, dia, turno, inicio, fin) {
    try {
        const result = await Swal.fire({
            title: '¿Eliminar definitivamente?',
            text: "Esta acción borrará la disponibilidad y cualquier asignación asociada",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar todo',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch('/api/disponibilidad', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_docente: parseInt(id),
                    dia,
                    turno,
                    inicio: parseInt(inicio),
                    fin: parseInt(fin)
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                Swal.fire('Error', data.error, 'error');
            } else {
                Swal.fire(
                    '¡Eliminación completa!',
                    'La disponibilidad y sus asignaciones fueron borradas permanentemente.',
                    'success'
                );
                getDisponibilidad();
                getCronograma();
            }
        }
    } catch (error) {
        console.error('Error al eliminar disponibilidad:', error);
        Swal.fire('Error', 'No se pudo completar la eliminación', 'error');
    }
}

async function getCronograma() {
    mostrarLoading(true);
    try {
        const response = await fetch('/api/cronograma');
        const data = await response.json();
        
        if (data.error) {
            salida.innerHTML = `<div class="error-message">${data.error}</div>`;
        } else {
            salida.innerHTML = crearCronograma(data);
        }
    } catch (error) {
        console.error('Error al obtener cronograma:', error);
        salida.innerHTML = '<div class="error-message">Error al cargar el cronograma</div>';
    } finally {
        mostrarLoading(false);
    }
}

async function insertarAsignacion() {
    const idCurso = document.getElementById('id-curso-asig').value;
    const idDocente = document.getElementById('id-docente-asig').value;
    const dia = document.getElementById('dia-asignacion').value;
    const turno = document.getElementById('turno-asignacion').value;
    const inicio = document.getElementById('inicio-asignacion').value;
    const fin = document.getElementById('fin-asignacion').value;
    
    if (!idCurso || !idDocente || !dia || !turno || !inicio || !fin) {
        mostrarMensaje('mensaje-asignacion', 'Por favor, complete todos los campos', 'error');
        return;
    }

    if (parseInt(inicio) >= parseInt(fin)) {
        mostrarMensaje('mensaje-asignacion', 'La hora de inicio debe ser menor que la hora de fin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/asignaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_curso: parseInt(idCurso),
                id_docente: parseInt(idDocente),
                dia,
                turno,
                inicio: parseInt(inicio),
                fin: parseInt(fin)
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            mostrarMensaje('mensaje-asignacion', data.error, 'error');
        } else {
            mostrarMensaje('mensaje-asignacion', `Asignación registrada correctamente: Curso ${idCurso} - Docente ${idDocente}`);
            document.getElementById('id-curso-asig').value = '';
            document.getElementById('id-docente-asig').value = '';
            document.getElementById('dia-asignacion').value = '';
            document.getElementById('turno-asignacion').value = '';
            document.getElementById('inicio-asignacion').value = '';
            document.getElementById('fin-asignacion').value = '';
            getCronograma();
        }
    } catch (error) {
        console.error('Error al registrar asignación:', error);
        mostrarMensaje('mensaje-asignacion', 'Error al registrar asignación', 'error');
    }
}

async function limpiarCronograma() {
    try {
        const result = await Swal.fire({
            title: 'Confirmar Acción',
            text: "¿Está seguro de que desea limpiar el cronograma? Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch('/api/cronograma', {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.error) {
                Swal.fire('Error', data.error, 'error');
            } else {
                Swal.fire('¡Éxito!', 'El cronograma ha sido limpiado.', 'success');
                getCronograma();
            }
        }
    } catch (error) {
        console.error('Error al limpiar cronograma:', error);
        Swal.fire('Error', 'No se pudo limpiar el cronograma', 'error');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    salida.innerHTML = '<div class="no-results">Seleccione una opción para consultar la información</div>';
});