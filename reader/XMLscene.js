function XMLscene(myInterface) {
    this.myInterface = myInterface;
    this.healthBars = [];
    this.boards = [];
    this.playerBoards = [];
    this.timer = null;
    this.repeat = false;
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.update = function(currTime) {

    this.tempovar = (currTime - this.tempo) / 1000;
    if (this.tempo == 0) {
        this.tempovar = 0;
    }
    this.tempo = currTime;
    this.tempo_dec += this.tempovar;

    if(this.cage != null && this.gameStart)this.cage.verifyTurns(this.tempovar);
    if(this.cage != null && this.repeat) this.cage.gameFilm(this.tempovar);

    if (this.init_anim) {
        for (var i = 0; i < this.anim_component.length; i++) {
            this.anim_component[i].update(this.tempovar);
        }
        if(this.cage != null && this.gameStart)this.cage.animationUpdate(this.tempovar);
        for(var i = 0; i < this.rings.length; i++){
            this.rings[i].updateAnimation(this.tempovar);
        }
        if(this.cam_animation != null){
            if(this.cam_start){
                if(!this.cam_animation.updateAnimation(this.tempo_dec,this.tempovar))
                {
                    this.cam_animation2.updateAnimation(this.tempo_dec,this.tempovar);
                    this.cam_start = false;
                    this.curr_cam = this.next_cam;
                    this.changeCamera();
                    this.myInterface.setActiveCamera(this.camera);
                }
            }
        }
    }
};

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.tempovar = 0;
    this.tempo = 0;
    this.tempo_dec = 0;
    this.tempo_wait = 1;
    this.init_anim = true;

    this.setUpdatePeriod(1);

    this.anim_component = [];
    this.cam_animation = null;
    this.cam_animation2 = null;
    this.cam_start = false;

    this.setPickEnabled(true);

    this.cage = null;
    this.client = new MyClient("http://localhost:8081/");
    this.gameStart = false;
    this.reset = true;
    this.must_jump = false;

    this.rings = [];
    this.playbox = null;
    this.axis = new CGFaxis(this);
};

