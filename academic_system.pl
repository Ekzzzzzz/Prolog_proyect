% Sistema de Asignación Académica

% Profesores
profesor(ana_garcia).
profesor(carlos_lopez).
profesor(maria_rodriguez).
profesor(juan_martinez).
profesor(luisa_perez).
profesor(pedro_gonzalez).
profesor(sofia_hernandez).
profesor(alexander_soto).
profesor(laura_mendoza).
profesor(diego_ramirez).

% Cursos por ciclo con tipo (teorico o laboratorio) y horas semanales
% Ciclo 1
curso(introduccion_vida_universitaria, teorico, 1, 2).
curso(individuo_medio_ambiente, teorico, 1, 2).
curso(ingles_1, teorico, 1, 2).
curso(comprension_redaccion_textos_1, teorico, 1, 4).
curso(matematica_1, teorico, 1, 4).
curso(principios_algoritmos, mixto, 1, 4).

% Ciclo 2
curso(introduccion_tic, teorico, 2, 2).
curso(ingles_2, teorico, 2, 2).
curso(comprension_redaccion_textos_2, teorico, 2, 4).
curso(matematica_2, teorico, 2, 4).
curso(matematica_discreta, teorico, 2, 4).
curso(problemas_desafios_peru, teorico, 2, 2).
curso(estadistica_descriptiva_probabilidades, teorico, 2, 4).

% Ciclo 3
curso(calculo_1, teorico, 3, 4).
curso(ingles_3, teorico, 3, 2).
curso(ciudadania_reflexion_etica, teorico, 3, 2).
curso(taller_programacion, mixto, 3, 4).
curso(estadistica_inferencial, teorico, 3, 4).
curso(mecanica_clasica, teorico, 3, 2).
curso(laboratorio_mecanica_clasica, laboratorio, 3, 2).

% Ciclo 4
curso(ingles_4, teorico, 4, 2).
curso(investigacion_academica, teorico, 4, 2).
curso(programacion_orientada_objetos, mixto, 4, 4).
curso(base_datos, mixto, 4, 4).
curso(analisis_diseno_algoritmos, teorico, 4, 2).
curso(calculo_2, teorico, 4, 4).
curso(fundamentos_electromagnetismo, teorico, 4, 2).
curso(laboratorio_fundamentos_electromagnetismo, laboratorio, 4, 2).

% Ciclo 5
curso(taller_programacion_web, mixto, 5, 4).
curso(sistemas_operativos, mixto, 5, 4).
curso(algoritmos_estructuras_datos, mixto, 5, 4).
curso(redes_comunicacion_datos_1, mixto, 5, 4).
curso(herramientas_informaticas_toma_decisiones, teorico, 5, 2).
curso(diseno_patrones, laboratorio, 5, 3).
curso(base_datos_2, mixto, 5, 4).

% Ciclo 6
curso(analisis_diseno_sistemas_informacion, teorico, 6, 2).
curso(curso_integrador_1_sistemas_software, mixto, 6, 4).
curso(administracion_organizacion_empresas, teorico, 6, 2).
curso(java_script_avanzado, mixto, 6, 4).
curso(marcos_desarrollo_web, mixto, 6, 4).
curso(hoja_estilo_cascada_avanzado, mixto, 6, 4).
curso(gestion_proyectos, teorico, 6, 2).

% Ciclo 7
curso(desarrollo_software, mixto, 7, 4).
curso(teoria_computacion, teorico, 7, 2).
curso(seguridad_informatica, mixto, 7, 4).
curso(lenguajes_programacion, laboratorio, 7, 3).
curso(desarrollo_web_integrado, mixto, 7, 4).
curso(herramientas_desarrollo, mixto, 7, 4).
curso(diseno_productos_servicios, teorico, 7, 2).

