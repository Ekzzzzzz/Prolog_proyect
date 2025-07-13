
% ===============================================
% Sistema de Asignación Académica Automatizado en Prolog
% Archivo: academic_system.pl
% -----------------------------------------------
% RESUMEN:
% Este archivo implementa un sistema en Prolog para asignar cursos a profesores, horarios y aulas, evitando conflictos y permitiendo consultas sobre el cronograma generado.
% Incluye:
%   - Hechos: profesores, cursos, horarios, aulas y disponibilidad.
%   - Reglas: asignación, generación de cronograma, verificación y detección de conflictos.
%   - Validación: cronograma válido/inválido.
%   - Interfaz: para integración con Node.js y consultas adicionales.
% -----------------------------------------------

% ===== HECHOS: DATOS DEL SISTEMA =====
% Definición de profesores, cursos, horarios, aulas y disponibilidad.

% ===== HECHOS: DATOS DEL SISTEMA =====


% Profesores disponibles
profesor(ana_garcia).
profesor(carlos_lopez).
profesor(maria_rodriguez).
profesor(juan_martinez).
profesor(sofia_torres).
profesor(diego_ruiz).


% Cursos de la malla curricular
% curso(Nombre, Tipo, Semestre)
curso(matematica_1, teorico, 1).
curso(fisica_1, teorico, 1).
curso(quimica_1, laboratorio, 1).
curso(programacion_1, laboratorio, 1).
curso(matematica_2, teorico, 2).
curso(fisica_2, laboratorio, 2).
curso(estructuras_datos, laboratorio, 2).
curso(calculo_1, teorico, 3).
curso(algoritmos, laboratorio, 3).
curso(base_datos, laboratorio, 3).


% Horarios disponibles
horario(lunes_8).
horario(lunes_10).
horario(martes_8).
horario(martes_10).
horario(miercoles_8).
horario(miercoles_10).
horario(jueves_8).
horario(jueves_10).
horario(viernes_8).
horario(viernes_10).


% Aulas disponibles
aula(a101, aula_normal).
aula(a102, aula_normal).
aula(a103, aula_normal).
aula(lab1, laboratorio).
aula(lab2, laboratorio).
aula(lab3, laboratorio).


% Disponibilidad de profesores por horario
% disponible(Profesor, Horario)
disponible(ana_garcia, lunes_8).
disponible(ana_garcia, martes_10).
disponible(ana_garcia, miercoles_8).
disponible(carlos_lopez, lunes_10).
disponible(carlos_lopez, martes_8).
disponible(carlos_lopez, jueves_8).
disponible(maria_rodriguez, lunes_8).
disponible(maria_rodriguez, miercoles_10).
disponible(maria_rodriguez, viernes_8).
disponible(juan_martinez, martes_8).
disponible(juan_martinez, jueves_10).
disponible(juan_martinez, viernes_10).
disponible(sofia_torres, lunes_10).
disponible(sofia_torres, miercoles_8).
disponible(sofia_torres, viernes_8).
disponible(diego_ruiz, martes_10).
disponible(diego_ruiz, jueves_8).
disponible(diego_ruiz, viernes_10).


% Semestre activo
semestre_activo(1).


% ===== REGLAS DE ASIGNACIÓN =====
% Reglas para asignar cursos a profesores, horarios y aulas, verificando compatibilidad y disponibilidad.


% Regla principal: asignar un curso a un profesor, horario y aula
asignar_curso(Curso, Profesor, Horario, Aula) :-
    curso(Curso, Tipo, Semestre),
    semestre_activo(Semestre),
    profesor(Profesor),
    disponible(Profesor, Horario),
    aula(Aula, TipoAula),
    tipo_compatible(Tipo, TipoAula).


% Compatibilidad entre tipo de curso y tipo de aula
tipo_compatible(teorico, aula_normal).
tipo_compatible(laboratorio, laboratorio).


% ===== GENERACIÓN DEL CRONOGRAMA COMPLETO =====
% Reglas para generar el cronograma completo del semestre activo.


% Generar cronograma para todos los cursos del semestre activo
generar_cronograma(Cronograma) :-
    semestre_activo(Semestre),
    findall(Curso, (curso(Curso, _, Semestre)), CursosSemestre),
    asignar_todos_cursos(CursosSemestre, [], Cronograma).


% Asignar todos los cursos de la lista
asignar_todos_cursos([], Cronograma, Cronograma).
asignar_todos_cursos([Curso|RestoCursos], CronogramaActual, CronogramaFinal) :-
    asignar_curso(Curso, Profesor, Horario, Aula),
    Asignacion = asignacion(Curso, Profesor, Horario, Aula),
    \+ member(Asignacion, CronogramaActual),
    \+ conflicto_profesor(Profesor, Horario, CronogramaActual),
    \+ conflicto_aula(Aula, Horario, CronogramaActual),
    \+ profesor_repite_curso(Profesor, Curso, CronogramaActual),
    NuevoCronograma = [Asignacion|CronogramaActual],
    asignar_todos_cursos(RestoCursos, NuevoCronograma, CronogramaFinal).


% ===== VERIFICACIÓN DE CONFLICTOS =====
% Reglas para detectar conflictos de horario y repetición de curso.


% Conflicto: profesor ya tiene clase en ese horario
conflicto_profesor(Profesor, Horario, Cronograma) :-
    member(asignacion(_, Profesor, Horario, _), Cronograma).


