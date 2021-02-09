import
{
    Class,
    ProjectDef,
    ArtboardObjectDef,
    ImageComponentDef,
    AttributesDef,
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
            attributes: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                alpha: 1
            },
            components: [],
            objects: []
        };
    }

    public static CreateImageObjectDef( x: number, y: number, assetId: string, assetUrl: string ): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            attributes: {
                x: x,
                y: y,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                alpha: 1
            },
            components: [
                ArtboardDefFactory.CreateImageComponentDef( assetId, assetUrl )
            ],
            objects: []
        };
    }

    public static CreateImageComponentDef( id: string, url: string ): ImageComponentDef {
        return {
            id: id,
            class: Class.ImageComponent,
            src: url
        }
    }
}
