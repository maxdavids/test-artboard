/**
 * Created by mdavids on 19/01/2018.
 */
import * as PIXI from 'pixi.js';
import ArtboardObject from "./ArtboardObject";
import WebGLRenderer = PIXI.WebGLRenderer;

export default class EngineUtils {

    public static CreateImageFromObject( target: ArtboardObject, scale: number, renderer: WebGLRenderer ): HTMLImageElement {
        const canvasElement: HTMLCanvasElement = EngineUtils.DrawObjectToCanvas( target, scale, renderer );

        if ( canvasElement ) {
            const image = new Image();
            image.src = canvasElement.toDataURL();

            return image;
        }

        return null;
    }

    public static DrawObjectToCanvas( target: ArtboardObject, scale: number, renderer: WebGLRenderer ): HTMLCanvasElement {
        const region: PIXI.Rectangle = target.getLocalBounds();
        const renderTexture: PIXI.RenderTexture = ( renderer as any ).generateTexture( target, PIXI.SCALE_MODES.LINEAR, scale, region );

        if ( renderTexture ) {
            const textureBuffer = ( renderTexture.baseTexture as any )._glRenderTargets[renderer.CONTEXT_UID];
            const frame = renderTexture.frame;

            const bufferWidth = frame.width === 0 ? 1 : frame.width;
            const bufferHeight = frame.height === 0 ? 1 : frame.height;

            const canvasBuffer = new PIXI.CanvasRenderTarget( bufferWidth, bufferHeight, scale );

            if ( textureBuffer ) {
                renderer.bindRenderTarget( textureBuffer );

                const bytesPerPixel: number = 4;
                const webglPixels: Uint8Array = new Uint8Array( bytesPerPixel * bufferWidth * bufferHeight );

                const gl = renderer.gl;
                gl.readPixels(
                    frame.x,
                    frame.y,
                    bufferWidth,
                    bufferHeight,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    webglPixels
                );

                const canvasData = canvasBuffer.context.getImageData( 0, 0, bufferWidth, bufferHeight );
                canvasData.data.set( webglPixels );
                canvasBuffer.context.putImageData( canvasData, 0, 0 );
            }

            renderTexture.destroy( true );

            return canvasBuffer.canvas;
        }

        return null;
    }
}
