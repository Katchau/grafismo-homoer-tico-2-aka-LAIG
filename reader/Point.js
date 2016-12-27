/*
  Classe que representa um ponto com coordenadas x, y, z
*/
class Point{
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone(){
      return new Point(this.x,this.y,this.z);
  }
}
