import Renderer from '../../../core/Renderer';
import Shader from '../../../core/Shader';

/**
 * Created by mdavids on 21/4/2017.
 */
class ShaderSharpen extends Shader {
  constructor(renderer: Renderer) {
    super(renderer);

    const vProgram: string = `
		 precision mediump float;
		 
		 attribute vec3 aPos;
		 attribute vec2 aUV;
		 
		 varying vec2 vUV;
		 
		 void main(void) {
			 gl_Position = vec4(aPos * 2.0, 1.0);
			 vUV = aUV;
		 }
		 `;

    const fProgram: string = `
		 precision mediump float;
		 
		 uniform sampler2D uTexture1;
		 uniform vec2 uTexelSize;
     uniform float uStrength;
     uniform float uClamp;
     uniform float uTime;
		 
		 varying vec2 vUV;
		 
     float noise(float x, float y, float seed, float phase)
     {
       float n = x * y * phase * seed;
       return mod(n, 13.0) * mod(n, 123.0);
     }
		 
		 void main(void) {
       vec4 color = texture(uTexture1, vUV);
      
       vec4 blur = texture(uTexture1, vUV + vec2(0.5 * uTexelSize.x, -uTexelSize.y));
       blur += texture(uTexture1, vUV + vec2(-uTexelSize.x, 0.5 * -uTexelSize.y));
       blur += texture(uTexture1, vUV + vec2(uTexelSize.x, 0.5 * uTexelSize.y));
       blur += texture(uTexture1, vUV + vec2(0.5 * -uTexelSize.x, uTexelSize.y));
       blur /= 4.0;
      
       vec4 lumaStrength = vec4(0.2126, 0.7152, 0.0722, 0.0) * uStrength * 0.7;
       vec4 sharp = color - blur;
       color += clamp(dot(sharp, lumaStrength), -uClamp, uClamp);
       
       gl_FragColor = vec4(color.rgb, 1.0);
		 }
		 `;

    this.init('shader_sharpen', vProgram, fProgram);
  }
}
export default ShaderSharpen;
