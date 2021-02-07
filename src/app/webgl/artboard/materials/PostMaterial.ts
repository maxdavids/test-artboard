/**
 * Created by mdavids on 26/02/2019.
 */
import Material from '../../common/renderer/core/Material';
import Vector2 from '../../common/renderer/core/Vector2';
import Renderer from '../../common/renderer/core/Renderer';
import ITexture from '../../common/renderer/core/ITexture';
import Camera from '../../common/renderer/core/Camera';
import Renderable from '../../common/renderer/core/Renderable';
import Clock from '../../common/renderer/Clock';
import Texture2D from '../../common/renderer/core/Texture2D';
import Shader from '../../common/renderer/core/Shader';

export class PostMaterial extends Material {
  public texLUT: Texture2D;

  public exposure: number = 1;

  protected _texelSize: Vector2 = new Vector2(1, 1);
  protected _texAspect: number = 1;

  constructor(renderer: Renderer, shader: Shader = null) {
    super(renderer, 'material_post');

    this.shader = shader;

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

    this.setVector2('uTexelSize', this._texelSize);
    this.setFloat('uTime', Clock.globalTime);
    this.setFloat('uExposure', this.exposure);

    const textureUniform: WebGLUniformLocation = this.getLoc('uTexture2');
    this.texLUT.bind();
    this._renderer.context.uniform1i(textureUniform, this.texLUT.registerIndex);
  }

  destruct() {
    super.destruct();
  }
}
