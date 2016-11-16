class Plane {
    constructor(dimX, dimY, partsX, partsY){
        this.dim_x = dimX;
        this.dim_y = dimY;
        this.parts_x = partsX;
        this.parts_y = partsY;

        this.dim_per_part_x = this.dim_x / this.parts_x;
        this.dim_per_part_y = this.dim_y / this.parts_y;

        this.point_ini_x = (this.dim_x/2);
        this.point_ini_y = (this.dim_y/2);

        this.superficie = null;

        var p1 = [-this.point_ini_x,  this.point_ini_y, 0.0, 1];
        var p2 = [ this.point_ini_x,  this.point_ini_y, 0.0, 1];
        var p3 = [-this.point_ini_x, -this.point_ini_y, 0.0, 1];
        var p4 = [ this.point_ini_x, -this.point_ini_y, 0.0, 1];

        this.superficie_points = [[p3, p1], [p4, p2]];

        /*for(var i = 0; i < this.parts_x + 1; i++){
          var at_x = -this.point_ini_x + (i * this.dim_per_part_x);
          var temp = [];
          for(var j = 0; j < this.parts_y + 1; j++){*/
    }
}

function MyPlane(scene, dimX, dimY, partsX, partsY) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.plane = new Plane(dimX, dimY, partsX, partsY);
    this.plane.superficie = this.makeSurface(1, 1, this.plane.superficie_points);
}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;


MyPlane.prototype.display = function() {
    this.plane.superficie.display();
}

class Patch{
  constructor(orderU, orderV, partsU, partsV, control_points){
    this.order_u = orderU;
    this.order_v = orderV;
    this.parts_u = partsU;
    this.parts_v = partsV;
    this.control_points = control_points;

    this.superficie_points = [];

    this.superficie;

    var n = 0;
    for(var i = 0; i <= this.order_u; i++){
      var temp = [];
      for(var j = 0; j <= this.order_v; j++){
        temp.push([this.control_points[n].x, this.control_points[n].y, this.control_points[n].z, 1]);
        n++;
      }
      this.superficie_points.push(temp);
    }
    //this.superficie_points.push(cenas);
  }
}

function MyPatch(scene, orderU, orderV, partsU, partsV, control_points) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.patch = new Patch(orderU, orderV, partsU, partsV, control_points);
    this.patch.superficie = this.makeSurface(orderU, orderV, this.patch.superficie_points);
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function() {
    this.patch.superficie.display();
}

MyPlane.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

MyPlane.prototype.makeSurface = function ( degree1, degree2, controlvertexes) {

	var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.plane.parts_x, this.plane.parts_y );
  return obj;
}


MyPatch.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

MyPatch.prototype.makeSurface = function (degree1, degree2, controlvertexes) {

	var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.patch.parts_u, this.patch.parts_v );
  return obj;
}
