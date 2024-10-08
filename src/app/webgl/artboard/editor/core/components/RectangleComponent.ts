/**
 * Created by mdavids on 09/02/2021.
 */
import ArtboardObject from "../ArtboardObject";
import { Class, ComponentDef, RectangleComponentDef } from '../model/ArtboardDef';
import IComponent from "./IComponent";
import Factory from '../Factory';
import Context from '../Context';
import { Buffer } from '../Enumeratives';
import RectangleMaterial from "./materials/RectangleMaterial";
import Renderable from "../../../../lib/renderer/core/Renderable";
import MeshQuad from "../../../../lib/renderer/core/MeshQuad";
import RenderTexture from "../../../../lib/renderer/core/RenderTexture";
import Transform from "../../../../lib/renderer/core/Transform";
import Vector4 from "../../../../lib/renderer/core/Vector4";

export default class ImageComponent implements IComponent {

    public readonly priority: number = 1000;

    readonly _owner: ArtboardObject;
    readonly _id: string;
    readonly _class: Class;

    protected _context: Context;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _radius: number[] = [0, 0, 0, 0];

    protected _mainBuffer: RenderTexture;
    protected _indexBuffer: RenderTexture;
    protected _material: RectangleMaterial;
    protected _renderable: Renderable;
    protected _transform: Transform;
    protected _globalTransform: Transform;

    constructor( context: Context, owner: ArtboardObject, def: RectangleComponentDef ) {
        this._context = context;
        this._owner = owner;

        let { class:clazz, id, width, height, radius } = def;

        this._class = clazz;
        this._id = id;
        this._width = width;
        this._height = height;
        this._radius = radius;
    }

    public async load(): Promise<void> {
        return new Promise<void>(( resolve, reject ) => {
            const mesh: MeshQuad = new MeshQuad(this._context.renderer);
            this._material = new RectangleMaterial(this._context.renderer);
            this._material.aspect = this._width / this._height;
            this._material.radius = new Vector4(this._radius[0], this._radius[1], this._radius[2], this._radius[3]);
            this._renderable = new Renderable(this._context.renderer, mesh, this._material);
            this._transform = this._renderable.getTransform();

            this._mainBuffer = this._context.getBuffer(Buffer.Main);
            this._indexBuffer = this._context.getBuffer(Buffer.Indexes);

            resolve();
        });
    }

    public serialize(): RectangleComponentDef {
        return {
            id: this._id,
            class: this._class,
            width: this._width,
            height: this._height,
            radius: [...this._radius],
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

    public get radius(): number[] {
        return this._radius;
    }

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    public update(): void {
        this._transform.setPosition(this._globalTransform.position);

        // Note: This is not ideal, renderables should be added to render lists
        // to avoid state changes and to dynamically batch render objects
        // but I do not have the time to code one.
        this._context.renderer.setRenderTarget(this._mainBuffer);
        this._material.indexMask = 0;
        this._renderable.draw(this._context.camera);

        this._context.renderer.setRenderTarget(this._indexBuffer);
        this._material.indexMask = 1;
        this._renderable.draw(this._context.camera);
    }

    public onAdded(): void {
        const index: number = this._context.indexList.addComponent(this);
        this._material.index = index;

        this._globalTransform = this._owner.transform.globalTransform;
        this._transform.setPosition(this._globalTransform.position);
        this._transform.setScaleXYZ(this._width, this._height, 1);
    }

    public onRemoved(): void {
        this._context.indexList.removeComponent(this);
        this._material.index = 0;
    }

    public destruct(): void {
      // TODO: Implement
    }
}
