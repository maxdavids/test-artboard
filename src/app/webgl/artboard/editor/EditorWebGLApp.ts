import {MainScene} from "./scenes/MainScene";
import { WebGLApp } from '../../common/WebGLApp';

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _scene: MainScene;

  protected onReady(): void {
    this._renderer.setClearColor(0, 0, 0, 1);
    this._renderer.clear();

    this._scene = new MainScene(this._renderer);

    const width = Math.max(this._canvasParent.offsetWidth, 1) * this._retinaMultiplier;
    const height = Math.max(this._canvasParent.offsetHeight, 1) * this._retinaMultiplier;
    this._scene.resize(width, height);
  }

  protected onUpdate(): void {
    this._scene.update();
  }

  protected onRender(): void {
    this._scene.draw();
  }

  protected onResize(): void {
    this._scene.resize(this.canvas.width, this.canvas.height);
  }

  protected onDestruct(): void {
    this._scene.destruct();
    this._scene = null;
  }
}
