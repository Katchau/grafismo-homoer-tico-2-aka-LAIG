#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cM;

uniform float div_u;
uniform float div_v;
uniform float s_u;
uniform float s_v;

vec4 actualColor(){

}

void main(){
    if ((vTextureCoord.x > (s_u/div_u)) && (vTextureCoord.x > ((s_u+1.0)/div_u)) && (vTextureCoord.y > (s_v/div_v)) && (vTextureCoord.y > ((s_v+1.0)/div_v)))
      gl_FragColor = cM;
    else if ((mod(div_u*vTextureCoord.x) < 1.0) ^^ (mod(div_v*vTextureCoord.y) < 1.0))
      gl_FragColor = c1;
    else
      gl_FragColor = c2;
}
