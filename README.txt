Sistema de Coordinación Académica
Un sistema inteligente para la asignación automática de horarios académicos que integra Prolog como motor de inferencia con Node.js para la interfaz web.
🎯 Características Principales

Motor de Inferencia Prolog: Utiliza backtracking para resolver conflictos de horarios automáticamente
Interfaz Web Intuitiva: Panel de control moderno para coordinadores académicos
Asignación Inteligente: Evita conflictos de horarios, aulas y docentes
Validación en Tiempo Real: Verifica disponibilidad y competencias antes de asignar
Generación Automática: Crea horarios completos optimizados

🏗️ Arquitectura del Sistema
Componentes Principales

Backend Prolog (academic_system.pl)

Hechos: Docentes, cursos, aulas, laboratorios, disponibilidad
Reglas: Lógica para evitar conflictos y validar asignaciones
Predicados: Interfaz de comunicación con Node.js


Servidor Node.js (server.js)

API RESTful para comunicación con el frontend
Interfaz con Prolog mediante procesos del sistema
Manejo de errores y validación de datos


Frontend Web (index.html)

Interfaz moderna y responsiva
Comunicación asíncrona con el backend
Visualización de horarios y resultados



🧠 Lógica de Prolog Explicada
Hechos Base
prolog% Docentes con sus especialidades
docente(d001, 'Dr. Carlos Mendoza', sistemas).

% Cursos con información completa
curso(mat101, 'Matematica I', 4, 1, aula, 28).

% Disponibilidad de docentes
disponible(d001, lunes, bloque_1).

% Infraestructura disponible
aula(a101, 30).
laboratorio(lab_sistemas, 25, computacion).
Reglas Críticas
1. Evitar Conflictos de Docentes
prologno_conflicto_docente(Docente, Dia, Bloque) :-
    \+ (asignacion(_, Docente, Dia, Bloque, _, _),
        asignacion(_, Docente, Dia, Bloque, _, _)).
2. Evitar Conflictos de Ambientes
prologno_conflicto_ambiente(Ambiente, Dia, Bloque) :-
    \+ (asignacion(_, _, Dia, Bloque, Ambiente, _),
        asignacion(_, _, Dia, Bloque, Ambiente, _)).
3. Validar Competencias
prologdocente_competente(Docente, Curso) :-
    docente(Docente, _, Especialidad),
    requiere_competencia(Curso, Especialidad).
4. Verificar Capacidades
prologcapacidad_suficiente(Curso, Ambiente) :-
    curso(Curso, _, _, _, aula, EstudiantesEstimados),
    aula(Ambiente, Capacidad),
    EstudiantesEstimados =< Capacidad.
Predicado Principal de Asignación
prologasignar_curso(Curso, Docente, Dia, Bloque, Ambiente, Semestre) :-
    % Verificaciones secuenciales con backtracking
    curso(Curso, _, _, SemestreCurso, _, _),
    Semestre = SemestreCurso,
    disponible(Docente, Dia, Bloque),
    docente_competente(Docente, Curso),
    ambiente_correcto(Curso, Ambiente),
    capacidad_suficiente(Curso, Ambiente),
    no_conflicto_docente(Docente, Dia, Bloque),
    no_conflicto_ambiente(Ambiente, Dia, Bloque).
🔧 Integración Técnica
Comunicación Prolog-Node.js
La comunicación se realiza mediante:

Ejecución de Procesos: Node.js lanza procesos SWI-Prolog
Archivos Temporales: Consultas dinámicas via archivos .pl
Parsing de Resultados: Conversión de respuestas Prolog a JSON

javascriptasync consultarProlog(consulta) {
    const tempFile = 'temp_query.pl';
    const queryContent = `
        :- consult('academic_system.pl').
        :- ${consulta}, write_canonical(Result), nl, halt.
    `;
    
    fs.writeFileSync(tempFile, queryContent);
    const queryProcess = spawn('swipl', ['-q', '-t', 'halt', '-s', tempFile]);
    // ... manejo de respuesta
}
API RESTful

