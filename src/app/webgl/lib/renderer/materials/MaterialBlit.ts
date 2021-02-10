import Material from '../core/Material';
import Renderer from '../core/Renderer';
import Shader from '../core/Shader';
import ShaderBlit from './shaders/ShaderBlit';
import ITexture from '../core/ITexture';
import Vector2 from '../core/Vector2';
import Camera from '../core/Camera';
import Renderable from '../core/Renderable';
import Vector4 from '../core/Vector4';
import Texture2D from '../core/Texture2D';

/**
 * Created by mdavids on 13/7/2017.
 */
class MaterialBlit extends Material {
  public color: Vector4 = new Vector4(1, 1, 1, 1);
  public texture2: Texture2D;

  protected _texelSize: Vector2 = new Vector2(1, 1);
  protected _texAspect: number = 1;

  protected _aspect: number = 1;

  constructor(renderer: Renderer, shader: Shader = null) {
    super(renderer, 'material_blit');

    this.shader = shader ? shader : new ShaderBlit(renderer);

    this._depthWrite = false;
    this._depthTest = false;
  }

  public setTexture(texture: ITexture): void {
    super.setTexture(texture);

    this._texelSize.x = 1 / texture.width;
    this._texelSize.y = 1 / texture.height;

    this._texAspect = texture.aspect;
  }

  public setUniforms(camera: Camera, renderable: Renderable): void {
    super.setUniforms(camera, renderable);

    this.setVector4('uColor', this.color);
    this.setVector2('uTexelSize', this._texelSize);

    if (this.texture2) {
      const textureUniform: WebGLUniformLocation = this.getLoc('uTexture2');
      this.texture2.bind();
      this._renderer.context.uniform1i(textureUniform, this.texture2.registerIndex);
    }
  }

  destruct() {
    super.destruct();
  }
}
export default MaterialBlit;
