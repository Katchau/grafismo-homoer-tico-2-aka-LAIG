/* Construtor do cliente */
function MyClient(server) {

    this.server_url = server;
    this.board = null;
    this.backup_board =null;
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
    xmlhttp.open("GET", url, false);
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
        this.backup_board = this.board;
        this.board = response;
        return true;
    }
    else if(response.length > this.default_board_length){
        this.backup_board = this.board;
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
        return new Point(this.number1, this.number2);
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

MyClient.prototype.reset_player = function () {
    this.player = 'x';
};

MyClient.prototype.jump = function(x,y,xf,yf){
    return "jump(" + this.board + "," + this.player + "," + x + "," + y + "," + xf + "," + yf + ")";
};

MyClient.prototype.rejump = function(x,y){
    return "canJump(" + this.board + "," + this.player + "," + x + "," + y + ")";
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

MyClient.prototype.botPlay = function () {
    return "bot(" + this.board + "," + this.player + ")";
};

MyClient.prototype.botRequest = function (){
    var response = this.sendRequest(this.botPlay());
    if(response == "0") return false;
    this.backup_board = this.board;
    this.board = response.substring(1,222);
    var lixo = response.substring(224);
    var number1 = "";
    var number2 = "";
    var next_number = false;
    for(var i = 0; i < lixo.length-1; i++){
        if(lixo[i] == ',') {
            if(next_number == false) next_number = true;
            else break;
        }
        else if(next_number) number2 += lixo[i];
        else number1 += lixo[i];
    }
    var x = parseInt(number1);
    var y = parseInt(number2);
    this.bot_start = new Point(x,y);
    var skip = number1.length + number2.length;
    var lixo2 = response.substring(224+skip+3);

    number1 = "";
    number2 = "";
    this.points = [];
    next_number = false;
    for(var i = 0; i < lixo2.length; i++){
        if(lixo2[i] == ']'){
            x = parseInt(number1);
            y = parseInt(number2);
            this.points.push(new Point(x,y));
            number1 = "";
            number2 = "";
            next_number = false;
            break;
        }
        if(lixo2[i] == ',') {
            if(next_number == false) next_number = true;
            else{
                x = parseInt(number1);
                y = parseInt(number2);
                this.points.push(new Point(x,y));
                number1 = "";
                number2 = "";
                next_number = false;
            }
        }
        else if(next_number) number2 += lixo2[i];
        else number1 += lixo2[i];
    }
    return true;
};

MyClient.prototype.switchPlayer = function () {
    this.player = (this.player == 'x') ? 'o' : 'x';
};

MyClient.prototype.prolog_request = function (request) {
    return this.requestManager(this.sendRequest(request));
};

MyClient.prototype.availablePlay = function(){
    if(!this.prolog_request(this.canPlay())){
        return false;
    }
    else return true;
};

MyClient.prototype.playerJump = function(x, y, xf, yf){
    return this.prolog_request(this.jump(x,y,xf,yf));
};

MyClient.prototype.canReJump = function (x, y) {
    return this.prolog_request(this.rejump(x,y));
};

MyClient.prototype.makeMovement = function (x,y,xf,yf) {
    return this.prolog_request(this.move(x,y,xf,yf));
};

MyClient.prototype.endTurn = function () {
    if(this.prolog_request(this.getGameState())){
        this.gameOver = true;//falta declarar vencedor
    }
    this.playNumber++;
    this.switchPlayer();
};

MyClient.prototype.revertTurn = function(){
    this.switchPlayer();
    this.playNumber--;
};
