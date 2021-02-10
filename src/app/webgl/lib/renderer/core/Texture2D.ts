import Renderer from './Renderer';
import ITexture from './ITexture';

/**
 * Created by mdavids on 21/11/2016.
 */

class Texture2D implements ITexture {
  public image: any;

  public registerIndex: number = -1;
  public textureGL: WebGLTexture;
  public width: number = -1;
  public height: number = -1;
  public aspect: number = -1;
  public renderer: Renderer;
  public sampleLinear: boolean = true;
  public useMips: boolean = false;
  public useFloat: boolean = false;
  protected _mipsCreated: boolean = false;
  protected _wrapClamp: boolean;

  constructor(
    renderer: Renderer,
    registerIndex: number,
    mips: boolean = false,
    filterLinear: boolean = true,
    wrapClamp: boolean = true,
    useFloat: boolean = false,
  ) {
    // super();

    this.renderer = renderer;

    const gl = this.renderer.context;
    this.textureGL = gl.createTexture();

    this.registerIndex = registerIndex;
    this.renderer.context.activeTexture(gl.TEXTURE0 + this.registerIndex);
    this.renderer.context.bindTexture(gl.TEXTURE_2D, this.textureGL);

    this.useMips = mips;
    this.setFilteringLinear(filterLinear);
    this.setWrapModeClamp(wrapClamp);

    this.useFloat = useFloat;
  }

  public bind(): void {
    const gl = this.renderer.context;
    this.renderer.context.activeTexture(gl.TEXTURE0 + this.registerIndex);
    this.renderer.context.bindTexture(gl.TEXTURE_2D, this.textureGL);
  }

  public getTarget(): number {
    const gl = this.renderer.context;
    return gl.TEXTURE_2D;
  }

  public setFilteringLinear(value: boolean): void {
    this.sampleLinear = value;
    const gl = this.renderer.context;
    this.bind();

    let mode: number;
    if (this._mipsCreated) {
      mode = value ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_LINEAR;
    } else {
      mode = value ? gl.LINEAR : gl.NEAREST;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, value ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mode);

    // gl.bindTexture(GL.TEXTURE_2D, null);
  }

  public setWrapModeClamp(value: boolean) {
    this._wrapClamp = value;
    const gl = this.renderer.context;
    this.bind();

    const mode = value ? gl.CLAMP_TO_EDGE : gl.REPEAT;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mode);

    // gl.bindTexture(GL.TEXTURE_2D, null);
  }

  public setAnisotropicFiltering(value: boolean): void {
    const gl: WebGLRenderingContext = this.renderer.context;
    const ext =
      gl.getExtension('EXT_texture_filter_anisotropic') ||
      gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
      gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');

    if (ext) {
      const max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.bindTexture(gl.TEXTURE_2D, this.textureGL);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
  }

  public isPOT(x: number, y: number): boolean {
    return (x & (x - 1)) === 0 && (y & (y - 1)) === 0;
  }

  public generateMips(): void {
    const gl = this.renderer.context;
    this.bind();
    gl.generateMipmap(gl.TEXTURE_2D);
    this.useMips = true;
    this._mipsCreated = true;
    this.setFilteringLinear(this.sampleLinear);
  }

  public setEmpty(width: number, height: number, levels: number = -1, flipY: boolean = true) {
    // if (this.isDestructed) return;

    const gl = this.renderer.context;
    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;
    let maxLevels: number = this.useMips ? levels : 1;
    if (maxLevels < 1) {
      maxLevels = 1;
    }

    this.bind();
    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.width = width;
    this.height = height;
    this.aspect = this.width / this.height;

    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, this.width, this.height, 0, format, type, null);

    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  }

  public setImage(image: any, flipY: boolean = true) {
    // if (this.isDestructed) return;

    const gl = this.renderer.context;
    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

    this.bind();
    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    // gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);

    this.width = image.width;
    this.height = image.height;
    this.aspect = this.width / this.height;
    this.image = image;

    let maxLevels: number = 1;
    if (this.useMips) {
      maxLevels = Math.min(Math.log2(this.width), 8);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image);

    if (this.useMips) {
      this.generateMips();
    }

    if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  }

  /*public setPixels(pixels:ArrayBufferView, width:number, height:number, flipY:boolean = true)
	{
		//if (this.isDestructed) return;

		var gl = this.renderer.context;
		var type = this.useFloat? gl.FLOAT : gl.UNSIGNED_BYTE;

		this.bind();
		if(flipY)gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, pixels);

		this.width = width;
		this.height = height;
		this.aspect = this.width / this.height;

		if (this.useMips) {
			this.generateMips();
		}

		if(flipY)gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

		this.image = pixels;
	}*/

  public updateImage(flipY: boolean = true): void {
    const gl = this.renderer.context;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

    this.bind();
    // if(flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, gl.RGBA, type, this.image);

    // if(flipY)gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  }

  public updateLevel(level: number, data: ArrayBufferView, flipY: boolean = true): void {
    const gl = this.renderer.context;
    const format = gl.RGBA;
    const type = this.useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

    const levelWidth: number = Math.floor(this.width / Math.pow(2, level));
    const levelHeight: number = Math.floor(this.height / Math.pow(2, level));

    this.bind();
    gl.texSubImage2D(gl.TEXTURE_2D, level, 0, 0, levelWidth, levelHeight, format, type, data);
  }

  destruct() {
    if (this.textureGL) {
      const gl = this.renderer.context;
      gl.deleteTexture(this.textureGL);
    }

    this.textureGL = null;
    this.renderer = null;

    // always call this last
    // super.destruct();
  }
}
export default Texture2D;
