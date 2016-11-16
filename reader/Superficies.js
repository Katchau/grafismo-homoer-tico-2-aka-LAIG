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

        var p1 = [-this.point_ini_x,  this.point_ini_y, 0.0, 1];
        var p2 = [ this.point_ini_x,  this.point_ini_y, 0.0, 1];
        var p3 = [-this.point_ini_x, -this.point_ini_y, 0.0, 1];
        var p4 = [ this.point_ini_x, -this.point_ini_y, 0.0, 1];

        this.superficie_points = [[p3, p1], [p4, p2]];

        /*for(var i = 0; i < this.parts_x + 1; i++){
          var at_x = -this.point_ini_x + (i * this.dim_per_part_x);
          var temp = [];
          for(var j = 0; j < this.parts_y + 1; j++){
            var at_y = -this.point_ini_y + (j * this.dim_per_part_y);
            temp.push([at_x, at_y, 0.0, 1]);
          }
          this.superficie_points.push(temp);
        }*/
    }
}

class Patch{
  constructor(orderU, orderV, partsU, partsV, control_points){
    this.order_u = orderU + 1;
    this.order_v = orderV + 1;
    this.parts_u = partsU;
    this.parts_v = partsV;
    this.control_points = control_points;

    this.superficie_points = [];

    var n = 0;

    for(var i = 0; i < this.order_v; i++){
      var temp = [];
      for(var j = 0; j < this.order_u; j++){
        temp.push([this.control_points[n].x, this.control_points[n].y, this.control_points[n].z, 1]);
        n++;
      }
      this.superficie_points.push(temp);
    }
  }
}
