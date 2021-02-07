import Material from '../../common/renderer/core/Material';
import Renderer from '../../common/renderer/core/Renderer';
import Camera from '../../common/renderer/core/Camera';
import Renderable from '../../common/renderer/core/Renderable';
import Vector4 from '../../common/renderer/core/Vector4';
import Shader from '../../common/renderer/core/Shader';
import Clock from '../../common/renderer/Clock';
import ITexture from '../../common/renderer/core/ITexture';
import Vector2 from '../../common/renderer/core/Vector2';

/**
 * Created by mdavids on 19/12/2018.
 */
class MaterialTimedGeneric extends Material {
  public color: Vector4 = new Vector4(1, 1, 1, 1);

  protected _texelSize: Vector2 = new Vector2(1, 1);

  constructor(renderer: Renderer, shader: Shader) {
    super(renderer, 'material_timed_generic');

    this.shader = shader;
    this.resetBlending();
  }

  public setTexture(texture: ITexture): void {
    this._texture = texture;

    this._texelSize.x = 1 / this._texture.width;
    this._texelSize.y = 1 / this._texture.height;
  }

  public setUniforms(camera: Camera, renderable: Renderable): void {
    super.setUniforms(camera, renderable);

    this.setMatrix('uWorld', renderable.getTransform().getMatrix());
    this.setMatrix('uViewProjection', camera.getViewProjection());

    this.setVector4('uColor', this.color);

    this.setVector2('uTexelSize', this._texelSize);
    this.setFloat('uTime', Clock.globalTime);
  }

  destruct() {
    super.destruct();
  }
}
export default MaterialTimedGeneric;
