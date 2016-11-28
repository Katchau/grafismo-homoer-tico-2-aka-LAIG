:-include('gamePVP.pl').

initGameBVB:- load_lib,
                board(Board),
                nl, write('Player v CPU mode'), nl,
                playGameBVBinit(Board).

playGameBVBinit(Board):- N is 0,
						 length(Board, Boardsize),
						 repeat,
					  	(
							nl, write('Bots difficulty: '), nl,
							write(' 1- Easy'), nl, 
							write(' 2- Hard'), nl, 
					  		write('Difficulty of the bot:'),
					  		read(DifBot),
					  		(
					  			DifBot == 1;
					  			DifBot == 2
					  		)
					  	),
                         playGameBVB(N, Board, Boardsize, DifBot).

playGameBVB(N, Board, Boardsize, DifBot):- N1 is N+1,
                        Num is (N mod 2), Pnum is (Num + 1), nl,
                        write('Bot'), write(Pnum), write(' playing:'), nl,
                        display_board(Board), nl,
						determine_player(Num, Piece),
						nextPossiblePlays(Board, Piece, Plays),
                        (

							verify_no_play(Plays),
                            NewBoard = Board,
                            write('Impossible Movement'), nl;
							DifBot == 1,
							bot_play(Board, NewBoard, Plays, Piece);
							DifBot == 2,
							hard_bot_play(Board, NewBoard, Plays, Piece)
                        ),
						(
                            game_over(Piece, NewBoard, Pnum),
							nl, write(N1), write(' plays were made');
                            playGameBVB(N1, NewBoard, Boardsize, DifBot)
                        ).
