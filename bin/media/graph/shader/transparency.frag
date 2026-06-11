//for water transparency modification

uniform sampler2D colorMap;
uniform sampler2D pseudoLightMap;
uniform sampler2D pseudoReflections;

uniform float water_transparency;
uniform float waterfall_transparency;
uniform vec3 waterfall_color;
uniform float setting_v3;

varying vec4 texcoord;
varying vec4 lightcoord;

varying vec4 vert_pos;
varying float is_vertical;
varying float fogFactor;

//0.1666
//float water_transparency = 0.1; //.2, 0.12
//float waterfall_transparency = 0.25; //.2

void main()
{
    //waterfall_color = vec3(0.1, 0.6, 0.3);
    vec4 color = texture2D(colorMap,texcoord.rg);
    
    float value = (lightcoord.r)/256.0;
    float value1 = (lightcoord.g)/256.0;
    
    vec4 light_color = texture2D(pseudoLightMap,vec2(value, value1));
    vec4 out_color = vec4(1.0);
    float alpha = color.a;
    
    if (is_vertical <= 0.1) { //required to render ice properly
        //-1 at surface
        //0 at waterfall
        alpha = (alpha * (-is_vertical) * water_transparency) + alpha * (1.0+is_vertical) * waterfall_transparency;
        
        if (setting_v3 >= 1.0) {
            //v3b settings
            color.rgb = (2.0*color.r + 2.0*color.g + 2.0*color.b)/4.5 + color.rgb*0.8;
        }
        
        //1.8.1 requires light non-linearity to work against lighting inconsistency?
        vec3 col = vec3(light_color.r*color.r, light_color.g*color.g, light_color.b*color.b);
                        
        //if (vert_color.b <= 0.9) col = vec3(1.0, 0.0, 0.0);
        
        //interpolate between flat and waterfall
        out_color.rgb = (-is_vertical) * col + (1.0+is_vertical) * col * waterfall_color;
        out_color.a = alpha;
        
    } else {
        float u;
        float v;
        if (vert_pos.x+0.1 <= vert_pos.y && vert_pos.x-0.1 >= vert_pos.y) {
            u = vert_pos.x;
            v = vert_pos.z;
        } else {
            u = vert_pos.x;
            v = vert_pos.y;
        }
        
        vec4 refl_col = texture2D(pseudoReflections,vec2(mod(u,10.0)/6.0, mod(v,10.0)/6.0));
        refl_col = 2.0*(sqrt(refl_col));
        color = (color+refl_col)/2.0;
        out_color = vec4((1.75*light_color.r)*color.r, (1.75*light_color.g)*color.g, (1.75*light_color.b)*color.b, alpha);
    }
    
    if (is_vertical > -0.9) {
        gl_FragColor = mix(gl_Fog.color, out_color, fogFactor);
    } else {    
        gl_FragColor = out_color;
    }
    
    //gl_FragColor = vec4(light_color.r, light_color.g, light_color.b, 1.0);
	
	//float value = (lightcoord.r)/256.0;
	//float value1 = (lightcoord.g)/256.0;
	
	//gl_FragColor = vec4(value + (1.0-value)*value1, 0.0, 0.0, 1.0);
	
}