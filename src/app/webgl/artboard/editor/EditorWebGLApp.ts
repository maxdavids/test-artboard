import { v4 as uuidv4 } from 'uuid';
import { WebGLApp } from '../common/WebGLApp';
import Project from "./core/Project";
import Factory from "./core/Factory";
import Context from "./core/Context";
import { TestProjectJSON } from './TestProjectJSON';
import ArtboardObject from './core/ArtboardObject';
import { Class, ProjectDef } from './core/model/ArtboardDef';
import ArtboardDefFactory from './core/model/ArtboardDefFactory';
import MouseComponent from './ui/components/MouseComponent';

/**
 * Created by mdavids on 10/02/2021.
 */
export class EditorWebGLApp extends WebGLApp {
  protected _context: Context;
  protected _project: Project;

  protected _mouseObject: ArtboardObject;

  private static async CreateObjects(context: Context, projectDef: ProjectDef): Promise<any> {
    const project: Project = await Factory.CreateProject(context, projectDef);
    const mouseObject: ArtboardObject = await Factory.CreateArtboardObject(context, ArtboardDefFactory.CreateEmptyArtboardObjectDef());
    mouseObject.addComponent(new MouseComponent(context, mouseObject));

    return {
      project: project,
      mouse: mouseObject
    }
  }

  protected onReady(): void {
    const gl: WebGLRenderingContext = this._renderer.context;
    if (!gl.getExtension('OES_standard_derivatives')) {
      throw new Error('OES_standard_derivatives unavailable');
    }

    this._renderer.setClearColor(0, 0, 0, 1);
    this._renderer.clear();

    this._context = Factory.CreateContext();
    
    EditorWebGLApp.CreateObjects(
      this._context,
      TestProjectJSON,
    ).then((objects) => {
      this._project = objects.project;
      this._mouseObject = objects.mouse;
    });
  }

  protected onUpdate(): void {
    
  }

  protected onRender(): void {
    this._project.update();
  }

  protected onResize(): void {
    
  }

  protected onDestruct(): void {
    this._project.destruct();
    this._project = null;
  }
}
