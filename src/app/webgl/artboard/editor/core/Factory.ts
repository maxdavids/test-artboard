import ArtboardObject from './ArtboardObject';
import IComponent from './components/IComponent';
import { ArtboardObjectDef, ComponentDef, Class, ProjectDef } from './model/ArtboardDef';
//import AssetsLoader from './AssetsLoader';
import ImageComponent from './components/ImageComponent';
import Project from './Project';
import Context from './Context';
import { Buffer } from './Enumeratives';
import RenderTexture from '../../../lib/renderer/core/RenderTexture';
import Renderer from '../../../lib/renderer/core/Renderer';
import Camera from '../../../lib/renderer/core/Camera';
import TransformComponent from './components/TransformComponent';
import RectangleComponent from './components/RectangleComponent';

/**
 * Created by mdavids on 31/10/2017.
 */
export default class Factory {

    protected static COMPONENTS: Object = {
        [Class.ImageComponent]: ImageComponent,
        [Class.TransformComponent]: TransformComponent,
        [Class.RectangleComponent]: RectangleComponent,
    };

    protected static ARTBOARD_OBJECTS: Object = {
        [Class.ArtboardObject]: ArtboardObject,
    };

    /*public static CreateAssetsLoader(): AssetsLoader {
        return new AssetsLoader();
    }*/

    public static async CreateProject( context: Context, projectDef: ProjectDef ): Promise<Project> {
        const project: Project = new Project( context, projectDef );
        const scene: ArtboardObject = await Factory.CreateArtboardObject( context, projectDef.scene );
        project.scene = scene;

        return project;
    }

    public static CreateContext(renderer: Renderer): Context {
        const width:number = renderer.getCanvas().width;
        const height:number = renderer.getCanvas().height;
        const aspect: number = width / height;
        const context: Context = new Context();

        context.renderer = renderer;
        context.addBuffer(Buffer.Main, new RenderTexture(renderer, width, height, 1));
        context.addBuffer(Buffer.Indexes, new RenderTexture(renderer, width, height, 2));
        //const assetsLoader = assetLoader ? assetLoader : this.CreateAssetsLoader();
        //context.assetsLoader = assetsLoader;

        const fov: number = 40;
        const fovy: number = fov * 0.0174533;
        const orthoSize: number = 10;
        const camera: Camera = new Camera(renderer, fovy, 0.1, 1, aspect);
        camera.forceOrthogonal(orthoSize);
        camera.setViewport(0, 0, width, height);
        camera.getTransform().setPositionXYZ(0, 0, 0.5);
        context.camera = camera;

        return context;
    }

    public static async CreateArtboardObject( context: Context, artboardObjectDef: ArtboardObjectDef ): Promise<ArtboardObject> {
        const artboardObject: ArtboardObject = new Factory.ARTBOARD_OBJECTS[artboardObjectDef.class]( context, artboardObjectDef );

        for ( const componentDef of artboardObjectDef.components ) {
            const component: IComponent = await Factory.CreateComponent( context, artboardObject, componentDef );
            artboardObject.addComponent( component );
        }

        for ( const objectDef of artboardObjectDef.objects ) {
            const child: ArtboardObject = await Factory.CreateArtboardObject( context, objectDef );
            artboardObject.addChild( child );
        }

        return artboardObject;
    }

    public static async CreateComponent( context: Context, owner: ArtboardObject, componentDef: ComponentDef ): Promise<IComponent> {
        const component: IComponent = new Factory.COMPONENTS[componentDef.class]( context, owner, componentDef );
        await component.load();
        return component;
    }
}