% Aulas teóricas
aula_teorica(404, b, 4).
aula_teorica(405, b, 4).
aula_teorica(406, b, 4).
aula_teorica(407, b, 4).
aula_teorica(504, a, 5).
aula_teorica(505, a, 5).
aula_teorica(506, a, 5).
aula_teorica(507, a, 5).
aula_teorica(604, a, 6).
aula_teorica(605, a, 6).
aula_teorica(606, a, 6).
aula_teorica(607, a, 6).
aula_teorica(704, a, 7).
aula_teorica(705, a, 7).
aula_teorica(706, a, 7).
aula_teorica(707, a, 7).
aula_teorica(804, b, 8).
aula_teorica(805, b, 8).
aula_teorica(806, b, 8).
aula_teorica(807, b, 8).
aula_teorica(901, b, 9).
aula_teorica(902, b, 9).
aula_teorica(903, b, 9).
aula_teorica(904, b, 9).
aula_teorica(905, b, 9).
aula_teorica(906, b, 9).
aula_teorica(907, b, 9).
aula_teorica(908, b, 9).
aula_teorica(1001, b, 10).
aula_teorica(1002, b, 10).
aula_teorica(1003, b, 10).
aula_teorica(1004, b, 10).
aula_teorica(1005, b, 10).
aula_teorica(1006, b, 10).
aula_teorica(1007, b, 10).
aula_teorica(1008, b, 10).
aula_teorica(1101, b, 11).
aula_teorica(1102, b, 11).
aula_teorica(1103, b, 11).
aula_teorica(1104, b, 11).
aula_teorica(1105, b, 11).
aula_teorica(1106, b, 11).
aula_teorica(1107, b, 11).
aula_teorica(1108, b, 11).
aula_teorica(1201, b, 12).
aula_teorica(1202, b, 12).
aula_teorica(1203, b, 12).
aula_teorica(1204, b, 12).
aula_teorica(1205, b, 12).
aula_teorica(1206, b, 12).
aula_teorica(1207, b, 12).
aula_teorica(1208, b, 12).
aula_teorica(1301, b, 13).
aula_teorica(1302, b, 13).
aula_teorica(1303, b, 13).
aula_teorica(1304, b, 13).
aula_teorica(1305, b, 13).
aula_teorica(1306, b, 13).
aula_teorica(1307, b, 13).
aula_teorica(1308, b, 13).
aula_teorica(1401, b, 14).
aula_teorica(1402, b, 14).
aula_teorica(1403, b, 14).
aula_teorica(1404, b, 14).
aula_teorica(1405, b, 14).
aula_teorica(1406, b, 14).
aula_teorica(1407, b, 14).
aula_teorica(1408, b, 14).
aula_teorica(1501, b, 15).
aula_teorica(1502, b, 15).
aula_teorica(1503, b, 15).
aula_teorica(1504, b, 15).
aula_teorica(1505, b, 15).
aula_teorica(1506, b, 15).
aula_teorica(1507, b, 15).
aula_teorica(1508, b, 15).

% Aulas de laboratorio
aula_laboratorio(401, b, 4).
aula_laboratorio(402, b, 4).
aula_laboratorio(403, b, 4).
aula_laboratorio(501, a, 5).
aula_laboratorio(502, a, 5).
aula_laboratorio(503, a, 5).
aula_laboratorio(601, a, 6).
aula_laboratorio(602, a, 6).
aula_laboratorio(603, a, 6).
aula_laboratorio(701, a, 7).
aula_laboratorio(702, a, 7).
aula_laboratorio(703, a, 7).
aula_laboratorio(801, b, 8).
aula_laboratorio(802, b, 8).
aula_laboratorio(803, b, 8).

% Horarios por turno
horario_manana(lunes_07_00, 'Lunes 07:00-09:00').
horario_manana(martes_07_00, 'Martes 07:00-09:00').
horario_manana(miercoles_07_00, 'Miércoles 07:00-09:00').
horario_manana(jueves_07_00, 'Jueves 07:00-09:00').
horario_manana(viernes_07_00, 'Viernes 07:00-09:00').
horario_manana(lunes_09_15, 'Lunes 09:15-11:15').
horario_manana(martes_09_15, 'Martes 09:15-11:15').
horario_manana(miercoles_09_15, 'Miércoles 09:15-11:15').
horario_manana(jueves_09_15, 'Jueves 09:15-11:15').
horario_manana(viernes_09_15, 'Viernes 09:15-11:15').

horario_tarde(lunes_11_30, 'Lunes 11:30-13:30').
horario_tarde(martes_11_30, 'Martes 11:30-13:30').
horario_tarde(miercoles_11_30, 'Miércoles 11:30-13:30').
horario_tarde(jueves_11_30, 'Jueves 11:30-13:30').
horario_tarde(viernes_11_30, 'Viernes 11:30-13:30').
horario_tarde(lunes_13_45, 'Lunes 13:45-15:45').
horario_tarde(martes_13_45, 'Martes 13:45-15:45').
horario_tarde(miercoles_13_45, 'Miércoles 13:45-15:45').
horario_tarde(jueves_13_45, 'Jueves 13:45-15:45').
horario_tarde(viernes_13_45, 'Viernes 13:45-15:45').
horario_tarde(lunes_16_00, 'Lunes 16:00-18:00').
horario_tarde(martes_16_00, 'Martes 16:00-18:00').
horario_tarde(miercoles_16_00, 'Miércoles 16:00-18:00').
horario_tarde(jueves_16_00, 'Jueves 16:00-18:00').
horario_tarde(viernes_16_00, 'Viernes 16:00-18:00').

