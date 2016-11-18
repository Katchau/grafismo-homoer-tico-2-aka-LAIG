/* Construtor do gafo da cena */
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	this.loadedOk = this.parseFunction(rootElement);
	if(this.loadedOk) this.scene.onGraphLoaded();
};

/* Calcula as matrizes de transformacao de cada componente/primitiva */
MySceneGraph.prototype.getMatrix = function (e) {
    var matrix = mat4.create();
    for(var j = 0; j < e.children.length; j++){
        var transf = e.children[j];
        switch(transf.nodeName){
            case "translate":
                var temp = this.getNewCoords(transf);
                mat4.translate(matrix, matrix, temp);
                break;
            case "rotate":
                var temp = [];
                this.readAngle(temp, transf);
                var rot = [];
                switch (temp[0]){
                    case "x":
                        rot = [1,0,0];
                        break;
                    case "y":
                        rot = [0,1,0];
                        break;
                    case "z":
                        rot = [0,0,1];
                        break;
                }
                mat4.rotate(matrix, matrix, temp[1], rot);
                break;
            case "scale":
                var temp = this.getNewCoords(transf);
                mat4.scale(matrix, matrix, temp);
                break;
        }
    }
    return matrix;
};

/* Funcao para convorter graus para radianos */
MySceneGraph.prototype.deg2rad = function(degrees) {
    return degrees * Math.PI / 180;
};

/* Funcao para ler as coordenadas x, y e z do .dsx */
MySceneGraph.prototype.readCoord = function(comp, transf){
    var x = this.reader.getFloat(transf,"x",true);
    var y = this.reader.getFloat(transf,"y",true);
    var z = this.reader.getFloat(transf,"z",true);
    comp.push(x);
    comp.push(y);
    comp.push(z);
}

/* Funcao para ler a caracteristica da rotacao do .dsx */
MySceneGraph.prototype.readAngle = function(comp, transf){
    var axis = this.reader.getString(transf,"axis",true);
    var angle = this.reader.getFloat(transf,"angle",true);
    angle = this.deg2rad(angle);
    comp.push(axis);
    comp.push(angle);
};

/* Guarda num array as coordenadas x, y e z */
MySceneGraph.prototype.getNewCoords = function(transf){
    var comp = [];
    this.readCoord(comp, transf);
    return comp;
};

MySceneGraph.prototype.getControlPoint = function(transf){
    var x = this.reader.getFloat(transf,"xx",true);
    var y = this.reader.getFloat(transf,"yy",true);
    var z = this.reader.getFloat(transf,"zz",true);
    var point = new Point(x,y,z);
    return point;
};

/* Funcao para ler a cor em rgba do .dsx */
MySceneGraph.prototype.readRGBA = function(comp, transf){
    var r = transf.attributes.getNamedItem("r").value;
    var g = transf.attributes.getNamedItem("g").value;
    var b = transf.attributes.getNamedItem("b").value;
    var aaa = transf.attributes.getNamedItem("a").value;
    comp.push(r);
    comp.push(g);
    comp.push(b);
    comp.push(aaa);
};

/* Funcao que inicia o parse do .dsx */
MySceneGraph.prototype.parseFunction = function(rootElement) {
	var error = this.testOrder(rootElement);
    if(error != null){
        this.onXMLError(error);
        return false;
    }
    else return true;
};

/* Funcao que verifica a ordem .dsx */
MySceneGraph.prototype.testOrder = function(rootElement){
	var elems = rootElement.children;
	var size = elems.length;

	console.log("nº de tags " + size);
    if(size < 9)
        return "faltam tags no documento dsx!;";

    if (elems[0].nodeName != "scene" || elems[1].nodeName != "views" || elems[2].nodeName != "illumination" ||
        elems[3].nodeName != "lights" || elems[4].nodeName != "textures" || elems[5].nodeName != "materials" ||
        elems[6].nodeName != "transformations" || elems[8].nodeName != "primitives" || elems[9].nodeName != "components" ||
        elems[7].nodeName != "animations")
        console.warn("Ordem incorreta das tags!");

    return 	this.parseScene(rootElement);
};

