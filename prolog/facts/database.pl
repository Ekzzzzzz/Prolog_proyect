:- dynamic docente/4, curso/4, disponibilidad/5, asignacion_temporal/6.
:- dynamic next_docente_id/1, next_curso_id/1.

% Inicialización
:- initialization((
    (exists_file('prolog/facts/database_saved.pl') -> 
        consult('prolog/facts/database_saved.pl');
        (assertz(next_docente_id(1)), assertz(next_curso_id(101)))
    )
)).

% Incrementadores
incrementar_docente_id :-
    retract(next_docente_id(Current)),
    New is Current + 1,
    assertz(next_docente_id(New)).

incrementar_curso_id :-
    retract(next_curso_id(Current)),
    New is Current + 1,
    assertz(next_curso_id(New)).

% Persistencia (SOLO aquí)
save_data :-
    tell('prolog/facts/database_saved.pl'),
    write(':- dynamic docente/4, curso/4, disponibilidad/5, asignacion_temporal/6.\n'),
    write(':- dynamic next_docente_id/1, next_curso_id/1.\n\n'),
    listing(docente/4),
    listing(curso/4),
    listing(disponibilidad/5),
    listing(asignacion_temporal/6),
    listing(next_docente_id/1),
    listing(next_curso_id/1),
    told.