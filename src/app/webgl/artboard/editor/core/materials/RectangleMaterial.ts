/**
 * Created by mdavids on 09/02/2021.
 */

import Material from "../../../../lib/renderer/core/Material";
import Renderer from "../../../../lib/renderer/core/Renderer";
import Shader from "../../../../lib/renderer/core/Shader";

export default class RectangleMaterial {

    private static Fragment: string = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1.0);
        }
    `;

    public static Create( renderer: Renderer ): Material {
        const name: string = 'RectangleMaterial';
        const shader: Shader = new Shader( renderer );
        const material: Material = new Material( renderer, name, shader );

        return material;
    }
}
