import { ProjectDef, Class, DEF_VERSION } from './model/ArtboardDef';
import ArtboardObject from './ArtboardObject';
import ArtboardContext from './ArtboardContext';

export default class Project {
    readonly _id: string;
    readonly _class: Class;

    protected _context: ArtboardContext;
    protected _scene: ArtboardObject;

    constructor( context: ArtboardContext, def: ProjectDef ) {
        this._context = context;
        this._id = def.id;
        this._class = def.class;

        this._scene = undefined;
    }

    public serialize(): ProjectDef {
        return {
            id: this._id,
            class: this._class,
            version: DEF_VERSION,
            scene: this._scene.serialize(),
        };
    }

    public get scene(): ArtboardObject {
        return this._scene;
    }

    public set scene( value: ArtboardObject ) {
        this._scene = value;
    }

    public update( globalElapsedMillis: number ): void {
        this._scene.update( globalElapsedMillis );
    }

    public get id(): string {
        return this._id;
    }

    public destruct(): void {
        // TODO: Implement
    }
}
