uniform float size;
uniform float t;
uniform float z;
uniform float pixelRatio;

varying vec3 vPosition;
varying vec3 mPosition;//modified position
varying float gas;

float a,b=0.;

varying vec4 position;

void main(){
    position = gl_Vertex;

	vPosition=position.xyz;

	a=length(position.xyz);
	if(t>0.)b=max(0.,(cos(a/20.-t*.02)-.99)*3./a);
	if(z>0.)b=max(0.,cos(a/40.-z*.01+2.));
	
	mPosition = position.xyz*(1.+b*4.);
	
	vec4 mvPosition = gl_ModelViewMatrix*vec4(mPosition,1.);
	gl_Position = gl_ModelViewProjectionMatrix * vec4(mPosition,1.);

	gas = max(.0,sin(-a/20.));

	gl_PointSize = 8.*pixelRatio*size*(1.+gas*2.)/length(mvPosition.xyz);
}
