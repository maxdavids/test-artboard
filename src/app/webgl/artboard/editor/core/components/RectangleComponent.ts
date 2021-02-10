/**
 * Created by mdavids on 09/02/2021.
 */
import ArtboardObject from "../ArtboardObject";
import { Class, ComponentDef, RectangleComponentDef } from '../model/ArtboardDef';
import IComponent from "./IComponent";
import ArtboardFactory from '../ArtboardFactory';
import ArtboardContext from '../ArtboardContext';

export default class ImageComponent implements IComponent {

    public readonly priority: number = 1000;

    readonly _owner: ArtboardObject;
    readonly _id: string;
    readonly _class: Class;

    protected _context: ArtboardContext;
    protected _width: number = 0;
    protected _height: number = 0;

    constructor( context: ArtboardContext, owner: ArtboardObject, def: RectangleComponentDef ) {
        this._context = context;
        this._owner = owner;

        let { class:clazz, id, width, height } = def;

        this._class = clazz;
        this._id = id;
        this._width = width;
        this._height = height;
    }

    public async load(): Promise<void> {
        return new Promise<void>(( resolve, reject ) => {
            resolve();
        });
    }

    public serialize(): RectangleComponentDef {
        let component = {
            id: this._id,
            class: this._class,
            width: this._width,
            height: this._height,
        };

        return component;
    }

    public async clone( newOwner: ArtboardObject = null ): Promise<IComponent> {
        const def: ComponentDef = this.serialize();
        const owner: ArtboardObject = newOwner ? newOwner : this._owner;

        return ArtboardFactory.CreateComponent( this._context, owner, def );
    }

    public getClass(): Class {
        return this._class;
    }

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    public update( elapsedTime: number ): void {

    }

    public onAdded(): void {

    }

    public onRemoved(): void {

    }

    public destruct(): void {
      // TODO: Implement
    }
}