horario_noche(lunes_18_15, 'Lunes 18:15-20:15').
horario_noche(martes_18_15, 'Martes 18:15-20:15').
horario_noche(miercoles_18_15, 'Miércoles 18:15-20:15').
horario_noche(jueves_18_15, 'Jueves 18:15-20:15').
horario_noche(viernes_18_15, 'Viernes 18:15-20:15').
horario_noche(lunes_20_30, 'Lunes 20:30-22:30').
horario_noche(martes_20_30, 'Martes 20:30-22:30').
horario_noche(miercoles_20_30, 'Miércoles 20:30-22:30').
horario_noche(jueves_20_30, 'Jueves 20:30-22:30').
horario_noche(viernes_20_30, 'Viernes 20:30-22:30').

% Disponibilidad de profesores (simplificada para todos los horarios)
disponible(Profesor, Horario) :- 
    profesor(Profesor),
    (horario_manana(Horario, _); horario_tarde(Horario, _); horario_noche(Horario, _)).

% Turnos
turno(m, Horario) :- horario_manana(Horario, _).
turno(t, Horario) :- horario_tarde(Horario, _).
turno(n, Horario) :- horario_noche(Horario, _).

% Cursos que son excepciones (siempre teóricos, incluso con 4h)
excepcion_curso_teorico(matematica_1).
excepcion_curso_teorico(comprension_redaccion_textos_1).
excepcion_curso_teorico(comprension_redaccion_textos_2).
excepcion_curso_teorico(matematica_2).
excepcion_curso_teorico(matematica_discreta).
excepcion_curso_teorico(estadistica_descriptiva_probabilidades).
excepcion_curso_teorico(calculo_1).
excepcion_curso_teorico(estadistica_inferencial).
excepcion_curso_teorico(calculo_2).

% Generar código de sección (35000-35999)
generar_seccion(Codigo) :-
    random(0, 1000, Num),
    NumPadded is Num + 1000, % Ensure 3 digits
    atom_concat('35', NumPadded, Temp),
    sub_atom(Temp, 0, 5, _, Codigo). % Take first 5 digits

% Obtener aula según tipo y piso
obtener_aula(teorico, Aula, Pabellon, Piso) :- aula_teorica(Aula, Pabellon, Piso).
obtener_aula(laboratorio, Aula, Pabellon, Piso) :- aula_laboratorio(Aula, Pabellon, Piso).

% Asignar horario según turno
asignar_horario(m, Horario, HorarioTexto) :- horario_manana(Horario, HorarioTexto).
asignar_horario(t, Horario, HorarioTexto) :- horario_tarde(Horario, HorarioTexto).
asignar_horario(n, Horario, HorarioTexto) :- horario_noche(Horario, HorarioTexto).

% Asignar curso según horas semanales
asignar_curso(Curso, Ciclo, Turno, Seccion, Profesor, Pabellon, Piso, Aula, HorarioTexto) :-
    curso(Curso, Tipo, Ciclo, Horas),
    profesor(Profesor),
    disponible(Profesor, Horario),
    turno(Turno, Horario),
    asignar_horario(Turno, Horario, HorarioTexto1),
    (   Horas = 2 ->
        generar_seccion(Seccion),
        TipoAula = teorico,
        obtener_aula(TipoAula, Aula, Pabellon, Piso),
        HorarioTexto = HorarioTexto1
    ;   Horas = 3 ->
        generar_seccion(Seccion),
        TipoAula = laboratorio,
        obtener_aula(TipoAula, Aula, Pabellon, Piso),
        HorarioTexto = HorarioTexto1
    ;   Horas = 4 ->
        generar_seccion(Seccion),
        (   excepcion_curso_teorico(Curso) ->
            TipoAula1 = teorico,
            obtener_aula(TipoAula1, Aula, Pabellon, Piso),
            asignar_horario(Turno, Horario2, HorarioTexto2),
            Horario \= Horario2,
            atom_concat(HorarioTexto1, '/', HorarioTemp),
            atom_concat(HorarioTemp, HorarioTexto2, HorarioTexto)
        ;   Tipo = mixto,
            TipoAula1 = teorico,
            obtener_aula(TipoAula1, Aula, Pabellon, Piso),
            HorarioTexto = HorarioTexto1
        )
    ).

