load_lib:- use_module(library(lists)), use_module(library(random)).

array_push([X , Y], X, Y).

get_vector(X0, Y0, X , Y, Xf, Yf):- Xf is X - X0, Yf is Y - Y0 .

validate_coord(X, Boardsize):- X =< Boardsize , X >= 1 .

readCoords(X,Y, Boardsize):- write('X= '), read(X), validate_coord(X, Boardsize), 
							 write('Y= '), read(Y), validate_coord(Y, Boardsize).
				  

check_destinationCoords(X, Xf):- X == Xf.
check_destinationCoords(X, Xf):- Xv is Xf - 1, X == Xv.
check_destinationCoords(X, Xf):- Xv is Xf + 1, X == Xv.
no_movement_selected(X0, Y0, X, Y):- X == X0, Y == Y0 .
validate_destination(X0, Y0, X, Y):- \+(no_movement_selected(X0, Y0, X, Y)), !,
									 check_destinationCoords(X0, X), !, check_destinationCoords(Y0, Y), !.

replace_element_list([],[], _, _, _).
replace_element_list([_ | L1], [Peca | L2], X, X1, Peca):- X == X1, X2 is X1 + 1, !, replace_element_list(L1, L2, X, X2, Peca).
replace_element_list([H | L1], [H | L2], X, X1, Peca):- X \== X1 , X2 is X1 + 1, !, replace_element_list(L1, L2, X, X2, Peca).

replace_element_board([],[], _, _, _, _).
replace_element_board([L | Ls], [L1 | Ls1], X, Y, Y1, Peca):- Y == Y1, Y2 is Y1 + 2, 
															  replace_element_list(L,L1,X,1,Peca), !, 
															  replace_element_board(Ls, Ls1, X, Y, Y2, Peca).
															  
replace_element_board([L | Ls], [L | Ls1], X, Y, Y1, Peca):- Y \== Y1, Y2 is Y1 + 1, replace_element_board(Ls, Ls1, X, Y, Y2, Peca) ,!.

replace_element(Board, NewBoard, X, Y, Peca):- replace_element_board(Board, NewBoard, X, Y, 1, Peca).

clean_two_elements(Board, NewBoard, X0, Y0, X, Y):- replace_element(Board, Inter, X0, Y0, v), replace_element(Inter, NewBoard, X, Y, v).
move_piece(Board, NewBoard, X0, Y0, X, Y, Peca):- replace_element(Board, Inter, X0, Y0, v), replace_element(Inter, NewBoard, X, Y, Peca).

random_element_list(L, Length, Element, Index):- random(0, Length, Index), nth0(Index, L, Element).

get_random_index(L, Piece, Index):- member(Piece, L),
									length(L, Length),
									repeat,
									(
										random_element_list(L, Length, Element, X),
										Element == Piece,
										Index is X + 1
									).