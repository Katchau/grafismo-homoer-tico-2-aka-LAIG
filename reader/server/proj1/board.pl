:-include('movement restrictions.pl').

board([
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x]
		]).

initial_board([
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x],
			[x,o,x,o,x,o,x,o,x,o],
			[o,x,o,x,o,x,o,x,o,x]
		]).

final_board([
			[x,v,v,v,v,v,v,v,x,v],
			[v,x,v,v,v,v,v,x,v,x],
			[v,v,v,v,v,v,v,v,v,v],
			[v,v,v,v,v,v,v,v,v,v],
			[x,v,v,v,v,v,v,v,v,x],
			[v,x,v,v,v,x,v,v,v,v],
			[v,v,v,v,v,v,v,v,v,v],
			[v,v,v,x,v,v,v,v,v,v],
			[v,v,v,v,v,v,x,v,x,v],
			[v,x,v,v,v,v,v,x,v,v]
		]).

middle_board([
			[x,v,x,v,v,o,v,v,x,o],
			[v,v,v,v,v,v,v,x,o,x],
			[v,v,v,v,v,o,x,v,v,v],
			[v,v,v,v,v,x,v,v,v,x],
			[x,v,v,v,v,o,v,v,v,v],
			[v,x,v,v,v,x,o,x,o,x],
			[x,v,v,v,v,o,x,o,x,o],
			[v,v,v,v,o,v,v,x,o,x],
			[v,v,v,v,v,v,v,o,v,v],
			[o,v,o,v,v,v,v,x,o,x]
		]).

display_initial_line:- write('   1   2   3   4   5   6   7   8   9  10 ').
display_number_line(N) :- write(' '), write(N).
display_division :-    write('  ---------------------------------------').

display_board_aux([], _) :- display_division.
display_board_aux([L1 | Ls] , N) :- N1 is N+1,  display_division, nl, display_line(L1),
								  display_number_line(N1), nl, display_board_aux(Ls, N1).
display_board([L1 | Ls]) :- display_initial_line, nl, display_board_aux([L1 | Ls], 0).

display_line([]):- write(' | ') .
display_line([E1 | Es]) :-  write(' | '), traduz(E1),  display_line(Es).


traduz(v) :- write(' ').
traduz(o) :- write('O'). %put_code(11044).
traduz(x) :- write('X').%put_code(11093).
traduz(i) :- write('LOL').

select_piece_aux(X, X1, [L | Ls], Peca):- (X == X1, Peca = L , !) ; (X2 is X1 + 1, select_piece_aux(X, X2, Ls, Peca)).
select_piece_aux(X, Y, Y1, [L | Ls], Peca):- (Y == Y1 , !,  select_piece_aux(X, 1,L , Peca) ); (Y2 is Y1 + 1 , select_piece_aux(X, Y, Y2, Ls, Peca)).
select_piece([L | Ls],X , Y, Peca):- X =< 10, X >= 1, Y =< 10, Y >= 1, select_piece_aux(X, Y, 1, [L | Ls], Peca).

check_piece_existence(Piece, [X | Xs]):- member(Piece, X) ; check_piece_existence(Piece, Xs).
win_message(Player):- write('Player '), write(Player), write(' WINS!!<3').
game_over(Piece, Board, Player):- Piece == x, \+(check_piece_existence(o, Board)), display_board(Board), nl, win_message(Player).
game_over(Piece, Board, Player):- Piece == o, \+(check_piece_existence(x, Board)), display_board(Board), nl, win_message(Player).
