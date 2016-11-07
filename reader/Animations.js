class Animation{
    constructor(id, time){
        this.id = id;
        this.time = time;
    }
}

class LinearAnimation extends Animation{
  constructor(id, time, cPoints){
      super(id, time);
      this.cPoints = cPoints;
      this.distance = 0;
      this.speed = 0;
      for(var i = 1; i < this.cPoints.length; i++){
          var point = this.cPoints[i];
          var point_before = this.cPoints[i-1];
          var vect_dest = vec3.fromValues(point.x,point.y,point.z);
          var vect_orig = vec3.fromValues(point_before.x,point_before.y,point_before.z);
          this.distance += vec3.distance(vect_dest, vect_orig);
      }
  }
}

class CircularAnimation extends Animation{
  constructor(id, time, center, radius, iAngle, rAngle){
      super(id, time);
      this.center = center;
      this.radius = radius;
      this.iAngle = iAngle;
      this.rAngle = rAngle;
  }
}
