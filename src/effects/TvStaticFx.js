// WORKING 1  NOT adjustable
// Define the shader source code for TV static effect
// const fragShader = `
// #define SHADER_NAME TV_STATIC_FS
//
// precision mediump float;
//
// uniform float     uTime;
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;
//
// void main( void )
// {
//     vec2 uv = outTexCoord;
//
//     // Generate random noise
//     float noise = fract(sin(dot(uv + uTime, vec2(12.9898, 78.233))) * 43758.5453);
//
//     // Add noise to the color
//     vec4 texColor = texture2D(uMainSampler, uv);
//     texColor.rgb += vec3(noise) * 0.2; // Adjust the intensity of the noise here
//     gl_FragColor = texColor;
// }
// `;
//
// export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
//     constructor (game) {
//         super({
//             game,
//             renderTarget: true,
//             fragShader
//         });
//
//         this._time = 0;
//     }
//
//     onPreRender () {
//         this._time += 0.005;
//
//         this.set1f('uTime', this._time);
//     }
// }

// Define the modified shader source code for TV static effect
// const fragShader = `
// #define SHADER_NAME TV_STATIC_FS
//
// precision mediump float;
//
// uniform float     uTime;
// uniform float     uNoiseIntensity; // New uniform for controlling noise intensity
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;
//
// void main( void )
// {
//     vec2 uv = outTexCoord;
//
//     // Generate random noise
//     float noise = fract(sin(dot(uv + uTime, vec2(12.9898, 78.233))) * 43758.5453);
//
//     // Adjust the noise intensity
//     noise *= uNoiseIntensity;
//     noise = clamp(noise, 0.0, 1.0);
//
//     // Add noise to the color
//     vec4 texColor = texture2D(uMainSampler, uv);
//     texColor.rgb += vec3(noise);
//
//     // Output the final color
//     gl_FragColor = texColor;
// }
//
// `;
//
// export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
//     constructor (game) {
//         super({
//             game,
//             renderTarget: true,
//             fragShader
//         });
//
//         this._time = 0;
//         this._noiseIntensity = 0.2; // Initial noise intensity
//     }
//
//     get noiseIntensity () {
//         return this._noiseIntensity;
//     }
//
//     set noiseIntensity (value) {
//         this._noiseIntensity = value;
//     }
//
//
//
//     onPreRender () {
//         this._time += 0.005;
//
//         this.set1f('uTime', this._time);
//         this.set1f('uNoiseIntensity', this._noiseIntensity); // Set the noise intensity uniform
//     }
// }


// WORKING 2 NOT adjustable
// Define the shader source code for TV static effect
// const fragShader = `
// #define SHADER_NAME TV_STATIC_FS
//
// precision mediump float;
//
// uniform float uTime;
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;
//
// float noise(vec2 pos, float evolve) {
//     // Loop the evolution (over a very long period of time).
//     float e = fract((evolve*0.01));
//
//     // Coordinates
//     float cx  = pos.x*e;
//     float cy  = pos.y*e;
//
//     // Generate a "random" black or white value
//     return fract(23.0*fract(2.0/fract(fract(cx*2.4/cy*23.0+pow(abs(cy/22.4),3.3))*fract(cx*evolve/pow(abs(cy),0.050)))));
// }
//
// void main( void )
// {
//     vec2 uv = outTexCoord;
//
//     // Generate a black to white pixel
//     vec3 colour = vec3(noise(uv, uTime));
//
//     // Get the color of the pixel from the main texture
//     vec4 texColor = texture2D(uMainSampler, uv);
//
//     // Mix the noise color with the texture color
//     vec3 finalColor = mix(texColor.rgb, colour, 0.2); // Adjust the mix factor as needed
//
//     // Output the final color
//     gl_FragColor = vec4(finalColor, 1.0);
// }
// `;
//
// export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
//     constructor (game) {
//         super({
//             game,
//             renderTarget: true,
//             fragShader
//         });
//
//         this._time = 0;
//     }
//
//     onPreRender () {
//         this._time += 0.005;
//
//         this.set1f('uTime', this._time);
//     }
// }
//


// working 2 adjustable
// Define the modified shader source code for TV static effect
// const fragShader = `
// #define SHADER_NAME TV_STATIC_FS
//
// precision mediump float;
//
// uniform float uTime;
// uniform float uNoiseIntensity; // New uniform for controlling noise intensity
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;
//
// float noise(vec2 pos, float evolve) {
//     // Loop the evolution (over a very long period of time).
//     float e = fract((evolve*0.01));
//
//     // Coordinates
//     float cx  = pos.x*e;
//     float cy  = pos.y*e;
//
//     // Generate a "random" black or white value
//     return fract(23.0*fract(2.0/fract(fract(cx*2.4/cy*23.0+pow(abs(cy/22.4),3.3))*fract(cx*evolve/pow(abs(cy),0.050)))));
// }
//
// void main( void )
// {
//     vec2 uv = outTexCoord;
//
//     // Generate a black to white pixel
//     vec3 colour = vec3(noise(uv, uTime) * uNoiseIntensity); // Adjust noise intensity
//
//     // Get the color of the pixel from the main texture
//     vec4 texColor = texture2D(uMainSampler, uv);
//
//     // Mix the noise color with the texture color
//     vec3 finalColor = mix(texColor.rgb, colour, 0.2); // Adjust the mix factor as needed
//
//     // Output the final color
//     gl_FragColor = vec4(finalColor, 1.0);
// }
// `;
//
// export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
//     constructor (game) {
//         super({
//             game,
//             renderTarget: true,
//             fragShader
//         });
//
//         this._time = 0;
//         this._noiseIntensity = 0.2; // Initial noise intensity
//     }
//
//     get noiseIntensity () {
//         return this._noiseIntensity;
//     }
//
//     set noiseIntensity (value) {
//         this._noiseIntensity = value;
//     }
//
//
//
//     onPreRender () {
//         this._time += 0.005;
//
//         this.set1f('uTime', this._time);
//         this.set1f('uNoiseIntensity', this._noiseIntensity); // Set the noise intensity uniform
//     }
// }


