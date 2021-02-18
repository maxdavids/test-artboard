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
            {
                id: uuidv4(),
                class: Class.TransformComponent,
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
            },
        ],
        objects: [
            ArtboardDefFactory.CreateRectangleObjectDef(10, 10),
            {
                id: uuidv4(),
                class: Class.ArtboardObject,
                components: [
                    {
                        id: uuidv4(),
                        class: Class.TransformComponent,
                        x: 5,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                    },
                    {
                        id: uuidv4(),
                        class: Class.ImageComponent,
                        src: 'assets/webgl/textures/test_image.jpg'
                    }
                ],
                objects: []
            }
        ]
    }
}
