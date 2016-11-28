:-include('board.pl').

verifyPlayerPiece(Pnum, Piece):- Piece == 'x', Pnum == 0; Piece == 'o', Pnum == 1.

verify_movement_aux(Board, Piece, X, Y, Xf, Yf):- select_piece(Board, X, Y, Elem), Elem == Piece,
                                                      (
                                                         jump(Board, _, Piece, X, Y, Xf, Yf);
                                                         (
															   replace_element(Board, CleanBoard, X, Y, v) ,check_ortho_adjacency(CleanBoard, Piece, Xf, Yf),
                                                             check_restriction(Board, X, Y, Xf, Yf),
                                                             (
                                                                length(Board, Boardsize), check_center_move(Boardsize, X, Y, Xf, Yf);
                                                                check_mov_adjoining(Board, Xf, Yf)
                                                             )
                                                         )
                                                      ).


verify_movement2(Board, Piece, X, Y):- Xf is X + 1, Yf is Y, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X - 1, Yf is Y, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X, Yf is Y + 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X, Yf is Y - 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X + 1, Yf is Y - 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X - 1, Yf is Y - 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X + 1, Yf is Y + 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).
verify_movement2(Board, Piece, X, Y):- Xf is X - 1, Yf is Y + 1, verify_movement_aux(Board, Piece, X, Y, Xf, Yf).

next_possible_step(Board, B_s, Piece, PP, X , Y):-	(
														X < B_s,
														Xn is X + 1,
														nextPossiblePlay_aux(Board, B_s, Piece,  PP, Xn , Y)
													);
													(
														Y < B_s,
														Xn is 1,
														Yn is Y + 1,
														nextPossiblePlay_aux(Board, B_s, Piece, PP, Xn , Yn)
													).

nextPossiblePlay_aux(_, B_s, _, _, X, Y):- X == B_s, Y == B_s .
nextPossiblePlay_aux(Board, B_s, Piece, [L1 | Ls], X , Y):-	(
																verify_movement2(Board, Piece, X, Y),
																array_push(L1, X, Y),
																next_possible_step(Board, B_s, Piece, Ls, X , Y)
															);
 															next_possible_step(Board, B_s, Piece, [L1 | Ls], X , Y).


% PP = possible plays
nextPossiblePlays(Board, Piece, PP):- X is 1, Y is 1, length(Board, B_s),
                                     nextPossiblePlay_aux(Board, B_s, Piece, PP, X, Y), !.

determine_player(Num, x):- Num == 0 .
determine_player(Num, o):- Num \== 0 .

verify_no_play(Plays):- nth0(0, Plays, Ele), length(Ele, L), L \== 2, !.



checkRightPiece(Board, X, Y, Pnum, Piece):- select_piece(Board, X, Y, Piece),
                                            verifyPlayerPiece(Pnum, Piece).


first_read(Board, Boardsize, Piece, X, Y, Num):- repeat,
									  (
										  nl, write('Enter the coordinates of the piece:'), nl,
										  readCoords(X,Y, Boardsize),
										  checkRightPiece(Board, X, Y, Num, Piece)
									  ).

destination_read(Boardsize, X, Y, Xf, Yf):- write('Enter the coordinates of the destinantion of the piece:'), nl,
											readCoords(Xf,Yf, Boardsize),
											validate_destination(X, Y, Xf, Yf).

player_play(Board, NewBoard, Boardsize, Num, Piece):-  repeat,
											(
												 first_read(Board, Boardsize, Piece, X, Y, Num),
												 destination_read(Boardsize, X, Y, Xf, Yf),
												 (
													 jump_cycle(Board, NewBoard, Piece, X, Y, Xf, Yf);
													 (
														 replace_element(Board, CleanBoard, X, Y, v) ,check_ortho_adjacency(CleanBoard, Piece, Xf, Yf),
														 check_restriction(Board, X, Y, Xf, Yf),
														 (
															 (
																 check_center_move(Boardsize, X, Y, Xf, Yf);
																 check_mov_adjoining(Board, Xf, Yf)
															 ),
															 move_piece(Board, NewBoard, X, Y, Xf, Yf, Piece)
														 )
													 )
												 )
											).
											
laig_player(Board, NewBoard, Boardsize, Num, Piece,X, Y, Xf, Yf):-  
checkRightPiece(Board, X, Y, Num, Piece),
validate_destination(X, Y, Xf, Yf),
(
	replace_element(Board, CleanBoard, X, Y, v) ,check_ortho_adjacency(CleanBoard, Piece, Xf, Yf),
	check_restriction(Board, X, Y, Xf, Yf),
	(
		 (
			 check_center_move(Boardsize, X, Y, Xf, Yf);
			 check_mov_adjoining(Board, Xf, Yf)
		 ),
		 move_piece(Board, NewBoard, X, Y, Xf, Yf, Piece)
	)
).
											
