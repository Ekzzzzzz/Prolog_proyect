:- use_module(library(http/json)).

% Importar la base de datos (con persistencia)
:- consult('../facts/database').

% --------------------------------------------
% DOCENTES
% --------------------------------------------

consultar_docentes :-
    findall(
        _{id:ID, nombre:Nombre, categoria:Categoria, experiencia:Experiencia},
        docente(ID, Nombre, Categoria, Experiencia),
        Docentes
    ),
    json_write(current_output, Docentes).

agregar_docente(Nombre, Categoria, Experiencia) :-
    next_docente_id(NextID),
    assertz(docente(NextID, Nombre, Categoria, Experiencia)),
    incrementar_docente_id,
    save_data, % <- Usa la función definida en database.pl
    json_write(current_output, _{status:success, id:NextID}).
    
eliminar_docente(ID) :-
    retract(docente(ID, _, _, _)),
    retractall(disponibilidad(ID, _, _, _, _)),
    retractall(asignacion_temporal(_, ID, _, _, _, _)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

% --------------------------------------------
% CURSOS
% --------------------------------------------

consultar_cursos :-
    findall(
        _{id:ID, nombre:Nombre, creditos:Creditos, ciclo:Ciclo},
        curso(ID, Nombre, Creditos, Ciclo),
        Cursos
    ),
    json_write(current_output, Cursos).

agregar_curso(Nombre, Creditos, Ciclo) :-
    next_curso_id(NextID),
    assertz(curso(NextID, Nombre, Creditos, Ciclo)),
    incrementar_curso_id,
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success, id:NextID}).

eliminar_curso(ID) :-
    retract(curso(ID, _, _, _)),
    retractall(asignacion_temporal(ID, _, _, _, _, _)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

% --------------------------------------------
% DISPONIBILIDAD
% --------------------------------------------

consultar_disponibilidad :-
    findall(
        _{id:ID, dia:Dia, turno:Turno, inicio:Inicio, fin:Fin},
        disponibilidad(ID, Dia, Turno, Inicio, Fin),
        Disponibilidad
    ),
    json_write(current_output, Disponibilidad).

agregar_disponibilidad(ID_Docente, Dia, Turno, Inicio, Fin) :-
    assertz(disponibilidad(ID_Docente, Dia, Turno, Inicio, Fin)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

eliminar_disponibilidad(ID_Docente, Dia, Turno, Inicio, Fin) :-
    retract(disponibilidad(ID_Docente, Dia, Turno, Inicio, Fin)),
    retractall(asignacion_temporal(_, ID_Docente, Dia, Turno, _, _)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

% --------------------------------------------
% CRONOGRAMA (ASIGNACIONES)
% --------------------------------------------

cronograma_actual(ID_Curso, NombreCurso, ID_Docente, NombreDocente, Dia, Turno, Inicio, Fin) :-
    asignacion_temporal(ID_Curso, ID_Docente, Dia, Turno, Inicio, Fin),
    (   curso(ID_Curso, NombreCurso, _, _) 
    ->  true 
    ;   NombreCurso = 'Curso no encontrado',
        format(user_error, 'ADVERTENCIA: Curso no encontrado para ID ~w~n', [ID_Curso])
    ),
    (   docente(ID_Docente, NombreDocente, _, _) 
    ->  true 
    ;   NombreDocente = 'Docente no encontrado',
        format(user_error, 'ADVERTENCIA: Docente no encontrado para ID ~w~n', [ID_Docente])
    ),
    (   disponibilidad(ID_Docente, Dia, Turno, DispInicio, DispFin)
    ->  Inicio >= DispInicio,
        Fin =< DispFin
    ;   format(user_error, 'ADVERTENCIA: Disponibilidad no encontrada para docente ~w en ~w ~w~n', [ID_Docente, Dia, Turno])
    ).

consultar_cronograma :-
    findall(
        json([id_curso=ID_Curso, nombre_curso=NombreCurso, 
             id_docente=ID_Docente, nombre_docente=NombreDocente,
             dia=Dia, turno=Turno, inicio=Inicio, fin=Fin]),
        cronograma_actual(ID_Curso, NombreCurso, ID_Docente, NombreDocente, Dia, Turno, Inicio, Fin),
        Cronograma
    ),
    json_write(current_output, Cronograma).

agregar_asignacion(ID_Curso, ID_Docente, Dia, Turno, Inicio, Fin) :-
    curso(ID_Curso, _, _, _),
    docente(ID_Docente, _, _, _),
    disponibilidad(ID_Docente, Dia, Turno, DispInicio, DispFin),
    Inicio >= DispInicio,
    Fin =< DispFin,
    \+ (asignacion_temporal(_, ID_Docente, Dia, Turno, AsigInicio, AsigFin),
        ((AsigInicio =< Inicio, AsigFin > Inicio);
         (Inicio =< AsigInicio, Fin > AsigInicio))),
    assertz(asignacion_temporal(ID_Curso, ID_Docente, Dia, Turno, Inicio, Fin)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

limpiar_cronograma :-
    retractall(asignacion_temporal(_, _, _, _, _, _)),
    save_data, % Guardar cambios en archivo
    json_write(current_output, _{status:success}).

% --------------------------------------------
% PERSISTENCIA (GUARDAR/CARGAR DATOS)
% --------------------------------------------

% Guardar todos los datos en un archivo
save_data :-
    tell('prolog/facts/database_saved.pl'),
    listing(docente/4),
    listing(curso/4),
    listing(disponibilidad/5),
    listing(asignacion_temporal/6),
    listing(next_docente_id/1),
    listing(next_curso_id/1),
    told.

% Cargar datos al inicio (si el archivo existe)
:- initialization(load_data).

load_data :-
    exists_file('prolog/facts/database_saved.pl'),
    consult('prolog/facts/database_saved.pl').

load_data. % Si no existe el archivo, continúa sin errores