uniform sampler2D colorMap;
varying vec4 texcoord;

void main()
{
    vec4 color = texture2D(colorMap,texcoord.rg);
    
    float baseColor = .05;
    //float baseColor = (color.r + color.g + color.b) * 0.33;
	gl_FragColor = vec4(vec3(baseColor), color.a);
}
