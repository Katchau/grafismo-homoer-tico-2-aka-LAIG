class Animation{
}

class LinearAnimation extends Animation{
  constructor(time, cPoint){
    this.time = time;
    this.cPoint = cPoint;
  }
}

class CircularAnimation extends Animation{
  constructor(time, center, radius, iAngle, rAngle){
    this.time = time;
    this.center = center;
    this.radius = radius;
    this.iAngle = iAngle;
    this.rAngle = rAngle;
  }
}
