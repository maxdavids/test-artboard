import Camera from '../../../renderer/core/Camera';
import Vector3 from '../../../renderer/core/Vector3';
import Transform from '../../../renderer/core/Transform';
import Vector4 from '../../../renderer/core/Vector4';
import Vector2 from '../../../renderer/core/Vector2';
import { vec4 } from 'gl-matrix';

export class ArtboardUtils {
  public static project2DReference(
    out: Vector3,
    x: number,
    y: number,
    dist: number,
    refWidth: number,
    refHeight: number,
    camera: Camera,
  ) {
    const refAspect: number = refWidth / refHeight;
    const scaleX: number = camera.getAspect() / refAspect;
    const projX: number = (x / refWidth) * 2 - 1;
    const projY: number = (1 - y / refHeight) * 2 - 1;

    camera.getScreenRayRef(out, projX * scaleX, projY, 1);
    out.normalize();
    out.multiplyScalar(dist);
    out.add(camera.getTransform().position);
  }

  public static getPointUVCoord(
    out: Vector2,
    point: Vector4,
    parent: Transform,
    camera: Camera,
  ): void {
    const pos: Float32Array = point.toF32();
    vec4.transformMat4(pos, pos, parent.getMatrix());
    vec4.transformMat4(pos, pos, camera.getViewProjection());

    pos[0] /= pos[3];
    pos[1] /= pos[3];

    out.x = pos[0] * 0.5 + 0.5;
    out.y = 1 - (pos[1] * 0.5 + 0.5);
  }

  public static getPixelToUnits(atDepth:number, camera:Camera):number {
    const bottomLeft:Vector3 = camera.getScreenRay(-1, -1, 1);
    const topRight:Vector3 = camera.getScreenRay(1, 1, 1);

    bottomLeft.normalize();
    topRight.normalize();

    bottomLeft.multiplyScalar(atDepth);
    topRight.multiplyScalar(atDepth);

    return (topRight.y - bottomLeft.y) / window.innerHeight;
  }

  /*
    public getCurrentFrameAsImage(): HTMLImageElement {
        return this.renderer.plugins.extract.image(this.stage);
    }

    public getCurrentFrameAsPixels(): Uint8ClampedArray {
        return this.renderer.plugins.extract.pixels(this.stage);
    }

    public getCurrentFrameAsBlob(callback: (blob: Blob) => void,
                                 format: string = 'image/jpeg',
                                 quality: number = 0.95): void {
        this.renderer.plugins.extract.canvas(this.stage).toBlob(callback, format, quality);
    }

    public getObjectSnapshot(object:ArtboardObject, boundsWidthHeight:number): HTMLImageElement {
        const objectStartTime:number = object.getStartTime();

        const toDisable:IComponent[] = [];
        toDisable.concat(
            object.getComponentsByClass(Class.AnimationComponent),
            object.getComponentsByClass(Class.TransitionComponent)
        );

        for (const component of toDisable) {
            component.disable();
        }

        object.update(objectStartTime);

        const objectBounds:PIXI.Rectangle = object.getLocalBounds();
        const objectMaxSize:number = Math.max(objectBounds.width, objectBounds.height);
        const scale:number = boundsWidthHeight / objectMaxSize;

        let result:HTMLImageElement;
        if (this.renderer instanceof WebGLRenderer) {
            result = EngineUtils.CreateImageFromObject(object, scale, this.renderer as WebGLRenderer);
        } else {
            result = this.renderer.plugins.extract.image(object);
        }

        for (const component of toDisable) {
            component.enable();
        }

        object.update(objectStartTime);

        return result;
    }
  */
}
