:-include('gamePVB.pl').

initGamePVP:- load_lib,
                board(Board),
                nl, write('Player v Player mode'), nl,
                playGamePVPinit(Board).

playGamePVPinit(Board):- N is 0,
						 length(Board, Boardsize),
                         playGamePVP(N, Board, Boardsize).

playGamePVP(N, Board, Boardsize):- N1 is N+1,
                        Num is (N mod 2), Pnum is (Num + 1), nl,
                        write('Player'), write(Pnum), write(' playing:'), nl,
                        display_board(Board), nl,
						determine_player(Num, Piece),
						nextPossiblePlays(Board, Piece, Plays),
                        (

							verify_no_play(Plays),
                            NewBoard = Board,
                            write('Impossible Movement'), nl;
							player_play(Board, NewBoard, Boardsize, Num, Piece)
                        ),
						(
                            game_over(Piece, NewBoard, Pnum);
                            playGamePVP(N1, NewBoard, Boardsize)
                        ).