% Conflicto: aula ya está ocupada en ese horario
conflicto_aula(Aula, Horario, Cronograma) :-
    member(asignacion(_, _, Horario, Aula), Cronograma).


% Conflicto: profesor ya dicta el mismo curso
profesor_repite_curso(Profesor, Curso, Cronograma) :-
    member(asignacion(Curso, Profesor, _, _), Cronograma).


% ===== DETECCIÓN DE CONFLICTOS EN CRONOGRAMA =====
% Reglas para detectar todos los conflictos presentes en un cronograma.


% Detectar todos los conflictos en un cronograma
detectar_conflictos(Cronograma, Conflictos) :-
    findall(Conflicto, conflicto_en_cronograma(Cronograma, Conflicto), Conflictos).


% Tipos de conflictos posibles
conflicto_en_cronograma(Cronograma, conflicto_profesor(Profesor, Horario)) :-
    member(asignacion(Curso1, Profesor, Horario, _), Cronograma),
    member(asignacion(Curso2, Profesor, Horario, _), Cronograma),
    Curso1 \= Curso2.

conflicto_en_cronograma(Cronograma, conflicto_aula(Aula, Horario)) :-
    member(asignacion(Curso1, _, Horario, Aula), Cronograma),
    member(asignacion(Curso2, _, Horario, Aula), Cronograma),
    Curso1 \= Curso2.

conflicto_en_cronograma(Cronograma, conflicto_curso_repetido(Profesor, Curso)) :-
    member(asignacion(Curso, Profesor, Horario1, _), Cronograma),
    member(asignacion(Curso, Profesor, Horario2, _), Cronograma),
    Horario1 \= Horario2.


% ===== VALIDACIÓN DEL CRONOGRAMA =====
% Reglas para validar si el cronograma está libre de conflictos.


% Validar si el cronograma es válido (sin conflictos)
validar_cronograma(Cronograma, valido) :-
    detectar_conflictos(Cronograma, []).

validar_cronograma(Cronograma, invalido(Conflictos)) :-
    detectar_conflictos(Cronograma, Conflictos),
    Conflictos \= [].


% ===== INTERFAZ PARA NODE.JS =====
% Predicado principal para ejecutar el sistema y mostrar resultados legibles.


% Ejecutar el sistema completo y mostrar resultados
ejecutar_sistema :-
    write('=== SISTEMA DE ASIGNACION ACADEMICA ==='), nl,
    (generar_cronograma(Cronograma) ->
        (write('CRONOGRAMA_GENERADO:'), nl,
         mostrar_cronograma(Cronograma),
         validar_cronograma(Cronograma, Estado),
         write('ESTADO_CRONOGRAMA:'), nl,
         mostrar_estado(Estado))
    ;
        (write('ERROR: No se pudo generar un cronograma válido'), nl)
    ).


% Mostrar cronograma en formato legible
mostrar_cronograma([]).
mostrar_cronograma([asignacion(Curso, Profesor, Horario, Aula)|Resto]) :-
    write('ASIGNACION: '), write(Curso), write(' | '), 
    write(Profesor), write(' | '), write(Horario), write(' | '), 
    write(Aula), nl,
    mostrar_cronograma(Resto).


% Mostrar estado del cronograma
mostrar_estado(valido) :-
    write('CRONOGRAMA VALIDO - Sin conflictos'), nl.

mostrar_estado(invalido(Conflictos)) :-
    write('CRONOGRAMA INVALIDO - Conflictos detectados:'), nl,
    mostrar_conflictos(Conflictos).


% Mostrar lista de conflictos
mostrar_conflictos([]).
mostrar_conflictos([conflicto_profesor(Profesor, Horario)|Resto]) :-
    write('CONFLICTO: Profesor '), write(Profesor), 
    write(' ya tiene clase en '), write(Horario), nl,
    mostrar_conflictos(Resto).
mostrar_conflictos([conflicto_aula(Aula, Horario)|Resto]) :-
    write('CONFLICTO: Aula '), write(Aula), 
    write(' ya está ocupada en '), write(Horario), nl,
    mostrar_conflictos(Resto).
mostrar_conflictos([conflicto_curso_repetido(Profesor, Curso)|Resto]) :-
    write('CONFLICTO: Profesor '), write(Profesor), 
    write(' dicta el curso '), write(Curso), write(' más de una vez'), nl,
    mostrar_conflictos(Resto).


% ===== CONSULTAS ADICIONALES =====
% Reglas para consultar asignaciones de profesor, ocupación de aula y cursos por horario.


% Consultar asignaciones de un profesor específico
consultar_profesor(Profesor, Cronograma, Asignaciones) :-
    findall(asignacion(Curso, Profesor, Horario, Aula), 
            member(asignacion(Curso, Profesor, Horario, Aula), Cronograma), 
            Asignaciones).

% Consultar ocupación de un aula
consultar_aula(Aula, Cronograma, Ocupacion) :-
    findall(asignacion(Curso, Profesor, Horario, Aula), 
            member(asignacion(Curso, Profesor, Horario, Aula), Cronograma), 
            Ocupacion).

% Consultar cursos por horario
consultar_horario(Horario, Cronograma, CursosHorario) :-
    findall(asignacion(Curso, Profesor, Horario, Aula), 
            member(asignacion(Curso, Profesor, Horario, Aula), Cronograma), 
            CursosHorario).

% Listar todos los cursos
listar_cursos :-
    findall(curso(Nombre, Tipo, Ciclo), curso(Nombre, Tipo, Ciclo), Lista),
    write(Lista).