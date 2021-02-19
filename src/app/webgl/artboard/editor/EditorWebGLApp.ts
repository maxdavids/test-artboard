import { v4 as uuidv4 } from 'uuid';
import { WebGLApp } from '../common/WebGLApp';
import Project from "./core/Project";
import Factory from "./core/Factory";
import Context from "./core/Context";
import { TestProjectJSON } from './TestProjectJSON';
import EditorUI from './ui/EditorUI';
import { Buffer } from './core/Enumeratives';
import RenderTexture from '../../lib/renderer/core/RenderTexture';
import MaterialBlit from '../../lib/renderer/materials/MaterialBlit';

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _context: Context;

  protected _project: Project;
  protected _ui: EditorUI;

  protected _mainBuffer: RenderTexture;
  protected _indexesBuffer: RenderTexture;
  protected _blitMaterial: MaterialBlit;

  protected onReady(): void {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('OES_standard_derivatives')) {
      throw new Error('OES_standard_derivatives unavailable');
    }

    this._renderer.setClearColor(0, 0, 0, 1);
    this._context = Factory.CreateContext(this._renderer);

    this._mainBuffer = this._context.getBuffer(Buffer.Main);
    this._indexesBuffer = this._context.getBuffer(Buffer.Indexes);
    this._blitMaterial = new MaterialBlit(this._renderer);
    
    Factory.CreateProject(this._context, TestProjectJSON)
      .then((project) => {
        this._project = project;
        this._ui = new EditorUI(this._context);
      });
  }

  protected onRender(): void {
    // TODO Move to RenderingContext
    this._renderer.setRenderTarget(this._mainBuffer);
    this._renderer.clear();

    this._renderer.setRenderTarget(this._indexesBuffer);
    this._renderer.clear();

    this._project.update();

    this._renderer.blitToScreen(this._mainBuffer, this._blitMaterial);
  }

  protected onResize(): void {
    // TODO Move to RenderingContext
    const newWidth: number = this.canvas.width;
    const newHeight: number = this.canvas.height;

    this._mainBuffer.setTextureSize(newWidth, newHeight);
    this._indexesBuffer.setTextureSize(newWidth, newHeight);
    this._context.camera.setViewport(0, 0, newWidth, newHeight);
  }

  protected onDestruct(): void {
    this._ui.destruct();
    this._ui = null;

    this._project.destruct();
    this._project = null;
  }
}
