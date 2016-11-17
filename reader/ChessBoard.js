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

    this.texture = null;
    this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.plane = new Plane(this.scene, 1, 1, this.du, this.dv);

    this.shader.setUniformValues({ uSample : 0,
                                   color1 : this.color1,
                                   color2 : this.color2,
                                   colorMark : this.colorMark,
                                   divU : parseInt(this.du)*1.0,
                                   divV: parseInt(this.dv)*1.0,
                                   sU: parseInt(this.su)*1.0,
                                   sV: parseInt(this.sv)*1.0
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
    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
}
