import { v4 as uuidv4 } from 'uuid';
import { Class, CURRENT_VERSION } from './core/model/ArtboardDef';
import ArtboardDefFactory from './core/model/ArtboardDefFactory';

/**
 * Created by mdavids on 10/02/2021.
 */
export const TestProjectJSON = {
    id: uuidv4(),
    version: CURRENT_VERSION,
    class: Class.Project,
    scene: {
        id: uuidv4(),
        class: Class.ArtboardObject,
        components: [
            ArtboardDefFactory.CreateTransformComponentDef(),
        ],
        objects: [
            ArtboardDefFactory.CreateRectangleObjectDef(10, 10),
        ]
    }
}
