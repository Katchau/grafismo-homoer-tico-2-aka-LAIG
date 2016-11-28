:- include('gameBVB.pl').

cage:- nl, write('CAGE'), nl, nl,
         write(' 1- Player v Player'), nl,
         write(' 2- Player v CPU'), nl,
         write(' 3- CPU v CPU'), nl,
         write(' 0- Exit'), nl, nl,
         repeat,
         (
            write('Enter the mode: '),
            read(GameMode),
            (
                GameMode == 1;
                GameMode == 2;
                GameMode == 3;
                GameMode == 0
            )
         ),
         (
            GameMode == 1,
            initGamePVP;
            GameMode == 2,
            initGamePVB;
            GameMode == 3,
            initGameBVB;
            GameMode == 0
         ).

%start_game([L1 | Ls], Player).
%available_movement([L1 | Ls], Player, X1, Y1, X2, Y2).
%available_jump([L1 | Ls], Player,  X1, Y1, X2, Y2).
%skip_turn([L1 | Ls] ,Player).
%concede_game([L1 | Ls] , Player).
