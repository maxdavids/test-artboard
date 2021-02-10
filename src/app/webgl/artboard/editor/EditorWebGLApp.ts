import { WebGLApp } from '../../common/WebGLApp';
import Project from "./core/Project";
import Factory from "./core/Factory";
import Context from "./core/Context";
import { TestProjectJSON } from './TestProjectJSON';

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _context: Context;
  protected _project: Project;

  protected onReady(): void {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('OES_standard_derivatives')) {
      throw new Error('OES_standard_derivatives unavailable');
    }

    this._renderer.setClearColor(0, 0, 0, 1);
    this._renderer.clear();

    this._context = Factory.CreateContext();
    
    Factory.CreateProject(
      this._context,
      TestProjectJSON,
    ).then((project) => {
      this._project = project;
    });
  }

  protected onUpdate(): void {
    
  }

  protected onRender(): void {
    
  }

  protected onResize(): void {
    
  }

  protected onDestruct(): void {
    this._project.destruct();
    this._project = null;
  }
}
