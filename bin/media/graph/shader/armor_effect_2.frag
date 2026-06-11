uniform sampler2D colorMap;

varying vec4 texcoord;
varying vec3 normal, lightDir;

// текущий игровой тик
uniform float timer;
// текущая яркость персонажа в мире
uniform float brightness;
// уровень улучшения текущей части брони
uniform float enchant;

void main() {
    vec4 color = texture2D(colorMap, texcoord.rg);
    vec2 uv = texcoord.xy;

    vec3 wave_color = vec3(0.0);
    float iTime = timer / 15.;
    float blue = clamp(enchant - 6., .01, 1.);
    float red = clamp(enchant - 9., .01, 1.);

    float wave_width = 0.0;
    uv = -3.0 + 2.0 * uv;
    uv.y += 0.0;
    for(float i = 0.0; i <= 28.0; i++) {
        uv.y += (0.2 + (0.9 * sin(iTime * 0.4) * sin(uv.x + i / 3.0 + 3.0 * iTime)));
        uv.x += 1.7 * sin(iTime * 0.4);
        wave_width = abs(1.0 / (200.0 * abs(cos(iTime)) * uv.y));
        wave_color += vec3(wave_width * (0.4 + ((i + 1.0) / 18.0)), wave_width * (i / 9.0) * (1. - blue) * (1. - red), wave_width * ((i + 1.0) / 8.0) * 1.9 * blue * (1. - red));
    }

    float shadowFactor = .4;
    float NdotL = (1. - shadowFactor) + dot(normal, lightDir) * shadowFactor;
    float realBr = brightness * .93 + .07;

    float k = pow(enchant, 1.1) * 0.05;
    gl_FragColor = vec4((color.rgb * NdotL + wave_color * k) * realBr, color.a);
}
