uniform sampler2D colorMap;
varying vec4 texcoord;

varying vec3 normal,lightDir,halfVector;

// текущая яркость персонажа в мире
uniform float brightness;

void main()
{
    vec4 color = texture2D(colorMap,texcoord.rg);
    
    float value = 0.2126*color.r + 0.7152*color.g + 0.0722*color.b;
    
    // light shadow
    float nrm = 1. - dot(normal, lightDir) * .5;
    
    float realBr = brightness * .93 + .07;
    
	gl_FragColor = vec4(vec3(value) * nrm * realBr * .8, color.a);
}
