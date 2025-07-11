:- dynamic docente/4.

docente(1, 'Dr Juan', titular, 10).

:- dynamic curso/4.

curso(101, 'Matematicas I', 4, 1).

:- dynamic disponibilidad/5.

disponibilidad(1, lunes, manana, 8, 12).

:- dynamic asignacion_temporal/6.

asignacion_temporal(101, 1, lunes, manana, 8, 12).

:- dynamic next_docente_id/1.

next_docente_id(1).
next_docente_id(2).

:- dynamic next_curso_id/1.

next_curso_id(101).
next_curso_id(102).