GET /api/docentes - Obtener lista de docentes
GET /api/cursos - Obtener lista de cursos
GET /api/ambientes - Obtener ambientes disponibles
GET /api/disponibilidad/:docente - Consultar disponibilidad
POST /api/asignar - Validar asignación manual
GET /api/generar-horario - Generar horario completo

📋 Prerrequisitos

Node.js (v16 o superior)
SWI-Prolog (v8.0 o superior)
npm o yarn

🚀 Instalación y Configuración

Clonar el repositorio

bashgit clone [url-del-repositorio]
cd sistema-coordinacion-academica

Instalar dependencias

bashnpm install

Instalar SWI-Prolog

bash# Ubuntu/Debian
sudo apt-get install swi-prolog

# macOS
brew install swi-prolog

# Windows
# Descargar desde https://www.swi-prolog.org/download/stable

Crear archivos necesarios

bash# Crear archivo Prolog
touch academic_system.pl

# Crear directorio público
mkdir public

Configurar archivos


Copiar el contenido de academic_system.pl al archivo
Copiar el contenido de index.html a public/index.html
Copiar el contenido de server.js al archivo principal

🏃‍♂️ Ejecución
bash# Modo desarrollo
npm run dev

# Modo producción
npm start
El sistema estará disponible en http://localhost:3000
💡 Decisiones de Diseño
¿Por qué Prolog?

Backtracking Natural: Ideal para resolver problemas de satisfacción de restricciones
Lógica Declarativa: Permite expresar reglas de negocio de forma natural
Flexibilidad: Fácil modificación de reglas sin cambiar el código base
Eficiencia: Optimización automática de búsquedas y resolución

¿Por qué Node.js?

Integración Sencilla: Fácil comunicación con procesos del sistema
Ecosistema Rico: Amplia variedad de librerías y herramientas
Performance: Excelente para aplicaciones I/O intensivas
Desarrollo Rápido: Prototipado y despliegue ágil

Arquitectura Sin Base de Datos

Simplicidad: Menos componentes = menos complejidad
Portabilidad: Fácil despliegue en diferentes entornos
Foco en Lógica: Concentración en algoritmos de asignación
Prototipado Rápido: Desarrollo y pruebas aceleradas

🎛️ Uso del Sistema
Panel de Coordinador

Asignación Manual

Seleccionar curso, docente, horario y ambiente
Validación automática de conflictos
Feedback inmediato sobre viabilidad


Generación Automática

Crear horarios completos optimizados
Resolución automática de conflictos
Visualización en formato tabla


Consulta de Disponibilidad

Ver horarios disponibles por docente
Planificación de asignaciones futuras



Reglas de Validación

✅ Un docente no puede tener dos clases simultáneas
✅ Un ambiente no puede ser usado por dos cursos a la vez
✅ Los docentes deben tener competencias para el curso
✅ La capacidad del ambiente debe ser suficiente
✅ Los laboratorios deben ser del tipo correcto

🔍 Algoritmo de Backtracking
El sistema utiliza el backtracking natural de Prolog para:

Explorar Espacios de Solución: Probar todas las combinaciones posibles
Detectar Conflictos: Retroceder cuando encuentra restricciones violadas
Optimizar Asignaciones: Encontrar la mejor distribución de recursos
Garantizar Consistencia: Asegurar que todas las reglas se cumplan

📊 Beneficios del Sistema

Automatización: Reduce trabajo manual del coordinador
Optimización: Maximiza uso de recursos disponibles
Flexibilidad: Fácil adaptación a cambios en requisitos
Confiabilidad: Elimina errores humanos en asignaciones
Escalabilidad: Maneja crecimiento en cursos y docentes

🛠️ Extensiones Futuras

Integración con sistemas de gestión académica
Algoritmos genéticos para optimización avanzada
Interfaz móvil para coordinadores
Reportes y anál