/* Funcao que comeca o parse da cena */
MySceneGraph.prototype.parseScene = function(rootElement){ //done
	var elems = rootElement.getElementsByTagName('scene');

	if (elems == null){
		return "faltam elementos na scene";
	}
	if (elems.length != 1){
		return "é necessário apenas 1 scene!";
	}

	this.rootObj = this.reader.getString(elems[0],'root',true);
	this.axis_length = this.reader.getFloat(elems[0],'axis_length',true);

    return 	this.parseViews(rootElement);
};

/* Funcao que faz parse das views do .dsx */
MySceneGraph.prototype.parseViews = function(rootElement) {
    var elems = rootElement.getElementsByTagName('views');
    var num_perpectives = elems[0].children.length;
    if(num_perpectives<1){
        return "e' necessario pelo menos uma view";
    }
    var def_view = this.reader.getString(elems[0],'default',true);
    var perspectives = [];
    var ids = [];
    this.views = [];
    for (var i = 0; i < num_perpectives;i++)
    {
        var set = [];
        this.views[i] = [];
        perspectives[i] = elems[0].children[i];
        var id_view = this.reader.getString(perspectives[i],'id',true);
        if(ids.indexOf(id_view) != -1) return "ids repetidos nas views!";
        ids.push(id_view);
        set[0] = id_view;
        set[1] = this.reader.getFloat(perspectives[i],'near',true);
        set[2] = this.reader.getFloat(perspectives[i],'far',true);
        set[3] = this.reader.getFloat(perspectives[i],'angle',true);
        set[3] = this.deg2rad(set[3]);

        var p_from = perspectives[i].children[0];
        var p_to = perspectives[i].children[1];

        this.readCoord(set, p_from);
        this.readCoord(set, p_to);

        this.views[i] = set;
    }
    this.first_view = ids.indexOf(def_view);
    if(this.first_view == -1)return "nao existe vista por defeito!";
    return this.parseIllumination(rootElement);
};

/* Funcao que faz parse da iluminacao do .dsx */
MySceneGraph.prototype.parseIllumination = function(rootElement){
	var elems = rootElement.getElementsByTagName('illumination');

	this.doublesided_illu = this.reader.getBoolean(elems[0], 'doublesided', true);
	this.local_illu = this.reader.getBoolean(elems[0], 'local', true);

	var size = elems[0].children.length;

	if(size != 2){
		return "illumination deve ter 2 componentes! (ambient e background)";
	}

	this.ambient_rgb = [];
	this.background_rgb = [];

	for(var i = 0;i< size; i++){
		var e = elems[0].children[i];
       // this.ambient_rgb[0]  = e.attributes.getNamedItem("r").value;
		if(i == 0){
            this.readRGBA(this.ambient_rgb,e);
		}
		else{
            this.readRGBA(this.background_rgb,e);
		}
	}

	return 	this.parseLights(rootElement);
};

