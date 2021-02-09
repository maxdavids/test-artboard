/**
 * Created by mdavids on 31/10/2017.
 */
import * as PIXI from 'pixi.js';
import IDisplayable from "./IDisplayable";
import ArtboardObject from "../ArtboardObject";
import AssetsLoader from "../AssetsLoader";
import { ImageComponentDef, Class, ComponentDef } from '../model/ArtboardDef';
import IComponent from "./IComponent";
import ArtboardFactory from '../ArtboardFactory';

// We are using gifuct-js that is no a module, it exposes GIF as a global
import  "./gif/gifuct-js.min.js";
import ArtboardContext from '../ArtboardContext';
declare var GIF: any; // tslint:disable-line:no-any

export default class ImageComponent extends PIXI.Container implements IDisplayable {

    readonly _owner: ArtboardObject;

    // do not serialize
    public readonly priority: number = 1000;

    readonly _id: string;
    readonly _class: Class; //'image' | 'background';
    protected _src: string;

    protected _context: ArtboardContext;

    protected _sprite: PIXI.Sprite;
    protected _frames: PIXI.Texture[] = [];

    protected _canAnimate: boolean = false; // canAnimate is true when imageComponent has frames > 0
    protected _canLoop: boolean = true;

    protected _isEnabled: boolean = true;

    protected _currentFrameIndex: number = 0;
    protected _frameDelay: number = 0;
    protected _totalAnimTime: number = 0;
    protected _sharpening: string = `
        precision mediump float;

        uniform sampler2D uSampler;
        uniform vec4 filterArea;
        uniform vec2 dimensions;

        uniform float uStrength;

        varying vec2 vTextureCoord;

        void main() {
          vec2 uv = vTextureCoord;
          vec2 texelSize = 1.0 / filterArea.xy;
          vec4 color = texture2D(uSampler, uv);

          vec4 blur = texture2D(uSampler, uv + vec2(0.5 * texelSize.x, -texelSize.y));
          blur += texture2D(uSampler, uv + vec2(-texelSize.x, 0.5 * -texelSize.y));
          blur += texture2D(uSampler, uv + vec2(texelSize.x, 0.5 * texelSize.y));
          blur += texture2D(uSampler, uv + vec2(0.5 * -texelSize.x, texelSize.y));
          blur /= 4.0;

          vec4 lumaStrength = vec4(0.2126, 0.7152, 0.0722, 0.0) * uStrength * 0.7;
          vec4 sharp = color - blur;
          color.xyz += clamp(dot(sharp, lumaStrength), -0.5, 0.5);

          gl_FragColor = vec4(color);
        }
        `.split( '\n' ).reduce(( c, a ) => c + a.trim() + '\n' );

    constructor( context: ArtboardContext, owner: ArtboardObject, def: ImageComponentDef ) {
        super();

        this._context = context;
        this._owner = owner;

        this._class = def.class;
        this._id = def.id;
        this._src = def.src;

        this._canLoop = def.loop;
    }

    public async load(): Promise<void> {
        return new Promise<void>(( resolve, reject ) => {

            if ( this._src ) {
                this._context.getAssetsLoader().push(
                    {
                        id: this._id,
                        src: this._src
                    },
                    () => {
                        this.addContent( this._id );
                        resolve();

                        //TODO: Falta exception cases
                        // reject();
                    }
                );
            } else {
                //There was no src set, so there is nothing to load
                resolve();
            }
        } );

    }

    public serialize(): ImageComponentDef {
        let component = {
            id: this._id,
            class: this._class,
            src: this._src, //TODO: make sure that both this is updated and the asset is loaded
        };
        //TODO: Fix this condition
        if ( this._src ) {
            const extensionIndex: number = this._src.lastIndexOf( "." );
            const extension: string = this._src.substr( extensionIndex + 1 );
            if ( extension === "gif" ) {
                component = Object.assign( component, { loop: this._canLoop } )
            }
        }
        return component;

    }

