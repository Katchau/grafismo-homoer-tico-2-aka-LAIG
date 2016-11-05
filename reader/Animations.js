class Animation{
    //wtf da erro this.id = -1;
}

class LinearAnimation extends Animation{
  constructor(id, time, cPoints){
      this.id = id;
      this.time = time;
      this.cPoints = cPoints;
  }
}

class CircularAnimation extends Animation{
  constructor(id, time, center, radius, iAngle, rAngle){
      this.id = id;
      this.time = time;
      this.center = center;
      this.radius = radius;
      this.iAngle = iAngle;
      this.rAngle = rAngle;
  }
}
