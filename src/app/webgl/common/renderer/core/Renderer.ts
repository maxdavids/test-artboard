// import Destructible from "../../../temple/core/Destructible";
import Material from './Material';
import MeshQuad from './MeshQuad';
import IRenderTarget from './IRenderTarget';
import Camera from './Camera';
import ITexture from './ITexture';
import Vector4 from './Vector4';
import Vector3 from './Vector3';

/**
 * Created by mdavids on 19/04/2016.
 * Based on the work by johan
 */
class Renderer /*extends Destructible*/ {
  public context: WebGLRenderingContext;

  private _quad: MeshQuad;
  private _canvas: HTMLCanvasElement;

  private _program: WebGLProgram;

  private _depthMask: boolean = true;
  private _depthTest: boolean = true;
  private _culling: number = -1;
  private _cullingEnabled: boolean = false;
  private _blendEquation: number = -1;
  private _blendEnabled: boolean = false;
  private _sourceBlend: number = -1;
  private _destinationBlend: number = -1;

  public renderWidth: number;
  public renderHeight: number;
  private _oldViewportX: number;
  private _oldViewportY: number;

  public currentRenderTarget: IRenderTarget;

  constructor(
    canvas: HTMLCanvasElement,
    { alpha, preserveDrawingBuffer, antialias }: {
      alpha: false,
      preserveDrawingBuffer: false,
      antialias: false,
    },
  ) {
    this._canvas = canvas;
    try {
      this.context = this._canvas.getContext('webgl', {
        alpha,
        preserveDrawingBuffer,
        antialias,
      }) as WebGLRenderingContext;
    } catch (e) {
      throw new Error('No 3D Context');
    }

    this._quad = new MeshQuad(this);
  }

  public init(): boolean {
    this.handleCanvasResize();
    this.setClearColor(0, 0, 0, 1);
    this.context.clearDepth(1);

    this.setDepthMask(this._depthMask, true);
    this.setDepthTest(this._depthTest, true);
    this.setCullingEnabled(this._cullingEnabled, true);
    this.setBlendEnabled(this._blendEnabled, true);

    return true;
  }
  public getCanvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public setClearColor(r: number, g: number, b: number, a: number): void {
    this.context.clearColor(r, g, b, a);
  }

  public setClearColorVec4(color: Vector4): void {
    this.context.clearColor(color.x, color.y, color.z, color.w);
  }

  public setClearColorVec3(color: Vector3): void {
    this.context.clearColor(color.x, color.y, color.z, 1);
  }

  // when rendering to a fbo, and depth does not seem to clear, try clearing after the draw.
  public clearDepth(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.clear(gl.DEPTH_BUFFER_BIT);
  }

  public clearColor(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public clear(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public setProgram(program: WebGLProgram, force: boolean = false): boolean {
    if (program !== this._program || force) {
      this._program = program;
      this.context.useProgram(this._program);
      return true;
    }
    return false;
  }

  public setDepthMask(value: boolean, force: boolean = false): void {
    if (value !== this._depthMask || force) {
      this.context.depthMask(value);
      this._depthMask = value;
    }
  }

  public setDepthTest(value: boolean, force: boolean = false): void {
    if (value !== this._depthTest || force) {
      const gl: WebGLRenderingContext = this.context;
      value ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
      this._depthTest = value;

      // console.log("Renderer::setDepthTest: " + value);
    }
  }

  public setCullingEnabled(value: boolean, force: boolean = false): void {
    if (value !== this._cullingEnabled || force) {
      const gl: WebGLRenderingContext = this.context;
      value ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
      this._cullingEnabled = value;

      // console.log("Renderer::setCullingEnabled: " + value);
    }
  }

  public setCulling(value: number, force: boolean = false): void {
    if (value !== this._culling || force) {
      const gl: WebGLRenderingContext = this.context;
      if (value === gl.NONE) {
        this.setCullingEnabled(false);
      } else {
        this.setCullingEnabled(true);
        gl.cullFace(value);
      }
      this._culling = value;
    }
  }

  public setBlendEquation(value: number, force: boolean = false): void {
    if (value !== this._blendEquation || force) {
      this.context.blendEquation(value);
      this._blendEquation = value;
    }
  }

  public setBlendEnabled(value: boolean, force: boolean = false): void {
    if (value !== this._blendEnabled || force) {
      const gl: WebGLRenderingContext = this.context;
      value ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND);
      this._blendEnabled = value;
    }
  }

  public setBlendFunc(source: number, destination: number, force: boolean = false): void {
    if (source !== this._sourceBlend || destination !== this._destinationBlend || force) {
      this.context.blendFunc(source, destination);
      this._sourceBlend = source;
      this._destinationBlend = destination;
    }
  }

  public setDepthCompareLess(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.depthFunc(gl.LESS);
  }

  public setDepthCompareGreater(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.depthFunc(gl.GREATER);
  }

  public setRenderTarget(rt: IRenderTarget): void {
    if (rt.getScaleToCanvas()) {
      rt.setSize(
        Math.round(this._canvas.width * rt.sizeMultiplier),
        Math.round(this._canvas.height * rt.sizeMultiplier),
      );
    }

    rt.setAsTarget();
    this.currentRenderTarget = rt;

    this.renderWidth = rt.width;
    this.renderHeight = rt.height;

    this.setViewport();
  }

  public unSetRenderTarget(): void {
    const gl = this.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this.currentRenderTarget = null;

    this.renderWidth = this._canvas.width;
    this.renderHeight = this._canvas.height;

    this.setViewport();
  }

  private setViewport(): void {
    // if (this._oldViewportX !== this.renderWidth || this._oldViewportY !== this.renderHeight) {
    this.context.viewport(0, 0, this.renderWidth, this.renderHeight);
    this._oldViewportX = this.renderWidth;
    this._oldViewportY = this.renderHeight;
    // }
  }

  public handleCanvasResize(): void {
    this.renderWidth = this._canvas.width;
    this.renderHeight = this._canvas.height;
    this.setViewport();
  }

  public blitInto(
    source: ITexture,
    destination: IRenderTarget,
    material: Material = null,
    camera: Camera = null,
    clear: boolean = true,
  ) {
    this.setRenderTarget(destination);

    if (clear) {
      this.clear();
    }

    material.setTexture(source);
    this._quad.draw(camera, material, null);

    this.unSetRenderTarget();
  }

  public blitToScreen(source: ITexture, material: Material, camera: Camera = null) {
    this.unSetRenderTarget();

    material.setTexture(source);
    this._quad.draw(camera, material, null);
  }

  destruct() {
    if (this._quad) {
      this._quad.destruct();
      this._quad = null;
    }

    this.context = null;

    // super.destruct();
  }
}
export default Renderer;
