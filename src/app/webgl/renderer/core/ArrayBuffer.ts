import Renderer from './Renderer';
import Shader from './Shader';

/**
 * Created by mdavids on 26/04/2017.
 */
class ArrayBuffer {
  public data: Float32Array;
  public buffer: WebGLBuffer;
  public elementSize: number;

  public name: string;
  public components: number;

  private _size: number = 0;
  private _renderer: Renderer;

  constructor(renderer: Renderer, data: Float32Array, attribute: string, size: number) {
    this.name = attribute;
    this.components = size;

    this._renderer = renderer;
    this._size = size;

    const gl: WebGLRenderingContext = this._renderer.context;
    this.buffer = gl.createBuffer();
    this.setData(data);
  }

  public setData(data: Float32Array) {
    this.data = data;
    if (data.length === 0) {
      throw 'ArrayBuffer: No data';
    }
    const gl: WebGLRenderingContext = this._renderer.context;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

    this.elementSize = data.BYTES_PER_ELEMENT;
  }

  public getBufferLength(): number {
    const gl: WebGLRenderingContext = this._renderer.context;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    return gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) / 4;
  }

  public enableFor(shader: Shader): void {
    if (shader.attributes[this.name] !== undefined) {
      const gl: WebGLRenderingContext = this._renderer.context;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      const aLoc: number = shader.attributes[this.name];
      gl.enableVertexAttribArray(aLoc);
      gl.vertexAttribPointer(aLoc, this._size, gl.FLOAT, false, this._size * this.elementSize, 0);
    }
  }

  destruct() {
    const gl: WebGLRenderingContext = this._renderer.context;
    gl.deleteBuffer(this.buffer);

    this.buffer = null;
    this.data = null;

    this._renderer = null;
  }
}

export default ArrayBuffer;
