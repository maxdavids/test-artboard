import AssetsLoader from './AssetsLoader';

export default class ArtboardContext {
    private assetsLoader: AssetsLoader;

    public setAssetsLoader( loader: AssetsLoader ) {
        this.assetsLoader = loader;
    }

    public getAssetsLoader() {
        return this.assetsLoader;
    }

}
