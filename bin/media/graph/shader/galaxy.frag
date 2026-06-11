#version 330

uniform float z;
      
varying vec3 vPosition;
varying vec3 mPosition;
varying float gas;

void main(){

	float a = distance(mPosition,vPosition);
	if(a>0.) a = 1.;

	float b = max(.32,.015*length(vPosition));
	  
	float c = distance(gl_PointCoord, vec2(.5));
	float starlook = -(c-.5)*1.2*gas; 
	float gaslook = (1.-gas)/(c*10.);
	float texture = max(starlook + gaslook, .1) - .1;
			   
	gl_FragColor = vec4(.32,.28,b,1.0)*texture*(1.-a*.35);
	if(z > 0.) gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
}
