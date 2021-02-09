/**
 * Created by mdavids on 29/11/2017.
 */
export default class AssetsLoader {

    public lazyLoading: boolean = false;

    protected _onLoadedListeners: { (): void; }[] = [];

    protected _pending: any[] = [];

    protected _done: { [index: string]: any } = {};

    protected _pixiLoader: PIXI.loaders.Loader;

    constructor() {
        this._pixiLoader = new PIXI.loaders.Loader();
    }

    public hasPending(): boolean {
        return this._pending.length > 0;
    }

    public addOnLoadedListener( callback: () => void ): void {
        this._onLoadedListeners.push( callback );
    }

    public getAsset( id: string ): any {
        return this._done[id];
    }

    public push( asset: any, onCompleteCallback: () => void ): void {

        if ( this._done[asset.id] ) {
            onCompleteCallback();
            return;
        }

        // I could use a dictionary / map / associative array / whatever and then delete this._pending[key];
        // but I'll need to iterate the list later, and don't want to get keys with an undefined value.
        let isPending: boolean = false;
        for ( const pendingItem of this._pending ) {
            if ( pendingItem.id === asset.id ) {
                pendingItem.onCompleteList.push( onCompleteCallback );
                isPending = true;
                break;
            }
        }

        if ( isPending ) {
            return;
        }
        const pendingAssetItem: any = {
            id: asset.id,
            onCompleteList: [onCompleteCallback],
            usesPIXILoader: true,
            parent: asset.parent,
            asset: {
                id: asset.id,
                src: asset.src,
                content: {}
            }
        };

        this._pending.push( pendingAssetItem );

        const extensionIndex: number = asset.src.lastIndexOf( "." );
        let extension: string = asset.src.substr( extensionIndex + 1 );
        extension = extension.toLowerCase();

        if ( extension === "gif" ) {
            pendingAssetItem.usesPIXILoader = false;

            const oReq = new XMLHttpRequest();
            oReq.open( "GET", pendingAssetItem.asset.src, true );
            oReq.responseType = "arraybuffer";
            oReq.onload = ( oEvent ) => {
                pendingAssetItem.asset.content = oReq.response;
                this.onAssetComplete( pendingAssetItem );
            };
            pendingAssetItem.request = oReq;
            // oReq.send(null);

        } else {
            if ( !this._pixiLoader.resources[pendingAssetItem.id] ) {

                const url: string = pendingAssetItem.asset.src + '?' + Math.floor(( Math.random() * 100 ) + 1 ); //TODO: Doesn't work on chrome without this. Avoiding cache issue and cors
                this._pixiLoader.add( {
                    name: pendingAssetItem.id,
                    url: url,
                    parentResource: this._pixiLoader.loading ? new PIXI.Container() : null,
                    onComplete: () => {
                        pendingAssetItem.asset.content = this._pixiLoader.resources[pendingAssetItem.id];
                        this.onAssetComplete( pendingAssetItem );
                    }
                } );
            }
            else {
                this.onAssetComplete( pendingAssetItem );
            }
        }

        if ( !this.lazyLoading ) {
            if ( !pendingAssetItem.usesPIXILoader ) {
                pendingAssetItem.request.send( null );

            } else {
                // PIXI.loader.load(pendingAssetItem.id, this.onLoadEvent);
                this._pixiLoader.load();
            }
        }
    }

    private onAssetComplete( pendingAssetItem: any ): void {
        this._done[pendingAssetItem.id] = pendingAssetItem.asset;

        const itemIndex: number = this._pending.indexOf( pendingAssetItem );
        this._pending.splice( itemIndex, 1 );

        const onCompleteList = pendingAssetItem.onCompleteList;
        for ( const callback of onCompleteList ) {
            callback();
        }

        if ( this._pending.length <= 0 ) {
            // this.dispatchOnCompleteEvent();
            setTimeout(() => { this.dispatchOnCompleteEvent() }, 0 );
        }

    }

    private dispatchOnCompleteEvent(): void {
        for ( const callback of this._onLoadedListeners ) {
            callback();
        }
    }

    /**
	 * FORCE LOAD IF USING LAZY LOADING ONLY, UNLESS YOU KNOW WHAT YOU ARE DOING
     */
    public forceLoad(): void {
        if ( this.hasPending() ) {
            PIXI.loader.load();

            for ( const item of this._pending ) {
                if ( !item.usesPIXILoader ) {
                    item.request.send( null );
                }
            }

        } else {
            setTimeout(() => this.dispatchOnCompleteEvent(), 0 );
        }
    }

    public removeAll(): void {
        // this._isLoading = false;

        // for (let i:number = 0; i < this._loading.length; i++) {
        // 	this._loading[i].cancel();
        // 	this._loading[i].destruct();
        // }
        //
        // for (let i:number = 0; i < this._pending.length; i++) {
        // 	this._pending[i].destruct();
        // }

        this._pending = [];
    }

    destruct() {
        this.removeAll();
    }

}
