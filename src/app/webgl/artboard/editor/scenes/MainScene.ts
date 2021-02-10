import Renderer from '../../../lib/renderer/core/Renderer';
import Clock from '../../../common/Clock';

/**
 * Created by mdavids on 14/03/2019.
 */
export class MainScene {
  public onLoaderUpdateCallback: (progress: number) => void;
  public onReadyCallback: () => void;
  public onErrorCallback: () => void;

  protected _canvas: HTMLCanvasElement;
  protected _retinaMultiplier: number = 0;

  protected _renderer: Renderer;

  protected _isLoading: boolean = false;
  protected _wasBuilt: boolean = false;

  protected _sceneTimeAcc: number = 0;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  public init(): boolean {
    this._canvas = this._renderer.getCanvas();

    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('WEBGL_depth_texture')) {
      return false;
    }
    if (!gl.getExtension('OES_standard_derivatives')) {
      return false;
    }

    return true;
  }

  protected buildScene(): void {
    this._retinaMultiplier = Math.floor(window.devicePixelRatio || 1);

    this._renderer.setClearColor(0, 0, 0, 0);
    this._renderer.clear();

    Clock.init();
    this._sceneTimeAcc = 0;

    this._wasBuilt = true;

    this.onReadyCallback();
  }

  protected onAssetsUpdate(progress: number): void {
    this.onLoaderUpdateCallback(progress);
  }

  protected onAssetsLoaded(): void {
    this._isLoading = false;
    this.buildScene();
  }

  public resize(width: number, height: number, redraw: boolean = true): void {
    if (!this._wasBuilt) return;

    const canvasWidth: number = Math.round(width);
    const canvasHeight: number = Math.round(height);

    if (redraw) {
      this.draw();
    }
  }

  public update(): void {
    if (!this._wasBuilt) {
      return;
    }

    this._sceneTimeAcc += Clock.deltaTime;
  }

  public draw(): void {
    if (!this._wasBuilt) {
      return;
    }
  }

  destruct() {
  }

  protected onLoadingError(): void {
    this.onErrorCallback();
  }

  protected initEventHandlers(): void {
  }
}