/* Funcao que faz parse das luzes do .dsx */
MySceneGraph.prototype.parseLights = function(rootElement){
    var elems = rootElement.getElementsByTagName('lights');

    var size = elems[0].children.length;

    var tem_omni = false;
    var tem_spot = false;
    var ids = [];
    var id_luz = null;
    this.omni_cenas = [];
    this.spot_ify = [];
    var tamanho_o = 0;
    var tamanho_s = 0;

    for(var i = 0;i<size;i++){
        var e = elems[0].children[i];
        if(e.nodeName == "omni"){
            tem_omni = true;
            this.omni_cenas[tamanho_o] = [];
            id_luz = this.reader.getString(e, 'id', true);
            if(ids.indexOf(id_luz) != -1)return "Ids repetidos na luz!";
            ids.push(id_luz);
            this.omni_cenas[tamanho_o][0] = id_luz;
            this.omni_cenas[tamanho_o][1] = this.reader.getBoolean(e, 'enabled', true);
            this.readCoord(this.omni_cenas[tamanho_o], e.children[0]);
            this.omni_cenas[tamanho_o][5] = this.reader.getFloat(e.children[0],'w',true);
            for(var j = 1;j<4;j++){
                this.readRGBA(this.omni_cenas[tamanho_o], e.children[j]);
            }
            tamanho_o+=1;
        }
        else if(e.nodeName == "spot"){
            tem_spot = true;
            this.spot_ify[tamanho_s] = [];
            id_luz = this.reader.getString(e, 'id', true);
            if(ids.indexOf(id_luz) != -1)return "Ids repetidos na luz!";
            ids.push(id_luz);
            this.spot_ify[tamanho_s][0] = id_luz;
            this.spot_ify[tamanho_s][1] = this.reader.getBoolean(e, 'enabled', true);
            var angle =  this.reader.getString(e, 'angle', true);
            angle = this.deg2rad(angle);
            this.spot_ify[tamanho_s][2] = angle;
            this.spot_ify[tamanho_s][3] = this.reader.getString(e, 'exponent', true);
            this.readCoord(this.spot_ify[tamanho_s], e.children[0]);
            this.readCoord(this.spot_ify[tamanho_s], e.children[1]);
            for(var j = 1;j<4;j++){
                this.readRGBA(this.spot_ify[tamanho_s], e.children[j+1]);
            }
            tamanho_s+=1;
        }
    }

    if(!tem_omni && !tem_spot){
        return "faltou um ou mais blocos obrigatorios! (omni e/ou spot)";
    }

    if((tamanho_o + tamanho_s) > 8)
        return "So' pode haver 8 luzes no maximo!";

    return this.parseTextures(rootElement);
};

/* Funcao que faz parse das texturas do .dsx */
MySceneGraph.prototype.parseTextures = function(rootElement) {
    var elems = rootElement.getElementsByTagName('textures');
    var num_textures = elems[0].children.length;

    if(num_textures < 1) return "e' necessario pelo menos uma texture!";

    var textures;
    this.text_ids = [];
    this.txturs = [];
    for (var i = 0; i < num_textures;i++)
    {
        var set = [];
        this.txturs[i] = [];
        textures = elems[0].children[i];
        var id = this.reader.getString(textures,'id',true);
        if(this.text_ids.indexOf(id) != -1) return "ids repetidos nas textures!";
        this.text_ids.push(id);
        set[0] = this.reader.getString(textures,'file',true);
        set[1] = this.reader.getFloat(textures,'length_s',true);
        set[2] = this.reader.getFloat(textures,'length_t',true);
        this.txturs[i] = set;
    }

    return 	this.parseMaterials(rootElement);
};

/* Funcao que faz parse dos materiais do .dsx */
MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = rootElement.getElementsByTagName('materials');

	var size = elems[0].children.length;

	if(size < 1)
		return "e' necessario pelo menos um material";

	this.material_ids = [];
	this.material_conf = [];
	this.material_shin = [];

	for(var i = 0;i < size; i++){
		var e = elems[0].children[i];

		this.material_conf[i] = [];
		var ids = this.reader.getString(e,"id",true);
		if(this.material_ids.indexOf(ids) != -1)return "ids repetidos nos materiais!";
		this.material_ids[i] = ids;
		for(var j = 0; j < 4; j++){
            this.readRGBA(this.material_conf[i],e.children[j]);
		}
		this.material_shin[i] = this.reader.getFloat(e.children[4],'value',true);
	}

	return this.parseTransformations(rootElement);
};

/* Funcao que faz parse das transformacoes do .dsx */
MySceneGraph.prototype.parseTransformations = function(rootElement){
	var elems = rootElement.getElementsByTagName('transformations');

	var size = elems[0].children.length;

	if(size < 1)
		return "e' necessario pelo menos uma transformacao";
	this.transf_ids = [];
    this.transf_matrix = [];

	for(var i = 0; i < size; i++){
		var e = elems[0].children[i];

		var ids = this.reader.getString(e,'id',true);
		if(this.transf_ids.indexOf(ids) != -1)return "ids repetidos nas transformacoes!";
		this.transf_ids[i] = ids;
        this.transf_matrix[i] = this.getMatrix(e);

	}

    return this.parseAnimations(rootElement);
};

