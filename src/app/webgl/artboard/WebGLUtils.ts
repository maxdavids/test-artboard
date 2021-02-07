import Camera from '../common/renderer/core/Camera';
import Vector3 from '../common/renderer/core/Vector3';
import Transform from '../common/renderer/core/Transform';
import Vector4 from '../common/renderer/core/Vector4';
import Vector2 from '../common/renderer/core/Vector2';
import { vec4 } from 'gl-matrix';

export class WebGLUtils {
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
}
