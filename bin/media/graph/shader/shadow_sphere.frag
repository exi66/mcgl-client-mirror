varying vec4 texcoord;
uniform sampler2D colorMap;


void main()
{
    vec4 color = texture2D(colorMap, texcoord.rg);
    vec2 uv = texcoord.xy;

    gl_FragColor = vec4(color.xyz * vec3(uv.y - .2), color.a);
}