/* Funcao que faz parse das animacoes do dsx */
MySceneGraph.prototype.parseAnimations = function(rootElement){
    var elems = rootElement.getElementsByTagName('animations');
    var size = elems[0].children.length;
    this.animations = [];
    this.anim_ids = [];
    for(var i = 0; i < size; i++){
        var e = elems[0].children[i];
        var id = this.reader.getString(e,"id",true);
        if(this.anim_ids.indexOf(id) != -1) return "ids repetidos nas animaçoes!";
        this.anim_ids.push(id);

        var time = this.reader.getFloat(e,"span",true);
        var type = this.reader.getString(e,"type",true);
        if(type == "linear"){
            var control_points = [];
            for(var j = 0; j<e.children.length; j++){
                var child = e.children[j];
                control_points.push(this.getControlPoint(child));
            }
            this.animations.push(new LinearAnimation(id, time, control_points));
        }
        else if(type == "circular"){
            var centerx = this.reader.getFloat(e,"centerx",true);
            var centery = this.reader.getFloat(e,"centery",true);
            var centerz = this.reader.getFloat(e,"centerz",true);
            var radius = this.reader.getFloat(e,"radius",true);
            var startang = this.reader.getFloat(e,"startang",true);
            startang = this.deg2rad(startang);
            var rotang = this.reader.getFloat(e,"rotang",true);
            rotang = this.deg2rad(rotang);
            this.animations.push(new CircularAnimation(id,time,centerx,centery,centerz,radius,startang,rotang));
        }
        else return "unknown animation type";
    }

    return 	this.parsePrimitives(rootElement);
};

