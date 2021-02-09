/**
 * Created by mdavids on 31/10/2017.
 */
import * as PIXI from 'pixi.js';
import IComponent from "./IComponent";

interface IDisplayable extends IComponent {
    getDisplayObject():PIXI.DisplayObject;
}
export default IDisplayable;
