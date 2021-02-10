import Renderer from '../../lib/renderer/core/Renderer';
import Clock from './Clock';

/**
 * Created by mdavids on 02/01/2019.
 */
export class WebGLApp {
    public static FPS_DELTA: number = 1 / 30;

    public canvas: HTMLCanvasElement;
    protected _canvasParent: HTMLElement;
    protected _autoResize: boolean;
    protected _resizeHandler: any;

    protected _updateFrameID: number = 0;
    protected _deltaTimeAcc: number = 0;

    protected _renderer: Renderer;
    protected _retinaMultiplier: number = 1;
    protected _canDraw: boolean = false;

    protected _onReady: Function;
    protected _onError: Function;

    protected _startTime: number = 0;
    protected _lastTime: number = 0;

    public constructor() {}

    public init({
        onError,
        canvas,
    }: {
        onError: Function;
        canvas: HTMLElement;
    }) {
        this._canvasParent = canvas;
        this._autoResize = true;
        this._onError = onError;

        if (!canvas) {
            this._autoResize = false;
        }

        this.canvas = this.prepareCanvas(canvas);
        this._renderer = new Renderer(this.canvas, { alpha:false, preserveDrawingBuffer:false, antialias:false });

        if (!this._renderer.init()) {
            this._onError();

        } else {
            this._canDraw = true;
            this._startTime = new Date().getTime();
            this._lastTime = this._startTime;
            this._deltaTimeAcc = 0;
        
            Clock.init();

            this.pause();
            this.update();

            this.onReady();
        }
    }

    public destruct(): void {
        this.pause();
        this._canDraw = false;

        this.onDestruct();

        if (this._renderer) {
            this._renderer.destruct();
        }

        this._renderer = null;

        if (this._canvasParent && this.canvas) {
            this._canvasParent.removeChild(this.canvas);
        }

        this._canvasParent = null;
        this.canvas = null;
    }

    public pause(): void {
        if (this._updateFrameID != 0) {
            window.cancelAnimationFrame(this._updateFrameID);
        }

        this._updateFrameID = 0;
    }

    public resume(): void {
        this.pause();

        if (this._updateFrameID == 0) {
            this._updateFrameID = window.requestAnimationFrame(() => this.update());
        }
    }

    protected onReady(): void {
        
    }

    protected onUpdate(): void {
        
    }

    protected onRender(): void {

    }

    protected onResize(): void {

    }

    protected onDestruct(): void {

    }

    private prepareCanvas(canvasParent: HTMLElement): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');

        const width: number = window.innerWidth;
        const height: number = window.innerHeight;

        canvas.style.position = 'absolute';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        this._retinaMultiplier = Math.floor(window.devicePixelRatio || 1);

        canvas.width = width * this._retinaMultiplier;
        canvas.height = height * this._retinaMultiplier;

        if (canvasParent) {
            canvasParent.appendChild(canvas);
        }

        if (this._autoResize) {
            this._resizeHandler = <any>this.handleResize.bind(this);
            window.addEventListener('resize', this._resizeHandler);
        }

        return canvas;
    }

    private handleResize(): void {
        if (!this._canvasParent) return;

        const width = Math.max(this._canvasParent.offsetWidth, 1);
        const height = Math.max(this._canvasParent.offsetHeight, 1);

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        const realToCSSPixels = Math.floor(window.devicePixelRatio || 1);

        this.canvas.width = width * realToCSSPixels;
        this.canvas.height = height * realToCSSPixels;

        this.onResize();

        this._renderer.unSetRenderTarget();

        this.pause();
        this.update();
    }

    private update = (): void => {
        this._updateFrameID = window.requestAnimationFrame(this.update);

        let currentTime: number = Date.now();
        let deltaTime: number = currentTime - this._lastTime;
        deltaTime = Math.min(deltaTime * 0.001, 1);

        this._lastTime = currentTime;
        this._deltaTimeAcc += deltaTime;

        if (this._deltaTimeAcc < WebGLApp.FPS_DELTA) {
            return;
        }

        this._deltaTimeAcc -= WebGLApp.FPS_DELTA;

        Clock.update();

        this.onUpdate();
        this.draw();
    };

    private draw(): void {
        if (!this._canDraw) {
            return;
        }

        this._renderer.setDepthMask(true);
        this._renderer.setDepthTest(true);

        this.onRender();
    }
}
