import ArrayBuffer from './ArrayBuffer';
import Renderer from './Renderer';
import Material from './Material';
import Camera from './Camera';
import Renderable from './Renderable';

/**
 * Created by mdavids on 18/04/2016.
 */
class Mesh {
  public instances: number = 0;

  protected _indexBuffer: WebGLBuffer;
  protected _indices: Uint16Array;

  protected _arrayBuffers: ArrayBuffer[] = [];

  protected _renderer: Renderer;
  protected _vertexCount: number;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
    this._vertexCount = 0;
  }

  public addArrayBuffer(buffer: ArrayBuffer, overwrite: boolean = true): void {
    let index: number = -1;
    for (let i: number = 0; i < this._arrayBuffers.length; i += 1) {
      if (this._arrayBuffers[i].name === buffer.name) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      this._arrayBuffers.push(buffer);
    } else {
      if (overwrite) this._arrayBuffers[index].destruct();
      this._arrayBuffers[index] = buffer;
    }

    if (buffer.name === 'aPos') {
      this._vertexCount = buffer.data.length / buffer.components;
    }
  }

  public getArrayBuffer(attribute: string): ArrayBuffer {
    const index: number = -1;
    for (let i: number = 0; i < this._arrayBuffers.length; i += 1) {
      if (this._arrayBuffers[i].name === attribute) {
        return this._arrayBuffers[i];
      }
    }

    return null;
  }

  public setVertexData(data: Float32Array) {
    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aPos', 3));
  }

  public getVertexBuffer(): ArrayBuffer {
    return this.getArrayBuffer('aPos');
  }

  public setUVData(data: Float32Array) {
    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aUV', 2));
  }

  public getUVBuffer(): ArrayBuffer {
    return this.getArrayBuffer('aUV');
  }

  public setVertexColorData(data: Float32Array) {
    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aColor', 3));
  }

  public getVertexColorBuffer(): ArrayBuffer {
    return this.getArrayBuffer('aColor');
  }

  public setNormals(data: Float32Array) {
    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aNormal', 3));
  }

  public getNormals(): ArrayBuffer {
    return this.getArrayBuffer('aNormal');
  }

  public setTangents(data: Float32Array) {
    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aTangent', 4));
  }

  public setIndices(indices: Uint16Array) {
    const gl: WebGLRenderingContext = this._renderer.context;
    this._indices = indices;
    this._indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
  }

  public getIndices(): Uint16Array {
    return this._indices;
  }

  public createBarycentricBuffer(): void {
    const length: number = this.getArrayBuffer('aPos').data.length;
    const data: Float32Array = new Float32Array(length);

    for (let i: number = 0; i < length; i += 9) {
      data[i + 0] = 1;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
      data[i + 4] = 1;
      data[i + 5] = 0;
      data[i + 6] = 0;
      data[i + 7] = 0;
      data[i + 8] = 1;
    }

    this.addArrayBuffer(new ArrayBuffer(this._renderer, data, 'aBC', 3));
  }

  public getNumVertices(): number {
    return this._vertexCount;
  }

  public draw(camera: Camera, material: Material, renderable: Renderable): void {
    const gl: WebGLRenderingContext = this._renderer.context;

    material.setActive();

    const buffersCount: number = this._arrayBuffers.length;
    for (let i: number = 0; i < buffersCount; i += 1) {
      this._arrayBuffers[i].enableFor(material.shader);
    }

    material.setUniforms(camera, renderable);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.getArrayBuffer('aPos').buffer);

    if (this._indices) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
      gl.drawElements(material._drawType, this._indices.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(material._drawType, 0, this._vertexCount);
    }
  }

  destruct() {
    const gl: WebGLRenderingContext = this._renderer.context;

    if (this._indices) {
      gl.deleteBuffer(this._indexBuffer);
    }

    this._indexBuffer = null;
    this._indices = null;

    const buffersCount: number = this._arrayBuffers.length;
    for (let i: number = 0; i < buffersCount; i += 1) {
      this._arrayBuffers[i].destruct();
    }

    this._arrayBuffers = null;
    this._renderer = null;
  }
}
export default Mesh;
