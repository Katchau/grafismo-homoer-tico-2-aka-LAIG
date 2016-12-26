/*
  Classe mãe dasamimações
*/
class Animation{
    //Construtor da classe Animation
    constructor(id, time){
        this.id = id;
        this.time = time;
    }

    // Calcula o angulo entre dois vetores
    get_angle(x, z, vector_z){
        var vet4angle = vec3.fromValues(x,0,z);
        var cosx = vec3.dot(vet4angle, vector_z) / Math.sqrt(x*x + z*z);
        var angle = Math.acos(cosx);
        if(x < 0){
            angle = Math.PI*2-angle;
        }
        return angle;
    }
}

/*
  Classe da animação linear, filha da classe animação
*/
class LinearAnimation extends Animation{
  //Construtor da classe LinearAnimation
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

  //Função que serve para instanciar uma nova LinearAnimation com os mesmo valores que a atual
  clone(){
      var ret = new LinearAnimation(this.id, this.time, this.cPoints);
      return ret;
  }

  //Função que define as condições e valores para a realização da animação linear
  calc_time(matrix){
      var vect_origin = matrix;
      var v0 = vec3.fromValues(1, 0, 0);
      var v1 = vec3.fromValues(0, 1, 0);
      var v2 = vec3.fromValues(0, 0, 1);
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
          var angle = this.get_angle(x, z, v2);
          this.angles.push(angle);
      }
      this.rotate = this.angles[0];

  }


}

/*
  Classe da animação circular, filha da classe animação
*/
class CircularAnimation extends Animation{

  //Construtor da classe CircularAnimation
  constructor(id, time, centerx, centery, centerz, radius, iAngle, rAngle){
      super(id, time);
      this.center = new Point(centerx, centery, centerz);
      this.radius = radius;
      this.iAngle = iAngle;
      this.rAngle = rAngle;

      this.angle_per_it = this.rAngle   / time;
      this.ang_ant = 0;
      this.angle_temp = 0;
      this.cPoints = [];
      this.final_point = new Point(0,0,0);
      this.calc_final_point();
  }

  //Função para calcular o ponto onde acaba a animação linear
  calc_final_point(){

      this.xi = Math.cos(this.iAngle) * this.radius;
      this.yi = 0;
      this.zi = Math.sin(-this.iAngle) * this.radius;

      var x = this.center.x + Math.cos(this.rAngle+this.iAngle) * this.radius;
      var z = this.center.z + Math.sin(-this.rAngle+this.iAngle) * this.radius;
      this.final_point = new Point(x,this.center.y, z);
      this.cPoints.push(this.final_point);
  }

  //Função que serve para instanciar uma nova CircularAnimation com os mesmo valores que a atual
  clone(){
      var ret = new CircularAnimation(this.id, this.time, this.center.x, this.center.y, this.center.z, this.radius, this.iAngle, this.rAngle);
      return ret;
  }
}

class gameAnimation extends Animation{
  constructor(id, xInicial, yInicial, xFinal, yFinal){
      var time = 2;
      super(id, time);
      this.initialPoint = new Point(xInicial, yInicial, 0.5);
      this.finalPoint = new Point(xFinal, yFinal, 0.5);
      this.dist = Math.sqrt((xFinal - xInicial)*(xFinal - xInicial) + (yFinal - yInicial)*(yFinal - yInicial));
      this.mov_per_it_x = (xFinal - xInicial) / time;
      this.mov_per_it_z = (yFinal - yInicial) / time;
      this.movement_per_it = 2 / time;
      this.heigth = 10;

      this.des = -1;
      this.x_atual = 0;
      this.y_atual = 0.5;
      this.z_atual = 0;
  }
  clone(){
      var ret = new gameAnimation(this.id, this.initialPoint.x, this.initialPoint.y, this.finalPoint.x, this.finalPoint.y);
      return ret;
  }
}
