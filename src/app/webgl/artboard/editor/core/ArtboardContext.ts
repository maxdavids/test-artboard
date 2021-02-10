import Camera from '../../../lib/renderer/core/Camera';
import Renderer from '../../../lib/renderer/core/Renderer';
import AssetsLoader from './AssetsLoader';

export default class ArtboardContext {
    private _renderer: Renderer;
    private _camera: Camera;
    private _assetsLoader: AssetsLoader;

    public set renderer( value: Renderer ) {
        this._renderer = value;
    }

    public get renderer(): Renderer {
        return this._renderer;
    }

    public set camera( value: Camera ) {
        this._camera = value;
    }

    public get camera(): Camera {
        return this._camera;
    }

    public set assetsLoader( value: AssetsLoader ) {
        this._assetsLoader = value;
    }

    public get assetsLoader(): AssetsLoader {
        return this._assetsLoader;
    }
}
