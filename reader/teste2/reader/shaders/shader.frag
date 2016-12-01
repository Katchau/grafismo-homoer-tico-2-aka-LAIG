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


void main(){
	vec4 color = texture2D(uSampler, vTextureCoord);

    if ((vTextureCoord.x > (s_u/div_u)) && (vTextureCoord.x < ((s_u+1.0)/div_u)) && ((1.0 - vTextureCoord.y) > (s_v/div_v)) && ((1.0 - vTextureCoord.y) < ((s_v+1.0)/div_v)))
      color.rgba *= cM;
    else if ((mod(div_u*vTextureCoord.x,2.0) < 1.0) ^^ (mod(div_v*vTextureCoord.y,2.0) < 1.0))
      color.rgba *= c1;
    else
      color.rgba *= c2;

    gl_FragColor = color;
}
