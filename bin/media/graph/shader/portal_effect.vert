varying vec4 texcoord;
varying vec4 texcoordLight;
varying vec4 position;

varying vec4 diffuse,ambient;
varying vec3 normal,lightDir,halfVector;

varying vec4 originColor;

void main()
{
	originColor = gl_Color;
	
    texcoord = gl_MultiTexCoord0;
    texcoordLight = normalize(gl_MultiTexCoord1);
    position = gl_Vertex;
    
    normal   = normalize(gl_NormalMatrix * gl_Normal);
    lightDir = normalize(vec3(gl_LightSource[0].position));
	halfVector = normalize(gl_LightSource[0].halfVector.xyz);
	
	diffuse = gl_FrontMaterial.diffuse * gl_LightSource[0].diffuse;
	ambient = gl_FrontMaterial.ambient * gl_LightSource[0].ambient;
	ambient += gl_LightModel.ambient * gl_FrontMaterial.ambient;

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
