import Camera from '../../../lib/renderer/core/Camera';
import Renderer from '../../../lib/renderer/core/Renderer';
import RenderTexture from '../../../lib/renderer/core/RenderTexture';
import AssetsLoader from './AssetsLoader';
import ObjectIndexList from './ObjectIndexList';

export default class Context {
    protected _renderer: Renderer;
    protected _camera: Camera;
    protected _assetsLoader: AssetsLoader;

    protected _buffers: Map<string, RenderTexture> = new Map<string, RenderTexture>();
    protected _indexList: ObjectIndexList = new ObjectIndexList();

    public addBuffer(id: string, buffer: RenderTexture): void {
        this._buffers.set(id, buffer);
    }

    public getBuffer(id: string): RenderTexture {
        return this._buffers.get(id);
    }
    
    public get indexList(): ObjectIndexList {
        return this._indexList;
    }

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
