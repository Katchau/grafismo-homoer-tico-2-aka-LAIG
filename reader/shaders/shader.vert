#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float div_u;
uniform float div_v;

uniform float s_u;
uniform float s_v;

varying vec2 vTextureCoord;

void main(){
    if ((aTextureCoord.x > (s_u/div_u)) && (aTextureCoord.x > ((s_u+1.0)/div_u)) && (aTextureCoord.y > (s_v/div_v)) && (aTextureCoord.y > ((s_v+1.0)/div_v)))
}
