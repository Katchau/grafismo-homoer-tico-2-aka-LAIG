:-include('player.pl').

get_random_coord(X, Y, Xf, Yf, N):- N == 0, Xf is X, Yf is Y - 1.
get_random_coord(X, Y, Xf, Yf, N):- N == 1, Xf is X, Yf is Y + 1.
get_random_coord(X, Y, Xf, Yf, N):- N == 2, Xf is X - 1, Yf is Y.
get_random_coord(X, Y, Xf, Yf, N):- N == 3, Xf is X + 1, Yf is Y.
get_random_coord(X, Y, Xf, Yf, N):- N == 4, Xf is X + 1, Yf is Y - 1 .
get_random_coord(X, Y, Xf, Yf, N):- N == 5, Xf is X - 1, Yf is Y - 1 .
get_random_coord(X, Y, Xf, Yf, N):- N == 6, Xf is X + 1, Yf is Y + 1 .
get_random_coord(X, Y, Xf, Yf, N):- N == 7, Xf is X - 1, Yf is Y + 1 .

get_random_ortho(X, Y, Xf, Yf):- random(0, 4, Numb), get_random_coord(X, Y, Xf, Yf, Numb), !.
get_random_dest(X, Y, Xf, Yf):- random(0, 8, Numb), get_random_coord(X, Y, Xf, Yf, Numb), !.
get_smthing(X, Y, Xf, Yf, Numb):- get_random_coord(X, Y, Xf, Yf, Numb), !.

jump_bot_cycle_hard(Board, NewBoard, Piece, X, Y, Xf, Yf, Num):- (
															jump(Board, NextBoard, Piece, X, Y, Xf, Yf, Xd, Yd),
															can_reJump(NextBoard, Piece, Xd, Yd),
															nl, display_board(NextBoard), nl,
															repeat , 
															(
																get_random_ortho(Xd, Yd, Xnew, Ynew),
																jump_bot_cycle_hard(NextBoard, NewBoard, Piece, Xd, Yd, Xnew, Ynew, Num1),
																Num is Num1 + 1
															),
															nl, display_board(NewBoard), nl
														); 
														jump(Board, NewBoard, Piece, X, Y, Xf, Yf), Num is 1 .


bot_movement_aux_hard(Board, NewBoard, Piece, X, Y, Xf, Yf, Num):- validate_destination(X, Y, Xf, Yf),
                                                            (
                                                               jump_bot_cycle_hard(Board, NewBoard, Piece, X, Y, Xf, Yf, Num);
                                                               (
																   replace_element(Board, CleanBoard, X, Y, v) ,check_ortho_adjacency(CleanBoard, Piece, Xf, Yf),
                                                                   check_restriction(Board, X, Y, Xf, Yf),
                                                                   (
                                                                      length(Board, Boardsize), check_center_move(Boardsize, X, Y, Xf, Yf);
                                                                      check_mov_adjoining(Board, Xf, Yf)
                                                                   ),
																   move_piece(Board, NewBoard, X, Y, Xf, Yf, Piece), Num is 0
                                                               )
                                                            ).		

select_higher_value(X, Y, Z, N, N1, N2):- X > Y, Z is X, N2 is N; X =< Y, Z is Y, N2 is N1.

get_points(Board, Piece, X, Y, N, Points):- ( get_random_coord(X, Y, Xf, Yf, N), Xf > 0, Yf > 0, Xf < 11, Yf < 11,
												bot_movement_aux_hard(Board, _, Piece, X, Y, Xf, Yf, Points), !) ; Points is -1 .

best_movement(Board, Piece, X, Y, Points, N):- Point is -2, N0 is 0,
													get_points(Board, Piece, X, Y, 0, Points1), select_higher_value(Point, Points1, Point1, N0, 0, N1), 
													get_points(Board, Piece, X, Y, 1, Points2), select_higher_value(Point1, Points2, Point2, N1, 1, N2), 
													get_points(Board, Piece, X, Y, 2, Points3), select_higher_value(Point2, Points3, Point3, N2, 2, N3), 
													get_points(Board, Piece, X, Y, 3, Points4), select_higher_value(Point3, Points4, Point4, N3, 3, N4), 
													get_points(Board, Piece, X, Y, 4, Points5), select_higher_value(Point4, Points5, Point5, N4, 4, N5),
													get_points(Board, Piece, X, Y, 5, Points6), select_higher_value(Point5, Points6, Point6, N5, 5, N6),
													get_points(Board, Piece, X, Y, 6, Points7), select_higher_value(Point6, Points7, Point7, N6, 6, N7),
													get_points(Board, Piece, X, Y, 7, Points8), select_higher_value(Point7, Points8, Points, N7, 7, N).

													
