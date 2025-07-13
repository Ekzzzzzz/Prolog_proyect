% Sistema de Asignación Académica
% Hechos
profesor(ana_garcia).
profesor(carlos_lopez).
profesor(maria_rodriguez).
profesor(juan_martinez).
profesor(luisa_perez).
profesor(pedro_gonzalez).
profesor(sofia_hernandez).

curso(matematica_1, teorico, 1).
curso(fisica_1, teorico, 1).
curso(programacion_1, laboratorio, 1).
curso(matematica_2, teorico, 2).
curso(fisica_2, teorico, 2).
curso(programacion_2, laboratorio, 2).
curso(quimica_1, teorico, 1).
curso(ingles_1, teorico, 1).
curso(estadistica_1, teorico, 2).

horario(lunes_8).
horario(lunes_10).
horario(lunes_14).
horario(lunes_16).
horario(lunes_18).
horario(lunes_20).
horario(martes_8).
horario(martes_10).
horario(martes_14).
horario(martes_16).
horario(martes_18).
horario(martes_20).
horario(miercoles_8).
horario(miercoles_10).
horario(miercoles_14).
horario(miercoles_16).
horario(miercoles_18).
horario(miercoles_20).
horario(jueves_8).
horario(jueves_10).
horario(jueves_14).
horario(jueves_16).
horario(jueves_18).
horario(jueves_20).
horario(viernes_8).
horario(viernes_10).
horario(viernes_14).
horario(viernes_16).
horario(viernes_18).
horario(viernes_20).
horario(sabado_8).
horario(sabado_10).
horario(sabado_14).
horario(sabado_16).

aula(a101, aula_normal).
aula(a102, aula_normal).
aula(a103, aula_normal).
aula(lab1, laboratorio).
aula(lab2, laboratorio).
aula(auditorio, aula_normal).

disponible(ana_garcia, lunes_8).
disponible(ana_garcia, martes_10).
disponible(ana_garcia, miercoles_14).
disponible(ana_garcia, jueves_18).
disponible(ana_garcia, viernes_8).
disponible(carlos_lopez, lunes_14).
disponible(carlos_lopez, martes_16).
disponible(carlos_lopez, miercoles_10).
disponible(carlos_lopez, jueves_20).
disponible(carlos_lopez, viernes_14).
disponible(maria_rodriguez, lunes_8).
disponible(maria_rodriguez, martes_18).
disponible(maria_rodriguez, miercoles_16).
disponible(maria_rodriguez, jueves_10).
disponible(maria_rodriguez, viernes_20).
disponible(juan_martinez, martes_8).
disponible(juan_martinez, miercoles_14).
disponible(juan_martinez, jueves_16).
disponible(juan_martinez, viernes_10).
disponible(juan_martinez, sabado_8).
disponible(luisa_perez, lunes_10).
disponible(luisa_perez, martes_14).
disponible(luisa_perez, miercoles_18).
disponible(luisa_perez, jueves_20).
disponible(luisa_perez, viernes_16).
disponible(pedro_gonzalez, lunes_16).
disponible(pedro_gonzalez, martes_20).
disponible(pedro_gonzalez, miercoles_8).
disponible(pedro_gonzalez, jueves_14).
disponible(pedro_gonzalez, sabado_10).
disponible(sofia_hernandez, lunes_18).
disponible(sofia_hernandez, martes_8).
disponible(sofia_hernandez, miercoles_20).
disponible(sofia_hernandez, jueves_16).
disponible(sofia_hernandez, viernes_14).

turno(morning, [lunes_8, lunes_10, martes_8, martes_10, miercoles_8, miercoles_10, jueves_8, jueves_10, viernes_8, viernes_10, sabado_8, sabado_10]).
turno(afternoon, [lunes_14, lunes_16, martes_14, martes_16, miercoles_14, miercoles_16, jueves_14, jueves_16, viernes_14, viernes_16]).
turno(evening, [lunes_18, lunes_20, martes_18, martes_20, miercoles_18, miercoles_20, jueves_18, jueves_20, viernes_18, viernes_20]).

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