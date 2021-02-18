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

        varying vec2 vUV;
        
        void main(void) {
          gl_Position =  uViewProjection * uWorld * vec4(aPos, 1.0);

          vUV = aUV;
        }
    `;

    private fragment: string = `
        precision highp float;
        
        uniform float uIndex;
        uniform float uIndexMask;
        uniform vec4 uColor;

        varying vec2 vUV;

        float roundBox(vec2 p, vec2 b, float r) {
          float df = length(max(abs(p) - b + r, 0.0)) - r;
          return 1.0 - smoothstep(0.0, 0.01, df);
        }

        float quadrant(vec2 p, vec2 q) {
          return abs(q.x - step(0.5, 1.0 - p.x)) * abs(q.y - step(0.5, 1.0 - p.y));
        }

        void main(void) {
            vec2 point = vUV - 0.5;
            vec2 halfSize = vec2(0.5);
            vec4 radius = vec4(0.25, 0.5, 0.15, 0.3);
            
            float shape = 0.0;
            shape += roundBox(point, halfSize, radius.x) * quadrant(vUV, vec2(0.0, 1.0));
            shape += roundBox(point, halfSize, radius.y) * quadrant(vUV, vec2(1.0, 1.0));
            shape += roundBox(point, halfSize, radius.z) * quadrant(vUV, vec2(0.0, 0.0));
            shape += roundBox(point, halfSize, radius.w) * quadrant(vUV, vec2(1.0, 0.0));

            vec4 color = mix(uColor * shape, vec4(uIndex / 255.0) * step(0.5, shape), uIndexMask);
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
