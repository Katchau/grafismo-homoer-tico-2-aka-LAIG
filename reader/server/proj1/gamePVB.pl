:-include('bot.pl').

initGamePVB:- load_lib,
                board(Board),
                nl, write('Player v CPU mode'), nl,
                playGamePVBinit(Board).

playGamePVBinit(Board):- N is 0,
						 length(Board, Boardsize),
                         repeat,
                         (
                            write('Num of the player(1,2):'),
                            read(NumPlay),
                            (
                                NumPlay == 1;
                                NumPlay == 2
                            )
                         ),
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
					  					playGamePVB(N, Board, Boardsize, NumPlay, DifBot).
					  
playGamePVB(N, Board, Boardsize, NumPlay, DifBot):- NPlay is (NumPlay-1),
                                            N1 is N+1,
                                            Num is (N mod 2), Pnum is (Num + 1), nl,
						                                determine_player(Num, Piece),
						                                nextPossiblePlays(Board, Piece, Plays),
                                            (
							                                     verify_no_play(Plays),
                                                   NewBoard = Board,
                                                   write('Impossible Movement'), nl;
                                          (
								                                  Num == NPlay,
                                                  write('Player playing:'), nl,
                                                  display_board(Board), nl,
								                                  player_play(Board, NewBoard, Boardsize, Num, Piece)
							                            );
							                            (
								                                  Num \== NPlay,
																  write('CPU playing...'), nl,
																  (
																	DifBot == 1,
																	bot_play(Board, NewBoard, Plays, Piece);
																	DifBot == 2,
																	hard_bot_play(Board, NewBoard, Plays, Piece)
																  )
								                                  
							                            )
                                          ),
						                              (
                                                  game_over(Piece, NewBoard, Pnum);
                                                  playGamePVB(N1, NewBoard, Boardsize, NumPlay, DifBot)
                                          ).
