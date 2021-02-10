/**
 * Created by mdavids on 06/10/2017.
 */

import IComponent from "./components/IComponent";
import { ArtboardObjectDef, Class } from './model/ArtboardDef';
import ArtboardFactory from './ArtboardFactory';
import Attributes from './Attributes';
import ArtboardContext from "./ArtboardContext";
import TransformComponent from "./components/TransformComponent";

export default class ArtboardObject implements ISerializable {

    protected _context: ArtboardContext;

    readonly _class: Class;
    protected _id: string;

    protected _components: IComponent[];
    protected _children: ArtboardObject[];

    protected _transform: TransformComponent;

    constructor(artboardObjectDef: ArtboardObjectDef ) {
        this._class = artboardObjectDef.class;
        this._id = artboardObjectDef.id;
        this._components = [];
        this._children = [];
    }

    public serialize(): ArtboardObjectDef {
        return {
            id: this._id,
            class: this._class,
            components: this._components.map(( component: IComponent ) => component.serialize() ),
            objects: this._children.map(( object: ArtboardObject ) => object.serialize() )
        }
    }

    public clone(): Promise<ArtboardObject> {
        const def: ArtboardObjectDef = this.serialize();
        return ArtboardFactory.CreateArtboardObject( this._context, def );
    }

    public getClass(): Class {
        return this._class;
    }

    public get transform(): TransformComponent {
        return this._transform;
    }

    public getComponentsByClass( clazz: Class ): IComponent[] {
        const results: IComponent[] = [];
        for ( const component of this._components ) {
            if ( component.getClass() === clazz ) {
                results.push( component );
            }
        }

        return results;
    }

    public getComponentByClass( clazz: Class ): IComponent {
        for ( const component of this._components ) {
            if ( component.getClass() === clazz ) {
                return component;
            }
        }

        return null;
    }

    public addComponent( component: IComponent ): void {
        let atIndex: number = -1;

        const length: number = this._components.length;
        for ( let i: number = 0; i < length; i++ ) {
            if ( component.priority < this._components[i].priority ) {
                atIndex = i;
                break;
            }
        }

        if ( atIndex < 0 ) {
            this._components.push( component );
        } else {
            this._components.splice( atIndex, 0, component );
        }

        component.onAdded();
    }

    public removeComponent( component: IComponent ): boolean {
        const index: number = this._components.indexOf( component );
        if ( index >= 0 ) {
            this._components.splice( index, 1 );
            component.onRemoved();

            return true;
        }

        return false;
    }

    public getChildren(): ArtboardObject[] {
        return this._children;
    }

    public getChildAt( index: number ): ArtboardObject {
        return this._children[index];
    }

    public getChildById( objectId: string ): ArtboardObject {
        if ( this._id === objectId ) {
            return this;
        }

        for ( const object of this._children ) {
            const foundObject = object.getChildById( objectId );
            if ( foundObject ) {
                return foundObject;
            }
        }

        return undefined;
    }

    public addChild( object: ArtboardObject ): void {
        this._children.push( object );
    }

    public removeChild( object: ArtboardObject ): boolean {
        const index: number = this._children.indexOf( object );

        if ( index >= 0 ) {
            this._children.splice( index, 1 );
            return true;
        }

        return false;
    }

    public getChildIndex( object: ArtboardObject ) {
        return this._children.indexOf( object );
    }

    public updateComponents(): void {
        this._components.forEach((component) => {
            component.update();
        });
    }

    public updateChildren(): void {
        this._children.forEach((child) => {
            child.update();
        });
    }

    public update(): void {
        this.updateComponents();
        this.updateChildren();
    }

    public destruct(): void {
        // TODO: Implement
    }
}
