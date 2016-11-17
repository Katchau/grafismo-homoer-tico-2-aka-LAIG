function ChessBoard(scene, du, dv, textureref, su, sv, c1, c2, cM) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.du = du;
    this.dv = dv;
    this.textureref = textureref;
    this.su = su;
    this.sv = sv;
    this.color1 = c1;
    this.color2 = c2;
    this.colorMark = cM;
    this.texture = new CGFtexture(this.scene, textureref);
    this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.plane = new MyPlane(this.scene, 1, 1, this.du*10, this.dv*10);
    console.log(this.color2);
    this.shader.setUniformsValues({ uSample : 0,
                                   c1 : this.color1,
                                   c2 : this.color2,
                                   cM : this.colorMark,
                                   div_u : parseInt(this.du)*1.0,
                                   div_v: parseInt(this.dv)*1.0,
                                   s_u: parseInt(this.su)*1.0,
                                   s_v: parseInt(this.sv)*1.0
                                   });
}

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function(){
    this.scene.pushMatrix();
    this.texture.bind(0);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.popMatrix();
    this.scene.setActiveShader(this.scene.defaultShader);
}
