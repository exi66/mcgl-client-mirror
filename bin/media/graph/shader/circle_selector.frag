varying vec4 position;

uniform float angle;
uniform int sectors;
uniform vec3 iResolution;
uniform vec3 iMouse;
uniform vec3 iCenter;

const float Pi = 3.14159;

vec2 q;

float circle(float rad, float size){
    return (1.0-smoothstep(rad+size,rad+size+0.01, length(q))) * smoothstep(rad, rad + 0.01, length(q)) ; 
}

void main()
{
    vec2 p = (position.xy - iCenter.xy) / iResolution.xy - vec2(0.5, 0.5);
    q = p;
    q.x *= iResolution.x/iResolution.y;
    
    vec3 col = vec3(0.0, .5, 0.0);
    vec3 col2 = vec3(0.5, 0.0, 0.0);
    vec3 sel = vec3(0.75, 0.0, 0.0);
    float sec = float(sectors);
    
    float cc = circle(.24, .22);
    col2 *= cc;
    sel *= cc;
    
    float angleBase = atan( q.y, q.x );
    float md = sqrt(q.y*q.y+q.x*q.x);
    
    float dist = 10. * (1. - step(distance(iResolution.xy * .5, iMouse.xy), 20.)) - 10.;
//    float orig = atan(iResolution.y*.5 - iMouse.y, -iResolution.x*.5 + iMouse.x) / Pi;
    int mAngle = int(dist) + int(mod(sec * (angle/Pi + 1.) * .5 + 1., sec));
  
    float border = .004;
    float angle1 = 1./sec - border;
    float angle2 = angleBase;
    vec2 qr;
    float t;
    vec3 c;
    for(int i = 0; i < sectors; i++) {
        qr.y = sin(angle2 - Pi * border)*md;
        qr.x = cos(angle2 - Pi * border)*md;

        t = (atan( qr.y, qr.x ) + Pi) / (2.0 * Pi);

        c = i == mAngle ? sel : col2;
        c *= 1.0 - smoothstep(.0+angle1, .005+angle1, t);
        c *= smoothstep(0.0, 0.005, t);

        col += c;
        angle2 += Pi * (2. / sec);
    }
    
    gl_FragColor = vec4(vec3(0.0), col.r);
}
