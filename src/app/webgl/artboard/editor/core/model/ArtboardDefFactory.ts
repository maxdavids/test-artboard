import
{
    Class,
    ProjectDef,
    ArtboardObjectDef,
    ImageComponentDef,
    TransformComponentDef,
    DEF_VERSION,
} from "./ArtboardDef";

import { v4 as uuidv4 } from 'uuid';

export default class ArtboardDefFactory {

    public static CreateEmptyProjectDef(): ProjectDef {
        return {
            "version": DEF_VERSION,
            "id": uuidv4(),
            "class": Class.Project,
            "scene": this.CreateEmptyArtboardObject()
        }
    }

    public static CreateEmptyArtboardObject(): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            components: [
                ArtboardDefFactory.CreateTransformComponentDef()
            ],
            objects: []
        };
    }

    public static CreateImageObjectDef( assetId: string, assetUrl: string ): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            components: [
                ArtboardDefFactory.CreateTransformComponentDef(),
                ArtboardDefFactory.CreateImageComponentDef( assetId, assetUrl )
            ],
            objects: []
        };
    }

    public static CreateTransformComponentDef(): TransformComponentDef {
        return {
            id: uuidv4(),
            class: Class.TransformComponent,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        }
    }

    public static CreateImageComponentDef( id: string, url: string ): ImageComponentDef {
        return {
            id: id,
            class: Class.ImageComponent,
            src: url
        }
    }
}
