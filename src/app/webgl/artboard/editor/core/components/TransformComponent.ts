import { Class, TransformComponentDef, ComponentDef } from '../model/ArtboardDef';
import ArtboardObject from '../ArtboardObject';
import Transform from '../../../../lib/renderer/core/Transform';
import IComponent from './IComponent';
import Context from '../Context';
import Factory from '../Factory';

export default class TransformComponent implements IComponent {
    public readonly priority: number = 0;

    readonly _owner: ArtboardObject;
    readonly _id: string;
    readonly _class: Class;

    protected _context: Context;
    protected _localTransform: Transform;
    protected _globalTransform: Transform;

    constructor( context: Context, owner: ArtboardObject, def: TransformComponentDef ) {
        this._context = context;
        this._owner = owner;

        this._localTransform = new Transform();
        this._globalTransform = new Transform();

        let { class:clazz, id, x, y, scaleX, scaleY, rotation } = def;

        this._class = clazz;
        this._id = id;
        this._globalTransform.setPositionXYZ(x, y, 0);
        this._globalTransform.setScaleXYZ(scaleX, scaleY, 1);
        this._globalTransform.setRotationXYZ(0, rotation, 0);
    }

    public async load(): Promise<void> {
        return new Promise<void>(( resolve, reject ) => {
            resolve();
        });
    }

    public serialize(): TransformComponentDef {
        // TODO
        const rotation: number = 0;

        return {
            id: this._id,
            class: this._class,
            x: this._globalTransform.position.x,
            y: this._globalTransform.position.y,
            scaleX: this._globalTransform.scale.x,
            scaleY: this._globalTransform.scale.y,
            rotation: rotation,
        };
    }

    public async clone( newOwner: ArtboardObject = null ): Promise<IComponent> {
        const def: ComponentDef = this.serialize();
        const owner: ArtboardObject = newOwner ? newOwner : this._owner;

        return Factory.CreateComponent( this._context, owner, def );
    }

    public getClass(): Class {
        return this._class;
    }

    public get localTransform(): Transform {
        return this._localTransform;
    }

    public get globalTransform(): Transform {
        return this._globalTransform;
    }

    public update(): void {

    }

    public onAdded(): void {

    }

    public onRemoved(): void {

    }

    public destruct(): void {
        // TODO: Implement
    }
}
