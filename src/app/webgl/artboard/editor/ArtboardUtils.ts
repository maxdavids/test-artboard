import Camera from '../../lib/renderer/core/Camera';
import Vector3 from '../../lib/renderer/core/Vector3';
import Transform from '../../lib/renderer/core/Transform';
import Vector4 from '../../lib/renderer/core/Vector4';
import Vector2 from '../../lib/renderer/core/Vector2';
import { vec4 } from 'gl-matrix';

export class ArtboardUtils {
  public static readonly BACK: Vector3 = new Vector3(0, 0, 1);

  public static ProjectPoint(
    out: Vector3,
    x: number,
    y: number,
    refWidth: number,
    refHeight: number,
    camera: Camera,
    planeZ: number = 0,
    planeNormal: Vector3 = ArtboardUtils.BACK,
  ) {
    const projX: number = (x / refWidth) * 2 - 1;
    const projY: number = (1 - y / refHeight) * 2 - 1;

    const rayForward = new Vector3();
    camera.getScreenRayRef(rayForward, projX, projY);
    rayForward.normalize();

    this.intersectBoundlessPlane(
      out,
      camera.getTransform().position,
      rayForward,
      planeZ,
      planeNormal
    );
  }

	public static intersectBoundlessPlane(
    out: Vector3,
    rayPosition: Vector3,
    rayForward: Vector3,
    planeDepth: number,
    planeNormal: Vector3
  ):void {
    const FdotN:number = Vector3.dot(rayForward, planeNormal);

    if (FdotN != 0) {
      const offset: Vector3 = new Vector3();
      offset.z = planeDepth - rayPosition.z;

      const d: number = Vector3.dot(offset, planeNormal) / FdotN;
      const ray: Vector3 = rayForward.clone();
      ray.multiplyScalar(d);
      out.setValuesFromVector(ray);
      out.add(rayPosition);
    }
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
