import Camera from "../../../../../lib/renderer/core/Camera";
import Material from "../../../../../lib/renderer/core/Material";
import Renderable from "../../../../../lib/renderer/core/Renderable";
import Renderer from "../../../../../lib/renderer/core/Renderer";
import Shader from "../../../../../lib/renderer/core/Shader";
import Vector4 from "../../../../../lib/renderer/core/Vector4";

/**
 * Created by mdavids on 18/02/2021.
 */

export default class ImageMaterial extends Material {
    public index: number = 0;
    public indexMask: number = 0;

    public color: Vector4 = new Vector4(1, 1, 1, 1);

    private vertex: string = `
        precision highp float;
            
        attribute vec3 aPos;
        attribute vec2 aUV;
        
        uniform mat4 uWorld;
        uniform mat4 uViewProjection;
        
        varying vec2 vUV;
        
        void main(void) {
            gl_Position =  uViewProjection * uWorld * vec4(aPos, 1.0);
            
            vUV = aUV;
        }
    `;

    private fragment: string = `
        precision highp float;
        
        uniform sampler2D uTexture1;
        uniform vec4 uColor;

        uniform float uIndex;
        uniform float uIndexMask;
        
        varying vec2 vUV;
        
        void main(void) {
            vec4 color = texture2D(uTexture1, vUV) * uColor;
            color = mix(color, vec4(uIndex / 255.0), uIndexMask);

            gl_FragColor = color;
        }
    `;

    constructor(renderer: Renderer) {
      super(renderer, 'image-material');
  
      this.shader = new Shader(renderer);
      this.shader.init('shader-image', this.vertex, this.fragment);

      this.resetBlending();
    }
  
    public setUniforms(camera: Camera, renderable: Renderable): void {
      super.setUniforms(camera, renderable);
  
      this.setMatrix('uWorld', renderable.getTransform().getMatrix());
      this.setMatrix('uViewProjection', camera.getViewProjection());
      this.setMatrix('uInvView', camera.getInvViewMatrix());
  
      this.setFloat('uIndex', this.index);
      this.setFloat('uIndexMask', this.indexMask);
      this.setVector4('uColor', this.color);
    }
  
    destruct() {
      super.destruct();
    }
}
