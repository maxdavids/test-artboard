import RenderTexture from "../../../../lib/renderer/core/RenderTexture";
import Vector2 from "../../../../lib/renderer/core/Vector2";
import ArtboardObject from "../../core/ArtboardObject";
import IComponent from "../../core/components/IComponent";
import Context from "../../core/Context";
import { Class, ComponentDef } from "../../core/model/ArtboardDef";
import { Buffer } from '../../core/Enumeratives';

export default class MouseComponent implements IComponent {
    public readonly priority: number = 2000;

    readonly _owner: ArtboardObject;
    readonly _class: Class = Class.Internal;
    readonly _context: Context;

    protected _indexesBuffer: RenderTexture;
    protected _mousePosition: Vector2 = new Vector2();

    constructor( context: Context, owner: ArtboardObject ) {
        this._context = context;
        this._owner = owner;
        this._indexesBuffer = this._context.getBuffer(Buffer.Indexes);
    }

    public async load(): Promise<void> {
        return new Promise<void>(( resolve, reject ) => {
            resolve();
        });
    }

    public serialize(): ComponentDef {
        return {
            class: Class.Internal,
        };
    }

    public async clone( newOwner: ArtboardObject = null ): Promise<IComponent> {
        const owner: ArtboardObject = newOwner ? newOwner : this._owner;

        return new MouseComponent(this._context, owner);
    }

    public getClass(): Class {
        return this._class;
    }

    public update(): void {

    }

    public onAdded(): void {
        this.addEventListeners();
    }

    public onRemoved(): void {

    }

    public destruct(): void {
        // TODO: Implement
    }

    protected updateMousePosition(clientX: number, clientY: number): void {
        const rect = this._context.renderer.getCanvas().getBoundingClientRect();
        const retinaMultiplier = window.devicePixelRatio || 1;
        const mouseX:number = (clientX - rect.left) * retinaMultiplier;
        const mouseY:number = (clientY - rect.top) * retinaMultiplier;

        this._mousePosition.x = mouseX;
        this._mousePosition.y = mouseY;
    }

    protected getIndexAt(x: number, y: number): number {
        const u:number = x / this._context.camera.vSize.x;
        const v:number = 1.0 - y / this._context.camera.vSize.y;

        return this._indexesBuffer.getPixel(u, v)[0];
    }

    protected addEventListeners() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    private onMouseMove(event: any): void {
        this.updateMousePosition(event.clientX, event.clientY);

        const index: number = this.getIndexAt(this._mousePosition.x, this._mousePosition.y);
        if (index < 255) {
            this._context.renderer.getCanvas().style.cursor = 'pointer';
          } else {
            this._context.renderer.getCanvas().style.cursor = 'default';
        }
    }

    private onMouseDown(event: any): void {
        this.updateMousePosition(event.clientX, event.clientY);
    }

    private onMouseUp(event: any): void {
        this.updateMousePosition(event.clientX, event.clientY);
    }
}
