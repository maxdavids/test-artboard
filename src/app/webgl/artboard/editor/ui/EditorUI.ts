import ArtboardObject from "../core/ArtboardObject";
import Context from "../core/Context";
import Factory from "../core/Factory";
import ArtboardDefFactory from "../core/model/ArtboardDefFactory";
import EditorMouse from "./EditorMouse";

export default class EditorUI {
    protected _context: Context;
    protected _mouse: EditorMouse;
    protected _scene: ArtboardObject;

    constructor(context: Context) {
        this._context = context;

        Factory.CreateArtboardObject(
            this._context,
            ArtboardDefFactory.CreateEmptyArtboardObjectDef()
        ).then((scene) => {
            this._scene = scene;
            this._mouse = new EditorMouse(this._context);
        });
    }

    public destruct(): void {
        // TODO: Implement
    }
}
