Sistema de Asignación Académica Automatizado
🎓 Descripción
Sistema automatizado para la asignación de cursos académicos que utiliza Prolog como motor lógico de backtracking y Node.js para la interfaz web. El sistema resuelve automáticamente la asignación de cursos a profesores, horarios y aulas sin intervención manual del usuario.
🚀 Características

Asignación automática: Utiliza backtracking en Prolog para resolver asignaciones
Detección de conflictos: Identifica automáticamente conflictos de horarios, profesores y aulas
Interfaz web moderna: Panel de control para coordinadores académicos
Validación completa: Verifica que se cumplan todas las restricciones académicas
Sin base de datos: Todos los datos están definidos como hechos en Prolog

📋 Prerrequisitos
Software requerido:

Node.js (v14 o superior)
SWI-Prolog (v8.0 o superior)
npm (incluido con Node.js)

Instalación de SWI-Prolog:
Windows:
bash# Descargar desde: https://www.swi-prolog.org/download/stable
# Instalar el archivo .exe descargado
macOS:
bash# Usar Homebrew
brew install swi-prolog
Linux (Ubuntu/Debian):
bashsudo apt-get update
sudo apt-get install swi-prolog
Linux (CentOS/RHEL):
bashsudo yum install pl
🛠️ Instalación
1. Clonar/Descargar el proyecto
bash# Si tienes git instalado
git clone <repository-url>
cd sistema-asignacion-academica

# O descargar y extraer los archivos manualmente
2. Instalar dependencias de Node.js
bashnpm install
3. Verificar instalación de Prolog
bashswipl --version
4. Estructura de archivos requerida
sistema-asignacion-academica/
├── server.js                 # Servidor Node.js
├── academic_system.pl        # Lógica Prolog
├── package.json             # Configuración npm
├── public/
│   └── index.html           # Interfaz web
└── README.md               # Este archivo
🚀 Ejecución
Iniciar el servidor:
bashnpm start
Para desarrollo (con auto-reload):
bashnpm run dev
Acceder a la interfaz:
Abrir navegador en: http://localhost:3000
📊 Uso del Sistema
Como Coordinador Académico:

Abrir la interfaz web en http://localhost:3000
Presionar "Generar Cronograma Automático"

El sistema ejecutará automáticamente la lógica Prolog
Resolverá todas las asignaciones usando backtracking
Mostrará el cronograma generado


Revisar los resultados:

✅ Cronograma válido: Sin conflictos detectados
❌ Cronograma inválido: Con conflictos que requieren atención


Consultar estadísticas del sistema
Exportar o imprimir el cronograma generado

Funcionalidades disponibles:

Visualización del cronograma: Tabla con todas las asignaciones
Detección de conflictos: Lista de conflictos encontrados
Estadísticas del sistema: Métricas del cronograma generado
Consultas específicas: Por profesor, aula o horario

🔧 Configuración
Modificar datos del sistema:
Editar el archivo academic_system.pl para cambiar:
prolog% Agregar nuevos profesores
profesor(nuevo_profesor).

% Agregar nuevos cursos
curso(nuevo_curso, tipo, semestre).

% Agregar nuevas aulas
aula(nueva_aula, tipo_aula).

% Agregar disponibilidad
disponible(profesor, horario).
Cambiar semestre activo:
prolog% Cambiar el semestre que se procesará
semestre_activo(2).  % Cambiar de 1 a 2, etc.
🧪 Pruebas y Validación
Verificar que Prolog funciona:
bashswipl -q -t "write('Prolog funcionando correctamente'), nl, halt."
Probar la lógica directamente:
bashswipl academic_system.pl
En la consola de Prolog:
prolog?- ejecutar_sistema.
Verificar la comunicación Node.js - Prolog:
bash# Iniciar el servidor
npm start

# En otro terminal, probar la API
curl http://localhost:3000/api/info
📈 API Endpoints
Endpoints disponibles:

GET / - Interfaz web principal
POST /api/generar-cronograma - Generar cronograma automático
GET /api/estadisticas - Obtener estadísticas del sistema
GET /api/profesor/:nombre - Consultar asignaciones de un profesor
GET /api/aula/:nombre - Consultar ocupación de un aula
GET /api/info - Información del sistema

🔍 Resolución de Problemas
Error: "swipl: command not found"
bash# Verificar que SWI-Prolog esté instalado
which swipl

# Si no está instalado, instalarlo según el OS
Error: "No se pudo generar cronograma"

Verificar que academic_system.pl esté en el directorio raíz
Comprobar que la sintaxis Prolog sea correcta
Verificar que haya suficientes recursos (profesores, aulas, horarios)

Error: "ENOENT: no such file or directory"
bash# Verificar que todos los archivos estén presentes
ls -la academic_system.pl server.js package.json
Puerto ya en uso:
bash# Cambiar el puerto en server.js
const PORT = 3001; // Cambiar de 3000 a 3001
🏗️ Arquitectura del Sistema
Componentes principales:

Motor Prolog (academic_system.pl):

Hechos del sistema (profesores, cursos, aulas)
Reglas de asignación
Algoritmo de backtracking
Detección de conflictos


Servidor Node.js (server.js):

API REST
Comunicación con Prolog via child_process
Procesamiento de resultados
Servicio de archivos estáticos


Interfaz Web (public/index.html):

Panel de control para coordinadores
Visualización de cronogramas
Manejo de estados del sistema
Exportación de resultados



Flujo de ejecución:

Coordinador presiona "Generar Cronograma"
Node.js ejecuta el archivo Prolog
Prolog resuelve las asignaciones usando backtracking
Node.js procesa la salida de Prolog
Interfaz muestra los resultados al coordinador

📝 Reglas del Sistema
Restricciones implementadas:

Un profesor no puede estar en dos lugares a la vez
Un aula no puede tener dos clases simultáneas
Los cursos de laboratorio solo van a laboratorios
Un profesor no puede dictar el mismo curso dos veces
Todos los cursos del semestre deben ser asignados

Detección de conflictos:

Conflicto de profesor: Asignado a múltiples cursos en el mismo horario
Conflicto de aula: Ocupada por múltiples cursos simultáneamente
Conflicto de curso: Profesor dicta el mismo curso más de una vez

🤝 Contribuciones
Para contribuir al proyecto:

Fork el repositorio
Crear una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
Commit tus cambios (git commit -am 'Agregar nueva funcionalidad')
Push a la rama (git push origin feature/nueva-funcionalidad)
Crear un Pull Request

📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
🆘 Soporte
Para reportar problemas o solicitar ayuda:

Crear un issue en GitHub
Incluir información del sistema (OS, versión de Node.js, versión de SWI-Prolog)
Proporcionar logs de error completos
Describir los pasos para reproducir el problema

🔮 Próximas Funcionalidades

 Soporte para múltiples semestres simultáneos
 Interfaz para modificar datos sin editar Prolog
 Exportación a PDF y Excel
 Optimización de asignaciones por preferencias
 Historial de cronogramas generados
 Notificaciones por email para coordinadores


Sistema de Asignación Académica Automatizado - Demostrando la integración efectiva entre Prolog y Node.js para resolver problemas complejos de planificación académica.