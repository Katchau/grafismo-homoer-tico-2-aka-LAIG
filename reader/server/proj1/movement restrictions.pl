:-include('usefull prepositions.pl').

check_outOfBounds(X, Y):- X == 0; Y == 0; Y == 11; X == 11 .

check_ortho_aux(_, X, Y, _):- check_outOfBounds(X , Y).
check_ortho_aux(Board, X, Y, Peca):- select_piece(Board, X, Y, Other), Other \== Peca.
check_ortho_adjacency(Board, Peca, X, Y):- X1 is X + 1, X2 is X - 1, Y1 is Y + 1, Y2 is Y - 1,
									 check_ortho_aux(Board, X1, Y, Peca), !, check_ortho_aux(Board, X, Y1, Peca), !,
									 check_ortho_aux(Board, X2, Y, Peca), !, check_ortho_aux(Board, X, Y2, Peca), !.


check_ortho_adv_aux(Board, X, Y, Peca):- select_piece(Board, X, Y, Other), Other \== Peca, Other \== v.
%amnh ver isto
check_ortho_adv_adjacency(Peca, Board, X, Y):- select_piece(Board, X, Y, Peca), Peca \== v, !, X1 is X + 1, X2 is X-1, Y1 is Y +1, Y2 is Y-1,
									    									(
                                         check_ortho_adv_aux(Board, X1, Y, Peca), !;
                                         check_ortho_adv_aux(Board, X, Y1, Peca), !;
									     check_ortho_adv_aux(Board, X2, Y, Peca), !;
                                         check_ortho_adv_aux(Board, X, Y2, Peca), !
                                        ).

check_ortho_adv_adjacency_dest(Peca, Board, X, Y):- select_piece(Board, X, Y, PecaDest), PecaDest == v, !, X1 is X + 1, X2 is X-1, Y1 is Y +1, Y2 is Y-1,
                                        (
                                         check_ortho_adv_aux(Board, X1, Y, Peca), !;
                                         check_ortho_adv_aux(Board, X, Y1, Peca), !;
                                         check_ortho_adv_aux(Board, X2, Y, Peca), !;
                                         check_ortho_adv_aux(Board, X, Y2, Peca), !
                                        ).

check_restriction(Board, X, Y, X1, X2) :- check_ortho_adv_adjacency(Peca, Board, X, Y), check_ortho_adv_adjacency_dest(Peca, Board, X1, X2), !; \+(check_ortho_adv_adjacency(Peca, Board, X, Y)), Peca \== v.

check_center_move(Value, ExpectValue):- ExpectValue == -1, Value =< 0 .
check_center_move(Value, ExpectValue):- ExpectValue \== -1, Value >= 0 .
check_center_move(X0, Y0, X, Y, ExpectX, ExpectY):- get_vector(X0, Y0, X, Y, Xv, Yv), check_center_move(Xv, ExpectX), !, check_center_move(Yv, ExpectY), !.

check_center_move(Board_size, X0, Y0, X ,Y):- X0 > Board_size / 2, Y0 =< Board_size / 2 , !, check_center_move(X0, Y0, X, Y, -1, 1) .
check_center_move(Board_size, X0, Y0, X ,Y):- X0 =< Board_size / 2, Y0 > Board_size / 2, !, check_center_move(X0, Y0, X, Y, 1, -1) .
check_center_move(Board_size, X0, Y0, X ,Y):- X0 > Board_size / 2, Y0 > Board_size / 2, !, check_center_move(X0, Y0, X, Y, -1, -1) .
check_center_move(Board_size, X0, Y0, X ,Y):- X0 =< Board_size / 2, Y0 =< Board_size / 2, !, check_center_move(X0, Y0, X, Y, 1, 1) .

check_mov_adjoining(Board, X, Y):- check_ortho_adv_adjacency_dest( _, Board, X, Y).

jump_aux(NewBoard, NewBoard, _, X, Y):- check_outOfBounds(X , Y), !.
jump_aux(Board, NewBoard, Peca, X, Y):- select_piece(Board, X, Y, Vazio), Vazio == v, replace_element(Board, NewBoard, X, Y, Peca),  !, check_ortho_adjacency(NewBoard, Peca, X, Y).
jump_aux(Board, NewBoard, Peca, X0, Y0, X, Y, Xf, Yf):- X \== X0, Y0 == Y, X_F is X + (X-X0), !,  Xf = X_F, Yf = Y,
											  clean_two_elements(Board, BoardInter, X0, Y0, X ,Y), jump_aux(BoardInter, NewBoard, Peca, X_F, Y).
jump_aux(Board, NewBoard, Peca, X0, Y0, X, Y, Xf, Yf):- Y \== Y0, X0 == X, Y_F is Y + (Y-Y0), !, Yf = Y_F, Xf = X,
											  clean_two_elements(Board, BoardInter, X0, Y0, X, Y), jump_aux(BoardInter, NewBoard, Peca, X, Y_F).

jump(Board, NewBoard, Player, X0, Y0, X, Y):- select_piece(Board, X, Y, Peca), Peca \== Player, Peca \== v, !, jump_aux(Board, NewBoard, Player, X0, Y0, X, Y, _, _).
jump(Board, NewBoard, Player, X0, Y0, X, Y, Xf, Yf):- select_piece(Board, X, Y, Peca), Peca \== Player, Peca \== v, !, jump_aux(Board, NewBoard, Player, X0, Y0, X, Y, Xf, Yf).

can_reJump(Board, Piece, X, Y):- X1 is X + 1, jump(Board, _, Piece, X, Y, X1, Y).
can_reJump(Board, Piece, X, Y):- X1 is X - 1, jump(Board, _, Piece, X, Y, X1, Y).
can_reJump(Board, Piece, X, Y):- Y1 is Y + 1, jump(Board, _, Piece, X, Y, X, Y1).
can_reJump(Board, Piece, X, Y):- Y1 is Y - 1, jump(Board, _, Piece, X, Y, X, Y1).

jump_cycle(Board, NewBoard, Piece, X, Y, Xf, Yf):-  (
														jump(Board, NextBoard, Piece, X, Y, Xf, Yf, Xd, Yd),
														can_reJump(NextBoard, Piece, Xd, Yd),
														nl, display_board(NextBoard), nl,
														repeat , 
														(
															length(Board, Length), destination_read(Length, Xd, Yd, Xnew, Ynew),
															jump_cycle(NextBoard, NewBoard, Piece, Xd, Yd, Xnew, Ynew)
														),
														nl, display_board(NewBoard), nl
													); 
													jump(Board, NewBoard, Piece, X, Y, Xf, Yf).