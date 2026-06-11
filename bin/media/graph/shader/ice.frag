uniform sampler2D colorMap;
varying vec4 texcoord;

varying vec3 normal,lightDir,halfVector;

// текущая яркость персонажа в мире
uniform float brightness;

// текущий игровой тик
uniform float timer;

const vec4 cHashA4 = vec4 (0., 1., 57., 58.);
const vec3 cHashA3 = vec3 (1., 57., 113.);
const float cHashM = 43758.54;

vec4 Hashv4f (float p)
{
  return fract (sin (p + cHashA4) * cHashM);
}

float Noisefv2 (vec2 p)
{
  vec2 i = floor (p);
  vec2 f = fract (p);
  f = f * f * (3. - 2. * f);
  vec4 t = Hashv4f (dot (i, cHashA3.xy));
  return mix (mix (t.x, t.y, f.x), mix (t.z, t.w, f.x), f.y);
}

float Fbm2 (vec2 p)
{
  float s = 0.;
  float a = 1.;
  for (int i = 0; i < 6; i ++) {
    s += a * Noisefv2 (p);
    a *= 0.5;
    p *= 2.;
  }
  return s;
}

float tCur;

vec2 VortF (vec2 q, vec2 c)
{
  vec2 d = q - c;
  return 0.25 * vec2 (d.y, - d.x) / (dot (d, d) + 0.05);
}

vec2 FlowField (vec2 q)
{
  vec2 vr, c;
  float dir = 1.;
  c = vec2 (mod (tCur, 10.) - 20., 0.6 * dir);
  vr = vec2 (0.);
  for (int k = 0; k < 30; k ++) {
    vr += dir * VortF (4. * q, c);
    c = vec2 (c.x + 1., - c.y);
    dir = - dir;
  }
  return vr;
}

void main()
{
    vec4 color = texture2D(colorMap,texcoord.rg);
    
    float value = 0.2126*color.r + 0.7152*color.g + 0.0722*color.b;
    
    // light shadow
    float nrm = 1. - dot(normal, lightDir) * .5;
    
    float realBr = brightness * .93 + .07;
    
//	vec2 uv = texcoord.rg;
	//uv.x *= iResolution.x / iResolution.y;
//	tCur = .002 * timer;
//	vec2 p = uv;
//	for (int i = 0; i < 10; i ++) p -= FlowField (p) * 0.03;
//	vec3 col = Fbm2 (5. * p + vec2 (-0.1 * tCur, 0.)) *	vec3 (0.5, 0.5, 1.);

	vec3 col = vec3(0.37, 0.44, 0.59);
	
	
	// gl_FragColor = vec4 (col * nrm * realBr * .8, .6); ice
    
	gl_FragColor = vec4(col * nrm * realBr * .8, color.a * (0.25 + value));
}


