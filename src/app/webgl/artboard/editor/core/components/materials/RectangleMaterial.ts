import Camera from "../../../../../lib/renderer/core/Camera";
import Material from "../../../../../lib/renderer/core/Material";
import Renderable from "../../../../../lib/renderer/core/Renderable";
import Renderer from "../../../../../lib/renderer/core/Renderer";
import Shader from "../../../../../lib/renderer/core/Shader";
import Vector4 from "../../../../../lib/renderer/core/Vector4";

/**
 * Created by mdavids on 09/02/2021.
 */

export default class RectangleMaterial extends Material {
    public index: number = 0;
    public indexMask: number = 0;

    public color: Vector4 = new Vector4(1, 1, 1, 1);

    private vertex: string = `
        precision highp float;
        
        attribute vec3 aPos;
        attribute vec2 aUV;
        attribute vec3 aNormal;
        
        uniform mat4 uWorld;
        uniform mat4 uViewProjection;
        
        void main(void) {
          gl_Position =  uViewProjection * uWorld * vec4(aPos, 1.0);
        }
    `;

    private fragment: string = `
        precision highp float;
        
        uniform float uIndex;
        uniform float uIndexMask;
        uniform vec4 uColor;
        
        void main(void) {
            vec4 color = mix(uColor, vec4(uIndex), uIndexMask);
            gl_FragColor = color;
        }
    `;

    constructor(renderer: Renderer) {
      super(renderer, 'rectangle-material');
  
      this.shader = new Shader(renderer);
      this.shader.init('shader-rectangle', this.vertex, this.fragment);

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
