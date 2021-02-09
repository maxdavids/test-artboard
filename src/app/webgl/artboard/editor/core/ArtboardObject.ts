/**
 * Created by mdavids on 06/10/2017.
 */

import IComponent from "./components/IComponent";
import IDisplayable from "./components/IDisplayable";
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

    /**
     * Type Guard because TypeScript
     */
    protected isDisplayable( component: IComponent ): component is IDisplayable {
        return ( component as any ).getDisplayObject !== undefined; // tslint:disable-line:no-any
    }

    public addComponent( component: IComponent ): void {
        // components are ordered by priority
        let atIndex: number = -1;
        let lastDisplayable: IDisplayable;

        const length: number = this._components.length;
        for ( let i: number = 0; i < length; i++ ) {
            if ( this.isDisplayable( this._components[i] ) ) {
                lastDisplayable = this._components[i] as IDisplayable;
            }

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

    public getArtboardObjects(): ArtboardObject[] {
        return this._objects;
    }

    public getArtboardObjectsQty(): number {
        return this._objects.length;
    }

    public getArtboardObjectAt( index: number ): ArtboardObject {
        return this._objects[index];
    }

    public getObjectById( objectId: string ): ArtboardObject {
        if ( this._id === objectId ) {
            return this;
        }

        for ( const object of this._objects ) {
            const foundObject = object.getObjectById( objectId );
            if ( foundObject ) {
                return foundObject;
            }
        }

        return undefined;
    }

    public addArtboardObject( object: ArtboardObject ): void {
        this._objects.push( object );
    }

    public removeArtboardObject( object: ArtboardObject ): boolean {
        const index: number = this._objects.indexOf( object );

        if ( index >= 0 ) {
            this._objects.splice( index, 1 );
            return true;
        }

        return false;
    }

    public setObjectIndex( object: ArtboardObject, newIndex: number ): void {
        const oldIndex: number = this.getObjectIndex( object );
        if ( oldIndex >= 0 && newIndex >= 0 && newIndex < this._objects.length && oldIndex !== newIndex ) {
            this._objects.splice( oldIndex, 1 );
            this._objects.splice( newIndex, 0, object );
        }
    }

    public getObjectIndex( object: ArtboardObject ) {
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
