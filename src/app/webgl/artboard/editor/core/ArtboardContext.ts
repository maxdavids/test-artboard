import Renderer from '../../../lib/renderer/core/Renderer';
import AssetsLoader from './AssetsLoader';

export default class ArtboardContext {
    private _renderer: Renderer;
    private _assetsLoader: AssetsLoader;

    public set renderer( value: Renderer ) {
        this._renderer = value;
    }

    public get renderer(): Renderer {
        return this._renderer;
    }

    public set assetsLoader( value: AssetsLoader ) {
        this._assetsLoader = value;
    }

    public get assetsLoader(): AssetsLoader {
        return this._assetsLoader;
    }
}
