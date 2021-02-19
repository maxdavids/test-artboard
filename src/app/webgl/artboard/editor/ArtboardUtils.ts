import Camera from '../../lib/renderer/core/Camera';
import Vector3 from '../../lib/renderer/core/Vector3';

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

    this.intersectPlane(
      out,
      camera.getTransform().position,
      rayForward,
      planeZ,
      planeNormal
    );
  }

	public static intersectPlane(
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
}