/* Funcao que le as primitivas do .dsx */
MySceneGraph.prototype.readPrimitives = function (e, j, obj, all_ids){
	var id = this.reader.getString(e,'id',true);
	if(all_ids.indexOf(id) != -1) {
	    if(e.children[j].nodeName != e.children[j-1].nodeName)
	    return "id repetido nas primitivas!";
    }
	else all_ids.push(id);
	switch(e.children[j].nodeName){
		case "rectangle":
			this.rectangles[obj.size_r] = [];
			this.rectangles[obj.size_r][0] = id;
			this.rectangles[obj.size_r][1] = this.reader.getFloat(e.children[j],'x1',true);
			this.rectangles[obj.size_r][2] = this.reader.getFloat(e.children[j],'y1',true);
			this.rectangles[obj.size_r][3] = this.reader.getFloat(e.children[j],'x2',true);
			this.rectangles[obj.size_r][4] = this.reader.getFloat(e.children[j],'y2',true);
			obj.size_r+=1;
			break;
		case "triangle":
			this.triangles[obj.size_t] = [];
			this.triangles[obj.size_t][0] = id;
			this.triangles[obj.size_t][1] = this.reader.getFloat(e.children[j],'x1',true);
			this.triangles[obj.size_t][2] = this.reader.getFloat(e.children[j],'y1',true);
			this.triangles[obj.size_t][3] = this.reader.getFloat(e.children[j],'z1',true);
			this.triangles[obj.size_t][4] = this.reader.getFloat(e.children[j],'x2',true);
			this.triangles[obj.size_t][5] = this.reader.getFloat(e.children[j],'y2',true);
			this.triangles[obj.size_t][6] = this.reader.getFloat(e.children[j],'z2',true);
			this.triangles[obj.size_t][7] = this.reader.getFloat(e.children[j],'x3',true);
			this.triangles[obj.size_t][8] = this.reader.getFloat(e.children[j],'y3',true);
			this.triangles[obj.size_t][9] = this.reader.getFloat(e.children[j],'z3',true);
			obj.size_t+=1;
			break;
		case "cylinder":
			this.cylinders[obj.size_c] = [];
			this.cylinders[obj.size_c][0] = id;
			this.cylinders[obj.size_c][1] = this.reader.getFloat(e.children[j],'base',true);
			this.cylinders[obj.size_c][2] = this.reader.getFloat(e.children[j],'top',true);
			this.cylinders[obj.size_c][3] = this.reader.getFloat(e.children[j],'height',true);
			this.cylinders[obj.size_c][4] = this.reader.getFloat(e.children[j],'slices',true);
			this.cylinders[obj.size_c][5] = this.reader.getFloat(e.children[j],'stacks',true);
			obj.size_c+=1;
			break;
		case "sphere":
			this.spheres[obj.size_s] = [];
			this.spheres[obj.size_s][0] = id;
			this.spheres[obj.size_s][1] = this.reader.getFloat(e.children[j],'radius',true);
			this.spheres[obj.size_s][2] = this.reader.getInteger(e.children[j],'slices',true);
			this.spheres[obj.size_s][3] = this.reader.getInteger(e.children[j],'stacks',true);
			obj.size_s+=1;
			break;
		case "torus":
			this.donuts[obj.size_d] = [];
			this.donuts[obj.size_d][0] = id;
			this.donuts[obj.size_d][1] = this.reader.getFloat(e.children[j],'inner',true);
			this.donuts[obj.size_d][2] = this.reader.getFloat(e.children[j],'outer',true);
			this.donuts[obj.size_d][3] = this.reader.getFloat(e.children[j],'slices',true);
			this.donuts[obj.size_d][4] = this.reader.getFloat(e.children[j],'loops',true);
			obj.size_d+=1;
			break;
        case "plane":
            this.planes[obj.size_p] = [];
            this.planes[obj.size_p][0] = id;
            this.planes[obj.size_p][1] = this.reader.getFloat(e.children[j],'dimX',true);
            this.planes[obj.size_p][2] = this.reader.getFloat(e.children[j],'dimY',true);
            this.planes[obj.size_p][3] = this.reader.getInteger(e.children[j],'partsX',true);
            this.planes[obj.size_p][4] = this.reader.getInteger(e.children[j],'partsY',true);
            obj.size_p+=1;
            break;
        case "patch":
            this.patches[obj.size_patch] = [];
            this.patches[obj.size_patch][0] = id;
            this.patches[obj.size_patch][1] = this.reader.getInteger(e.children[j],'orderU',true);
            this.patches[obj.size_patch][2] = this.reader.getInteger(e.children[j],'orderV',true);
            this.patches[obj.size_patch][3] = this.reader.getInteger(e.children[j],'partsU',true);
            this.patches[obj.size_patch][4] = this.reader.getInteger(e.children[j],'partsV',true);
            var temp = [];
            for(var i = 0; i < e.children[j].children.length;i++){
                var child = e.children[j].children[i];
                this.temp_arr = [];
                this.readCoord(this.temp_arr,child);
                temp[i] = new Point(this.temp_arr[0],this.temp_arr[1],this.temp_arr[2]);
            }
            this.patches[obj.size_patch].push(temp);
            obj.size_patch+=1;
            break;
        case "vehicle":
            this.vehicles[obj.size_v] = [];
            this.vehicles[obj.size_v][0] = id;
            var carParts = [];
            for(var i = 0; i < this.patches.length;i++){
                if(this.patches[i][0] == "car1"){
                    carParts.push(this.patches[i]);
                }
            }
            this.vehicles[obj.size_v][1] = carParts;
            obj.size_v+=1;
            break;
        case "chessboard":
            this.chesses[obj.size_chess] = [];
            this.chesses[obj.size_chess][0] = id;
            this.chesses[obj.size_chess][1] = this.reader.getInteger(e.children[j],'du',true);
            this.chesses[obj.size_chess][2] = this.reader.getInteger(e.children[j],'dv',true);

            var texture  = this.reader.getString(e.children[j],'textureref',true);
            var ind_t = this.text_ids.indexOf(texture);
            if(ind_t == -1 ) return "no texture found on the chess!";
            this.chesses[obj.size_chess][3] = this.txturs[ind_t][0];

            this.chesses[obj.size_chess][4] = this.reader.getInteger(e.children[j],'su',true);
            this.chesses[obj.size_chess][5] = this.reader.getInteger(e.children[j],'sv',true);
            for(var i = 0;i < e.children[j].children.length;i++){
                this.temp_arr = [];
                this.readRGBA(this.temp_arr,e.children[j].children[i]);
                var vect = vec4.fromValues(this.temp_arr[0],this.temp_arr[1],this.temp_arr[2],this.temp_arr[3]);
                this.chesses[obj.size_chess].push(vect);
            }
            obj.size_chess+=1;
            break;

	}

};

