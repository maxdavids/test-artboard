import Renderer from '../../../core/Renderer';
import Shader from '../../../core/Shader';

/**
 * Created by mdavids on 01/05/2016.
 */
class ShaderBlit extends Shader {
  constructor(renderer: Renderer) {
    super(renderer);

    const vProgram: string = `
         precision mediump float;
         
         attribute vec3 aPos;
         attribute vec2 aUV;
         attribute vec3 aNormal;
         
         varying vec2 vUV;
         varying vec3 vNormal;
         
         void main(void) {
             gl_Position = vec4(aPos * 2.0, 1.0);
             vUV = aUV;
             vNormal = aNormal;
         }
         `;

    const fProgram: string = `
         precision mediump float;
         
         uniform sampler2D uTexture1;
         uniform vec4 uColor;
         
         varying vec2 vUV;
         
         void main(void) {
            vec4 color = texture2D(uTexture1, vUV) * uColor;
            // color.rgb *= color.a;

            gl_FragColor = color;
         }
         `;

    this.init('shader_blit', vProgram, fProgram);
  }
}
export default ShaderBlit;
