varying vec4 texcoord;
varying vec4 position;
varying vec3 normal,lightDir,halfVector;

void main()
{
    texcoord = gl_MultiTexCoord0;
    position = gl_Vertex;
    
    normal   = normalize(gl_NormalMatrix * gl_Normal);
    lightDir = normalize(vec3(gl_LightSource[0].position));
	halfVector = normalize(gl_LightSource[0].halfVector.xyz);

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
