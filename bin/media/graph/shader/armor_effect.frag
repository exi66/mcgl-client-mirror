uniform sampler2D colorMap;
varying vec4 texcoord;
varying vec4 texcoordLight;

varying vec4 diffuse,ambient;
varying vec3 normal,lightDir,halfVector;

varying vec4 originColor;

// текущий игровой тик
uniform float timer;
// текущая яркость персонажа в мире
uniform float brightness;
// уровень улучшения текущей части брони
uniform float enchant;

float Hash( vec2 p)
{
    vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0-2.0*f);

    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}

float fbm(vec2 p)
{
     float v = 0.0;
     v += noise(p*1.)*.100;
     v += noise(p*2.)*.025; // .25
     v += noise(p*4.)*.125;
     v += noise(p*8.)*.0625;
     return v;
}

float WaveletNoise(vec2 p, float z, float k) {
    float d=0.,s=1.,m=0., a;
    for(float i=0.; i<4.; i++) {
        vec2 q = p*s, g=fract(floor(q)*vec2(123.34,233.53));
    	g += dot(g, g+23.234);
		a = fract(g.x*g.y)*1e3;// +z*(mod(g.x+g.y, 2.)-1.); // add vorticity
        q = (fract(q)-.5)*mat2(cos(a),-sin(a),sin(a),cos(a));
        d += sin(q.x*10.+z)*smoothstep(.25, .0, dot(q,q))/s;
        p = p*mat2(.54,-.84, .84, .54)+i;
        m += 1./s;
        s *= k; 
    }
    return d/m;
}

vec4 apply(vec4 color, vec3 effect) {
	float k = 0.1;
	return vec4(
		color.r + effect.r*k,
		color.g + effect.g*k,
		color.b + effect.b*k,
		color.a);
}

mat2 rotation2dX(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, s,
		-s, c
	);
}

void main()
{
    vec4 color = texture2D(colorMap, texcoord.rg);
    vec2 uv = texcoord.xy;

    // вариант 1
//	vec3 finalColor = vec3( 0.0 );
//	for( int i=1; i < 8; ++i )
//	{
//		float t = abs(1.0 / ((uv.x + fbm( uv + 10./float(i)))*75.));
//		finalColor +=  t * vec3( float(i) * 0.1 +0.1, 0.5, 2.0 );
//	}

//	gl_FragColor = vec4(color.r, color.g, color.b + cos(timer/10. * noise(uv) + timer*5.), color.a);
	

    // 2:
    float Y = uv.y;
	for(float i = 1.0; i < 8.0; i++){
		Y += i * 0.1 / i * 
			sin(uv.x * i * i + timer * 0.5) * sin(Y * i * i + timer * 0.5);
	}
	vec3 col2;
	col2.r = Y - 0.1;
	col2.g = Y + 0.3;
	col2.b = Y + 0.95;
	float k = 0.8;
    
//	gl_FragColor = vec4(color.r, color.g, color.b + uv.y*k, color.a);

	// 3: молнии

//	vec3 wave_color = vec3(0.0);
//	float iTime = timer/15.;

//	float wave_width = 0.0;
//	uv  = -3.0 + 2.0 * uv;
//	uv.y += 0.0;
//	for(float i = 0.0; i <= 28.0; i++) {
//		uv.y += (0.2+(0.9*sin(iTime*0.4) * sin(uv.x + i/3.0 + 3.0 *iTime )));
//        uv.x += 1.7* sin(iTime*0.4);
//		wave_width = abs(1.0 / (200.0*abs(cos(iTime)) * uv.y));
//		wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 9.0), wave_width * ((i+1.0)/ 8.0) * 1.9);
//	}

/*	float k = 0.2;
	gl_FragColor = vec4(
		color.r + wave_color.r*k,
		color.g + wave_color.g*k,
		color.b + wave_color.b*k,
		color.a);*/


    // 5: линейный градиент
    float ench = enchant;	// уровень улучшений
    float angle = 10.;		// наклон полос
    float res = 5.;			// толщина линий
    float speed = 1.;		// скорость движения
    float period = 1.;		// период отображения эффекта: 
    float intensity = 0.25;	// яркость эффекта
    
    vec2 uvR = uv * rotation2dX(angle);
    vec2 cv = vec2(uvR.x * res + timer * speed, 0);
    float frame = clamp(sin(timer) + period, 0., 1.);
    float gColor = clamp(fbm(cv) * frame, .1, 1.) - .1;
    float blue = clamp(ench - 6., .01, 1.);
    float red = clamp(ench - 9., .01, 1.);
    vec3 grad = vec3(gColor, gColor * (1. - blue) * (1. - red), gColor * blue * (1. - red)) * (pow(ench, 1.1) * intensity);
    
    // 4: перелив
//    grad = vec3(0);
//    grad += WaveletNoise(uv*5., timer*10., 1.24)*.5+.5; 
//    if(grad.r>.99) grad= vec3(1,0,0); 
//    if(grad.r<0.01) grad = vec3(0,0,1);
    
    // light shadow
    float shadowFactor = .4;
    float NdotL = (1. - shadowFactor) + dot(normal, lightDir) * shadowFactor;
    
    //gl_FragColor = vec4(mix(originColor.xyz, wave_color, 0.0) * NdotL, originColor.a);
   
    // entity brightness
    float realBr = brightness * .93 + .07;
    
    // result color
    //gl_FragColor = vec4(mix(color.xyz, grad, .4) * NdotL * realBr, color.a);
    gl_FragColor = vec4((color.xyz * NdotL + grad) * realBr, color.a);
}
