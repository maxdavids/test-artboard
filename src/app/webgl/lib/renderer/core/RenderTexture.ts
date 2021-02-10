import Texture2D from './Texture2D';
import Renderer from './Renderer';
import IRenderTarget from './IRenderTarget';

/**
 * Created by mdavids on 01-05-2016.
 */
class RenderTexture extends Texture2D implements IRenderTarget {
  public frameBuffer: WebGLFramebuffer;
  public sizeMultiplier: number = 1;

  public depthBuffer: WebGLRenderbuffer;
  public depthTexture: Texture2D;
  protected _useDepthTexture: boolean = false;

  protected _scaleToCanvas: boolean = false;

  constructor(
    renderer: Renderer,
    width: number = 1,
    height: number = 1,
    registerIndex: number = -1,
    scaleToCanvas: boolean = false,
    filterLinear: boolean = false,
    wrapClamp: boolean = true,
    useDepth: boolean = false,
    useFloat: boolean = false,
    useDepthTexture: boolean = false,
  ) {
    super(renderer, registerIndex, false, filterLinear, wrapClamp, useFloat);

    this._scaleToCanvas = scaleToCanvas;

    const gl = this.renderer.context;
    this.frameBuffer = gl.createFramebuffer();

    if (useDepth) {
      this._useDepthTexture = useDepthTexture;
      this.createDepthBuffer(width, height);
    }

    this.setTextureSize(width, height);
  }

  public getScaleToCanvas(): boolean {
    return this._scaleToCanvas;
  }

  private createDepthBuffer(width: number, height: number) {
    const gl = this.renderer.context;

    if (!this._useDepthTexture) {
      this.depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    } else {
      this.depthTexture = new Texture2D(
        this.renderer,
        this.registerIndex + 1,
        false,
        false,
        this._wrapClamp,
        false,
      );
    }
  }

  public setAsTarget(): void {
    const gl = this.renderer.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureGL, 0);

    if (this.depthBuffer) {
      this.renderer.setDepthMask(true);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        this.depthBuffer,
      );
    }

    if (this.depthTexture) {
      this.renderer.setDepthMask(true);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.TEXTURE_2D,
        this.depthTexture.textureGL,
        0,
      );
    }
  }

  public setSize(width: number, height: number): void {
    this.setTextureSize(width, height);
  }

  public setTextureSize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;

    const gl = this.renderer.context;

    this.width = width;
    this.height = height;
    this.aspect = this.width / this.height;

    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

    this.bind();

    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, this.width, this.height, 0, format, type, null);

    if (this.depthBuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    if (this.depthTexture) {
      this.depthTexture.bind();
      this.depthTexture.width = this.width;
      this.depthTexture.height = this.height;
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.DEPTH_COMPONENT,
        this.width,
        this.height,
        0,
        gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT,
        null,
      );
    }
  }

  public setImage(image: any, flipY: boolean = true) {
    // if (this._scaleToCanvas || this._dynamic || this.useMips) {
    if (this._scaleToCanvas || this.useMips) {
      // it should probably throw an error

      return;
    }

    const gl = this.renderer.context;
    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

    this.bind();

    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    this.image = image;

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      this.width,
      this.height,
      0,
      format,
      type,
      image,
    );

    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  }

  public getPixel(u: number, v: number): Uint8Array {
    const gl: WebGLRenderingContext = this.renderer.context;
    this.setAsTarget();

    const data = new Uint8Array(1 * 1 * 4);
    gl.readPixels(u * this.width, v * this.height, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return data;
  }

  public getImageData(
    offX: number = 0,
    offY: number = 0,
    width: number = 0,
    height: number = 0,
  ): Uint8Array {
    const sizeX: number = width <= 0 ? this.width : width;
    const sizeY: number = height <= 0 ? this.height : height;

    const gl: WebGLRenderingContext = this.renderer.context;
    this.setAsTarget();

    const data = new Uint8Array(sizeX * sizeY * 4);
    gl.readPixels(offX, offY, sizeX, sizeY, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return data;
  }

  destruct() {
    const gl: WebGLRenderingContext = this.renderer.context;

    if (this.frameBuffer) {
      gl.deleteFramebuffer(this.frameBuffer);
    }

    if (this.depthBuffer) {
      gl.deleteRenderbuffer(this.depthBuffer);
    }

    if (this.depthTexture) {
      this.depthTexture.destruct();
    }

    this.frameBuffer = null;
    this.depthBuffer = null;

    // always call this last
    super.destruct();
  }
}
export default RenderTexture;