/* Funcao que faz parse das primitivas do .dsx */
MySceneGraph.prototype.parsePrimitives = function(rootElement){
	var elems = rootElement.getElementsByTagName('primitives');
	var size = elems[0].children.length;

	if(size < 1)
		return "deve existir pelo menos 1 primtiva!";

	this.rectangles = [];
	this.triangles = [];
	this.cylinders = [];
	this.spheres = [];
	this.donuts = [];
    this.planes = [];
    this.patches = [];
    this.vehicles = [];
    this.chesses = [];

	var obj = {
		size_r : 0, size_t : 0, size_c : 0, size_s : 0, size_d : 0, size_p : 0, size_patch : 0, size_v : 0, size_chess : 0
	};

	var all_ids = [];

	for(var i = 0;i < size;i++){
		var e = elems[0].children[i];
		for(var j = 0; j < e.children.length; j++){
			var error = this.readPrimitives(e,j,obj,all_ids);
			if(error != null) return error;
		}

	}
	return   this.parseComponents(rootElement);

};

/* Funcao que junta as primitivas de cada objeto complexo com a referência para as mesmas no vertice, se não tiver nenhuma, retorna null */
MySceneGraph.prototype.isPrimitive = function(object, id, vertex, tipo){
    var state_machine = 0;
    for(var i = 0; i < object.length; i++){
        if(object[i][0] == id){
            vertex.primitive_types.push(tipo);
            vertex.primitives.push(object[i]);
            state_machine = 1;
        }
        else if(state_machine == 1)
            return "finish pushing primitives";
    }
    if(state_machine == 1) return "finish pushing primitives";
    return null;
};

/* Funcao que verifica se o tipo de primitiva e valida */
MySceneGraph.prototype.getPrimitive = function(vertex, objects, id){

    var bananas;
    if((bananas = this.isPrimitive(objects[0], id, vertex, "rect")) == null)
        if((bananas = this.isPrimitive(objects[1], id, vertex, "tri")) == null)
            if((bananas = this.isPrimitive(objects[2], id, vertex, "cyl")) == null)
                if((bananas = this.isPrimitive(objects[3], id, vertex, "sph")) == null)
                    if((bananas = this.isPrimitive(objects[4], id, vertex, "don")) == null)
                        if((bananas = this.isPrimitive(objects[5], id, vertex, "pla")) == null)
                            if((bananas = this.isPrimitive(objects[6], id, vertex, "pat")) == null)
                                if((bananas = this.isPrimitive(objects[7], id, vertex, "car")) == null)
                                    if((bananas = this.isPrimitive(objects[8], id, vertex, "chess")) == null)
                                        return "primitive type not found";

    console.log("Work " + bananas);

};

/* Funcao que retorna a matriz de transformacao de uma transformacao que foi efetuada antes */
MySceneGraph.prototype.getTransformation = function(id){
    var indice = this.transf_ids.indexOf(id);
    if(indice == -1) return -1;
    return this.transf_matrix[indice];
};

MySceneGraph.prototype.calculate_origin = function(comp){
    var vect_origin = vec3.fromValues(0,0,0);
    var v0 = vec3.fromValues(1, 0, 0);
    var v1 = vec3.fromValues(0, 1, 0);
    var v2 = vec3.fromValues(0, 0, 1);
    vec3.transformMat4(vect_origin,vec3.fromValues(0,0,0), comp.matrix);
    comp.origin = new Point(vec3.dot(vect_origin,v0),vec3.dot(vect_origin,v1),vec3.dot(vect_origin,v2));
};

