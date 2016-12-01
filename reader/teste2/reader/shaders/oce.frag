#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 filter1 = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
	vec4 filter2 = texture2D(uSampler, vec2(0.0,0.1)+vTextureCoord);
	
	if(filter2.b < 0.5)
		color = filter2;
	
	gl_FragColor = color;
}
