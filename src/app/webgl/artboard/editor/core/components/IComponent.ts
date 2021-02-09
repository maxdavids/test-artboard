import ArtboardObject from "../ArtboardObject";
import { Class } from "../model/ArtboardDef";

/**
 * Created by mdavids on 31/10/2017.
 */
interface IComponent extends ISerializable {

    readonly priority: number;
    readonly _class: Class;
    readonly _owner: ArtboardObject;

    getClass(): Class;
    
    load(): Promise<void>;

    clone(newOwner:ArtboardObject): Promise<IComponent>;

    update(deltaTime:number):void;

    onAdded():void;
    onRemoved():void;

    destruct():void;
}
export default IComponent;
