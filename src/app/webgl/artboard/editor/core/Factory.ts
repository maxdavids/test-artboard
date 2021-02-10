import ArtboardObject from './ArtboardObject';
import IComponent from './components/IComponent';
import { ArtboardObjectDef, ComponentDef, Class, ProjectDef } from './model/ArtboardDef';
import AssetsLoader from './AssetsLoader';
import ImageComponent from './components/ImageComponent';
import Project from './Project';
import Context from './Context';

/**
 * Created by mdavids on 31/10/2017.
 */
export default class Factory {

    protected static COMPONENTS: Object = {
        [Class.ImageComponent]: ImageComponent,
    };

    protected static ARTBOARD_OBJECTS: Object = {
        [Class.ArtboardObject]: ArtboardObject,
    };

    public static CreateAssetsLoader(): AssetsLoader {
        return new AssetsLoader();
    }

    public static async CreateProject( context: Context, projectDef: ProjectDef ): Promise<Project> {
        const project: Project = new Project( context, projectDef );
        const scene: ArtboardObject = await Factory.CreateArtboardObject( context, projectDef.scene );
        project.scene = scene;

        return project;
    }

    public static CreateContext( assetLoader?: AssetsLoader ): Context {
        const context: Context = new Context();
        const assetsLoader = assetLoader ? assetLoader : this.CreateAssetsLoader();
        context.assetsLoader = assetsLoader;
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