XMLscene.prototype.initLights = function() {

    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function() {
    this.setAmbient(0, 0, 0, 1.0); //testando 0.2 0.4 0.8
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
    this.SetInitialStatus();
    this.SetViews();
    this.createMaterials();
    this.createTextures();
    this.createLights();
};

//inicializa os parâmetros do illumination e do scene, de acordo com o ficheiro dsx
XMLscene.prototype.SetInitialStatus = function() {
    this.gl.clearColor(this.graph.background_rgb[0], this.graph.background_rgb[1], this.graph.background_rgb[2], this.graph.background_rgb[3]);
    this.setAmbient(this.graph.ambient_rgb[0], this.graph.ambient_rgb[1], this.graph.ambient_rgb[2], this.graph.ambient_rgb[3]);

    this.axis = new CGFaxis(this, this.graph.axis_length); //0.2 e' o default
};

//inicializa a camara(view) pre-definida, bem como outros parametros, para permitir a navegacao entre diferentes cameras
XMLscene.prototype.SetViews = function() {
    this.cameras = this.graph.views;
    this.num_cameras = this.cameras.length;
    this.curr_cam = this.graph.first_view;
    this.next_cam = null;
    this.changeCamera();
}

//muda a camara atual, de acordo com o a variavel this.curr_cam. Esta funçao e' chamada sempre que ha uma alteracao na interface, ou seja, quando se carrega na letra v/V
XMLscene.prototype.changeCamera = function() {
    this.camera = new CGFcamera(this.cameras[this.curr_cam][3], this.cameras[this.curr_cam][1], this.cameras[this.curr_cam][2],
        vec3.fromValues(this.cameras[this.curr_cam][4], this.cameras[this.curr_cam][5], this.cameras[this.curr_cam][6]),
        vec3.fromValues(this.cameras[this.curr_cam][7], this.cameras[this.curr_cam][8], this.cameras[this.curr_cam][9]));
    this.myInterface.setActiveCamera(this.camera);
}

//inicializa as luzes, de acordo com os parametros do ficheiro dsx, criando varias luzes spots e omni
//tambem invoca a funcao que permita criar um grupo de luzes na interface, com a informacao acerca do estado destas(on/off)
XMLscene.prototype.createLights = function() {
    var num_omni = this.graph.omni_cenas.length;
    var num_spot = this.graph.spot_ify.length;
    this.total_lights = num_omni + num_spot;
    this.lightNames = [];
    this.lightStatus = [];
    for (var i = 0; i < num_omni; i++) {
        this.lights[i].setPosition(this.graph.omni_cenas[i][2], this.graph.omni_cenas[i][3], this.graph.omni_cenas[i][4], this.graph.omni_cenas[i][5]);
        this.lights[i].setAmbient(this.graph.omni_cenas[i][6], this.graph.omni_cenas[i][7], this.graph.omni_cenas[i][8], this.graph.omni_cenas[i][9]);
        this.lights[i].setDiffuse(this.graph.omni_cenas[i][10], this.graph.omni_cenas[i][11], this.graph.omni_cenas[i][12], this.graph.omni_cenas[i][13]);
        this.lights[i].setSpecular(this.graph.omni_cenas[i][14], this.graph.omni_cenas[i][15], this.graph.omni_cenas[i][16], this.graph.omni_cenas[i][17]);
        this.lights[i].setVisible(true);
        if (this.graph.omni_cenas[i][1])
            this.lights[i].enable();
        else
            this.lights[i].disable();
        this.lightStatus[i] = this.graph.omni_cenas[i][1];
        this.lightNames.push(this.graph.omni_cenas[i][0]);
    }

    for (var j = 0; j < num_spot; j++) {

        this.lights[num_omni + j].setPosition(this.graph.spot_ify[j][7], this.graph.spot_ify[j][8], this.graph.spot_ify[j][9], 1);
        this.lights[num_omni + j].setSpotDirection(this.graph.spot_ify[j][4] - this.graph.spot_ify[j][7], this.graph.spot_ify[j][5] - this.graph.spot_ify[j][8], this.graph.spot_ify[j][6] - this.graph.spot_ify[j][9]);
        this.lights[num_omni + j].setAmbient(this.graph.spot_ify[j][10], this.graph.spot_ify[j][11], this.graph.spot_ify[j][12], this.graph.spot_ify[j][13]);
        this.lights[num_omni + j].setDiffuse(this.graph.spot_ify[j][14], this.graph.spot_ify[j][15], this.graph.spot_ify[j][16], this.graph.spot_ify[j][17]);
        this.lights[num_omni + j].setSpecular(this.graph.spot_ify[j][18], this.graph.spot_ify[j][19], this.graph.spot_ify[j][20], this.graph.spot_ify[j][21]);
        this.lights[num_omni + j].setSpotExponent(this.graph.spot_ify[j][3]);
        this.lights[num_omni + j].setSpotCutOff(this.graph.spot_ify[j][2]);
        this.lights[num_omni + j].setVisible(true);
        if (this.graph.spot_ify[j][1])
            this.lights[num_omni + j].enable();
        else
            this.lights[i].disable();
        this.lightStatus[num_omni + j] = this.graph.spot_ify[j][1];
        this.lightNames.push(this.graph.spot_ify[j][0]);
    }

    this.myInterface.addLightGroup();
}


//inicializa todos os materiais, guardando-os num array, onde depois vai ser acedido no displaySceneGraph para poder aplicar o material
XMLscene.prototype.createMaterials = function() {
    this.materials = [];
    var num_mat = this.graph.material_ids.length;
    this.mat_ids = this.graph.material_ids;
    this.material_pos = 0;
    this.has_next_mat = true;
    for (var i = 0; i < num_mat; i++) {
        this.materials[i] = new CGFappearance(this);
        this.materials[i].setEmission(this.graph.material_conf[i][0], this.graph.material_conf[i][1], this.graph.material_conf[i][2], this.graph.material_conf[i][3]);
        this.materials[i].setAmbient(this.graph.material_conf[i][4], this.graph.material_conf[i][5], this.graph.material_conf[i][6], this.graph.material_conf[i][7]);
        this.materials[i].setDiffuse(this.graph.material_conf[i][8], this.graph.material_conf[i][9], this.graph.material_conf[i][10], this.graph.material_conf[i][11]);
        this.materials[i].setSpecular(this.graph.material_conf[i][12], this.graph.material_conf[i][13], this.graph.material_conf[i][14], this.graph.material_conf[i][15]);
        this.materials[i].setShininess(this.graph.material_shin[i]);
    }

}

//estrutura de dados que guarda informacao de 2 variaveis
class Double_value {
    constructor(x, y) {
        this.left = x;
        this.right = y;
    }

}

//inicializa e carrega todas as texturas que estao presentes no dsx, colocando-as num array
XMLscene.prototype.createTextures = function() {
    this.textures = [];
    var num_text = this.graph.txturs.length;
    this.text_ids = this.graph.text_ids;
    this.text_param = [];
    for (var i = 0; i < num_text; i++) {
        this.textures[i] = new CGFtexture(this, this.graph.txturs[i][0]);
        var cenas = new Double_value(this.graph.txturs[i][1], this.graph.txturs[i][2]);
        this.text_param[i] = cenas;
    }
};

//funcao responsavel por alterar as coordenadas da textura de uma primitiva, caso o scale seja true.
//apenas altera do retangulo e do triangulo
XMLscene.prototype.displayPrimitives = function(primitive, info, scale) {
    switch (info) {
        case "rect":
            if (scale) {
                var param_text = this.text_param[this.text_queue[this.text_queue.length - 1]];
                primitive.changeTextCoords(param_text.left, param_text.right);
            }
            break;
        case "tri":
            if (scale) {
                var param_text = this.text_param[this.text_queue[this.text_queue.length - 1]];
                primitive.changeTextCoords(param_text.left, param_text.right);
            }
            break;
    }
}

//funcao responsavel por determinar qual material correspondente ao vertice(componente)(vertex) que esta a ser percorrido
//este ou vai buscar um material ao array de materiais previamente carregados no array, e coloca o indice
//deste material para um array, ou entao caso o material seja do tipo "inherit", vai diretamente buscar o ultimo indice
//introduzido no array
//Sempre que se encontrar um material novo(ou seja, que nao seja inherit) este e' introduzido num array, que serve de stack
XMLscene.prototype.displayMaterial = function(vertex) {
    var ind = 0;
    var mat_l = vertex.component.materials.length;
    if (this.material_pos + 1 <= mat_l) {
        ind = this.material_pos;
    }
    if (this.material_pos + 1 < mat_l) {
        this.has_next_mat = true;
    }
    var indice = vertex.component.materials[ind];
    if (indice != -1 && typeof indice == 'number') {
        this.mat_queue.push(indice);
        return true;
    } else if (indice == "inherit")
        return false;
    else
        console.log("smthing is wrong with materials, and shouldnt be by this point");
    return false;
}

//funcao responsavel por determinar qual textura associada ao vertice atual, bem como associar este ao material atual, e dar display deste
//Este vai atualizar a stack/array de texturas, bem como determina como vai ser o tipo de textura(se se vai repetir, etc).
XMLscene.prototype.displayTexture = function(vertex) {
        var texture_id = vertex.component.texture;
        var material_ind = this.mat_queue[this.mat_queue.length - 1];
        this.param_text = null;
        if (typeof texture_id == 'number') {
            this.text_queue.push(texture_id);
            this.materials[material_ind].setTexture(this.textures[texture_id]);
            this.param_text = this.text_param[this.text_queue[this.text_queue.length - 1]];
            if (this.param_text.right != 1.0 || this.param_text.left != 1.0) this.materials[material_ind].setTextureWrap('REPEAT', 'REPEAT');
            else this.materials[material_ind].setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE'); //para evitar casos em que uma determinada textura nao seja potencia 2
            this.materials[material_ind].apply();
            return true;
        }
        if (texture_id == "inherit") {
            var next_text = this.text_queue[this.text_queue.length - 1];
            this.materials[material_ind].setTexture(this.textures[next_text]);
            if (next_text == "none") {
                this.materials[material_ind].setTexture(null);
                this.materials[material_ind].apply();
                return false;
            }
            this.param_text = this.text_param[next_text];
            if (this.param_text.right != 1.0 || this.param_text.left != 1.0) this.materials[material_ind].setTextureWrap('REPEAT', 'REPEAT');
            else this.materials[material_ind].setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE'); //para evitar casos em que uma determinada textura nao seja potencia 2
        } else if (texture_id == "none") {
            this.materials[material_ind].setTexture(null);
            this.text_queue.push(texture_id);
            this.materials[material_ind].apply();
            return true;
        }
        this.materials[material_ind].apply();
        return false;
}
    /*
        função responsável por executar as alterações de movimento e rotação executadas na função update
     */
XMLscene.prototype.animation = function(vertex) {
    var origi = vertex.component.origin;
    var indice = vertex.component.curr_anim;
    if (indice == vertex.component.animations.length) indice--;
    var anim = vertex.component.animations[indice];
    if (anim instanceof LinearAnimation) {
        this.translate(anim.translate.x, anim.translate.y, anim.translate.z);
        this.translate(origi.x, origi.y, origi.z);
        this.rotate(anim.rotate, 0, 1, 0);
        this.translate(-origi.x, -origi.y, -origi.z);
    } else if (anim instanceof CircularAnimation) {
        this.translate(anim.center.x, anim.center.y, anim.center.z);
        this.rotate(anim.angle_temp, 0, 1, 0);
        this.translate(anim.xi, anim.yi, anim.zi);
        this.rotate(anim.iAngle, 0, 1, 0);
        this.translate(-origi.x, -origi.y, -origi.z);
    }
};

//funcao que vai percorrer recursivamente (pesquisa em profundidade)todo o grafo, efetuando display das primitivas do vertice, alterando a matrix de transformacao do vertice atual
//bem fazendo display de materiais e texturas associadas ao vertex.
XMLscene.prototype.profundidade_rec = function(vertex) {
    this.pushMatrix();
    var pushed_mat = this.displayMaterial(vertex);
    var pushed_text = this.displayTexture(vertex);
    if (vertex.component.animations.length != 0) {
        this.animation(vertex);
    }

    this.multMatrix(vertex.component.matrix);
    var needs_scale = false;
    if (this.param_text != null) needs_scale = ((pushed_text == true || vertex.component.texture == "inherit") && (this.param_text.left != 1 || this.param_text.right != 1));
    for (var i = 0; i < vertex.primitives.length; i++) {
        this.displayPrimitives(vertex.component.primitivess[i], vertex.primitive_types[i], needs_scale);
        vertex.component.primitivess[i].display();
    }
    for (var i = 0; i < vertex.derivates.length; i++) {
        this.profundidade_rec(vertex.derivates[i]);
    }
    if (pushed_mat) this.mat_queue.pop();
    if (pushed_text) this.text_queue.pop();
    this.popMatrix();
}

//funcao que comeca o processo de pesquisa em profundide do grafo, determinando qual a raiz deste,
//para poder comecar por este. Inicializa tambem os arrays que vao permitir armazenar informacao acerca das texturas e materiais
//que vao/podem ser herdados por outros.
XMLscene.prototype.displaySceneGraph = function() {
    var graphScene = this.graph.graph;
    var indice = graphScene.vertexIDs.indexOf(this.graph.rootObj);
    this.mat_queue = [];
    this.text_queue = [];
    this.profundidade_rec(graphScene.vertexSet[indice]);
};

//faz update das luzes, e verifica o estado destas, desligando ou ligando consoante o estado na interface
XMLscene.prototype.updateLight = function(index) {
    if (this.lightStatus[index]) this.lights[index].enable();
    else this.lights[index].disable();
    this.lights[index].update();
};

XMLscene.prototype.changeViewHome = function(){
    this.next_cam = 2;
    this.changeView(this.curr_cam,this.next_cam);
    this.gameStart = false;
    this.reset = true;
};

XMLscene.prototype.changeView = function (view1, view2){
    var tmp1 = this.cameras[view1];
    var tmp2 = this.cameras[view2];
    this.cam_animation = new gameAnimation(69,tmp1[4],tmp1[6],tmp2[4],tmp2[6]);
    this.cam_animation2 = new gameAnimation(69,tmp1[7],tmp1[9],tmp2[7],tmp2[9]);
    this.cam_animation.heigth = 10;
    this.cam_animation2.heigth = 10;
    this.cam_start = true;
    this.tempo_dec = 0;
};

XMLscene.prototype.changeView2 = function () {
    this.next_cam = (this.curr_cam == 0) ? 1 : 0;
    this.changeView(this.curr_cam,this.next_cam);
};

XMLscene.prototype.updateCamera = function () {
    if(this.cam_start){
        var tmp = this.cam_animation;
        var x = tmp.x_atual + this.cameras[this.curr_cam][4];
        var y = tmp.y_atual + this.cameras[this.curr_cam][5];
        var z = tmp.z_atual + this.cameras[this.curr_cam][6];
        this.camera.position = vec3.fromValues(x,y,z);

        var tmp2 = this.cam_animation2;
        var x2 = tmp2.x_atual + this.cameras[this.next_cam][7];
        var y2 = tmp2.y_atual + this.cameras[this.next_cam][8];
        var z2 = tmp2.z_atual + this.cameras[this.next_cam][9];
        this.camera.target = vec3.fromValues(x2,y2,z2);

        this.myInterface.setActiveCamera(this.camera);
    }
};

XMLscene.prototype.clientTest = function(){
    console.log(this.client.sendRequest("handshake"));
};

XMLscene.prototype.logPicking = function() {
    if(this.cage == null || !this.gameStart) return;
    else {
        var checkSelection = this.cage.movement();
        if(checkSelection && !this.cage.animation_start){
            var answer = null;
            if(this.must_jump){
                answer = this.cage.makeJump();
                if(answer === true) this.must_jump = false;
                else{
                    this.cage.dest = undefined;
                    return;
                }
            }else{
                answer = this.cage.checkPlay();
                if(answer == "again") {
                    this.must_jump = true;
                    this.cage.dest = undefined;
                    return;
                }else {
                    if(!answer){
                        console.log("invalid movement");
                        //todo possivelmente fazer aqui alguma coisa :D
                    }
                    this.must_jump = false;
                }
            }
            this.cage.select = undefined;
            this.cage.dest = undefined;
        }
    }
};

XMLscene.prototype.mainMenu = function(){
    if(this.playbox != null && this.reset){
        var click = this.playbox.checkClicks();
        if(click == 691){
            this.reset = false;
            this.gameStart = true;
            this.gameMode = 1;
            this.next_cam = (this.curr_cam == 0) ? 2 : 0;
            this.boards = [];
            this.playerBoards = [];
            this.changeView(this.curr_cam,this.next_cam);
        }
        if(click == 692){
            this.reset = false;
            this.gameStart = true;
            this.gameMode = 2;
            this.next_cam = (this.curr_cam == 0) ? 2 : 0;
            this.boards = [];
            this.botJ = true;
            this.playerBoards = [];
            this.changeView(this.curr_cam,this.next_cam);
        }
        if(click == 693){
            this.cage.timePerTurn = 60;
            this.cage.lastTurnEnd = 60;
            this.cage.actualTime = 60;
            console.log("izi mode activated");
        }
        if(click == 694){
            this.cage.timePerTurn = 20;
            this.cage.lastTurnEnd = 20;
            this.cage.actualTime = 20;
            console.log("god mode activated. Madness");
        }
    }
};

XMLscene.prototype.playCage = function(){
    if(this.cage == null || !this.gameStart) return;
    if(this.gameMode == 1){
        this.logPicking();
    }
    else{
        if(this.client.player == 'x')
            this.logPicking();
        else if(this.client.player == 'o')
            if(!this.cage.animation_start && !this.cam_start){
                if(this.botJ)this.botJ = this.cage.bot_movement();
                else this.botJ = this.cage.bot_jumps();
            }
    }
    if(this.client.gameOver){
        this.gameStart = false;
        this.client.gameOver = false;
        this.reset = true;
        this.cage.resetGame();
        this.changeViewHome();
    }
};

XMLscene.prototype.display = function() {

    this.playCage();
    this.mainMenu();
    this.clearPickRegistration();

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();

    this.updateCamera();

    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it


    if (this.graph.loadedOk) {
        this.displaySceneGraph();
        for (var i = 0; i < this.total_lights; i++) {
            this.updateLight(i);
        }
    };
};