    public async clone( newOwner: ArtboardObject = null ): Promise<IComponent> {
        const def: ComponentDef = this.serialize();
        const owner: ArtboardObject = newOwner ? newOwner : this._owner;

        return ArtboardFactory.CreateComponent( this._context, owner, def );
    }

    public getSrc = (): string => {
        return this._src;
    }

    protected addContent( key: string ): void {
        const asset: any = this._context.getAssetsLoader().getAsset( key );
        const content: any = asset.content;

        const extensionIndex: number = this._src.lastIndexOf( "." );
        const extension: string = this._src.substr( extensionIndex + 1 ).toLowerCase();

        if ( extension === "gif" ) {
            this.buildGifFrames( content );
        } else {
            this._frames.push( content.texture );
        }
        if ( this._frames.length > 0 ) {
            this._canAnimate = this._frames.length > 1;

            this._sprite = new PIXI.Sprite( this._frames[0] );
            this._sprite.anchor.set( 0 );
            this._sprite.x -= this._sprite.width * 0.5;
            this._sprite.y -= this._sprite.height * 0.5;

            // let filter:any = new PIXI.Filter(null, this._sharpening);
            // filter.uniforms.uStrength = 40.0;
            // this._sprite.filters = [filter];

            this.addChild( this._sprite );
        } else {
            this._canAnimate = false;
        }
    }

    public getHeight(): number {
        return this._sprite.height;
    }

    public getWidth(): number {
        return this._sprite.width;
    }

    public getClass(): Class {
        return this._class;
    }

    public getDisplayObject(): PIXI.DisplayObject {
        return this;
    }

    public isEnabled(): boolean {
        return this._isEnabled;
    }

    public enable(): void {
        this._sprite.visible = true;
        this._isEnabled = true;
    }

    public disable(): void {
        this._sprite.visible = false;
        this._isEnabled = false;
    }

    public update( elapsedTime: number ): void {
        if ( this._isEnabled && this._canAnimate ) {
            this._sprite.texture = this._frames[this._currentFrameIndex];

            const nextFrameIndex: number = Math.floor(( this._frames.length - 1 ) * ( elapsedTime / this._totalAnimTime ) );

            if ( this._canLoop ) {
                this._currentFrameIndex = nextFrameIndex % this._frames.length;
            } else {
                this._currentFrameIndex = Math.min( nextFrameIndex, this._frames.length - 1 );
            }
        }
    }

    public onAdded(): void {

    }

    public onRemoved(): void {

    }

    public destruct(): void {
      // TODO: Implement
    }

    private buildGifFrames( content: any ): void {
        const gif = new GIF( content );
        const gifFrames = gif.decompressFrames( true );

        if ( gifFrames.length <= 0 ) {
            return;
        }

        const dims = gifFrames[0].dims;

        this._frameDelay = gifFrames[0].delay;
        this._totalAnimTime = this._frameDelay * gifFrames.length;

        const canvasAcc: HTMLCanvasElement = document.createElement( 'canvas' );
        canvasAcc.width = dims.width;
        canvasAcc.height = dims.height;

        const context2DAcc: CanvasRenderingContext2D = canvasAcc.getContext( '2d' );

        const canvasFrame: HTMLCanvasElement = document.createElement( 'canvas' );
        canvasFrame.width = dims.width;
        canvasFrame.height = dims.height;

        const context2DFrame: CanvasRenderingContext2D = canvasFrame.getContext( '2d' );
        const frameImageData: ImageData = context2DFrame.createImageData( dims.width, dims.height );

        let canvas: HTMLCanvasElement;
        let context2D: CanvasRenderingContext2D;

        for ( const gifFrame of gifFrames) {
            frameImageData.data.set( gifFrame.patch );
            context2DFrame.putImageData( frameImageData, 0, 0 );
            context2DAcc.drawImage( canvasFrame, dims.left, dims.top );

            canvas = document.createElement( 'canvas' );
            canvas.width = dims.width;
            canvas.height = dims.height;

            context2D = canvas.getContext( '2d' );
            context2D.drawImage( canvasAcc, dims.left, dims.top );

            this._frames.push( PIXI.Texture.fromCanvas( canvas ) );
        }
    }
}
