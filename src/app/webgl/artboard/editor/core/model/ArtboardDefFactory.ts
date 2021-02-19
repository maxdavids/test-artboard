import
{
    Class,
    ProjectDef,
    ArtboardObjectDef,
    ImageComponentDef,
    TransformComponentDef,
    CURRENT_VERSION,
    RectangleComponentDef,
} from "./ArtboardDef";

import { v4 as uuidv4 } from 'uuid';

export default class ArtboardDefFactory {

    public static CreateEmptyProjectDef(): ProjectDef {
        return {
            version: CURRENT_VERSION,
            id: uuidv4(),
            class: Class.Project,
            scene: this.CreateEmptyArtboardObjectDef()
        }
    }

    public static CreateEmptyArtboardObjectDef(): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            components: [
                ArtboardDefFactory.CreateTransformComponentDef()
            ],
            objects: []
        };
    }

    public static CreateRectangleObjectDef(width: number, height: number): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            components: [
                ArtboardDefFactory.CreateTransformComponentDef(),
                ArtboardDefFactory.CreateRectangleComponentDef(width, height),
            ],
            objects: []
        }
    }

    public static CreateImageObjectDef(assetId: string, assetUrl: string): ArtboardObjectDef {
        return {
            id: uuidv4(),
            class: Class.ArtboardObject,
            components: [
                ArtboardDefFactory.CreateTransformComponentDef(),
                ArtboardDefFactory.CreateImageComponentDef(assetId, assetUrl)
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

    public static CreateRectangleComponentDef(width: number, height: number): RectangleComponentDef {
        return {
            id: uuidv4(),
            class: Class.RectangleComponent,
            width: width,
            height: height,
            radius: [0.05, 0.05, 0.05, 0.05],
        }
    }

    public static CreateImageComponentDef(id: string, url: string): ImageComponentDef {
        return {
            id: id,
            class: Class.ImageComponent,
            src: url
        }
    }
}
