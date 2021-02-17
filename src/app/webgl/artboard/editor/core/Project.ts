import { ProjectDef, Class, CURRENT_VERSION } from './model/ArtboardDef';
import ArtboardObject from './ArtboardObject';
import Context from './Context';

export default class Project {
    readonly _id: string;
    readonly _class: Class;

    protected _context: Context;
    protected _scene: ArtboardObject;

    constructor( context: Context, def: ProjectDef ) {
        this._context = context;
        this._id = def.id;
        this._class = def.class;
    }

    public serialize(): ProjectDef {
        return {
            id: this._id,
            class: this._class,
            version: CURRENT_VERSION,
            scene: this._scene.serialize(),
        };
    }

    public get scene(): ArtboardObject {
        return this._scene;
    }

    public set scene( value: ArtboardObject ) {
        this._scene = value;
    }

    public update(): void {
        this._scene.update();
    }

    public get id(): string {
        return this._id;
    }

    public destruct(): void {
        // TODO: Implement
    }
}