% Asignar curso para 4 horas (segunda clase en laboratorio si no es excepción)
asignar_curso_segunda_clase(Curso, Ciclo, Turno, Seccion, Profesor, Pabellon, Piso, Aula, HorarioTexto) :-
    generar_seccion(Seccion),
    curso(Curso, mixto, Ciclo, 4),
    \+ excepcion_curso_teorico(Curso),
    profesor(Profesor),
    disponible(Profesor, Horario),
    turno(Turno, Horario),
    asignar_horario(Turno, Horario, HorarioTexto),
    obtener_aula(laboratorio, Aula, Pabellon, Piso).


% Generar cronograma para un ciclo y turno
generar_cronograma(Ciclo, Turno, Cronograma) :-
    findall(Curso, curso(Curso, _, Ciclo, _), Cursos),
    asignar_todos_cursos(Cursos, Ciclo, Turno, [], Cronograma).

% Asignar todos los cursos
asignar_todos_cursos([], _, _, Cronograma, Cronograma).
asignar_todos_cursos([Curso|Resto], Ciclo, Turno, CronogramaActual, CronogramaFinal) :-
    curso(Curso, _, Ciclo, Horas),
    generar_seccion(Seccion),
    asignar_curso(Curso, Ciclo, Turno, Seccion, Profesor, Pabellon, Piso, Aula, HorarioTexto),
    Asignacion = asignacion(Curso, Seccion, Profesor, Pabellon, Piso, Aula, HorarioTexto, Turno),
    \+ member(Asignacion, CronogramaActual),
    \+ conflicto_profesor(Profesor, HorarioTexto, CronogramaActual),
    \+ conflicto_aula(Aula, HorarioTexto, CronogramaActual),
    \+ profesor_repite_curso(Profesor, Curso, CronogramaActual),
    (   Horas = 4, \+ excepcion_curso_teorico(Curso) ->
        asignar_curso_segunda_clase(Curso, Ciclo, Turno, Seccion, Profesor, Pabellon2, Piso2, Aula2, HorarioTexto2),
        \+ conflicto_profesor(Profesor, HorarioTexto2, CronogramaActual),
        \+ conflicto_aula(Aula2, HorarioTexto2, CronogramaActual),
        atom_concat(HorarioTexto, '/', HorarioTemp),
        atom_concat(HorarioTemp, HorarioTexto2, HorarioCombinado),
        NuevaAsignacion = asignacion(Curso, Seccion, Profesor, Pabellon2, Piso2, Aula2, HorarioCombinado, Turno),
        NuevoCronograma = [NuevaAsignacion|CronogramaActual]
    ;   NuevoCronograma = [Asignacion|CronogramaActual]
    ),
    asignar_todos_cursos(Resto, Ciclo, Turno, NuevoCronograma, CronogramaFinal).

% Conflictos
conflicto_profesor(Profesor, Horario, Cronograma) :-
    member(asignacion(_, _, Profesor, _, _, _, HorarioExistente, _), Cronograma),
    horarios_conflictivos(Horario, HorarioExistente).

conflicto_aula(Aula, Horario, Cronograma) :-
    member(asignacion(_, _, _, _, _, Aula, HorarioExistente, _), Cronograma),
    horarios_conflictivos(Horario, HorarioExistente).

profesor_repite_curso(Profesor, Curso, Cronograma) :-
    member(asignacion(Curso, _, Profesor, _, _, _, _, _), Cronograma).

% Verificar si dos horarios son conflictivos (mismo día y hora)
horarios_conflictivos(Horario1, Horario2) :-
    (   sub_atom(Horario1, _, _, _, DiaHora1),
        sub_atom(Horario2, _, _, _, DiaHora1),
        DiaHora1 \= ''
    ;   sub_atom(Horario1, 0, _, _, Dia1), % Extract day from Horario1
        sub_atom(Horario2, 0, _, _, Dia2), % Extract day from Horario2
        Dia1 = Dia2, % Same day
        Horario1 \= Horario2
    ).

% Detectar conflictos
detectar_conflictos(Cronograma, Conflictos) :-
    findall(Conflicto, conflicto_en_cronograma(Cronograma, Conflicto), Conflictos).

conflicto_en_cronograma(Cronograma, conflicto_profesor(Profesor, Horario)) :-
    member(asignacion(Curso1, _, Profesor, _, _, _, Horario, _), Cronograma),
    member(asignacion(Curso2, _, Profesor, _, _, _, Horario, _), Cronograma),
    Curso1 \= Curso2.

