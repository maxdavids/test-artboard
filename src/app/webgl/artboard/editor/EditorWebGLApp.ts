import { v4 as uuidv4 } from 'uuid';
import { WebGLApp } from '../common/WebGLApp';
import Project from "./core/Project";
import Factory from "./core/Factory";
import Context from "./core/Context";
import { TestProjectJSON } from './TestProjectJSON';
import EditorUI from './ui/EditorUI';
import { Buffer } from './core/Enumeratives';

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _context: Context;

  protected _project: Project;
  protected _ui: EditorUI;

  protected onReady(): void {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('OES_standard_derivatives')) {
      throw new Error('OES_standard_derivatives unavailable');
    }

    this._renderer.setClearColor(0, 0, 0, 1);
    this._context = Factory.CreateContext();
    
    Factory.CreateProject(this._context, TestProjectJSON)
      .then((project) => {
        this._project = project;
        this._ui = new EditorUI(this._context);
      });
  }

  protected onRender(): void {
    // TODO Move to RenderingContext::clear()
    this._renderer.setRenderTarget(this._context.getBuffer(Buffer.Main));
    this._renderer.clear();

    this._renderer.setRenderTarget(this._context.getBuffer(Buffer.Indexes));
    this._renderer.clear();

    this._project.update();
  }

  protected onDestruct(): void {
    this._ui.destruct();
    this._ui = null;

    this._project.destruct();
    this._project = null;
  }
}
