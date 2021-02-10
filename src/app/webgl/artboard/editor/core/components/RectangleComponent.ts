/**
 * Created by mdavids on 09/02/2021.
 */
import ArtboardObject from "../ArtboardObject";
import { Class, ComponentDef, RectangleComponentDef } from '../model/ArtboardDef';
import IComponent from "./IComponent";
import Factory from '../Factory';
import Context from '../Context';
import RectangleMaterial from "./materials/RectangleMaterial";
import Renderable from "../../../../lib/renderer/core/Renderable";
import Material from "../../../../lib/renderer/core/Material";
import MeshQuad from "../../../../lib/renderer/core/MeshQuad";

export default class ImageComponent implements IComponent {

    public readonly priority: number = 1000;

    readonly _owner: ArtboardObject;
    readonly _id: string;
    readonly _class: Class;

    protected _context: Context;
    protected _width: number = 0;
    protected _height: number = 0;

    protected _renderable: Renderable;

    constructor( context: Context, owner: ArtboardObject, def: RectangleComponentDef ) {
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
            const material: Material = RectangleMaterial.Create(this._context.renderer);
            const mesh: MeshQuad = new MeshQuad(this._context.renderer);
            this._renderable = new Renderable(this._context.renderer, mesh, material);

            resolve();
        });
    }

    public serialize(): RectangleComponentDef {
        return {
            id: this._id,
            class: this._class,
            width: this._width,
            height: this._height,
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

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    public update(): void {
        this._renderable.draw(this._context.camera);
    }

    public onAdded(): void {

    }

    public onRemoved(): void {

    }

    public destruct(): void {
      // TODO: Implement
    }
}
