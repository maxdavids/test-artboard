/**
 * Created by mdavids on 18/02/2021.
 */
import ArtboardObject from "../ArtboardObject";
import { ImageComponentDef, Class, ComponentDef } from '../model/ArtboardDef';
import IComponent from "./IComponent";
import Factory from '../Factory';
import Context from '../Context';
import MaterialTexture2D from "../../../../lib/renderer/materials/MaterialTexture2D";
import Texture2DLoader from "../../../../lib/renderer/loader/Texture2DLoader";
import MeshQuad from "../../../../lib/renderer/core/MeshQuad";
import Renderable from "../../../../lib/renderer/core/Renderable";
import Transform from "../../../../lib/renderer/core/Transform";
import RenderTexture from "../../../../lib/renderer/core/RenderTexture";
import { Buffer } from "../Enumeratives";

export default class ImageComponent implements IComponent {

    readonly _owner: ArtboardObject;

    // do not serialize
    public readonly priority: number = 1000;

    readonly _id: string;
    readonly _class: Class;
    protected _src: string;

    protected _context: Context;

    protected _asset: Texture2DLoader;
    protected _material: MaterialTexture2D;
    protected _renderable: Renderable;
    protected _transform: Transform;
    protected _globalTransform: Transform;

    protected _mainBuffer: RenderTexture;
    protected _indexBuffer: RenderTexture;

    constructor( context: Context, owner: ArtboardObject, def: ImageComponentDef ) {
        this._context = context;
        this._owner = owner;

        this._class = def.class;
        this._id = def.id;
        this._src = def.src;
    }

    public async load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._src) {
                this._asset = new Texture2DLoader(this._context.renderer, 4, this._src, this._src);
                this._asset.load(
                    () => {
                        const mesh: MeshQuad = new MeshQuad(this._context.renderer);
                        this._material = new MaterialTexture2D(this._context.renderer);
                        this._material.setTexture(this._asset);

                        this._renderable = new Renderable(this._context.renderer, mesh, this._material);
                        this._transform = this._renderable.getTransform();

                        this._mainBuffer = this._context.getBuffer(Buffer.Main);
                        this._indexBuffer = this._context.getBuffer(Buffer.Indexes);            

                        resolve();
                    },
                    () => {
                        console.log('texture not found');
                        resolve();
                    }
                );
            } else {
                resolve();
            }
        });
    }

    public serialize(): ImageComponentDef {
        let component = {
            id: this._id,
            class: this._class,
            src: this._src,
        };

        return component;
    }

    public async clone( newOwner: ArtboardObject = null ): Promise<IComponent> {
        const def: ComponentDef = this.serialize();
        const owner: ArtboardObject = newOwner ? newOwner : this._owner;

        return Factory.CreateComponent( this._context, owner, def );
    }

    public get src(): string {
        return this._src;
    }

    public height(): number {
        return this._transform.scale.x;
    }

    public width(): number {
        return this._transform.scale.y;
    }

    public getClass(): Class {
        return this._class;
    }

    public update(): void {
        this._transform.setPosition(this._globalTransform.position);

        // Note: This is not ideal, renderables should be added to render lists
        // to avoid state changes and to dynamically batch render objects
        // but I do not have the time to code one.
        this._context.renderer.setRenderTarget(this._mainBuffer);
        //this._material.indexMask = 0;
        this._renderable.draw(this._context.camera);

        /*this._context.renderer.setRenderTarget(this._indexBuffer);
        this._material.indexMask = 1;
        this._renderable.draw(this._context.camera);*/
    }

    public onAdded(): void {
        const index: number = this._context.indexList.addComponent(this);
        //this._material.index = index;

        this._globalTransform = this._owner.transform.globalTransform;
        this._transform.setPosition(this._globalTransform.position);
    }

    public onRemoved(): void {
        this._context.indexList.removeComponent(this);
        //this._material.index = 0;
    }

    public destruct(): void {
      // TODO: Implement
    }
}
