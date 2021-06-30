export const waterFragmentShader = `

    uniform vec3 uDepthColor;
    uniform vec3 uSurfaceColor;
    uniform float uColorOffset;
    uniform float uColorOffsetMultiplier;

    varying float vElevation;

    varying vec2 vUV;

    void main(){
        
        // we are going to mix uDepthColor and uSurfaceColor based on vElevation
        float mixStrength = ( vElevation + uColorOffset ) * uColorOffsetMultiplier;
        vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);


        // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
        gl_FragColor = vec4(color, 1.0);

    }

`