conflicto_en_cronograma(Cronograma, conflicto_aula(Aula, Horario)) :-
    member(asignacion(Curso1, _, _, _, _, Aula, Horario, _), Cronograma),
    member(asignacion(Curso2, _, _, _, _, Aula, Horario, _), Cronograma),
    Curso1 \= Curso2.

conflicto_en_cronograma(Cronograma, conflicto_curso_repetido(Profesor, Curso)) :-
    member(asignacion(Curso, _, Profesor, _, _, _, Horario1, _), Cronograma),
    member(asignacion(Curso, _, Profesor, _, _, _, Horario2, _), Cronograma),
    Horario1 \= Horario2.

% Validar cronograma
validar_cronograma(Cronograma, valido) :-
    detectar_conflictos(Cronograma, []).

validar_cronograma(Cronograma, invalido(Conflictos)) :-
    detectar_conflictos(Cronograma, Conflictos),
    Conflictos \= [].

% Mostrar cronograma
mostrar_cronograma([]).
mostrar_cronograma([asignacion(Curso, Seccion, Profesor, Pabellon, Piso, Aula, Horario, Turno)|Resto]) :-
    format('ASIGNACION: ~w | ~w | ~w | ~w | ~w | ~w | ~w | ~w~n',
           [Curso, Seccion, Profesor, Pabellon, Piso, Aula, Horario, Turno]),
    mostrar_cronograma(Resto).

% Mostrar estado
mostrar_estado(valido) :-
    write('CRONOGRAMA VALIDO - Sin conflictos'), nl.

mostrar_estado(invalido(Conflictos)) :-
    write('CRONOGRAMA INVALIDO - Conflictos detectados:'), nl,
    mostrar_conflictos(Conflictos).

mostrar_conflictos([]).
mostrar_conflictos([conflicto_profesor(Profesor, Horario)|Resto]) :-
    format('CONFLICTO: Profesor ~w ya tiene clase en ~w~n', [Profesor, Horario]),
    mostrar_conflictos(Resto).
mostrar_conflictos([conflicto_aula(Aula, Horario)|Resto]) :-
    format('CONFLICTO: Aula ~w ya está ocupada en ~w~n', [Aula, Horario]),
    mostrar_conflictos(Resto).
mostrar_conflictos([conflicto_curso_repetido(Profesor, Curso)|Resto]) :-
    format('CONFLICTO: Profesor ~w dicta el curso ~w más de una vez~n', [Profesor, Curso]),
    mostrar_conflictos(Resto).

% Sistema principal
ejecutar_sistema(Ciclo, Turno) :-
    integer(Ciclo), Ciclo >= 1, Ciclo =< 7,
    member(Turno, [m, t, n]),
    write('=== SISTEMA DE ASIGNACION ACADEMICA ==='), nl,
    write('Generando cronograma para Ciclo '), write(Ciclo), write(' Turno '), write(Turno), nl,
    (   generar_cronograma(Ciclo, Turno, Cronograma) ->
        write('CRONOGRAMA_GENERADO:'), nl,
        mostrar_cronograma(Cronograma),
        validar_cronograma(Cronograma, Estado),
        write('ESTADO_CRONOGRAMA:'), nl,
        mostrar_estado(Estado)
    ;   write('ERROR: No se pudo generar un cronograma válido'), nl
    ).

% Predicado para listar profesores
listar_profesores :-
    findall(Profesor, profesor(Profesor), Profesores),
    atomic_list_concat(Profesores, ',', ProfStr),
    format('PROFESORES:[~w]~n', [ProfStr]).

% Predicado para listar cursos
listar_cursos :-
    findall([Nombre, Tipo, Ciclo, Horas], curso(Nombre, Tipo, Ciclo, Horas), Cursos),
    cursos_to_string(Cursos, CursosStr),
    format('CURSOS:[~w]~n', [CursosStr]).

% Convertir lista de cursos a string
cursos_to_string([], '').
cursos_to_string([[Nombre, Tipo, Ciclo, Horas]|Resto], Str) :-
    format(atom(S), '~w;~w;~w;~w', [Nombre, Tipo, Ciclo, Horas]),
    cursos_to_string(Resto, RestoStr),
    (   RestoStr = '' -> Str = S
    ;   atom_concat(S, ',', Temp),
        atom_concat(Temp, RestoStr, Str)
    ).