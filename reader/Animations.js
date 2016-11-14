class Animation{
    constructor(id, time){
        this.id = id;
        this.time = time;
        this.completed = false;
    }
}

class LinearAnimation extends Animation{
  constructor(id, time, cPoints){
      super(id, time);
      this.cPoints = cPoints;
      this.distance = 0;
      this.speed = 0;
      this.next_anim = [];

      this.walk_d = [];
      this.times = [];
      this.distances = [];
      this.angles = [];
      this.translate = new Point(0,0,0);
      this.rotate = 0;

      for(var i = 1; i < this.cPoints.length; i++){
          var point = this.cPoints[i];
          var point_before = this.cPoints[i-1];
          var vect_dest = vec3.fromValues(point.x,point.y,point.z);
          var vect_orig = vec3.fromValues(point_before.x,point_before.y,point_before.z);
          this.distance += vec3.distance(vect_dest, vect_orig);
          this.next_anim.push(false);
      }
      this.next_anim[0] = true;
      this.next_anim.push(false);
  }

  get_angle(x, z, vector_z){
      var vet4angle = vec3.fromValues(x,0,z);
      var cosx = vec3.dot(vet4angle, vector_z) / Math.sqrt(x*x + z*z);
      var angle = Math.acos(cosx);
      if(z < 0){
          angle = Math.PI*2-angle;
      }
      this.angles.push(angle);
  }

  calc_time(matrix){
      var vect_origin = vec3.fromValues(0,0,0);
      vec3.transformMat4(vect_origin,vec3.fromValues(0,0,0), matrix);
      var v0 = vec3.fromValues(1, 0, 0);
      var v1 = vec3.fromValues(0, 1, 0);
      var v2 = vec3.fromValues(0, 0, 1);
      this.origin = new Point(vec3.dot(vect_origin,v0),vec3.dot(vect_origin,v1),vec3.dot(vect_origin,v2))
      var time = 0;
      for(var i = 0;i < this.cPoints.length;i++){
          var point = this.cPoints[i];
          var next_vect = vec3.fromValues(point.x,point.y,point.z);
          var distance = vec3.distance(next_vect, vect_origin);
          this.distances.push(distance);
          var temp_time = distance/this.speed;
          time += temp_time;
          this.times.push(time);
          vec3.subtract(next_vect, next_vect, vect_origin);
          var x = vec3.dot(next_vect, v0);
          var y = vec3.dot(next_vect, v1);
          var z = vec3.dot(next_vect, v2);
          var walk = [(x/temp_time), (y/temp_time), (z/temp_time)];
          this.walk_d.push(walk);
          vect_origin = vec3.fromValues(point.x,point.y,point.z);
          this.get_angle(x, z, v2);
      }
      this.rotate = this.angles[0];

  }


}

class CircularAnimation extends Animation{
  constructor(id, time, centerx, centery, centerz, radius, iAngle, rAngle){
      super(id, time);
      this.center = new Point(centerx, centery, centerz);
      this.radius = radius;
      this.iAngle = iAngle;
      this.rAngle = rAngle;
  }
}
