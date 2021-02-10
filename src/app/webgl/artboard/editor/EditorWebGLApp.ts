import { WebGLApp } from '../../common/WebGLApp';
import Project from "./core/Project";
import ArtboardFactory from "./core/ArtboardFactory";
import ArtboardContext from "./core/ArtboardContext";
import ArtboardDefFactory from "./core/model/ArtboardDefFactory";

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _context: ArtboardContext;
  protected _project: Project;

  protected onReady(): void {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('OES_standard_derivatives')) {
      throw new Error('OES_standard_derivatives unavailable');
    }

    this._renderer.setClearColor(0, 0, 0, 1);
    this._renderer.clear();

    this._context = ArtboardFactory.CreateContext();
    
    ArtboardFactory.CreateProject(
      this._context,
      ArtboardDefFactory.CreateEmptyProjectDef(),
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
