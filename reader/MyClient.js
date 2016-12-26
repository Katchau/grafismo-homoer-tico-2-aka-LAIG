/* Construtor do cliente */
function MyClient(server) {

    this.server_url = server;
    this.board = null;
    this.gameOver = false;
    this.reset_board();
    this.player = 'x';
    this.playNumber = 0;
    this.default_board_length = this.board.length;
}

MyClient.prototype = Object.create(null);
MyClient.prototype.constructor=MyClient;


MyClient.prototype.createRequest = function () {
    var temp = new XMLHttpRequest();
    temp.onreadystatechange = function() {
        if (temp.readyState == XMLHttpRequest.DONE ) {
            if (temp.status == 200) {
                return temp.responseText;
            }
            else if (temp.status == 400) {
                console.log("Bad request");
                return false;
            }
            else {
                console.log("No available connection");
                return false;
            }
        }
    };
    return temp;
};

MyClient.prototype.sendRequest = function (request) {
    var xmlhttp = this.createRequest();
    var url = this.server_url + "" + request;
    xmlhttp.open("GET", url, false); //fazer de forma assíncrona, ou sincronizada?
    xmlhttp.send();
    return xmlhttp.onreadystatechange();
};

MyClient.prototype.requestManager = function (response) {
    switch (response){
        case false:
            return "error";
            break;
        case "Syntax Error":
            return "error";
            break;
        case "0":
            return false;
            break;
        case "1":
            return true;
            break;
        case "could not jump":
            return false;
            break;
        case "could not move":
            return false;
            break;
    }
    if(response.length == this.default_board_length){
        this.board = response;
        return true;
    }
    else if(response.length > this.default_board_length){
        this.board = response.substring(1,222);
        var next_play = response.substr(223);
        var number1 = "";
        var number2 = "";
        var next_number = false;
        for(var i = 0; i < next_play.length-1; i++){
            if(next_play[i] == ',') next_number = true;
            else if(next_number) number2 += next_play[i];
            else number1 += next_play[i];
        }
        this.number1 = parseInt(number1);
        this.number2 = parseInt(number2);
        return "jump again";
    }
};

MyClient.prototype.reset_board = function () {
    this.board = "[[x,o,x,o,x,o,x,o,x,o]," +
        "[o,x,o,x,o,x,o,x,o,x]," +
        "[x,o,x,o,x,o,x,o,x,o]," +
        "[o,x,o,x,o,x,o,x,o,x]," +
        "[x,o,x,o,x,o,x,o,x,o]," +
        "[o,x,o,x,o,x,o,x,o,x]," +
        "[x,o,x,o,x,o,x,o,x,o]," +
        "[o,x,o,x,o,x,o,x,o,x]," +
        "[x,o,x,o,x,o,x,o,x,o]," +
        "[o,x,o,x,o,x,o,x,o,x]]";
};

MyClient.prototype.jump = function(x,y,xf,yf){
    return "jump(" + this.board + "," + this.player + "," + x + "," + y + "," + xf + "," + yf + ")";
};

MyClient.prototype.getGameState = function () {
    return "gg(" + this.board + "," + this.player + ")"; //checka se o jogo terminou ou nao
};

MyClient.prototype.move = function(x,y,xf,yf){
    var num = (this.player == 'x') ? 0 : 1;
    return "move(" + this.board + "," + this.player + "," + num + "," + x + "," + y + "," + xf + "," + yf + ")";
};

MyClient.prototype.canPlay = function(){
    return "canPlay(" + this.board + "," + this.player + ")";
};

MyClient.prototype.switchPlayer = function () {
    this.player = (this.player == 'x') ? 'o' : 'x';
};

MyClient.prototype.prolog_request = function (request) {
    return this.requestManager(this.sendRequest(request));
};

MyClient.prototype.makePlay = function (x, y, xf, yf) {
    if(this.gameOver) return false;
    if(!this.prolog_request(this.canPlay())){
        this.switchPlayer();
        return true;
    }
    var jump_result = this.prolog_request(this.jump(x,y,xf,yf));
    if(typeof jump_result == "string"){
        //todo falta isto e já fica jogável
        //todo fazer ciclo para vários saltos precisa novamente de input do jogador
        //todo possivelmente vou ter de separar isto em várias funções, que é para poder invocar o ciclo de saltos várias vezes
    }
    else if(!jump_result){
        var move_result = this.prolog_request(this.move(x,y,xf,yf));
        if(!move_result) return false;
    }
    if(this.prolog_request(this.getGameState())){
        this.gameOver = true;//falta declarar vencedor
    }
    this.playNumber++;
    this.switchPlayer();
    return true;
    //console.log(prolog_request);

};