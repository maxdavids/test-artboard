/**
 * Created by mdavids on 06/10/2017.
 */

import IComponent from "./components/IComponent";
import { ArtboardObjectDef, Class } from './model/ArtboardDef';
import ArtboardFactory from './ArtboardFactory';
import Attributes from './Attributes';
import ArtboardContext from "./ArtboardContext";

export default class ArtboardObject implements ISerializable {

    protected _context: ArtboardContext;

    readonly _class: Class;
    protected _id: string;

    protected _components: IComponent[];
    protected _objects: ArtboardObject[];

    protected _lastUpdateTime: number = 0;

    public attributes: Attributes;

    constructor(artboardObjectDef: ArtboardObjectDef ) {
        this._class = artboardObjectDef.class;
        this._id = artboardObjectDef.id;
        this._components = [];
        this._objects = [];

        this.attributes = artboardObjectDef.attributes;
    }

    public serialize(): ArtboardObjectDef {
        return {
            id: this._id,
            class: this._class,
            attributes: this.attributes,
            components: this._components.map(( component: IComponent ) => component.serialize() ),
            objects: this._objects.map(( object: ArtboardObject ) => object.serialize() )
        }
    }

    public clone(): Promise<ArtboardObject> {
        const def: ArtboardObjectDef = this.serialize();
        return ArtboardFactory.CreateArtboardObject( this._context, def );
    }

    public getClass(): Class {
        return this._class;
    }

    public getAttributes(): Attributes {
        return this.attributes;
    }

    public setAttributes( attributes: Attributes ): void {
        this.attributes = { ...this.attributes, ...attributes };
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
        return this._objects;
    }

    public getChildAt( index: number ): ArtboardObject {
        return this._objects[index];
    }

    public getChildById( objectId: string ): ArtboardObject {
        if ( this._id === objectId ) {
            return this;
        }

        for ( const object of this._objects ) {
            const foundObject = object.getChildById( objectId );
            if ( foundObject ) {
                return foundObject;
            }
        }

        return undefined;
    }

    public addChild( object: ArtboardObject ): void {
        this._objects.push( object );
    }

    public removeChild( object: ArtboardObject ): boolean {
        const index: number = this._objects.indexOf( object );

        if ( index >= 0 ) {
            this._objects.splice( index, 1 );
            return true;
        }

        return false;
    }

    public getChildIndex( object: ArtboardObject ) {
        return this._objects.indexOf( object );
    }

    public updateComponents( globalElapsedMillis: number ): void {
        for ( const component of this._components ) {
            component.update( globalElapsedMillis );
        }
    }

    public updateChildren( elapsedLocalTime: number ): void {
        for ( const child of this._objects ) {
            child.update( elapsedLocalTime );
        }
    }

    public update( globalElapsedMillis: number ): void {
        this._lastUpdateTime = globalElapsedMillis;

        this.updateComponents( globalElapsedMillis );
        this.updateChildren( globalElapsedMillis );
    }

    public destruct(): void {
        // TODO: Implement
    }
}
