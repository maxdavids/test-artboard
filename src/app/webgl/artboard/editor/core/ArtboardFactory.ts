import ArtboardObject from './ArtboardObject';
import IComponent from './components/IComponent';
import { ArtboardObjectDef, ComponentDef, Class, ProjectDef } from './model/ArtboardDef';
import AssetsLoader from './AssetsLoader';
import ImageComponent from './components/ImageComponent';
import Project from './Project';
import ArtboardContext from './ArtboardContext';

/**
 * Created by mdavids on 31/10/2017.
 */
export default class ArtboardFactory {

    protected static COMPONENTS: Object = {
        [Class.ImageComponent]: ImageComponent,
    };

    protected static ARTBOARD_OBJECTS: Object = {
        [Class.ArtboardObject]: ArtboardObject,
    };

    public static CreateAssetsLoader(): AssetsLoader {
        return new AssetsLoader();
    }

    public static async CreateProject( context: ArtboardContext, projectDef: ProjectDef ): Promise<Project> {
        const project: Project = new Project( context, projectDef );
        const scene: ArtboardObject = await ArtboardFactory.CreateArtboardObject( context, projectDef.scene );
        project.scene = scene;

        return project;
    }

    public static CreateContext( assetLoader?: AssetsLoader ): ArtboardContext {
        const context: ArtboardContext = new ArtboardContext();
        const assetsLoader = assetLoader ? assetLoader : this.CreateAssetsLoader();
        context.assetsLoader = assetsLoader;
        return context;
    }

    public static async CreateArtboardObject( context: ArtboardContext, artboardObjectDef: ArtboardObjectDef ): Promise<ArtboardObject> {
        const artboardObject: ArtboardObject = new ArtboardFactory.ARTBOARD_OBJECTS[artboardObjectDef.class]( context, artboardObjectDef );

        for ( const componentDef of artboardObjectDef.components ) {
            const component: IComponent = await ArtboardFactory.CreateComponent( context, artboardObject, componentDef );
            artboardObject.addComponent( component );
        }

        for ( const objectDef of artboardObjectDef.objects ) {
            const child: ArtboardObject = await ArtboardFactory.CreateArtboardObject( context, objectDef );
            artboardObject.addChild( child );
        }

        return artboardObject;
    }

    public static async CreateComponent( context: ArtboardContext, owner: ArtboardObject, componentDef: ComponentDef ): Promise<IComponent> {
        const component: IComponent = new ArtboardFactory.COMPONENTS[componentDef.class]( context, owner, componentDef );
        await component.load();
        return component;
    }
}
