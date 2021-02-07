import Renderer from '../../../core/Renderer';
import Shader from '../../../core/Shader';

/**
 * Created by mdavids on 01/05/2016.
 */
class ShaderTexture2D extends Shader {
  constructor(renderer: Renderer) {
    super(renderer);

    const vProgram: string = `
		 precision highp float;
		 
		 attribute vec3 aPos;
		 attribute vec2 aUV;
		 attribute vec3 aNormal;
		 
		 uniform mat4 uWorld;
		 uniform mat4 uViewProjection;
		 
		 varying vec2 vUV;
		 
		 void main(void) {
			 gl_Position =  uViewProjection * uWorld * vec4(aPos, 1.0);
			 
			 vUV = aUV;
		 }
		 `;

    const fProgram: string = `
		 precision highp float;
		 
		 uniform sampler2D uTexture1;
     	 uniform vec4 uColor;
		 
		 varying vec2 vUV;
		 
		 void main(void) {
			 vec4 color = texture2D(uTexture1, vUV) * uColor;
			 // color.rgb *= uColor.a;
			 
			 gl_FragColor = color;
		 }
		 `;

    this.init('shader_texture', vProgram, fProgram);
  }
}
export default ShaderTexture2D;