// Define the modified shader source code for TV static effect
// const fragShader = `
// #define SHADER_NAME TV_STATIC_FS
//
// precision mediump float;
//
// uniform float uTime;
// uniform float uNoiseIntensity; // New uniform for controlling noise intensity
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;
//
// float noise(vec2 pos, float evolve) {
//     // Loop the evolution (over a very long period of time).
//     float e = fract((evolve*0.01));
//
//     // Coordinates
//     float cx  = pos.x*e;
//     float cy  = pos.y*e;
//
//     // Generate a "random" black or white value
//     return fract(23.0*fract(2.0/fract(fract(cx*2.4/cy*23.0+pow(abs(cy/22.4),3.3))*fract(cx*evolve/pow(abs(cy),0.050)))));
// }
//
// void main( void )
// {
//     vec2 uv = outTexCoord;
//
//     // Check if noise intensity is greater than 0
//     if(uNoiseIntensity > 0.0) {
//         // Generate a black to white pixel
//         vec3 colour = vec3(noise(uv, uTime) * uNoiseIntensity); // Adjust noise intensity
//
//         // Get the color of the pixel from the main texture
//         vec4 texColor = texture2D(uMainSampler, uv);
//
//         // Mix the noise color with the texture color
//         vec3 finalColor = mix(texColor.rgb, colour, 0.2); // Adjust the mix factor as needed
//
//         // Output the final color
//         gl_FragColor = vec4(finalColor, 1.0);
//     } else {
//         // If noise intensity is 0, output the color from the main texture directly
//         gl_FragColor = texture2D(uMainSampler, uv);
//     }
// }
// `;
//
// export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
//     constructor (game) {
//         super({
//             game,
//             renderTarget: true,
//             fragShader
//         });
//
//         this._time = 0;
//         this._noiseIntensity = 0.2; // Initial noise intensity
//     }
//
//     get noiseIntensity () {
//         return this._noiseIntensity;
//     }
//
//     set noiseIntensity (value) {
//         this._noiseIntensity = value;
//     }
//
//     onPreRender () {
//         this._time += 0.005;
//
//         this.set1f('uTime', this._time);
//         this.set1f('uNoiseIntensity', this._noiseIntensity); // Set the noise intensity uniform
//     }
// }

// Define the modified shader source code for TV static effect
const fragShader = `
#define SHADER_NAME TV_STATIC_FS

precision mediump float;

uniform float uTime;
uniform float uNoiseIntensity; // New uniform for controlling noise intensity
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 pos, float evolve) {
    // Loop the evolution (over a very long period of time).
    float e = fract((evolve*0.01));

    // Coordinates with some randomness
    vec2 offset = vec2(rand(pos), rand(pos * 0.5));
    vec2 coord = pos + offset * 0.1; // Adjust the scale of the randomness

    // Generate a "random" black or white value
    return fract(23.0*fract(2.0/fract(fract(coord.x*2.4/coord.y*23.0+pow(abs(coord.y/22.4),3.3))*fract(coord.x*evolve/pow(abs(coord.y),0.050)))));
}

void main( void )
{
    vec2 uv = outTexCoord;

    // Check if noise intensity is greater than 0
    if(uNoiseIntensity > 0.0) {
        // Generate a black to white pixel with some randomness
        vec3 colour = vec3(noise(uv, uTime) * uNoiseIntensity); // Adjust noise intensity

        // Get the color of the pixel from the main texture
        vec4 texColor = texture2D(uMainSampler, uv);

        // Mix the noise color with the texture color
        vec3 finalColor = mix(texColor.rgb, colour, 0.2); // Adjust the mix factor as needed

        // Output the final color
        gl_FragColor = vec4(finalColor, 1.0);
    } else {
        // If noise intensity is 0, output the color from the main texture directly
        gl_FragColor = texture2D(uMainSampler, uv);
    }
}
`;

export default class TVStatic extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor (game) {
        super({
            game,
            renderTarget: true,
            fragShader
        });

        this._time = 0;
        this._noiseIntensity = 0.2; // Initial noise intensity
    }

    get noiseIntensity () {
        return this._noiseIntensity;
    }

    set noiseIntensity (value) {
        this._noiseIntensity = value;
    }

    onPreRender () {
        this._time += 0.005;

        this.set1f('uTime', this._time);
        this.set1f('uNoiseIntensity', this._noiseIntensity); // Set the noise intensity uniform
    }
}
