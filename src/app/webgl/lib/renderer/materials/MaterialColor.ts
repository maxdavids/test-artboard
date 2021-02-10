import Material from '../core/Material';
import Renderer from '../core/Renderer';
import Camera from '../core/Camera';
import Renderable from '../core/Renderable';
import Vector4 from '../core/Vector4';
import ShaderColor from './shaders/ShaderColor';
import Shader from '../core/Shader';

/**
 * Created by mdavids on 29/04/2016.
 */
class MaterialColor extends Material {
  public color: Vector4 = new Vector4(1, 1, 1, 1);

  constructor(renderer: Renderer, shader: Shader = null) {
    super(renderer, 'material_color');

    this.shader = shader ? shader : new ShaderColor(renderer);
    this.resetBlending();
  }

  public setUniforms(camera: Camera, renderable: Renderable): void {
    super.setUniforms(camera, renderable);

    this.setMatrix('uWorld', renderable.getTransform().getMatrix());
    this.setMatrix('uViewProjection', camera.getViewProjection());
    this.setMatrix('uInvView', camera.getInvViewMatrix());

    this.setVector4('uColor', this.color);
  }

  destruct() {
    super.destruct();
  }
}
export default MaterialColor;
