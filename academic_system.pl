% Sistema de Asignación Académica
% Hechos
profesor(ana_garcia).
profesor(carlos_lopez).
profesor(maria_rodriguez).
profesor(juan_martinez).

curso(matematica_1, teorico, 1).
curso(fisica_1, teorico, 1).
curso(programacion_1, laboratorio, 1).
curso(matematica_2, teorico, 2).

horario(lunes_8).
horario(lunes_14).
horario(lunes_18).
horario(martes_8).
horario(martes_14).
horario(martes_18).
horario(miercoles_8).
horario(miercoles_14).
horario(miercoles_18).
horario(jueves_8).
horario(jueves_14).
horario(jueves_18).
horario(viernes_8).
horario(viernes_14).
horario(viernes_18).

aula(a101, aula_normal).
aula(a102, aula_normal).
aula(lab1, laboratorio).

disponible(ana_garcia, lunes_8).
disponible(ana_garcia, martes_14).
disponible(ana_garcia, miercoles_18).
disponible(carlos_lopez, lunes_14).
disponible(carlos_lopez, martes_8).
disponible(carlos_lopez, jueves_18).
disponible(maria_rodriguez, lunes_8).
disponible(maria_rodriguez, miercoles_14).
disponible(maria_rodriguez, viernes_18).
disponible(juan_martinez, martes_8).
disponible(juan_martinez, jueves_14).
disponible(juan_martinez, viernes_8).

turno(morning, [lunes_8, martes_8, miercoles_8, jueves_8, viernes_8]).
turno(afternoon, [lunes_14, martes_14, miercoles_14, jueves_14, viernes_14]).
turno(evening, [lunes_18, martes_18, miercoles_18, jueves_18, viernes_18]).

semestre_activo(1).

% Reglas
horario_en_turno(Horario, Turno) :-
    turno(Turno, Horarios),
    member(Horario, Horarios).

asignar_curso(Curso, Profesor, Horario, Aula) :-
    curso(Curso, Tipo, Semestre),
    semestre_activo(Semestre),
    profesor(Profesor),
    disponible(Profesor, Horario),
    (horario_en_turno(Horario, morning); horario_en_turno(Horario, afternoon); horario_en_turno(Horario, evening)),
    aula(Aula, TipoAula),
    tipo_compatible(Tipo, TipoAula).

tipo_compatible(teorico, aula_normal).
tipo_compatible(laboratorio, laboratorio).

generar_cronograma(Cronograma) :-
    semestre_activo(Semestre),
    findall(Curso, curso(Curso, _, Semestre), Cursos),
    asignar_todos_cursos(Cursos, [], Cronograma).

asignar_todos_cursos([], Cronograma, Cronograma).
asignar_todos_cursos([Curso|Resto], CronogramaActual, CronogramaFinal) :-
    asignar_curso(Curso, Profesor, Horario, Aula),
    Asignacion = asignacion(Curso, Profesor, Horario, Aula),
    \+ member(Asignacion, CronogramaActual),
    \+ conflicto_profesor(Profesor, Horario, CronogramaActual),
    \+ conflicto_aula(Aula, Horario, CronogramaActual),
    \+ profesor_repite_curso(Profesor, Curso, CronogramaActual),
    NuevoCronograma = [Asignacion|CronogramaActual],
    asignar_todos_cursos(Resto, NuevoCronograma, CronogramaFinal).

conflicto_profesor(Profesor, Horario, Cronograma) :-
    member(asignacion(_, Profesor, Horario, _), Cronograma).

conflicto_aula(Aula, Horario, Cronograma) :-
    member(asignacion(_, _, Horario, Aula), Cronograma).

profesor_repite_curso(Profesor, Curso, Cronograma) :-
    member(asignacion(Curso, Profesor, _, _), Cronograma).

detectar_conflictos(Cronograma, Conflictos) :-
    findall(Conflicto, conflicto_en_cronograma(Cronograma, Conflicto), Conflictos).

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

validar_cronograma(Cronograma, valido) :-
    detectar_conflictos(Cronograma, []).

validar_cronograma(Cronograma, invalido(Conflictos)) :-
    detectar_conflictos(Cronograma, Conflictos),
    Conflictos \= [].

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

mostrar_cronograma([]).
mostrar_cronograma([asignacion(Curso, Profesor, Horario, Aula)|Resto]) :-
    write('ASIGNACION: '), write(Curso), write(' | '),
    write(Profesor), write(' | '), write(Horario), write(' | '),
    write(Aula), nl,
    mostrar_cronograma(Resto).

mostrar_estado(valido) :-
    write('CRONOGRAMA VALIDO - Sin conflictos'), nl.

mostrar_estado(invalido(Conflictos)) :-
    write('CRONOGRAMA INVALIDO - Conflictos detectados:'), nl,
    mostrar_conflictos(Conflictos).

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

listar_cursos :-
    findall(curso(Nombre, Tipo, Ciclo), curso(Nombre, Tipo, Ciclo), Lista),
    write(Lista).