%hard_cycle_aux(Board, Plays, Piece, Element, Limit, Score, Choice):- Element == Limit.
%hard_cycle_aux(Board, Plays, Piece, Element, Limit, Score, Choice):- nth0(N, Plays, Vect), nth0(0, Vect, X1), nth0(1, Vect, Y1), 
																	 %best_movement( Board,Piece, X1, Y1, Points, Choice),
													
%hard_cycle(Board, Plays, Piece, X, Y, Choice):- N is 0, Score is 0, length(Plays, L), Length is L - 1,

jump_bot_cycle(Board, NewBoard, Piece, X, Y, Xf, Yf):- (
															jump(Board, NextBoard, Piece, X, Y, Xf, Yf, Xd, Yd),
															can_reJump(NextBoard, Piece, Xd, Yd),
															nl, display_board(NextBoard), nl,
															repeat , 
															(
																get_random_ortho(Xd, Yd, Xnew, Ynew),
																jump_bot_cycle(NextBoard, NewBoard, Piece, Xd, Yd, Xnew, Ynew)
															),
															nl, display_board(NewBoard), nl
														); 
														jump(Board, NewBoard, Piece, X, Y, Xf, Yf).


bot_movement_aux(Board, NewBoard, Piece, X, Y, Xf, Yf):- validate_destination(X, Y, Xf, Yf),
                                                            (
                                                               jump_bot_cycle(Board, NewBoard, Piece, X, Y, Xf, Yf);
                                                               (
																   replace_element(Board, CleanBoard, X, Y, v) ,check_ortho_adjacency(CleanBoard, Piece, Xf, Yf),
                                                                   check_restriction(Board, X, Y, Xf, Yf),
                                                                   (
                                                                      length(Board, Boardsize), check_center_move(Boardsize, X, Y, Xf, Yf);
                                                                      check_mov_adjoining(Board, Xf, Yf)
                                                                   ),
																   move_piece(Board, NewBoard, X, Y, Xf, Yf, Piece)
                                                               )
                                                            ).													

random_cycle(Board, NewBoard, Piece, X, Y):- repeat,
												(
													get_random_dest(X, Y, Xf, Yf),
													bot_movement_aux(Board, NewBoard, Piece, X, Y, Xf, Yf)
												).						
random_hard_cycle(Board, NewBoard, Piece, X, Y):- 
													get_random_dest(X, Y, Xf, Yf),
													bot_movement_aux_hard(Board, _, Piece, X, Y, Xf, Yf, Points),
													Points > 0, bot_movement_aux_hard(Board, NewBoard, Piece, X, Y, Xf, Yf, Points).
												
choose_random_movement(Board, NewBoard, Piece, Plays):- length(Plays, Num), N is Num - 1, N >= 1, random(0, N, Random),
														nth0(Random, Plays, Vect), nth0(0, Vect, X), nth0(1, Vect, Y),
														random_cycle(Board, NewBoard, Piece, X, Y).

choose_random_movement(Board, NewBoard, Piece, Plays):- nth0(0, Plays, Vect), nth0(0, Vect, X), nth0(1, Vect, Y),
														random_cycle(Board, NewBoard, Piece, X, Y).


change_best_piece(Board, NewBoard, Piece, X, Y):- best_movement(Board, Piece, X, Y, _, N), get_smthing(X, Y, Xf, Yf, N),
											  bot_movement_aux(Board, NewBoard, Piece, X, Y, Xf, Yf).
											
choose_hard_movement(Board, NewBoard, Piece, Plays):- length(Plays, Num), N is Num - 1, N >= 1, 
														repeat, (
															random(0, N, Random),
															nth0(Random, Plays, Vect), nth0(0, Vect, X), nth0(1, Vect, Y),
															change_best_piece(Board, NewBoard, Piece, X, Y)															
														).
														
choose_hard_movement(Board, NewBoard, Piece, Plays):- nth0(0, Plays, Vect), nth0(0, Vect, X), nth0(1, Vect, Y),
													  change_best_piece(Board, NewBoard, Piece, X, Y).
														
bot_play(Board, NewBoard, Plays, Piece):-  choose_random_movement(Board, NewBoard, Piece, Plays).
hard_bot_play(Board, NewBoard, Plays, Piece):-  choose_hard_movement(Board, NewBoard, Piece, Plays).