/* Funcao que faz parse dos components do .dsx */
MySceneGraph.prototype.parseComponents = function(rootElement){
	var elems = rootElement.getElementsByTagName('components');
	var size = elems[0].children.length;

	this.components = [];
	this.graph = new MyGraph();

    var objects = [];
    objects.push(this.rectangles); objects.push(this.triangles); objects.push(this.cylinders); objects.push(this.spheres); objects.push(this.donuts);
    objects.push(this.planes); objects.push(this.patches); objects.push(this.vehicles); objects.push(this.chesses);

	for(var i = 0;i < size; i++){
		var e = elems[0].children[i];
        var error = null;
		var comp = new MyComponent();
		comp.id = this.reader.getString(e,'id',true);
        var vertex = new MyVertex();

		if(this.components.indexOf(comp.id) != -1)
			return "Componentes com ids repetidos! ";
		this.components.push(comp.id);
		for(var j = 0; j < e.children.length; j++){
			var child = e.children[j];
			if(child.nodeName == "texture"){
                var tex_id = this.reader.getString(child,"id",true);
                comp.texture = this.text_ids.indexOf(tex_id);
                if(comp.texture == -1) comp.texture = tex_id;
			}
			if(child.nodeName == "transformation" && child.children[0] != "transformatonref"){
			    comp.matrix = this.getMatrix(child);
            }
			for(var k = 0; k < child.children.length;k++){
				var transf = child.children[k];
				if(child.nodeName == "transformation"){

					if(transf.nodeName == "transformationref"){
						if(child.children.length != 1)
							return "transformacao no " + comp.id + " esta' mal estruturada!";
						comp.transformation_ref = this.reader.getString(transf,"id",true);
                        comp.matrix = this.getTransformation(comp.transformation_ref);
                        if(comp.matrix == -1) return "nao encontrou transformacao!" + comp.transformation_ref;
					}
				}

				if(child.nodeName == "animation"){
                    var anim_id = this.anim_ids.indexOf(this.reader.getString(transf, "id",true));
                    if(anim_id == -1) return "Nao existe o id  da animation";
                    var anime_konichiwa = this.animations[anim_id].clone();
                    //calculate distance to first point
                    if(comp.animations.length < 1){
                        this.calculate_origin(comp);
                    }
                    if(anime_konichiwa instanceof LinearAnimation){
                        var vect_origin;
                        var first_point;
                        if(comp.animations.length < 1){

                            vect_origin = vec3.fromValues(comp.origin.x,comp.origin.y,comp.origin.z);
                            first_point = anime_konichiwa.cPoints[0];
                            anime_konichiwa.distance += vec3.distance(vec3.fromValues(first_point.x,first_point.y,first_point.z), vect_origin);
                            anime_konichiwa.speed = anime_konichiwa.distance/anime_konichiwa.time;
                            anime_konichiwa.calc_time(vect_origin);
                        }
                        else{
                            var points = comp.animations[comp.animations.length-1].cPoints;
                            vect_origin = vec3.fromValues(points[points.length-1].x,points[points.length-1].y,points[points.length-1].z);
                            first_point = anime_konichiwa.cPoints[0];
                            anime_konichiwa.distance += vec3.distance(vec3.fromValues(first_point.x,first_point.y,first_point.z), vect_origin);
                            anime_konichiwa.speed = anime_konichiwa.distance/anime_konichiwa.time;
                            anime_konichiwa.calc_time(vect_origin);
                        }
                    }
                    comp.animations.push(anime_konichiwa);
                }

				if(child.nodeName == "materials"){
					if(child.children.length < 1)
						return "E' necessario no minimo 1 material!";
					var mat_id = this.reader.getString(transf,"id",true);
                    var mati = this.material_ids.indexOf(mat_id);
                    if(mati == -1) mati = "inherit";
					comp.materials.push(mati);
				}


				if(child.nodeName == "children"){
					if(child.children.length < 1)
						return "E' preciso de pelo menos uma primtiva ou componente!";
					var obj_id = this.reader.getString(transf,"id",true);
					if(transf.nodeName == "componentref")
						comp.children_comp.push(obj_id);
					else {
                        error = this.getPrimitive(vertex, objects, obj_id);
                        if(error!= null) return error;
                    }

				}
			}
		}
		vertex.component = comp;
		this.graph.vertexSet.push(vertex);
	}
	this.graph.vertexIDs = this.components;
	if(this.graph.addEdges() == -1) return "error at scene graph";
	if(this.graph.pesquisa_profundidade(this.rootObj,this.scene) == -1)return "error on the root element";
};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
