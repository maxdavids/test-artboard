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
            {
                id: uuidv4(),
                class: Class.ArtboardObject,
                components: [
                    {
                        id: uuidv4(),
                        class: Class.TransformComponent,
                        x: -200,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                    },
                    {
                        id: uuidv4(),
                        class: Class.RectangleComponent,
                        width: 300,
                        height: 200,
                        radius: [0.1, 0.2, 0.0, 0.3],
                    }
                ],
                objects: []
            },
            {
                id: uuidv4(),
                class: Class.ArtboardObject,
                components: [
                    {
                        id: uuidv4(),
                        class: Class.TransformComponent,
                        x: 512,
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
