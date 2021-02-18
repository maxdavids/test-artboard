import Camera from "../../../lib/renderer/core/Camera";
import RenderTexture from "../../../lib/renderer/core/RenderTexture";
import Vector2 from "../../../lib/renderer/core/Vector2";
import Vector3 from "../../../lib/renderer/core/Vector3";
import { ArtboardUtils } from "../ArtboardUtils";
import ArtboardObject from "../core/ArtboardObject";
import IComponent from "../core/components/IComponent";
import Context from "../core/Context";
import { Buffer } from "../core/Enumeratives";

export default class EditorMouse {
    protected _context: Context;

    protected _indexesBuffer: RenderTexture;
    protected _mousePosition: Vector2 = new Vector2();

    protected _isMouseDown: boolean = false;
    protected _isDragging: boolean = false;

    protected _selectedObject: ArtboardObject = null;

    constructor(context: Context) {
        this._context = context;
        this._indexesBuffer = this._context.getBuffer(Buffer.Indexes);

        this.addEventListeners();
    }

    public destruct(): void {
        // TODO
    }

    protected addEventListeners() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    private onMouseMove = (event: any): void => {
        this.updateMousePosition(event.clientX, event.clientY);

        if (this._isMouseDown && this._selectedObject !== null) {
            this.updateMousePosition(event.clientX, event.clientY);
            this._isDragging = true;

            const camera: Camera = this._context.camera;
            const result: Vector3 = new Vector3();
            ArtboardUtils.ProjectPoint(
                result,
                this._mousePosition.x,
                this._mousePosition.y,
                camera.vSize.x,
                camera.vSize.y,
                camera,
            );

            this._selectedObject.transform.globalTransform.setPosition(result);
        }

        if (!this._isDragging) {
            const index: number = this.getIndexAt(this._mousePosition.x, this._mousePosition.y);

            if (index > 0) {
                this._context.renderer.getCanvas().style.cursor = 'pointer';
            } else {
                this._context.renderer.getCanvas().style.cursor = 'default';
            }    
        }
    }

    private onMouseDown = (event: any): void => {
        this._isMouseDown = true;

        const index: number = this.getIndexAt(this._mousePosition.x, this._mousePosition.y);
        this._selectedObject = null;

        if (index > 0) {
            const selectedComponent: IComponent = this._context.indexList.getComponent(index);
            this._selectedObject = selectedComponent._owner;
        }
    }

    private onMouseUp = (event: any): void => {
        this._isMouseDown = false;
        this._isDragging = false;
    }

    private updateMousePosition(clientX: number, clientY: number): void {
        const rect = this._context.renderer.getCanvas().getBoundingClientRect();
        const retinaMultiplier = window.devicePixelRatio || 1;
        const mouseX:number = (clientX - rect.left) * retinaMultiplier;
        const mouseY:number = (clientY - rect.top) * retinaMultiplier;

        this._mousePosition.x = mouseX;
        this._mousePosition.y = mouseY;
    }

    private getIndexAt(x: number, y: number): number {
        const u:number = x / this._context.camera.vSize.x;
        const v:number = 1.0 - y / this._context.camera.vSize.y;

        return this._indexesBuffer.getPixel(u, v)[0];
    }
}
