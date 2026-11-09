uniform sampler2D colorMap;

// время в секундах, для мерцания
uniform float time;
// цвет свечения (цвет звёздной системы)
uniform vec3 glowColor;

varying vec4 texcoord;

void main()
{
    vec4 color = texture2D(colorMap, texcoord.rg);

    // границы силуэта планеты: по градиенту альфы
    vec2 px = vec2(1.5 / 128.0);
    float al = texture2D(colorMap, texcoord.rg - vec2(px.x, 0.0)).a;
    float ar = texture2D(colorMap, texcoord.rg + vec2(px.x, 0.0)).a;
    float au = texture2D(colorMap, texcoord.rg + vec2(0.0, px.y)).a;
    float ad = texture2D(colorMap, texcoord.rg - vec2(0.0, px.y)).a;
    float edge = clamp(abs(color.a - al) + abs(color.a - ar) + abs(color.a - au) + abs(color.a - ad), 0.0, 1.0);

    // кольцо по внешнему краю спрайта (128x128, планета вписана в круг)
    vec2 c = texcoord.rg - 0.5;
    float r = length(c) * 2.0;
    float ring = smoothstep(0.80, 0.98, r) * (1.0 - smoothstep(0.99, 1.03, r));
    // свечение только у внешнего обода: внутренние альфа-границы текстуры не светим
    float ringBand = smoothstep(0.72, 0.92, r);
    edge = max(edge * 2.5, ring * 0.8) * ringBand;

    // мерцание: медленная волна, огибающая край по углу + общее пульсирование
    float ang = atan(c.y, c.x);
    float wave = 0.5 + 0.5 * sin(time * 2.2 + ang * 4.0 + 1.5 * sin(time * 0.7 + ang * 2.0));
    float pulse = 0.75 + 0.25 * sin(time * 1.3);
    float glow = edge * wave * pulse;

    gl_FragColor = vec4(color.rgb + glowColor * glow, color.a + glow * 0.45);
}
