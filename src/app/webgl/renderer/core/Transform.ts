import Vector3 from './Vector3';
import Quaternion from './Quaternion';
import Spherical from './Spherical';
import { mat4, vec3 } from 'gl-matrix';

/**
 * Created by mdavids on 21/04/2016.
 */
class Transform {
  public up: Vector3 = new Vector3(0, 1, 0);
  public right: Vector3 = new Vector3(1, 0, 0);
  public forward: Vector3 = new Vector3(0, 0, -1);

  public position: Vector3;
  public scale: Vector3;
  public rotation: Quaternion;

  protected _isDirty: boolean = true;
  protected _isDirtyInverse: boolean = true;

  protected _matrix: Float32Array;
  protected _invMatrix: Float32Array;

  constructor() {
    // super();
    this.up.y = 1.0;

    this.position = new Vector3();
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Quaternion();

    this._matrix = <Float32Array>mat4.create();
    this._invMatrix = <Float32Array>mat4.create();
  }

  public isDirty(): Boolean {
    return this._isDirty;
  }

  public isDirtyInverse(): boolean {
    return this._isDirtyInverse;
  }

  public setPosition(pos: Vector3): void {
    this.position = pos;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setPositionXYZ(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setX(x: number): void {
    this.position.x = x;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setY(y: number): void {
    this.position.y = y;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setZ(z: number): void {
    this.position.z = z;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setScale(pos: Vector3): void {
    this.scale = pos;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setScaleXYZ(x: number, y: number, z: number): void {
    this.scale.x = x;
    this.scale.y = y;
    this.scale.z = z;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setRotationVector(vector: Vector3): void {
    this.rotation.setFromEuler(vector);

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setRotationXYZ(x: number, y: number, z: number): void {
    this.rotation.setFromEuler(new Vector3(x, y, z));

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setRotationQuat(quaternion: Quaternion): void {
    this.rotation = quaternion;

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public setFromSpherical(sphericalPos: Spherical): void {
    const quatInverse: Quaternion = new Quaternion();
    quatInverse.setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(0, 1, 0));
    quatInverse.invert();

    const offset: Vector3 = new Vector3();
    offset.setFromSpherical(sphericalPos);
    offset.applyQuaternion(quatInverse);

    this.setPosition(offset);
  }

  public getMatrix(): Float32Array {
    if (this._isDirty) {
      /*window['glMatrix'].mat4.identity(this._matrix);
			window['glMatrix'].mat4.translate(this._matrix, this._matrix, this.position.toF32());
			window['glMatrix'].mat4.scale(this._matrix, this._matrix, this.scale.toF32());
			window['glMatrix'].mat4.rotateY(this._matrix, this._matrix, this.rotation.y);
			window['glMatrix'].mat4.rotateX(this._matrix, this._matrix, this.rotation.x);
			window['glMatrix'].mat4.rotateZ(this._matrix, this._matrix, this.rotation.z);*/

      mat4.fromRotationTranslationScale(
        this._matrix,
        this.rotation.toF32(),
        this.position.toF32(),
        this.scale.toF32(),
      );

      this._isDirtyInverse = true;
      this._isDirty = false;
    }

    return this._matrix;
  }

  public getInvMatrix(): Float32Array {
    if (this._isDirtyInverse) {
      this.getMatrix();

      mat4.invert(this._invMatrix, this._matrix);

      this._isDirtyInverse = false;
    }

    return this._invMatrix;
  }

  public lookAt(target: Vector3, up: Vector3 = null): void {
    const upVec: Vector3 = up ? up : this.up;

    mat4.lookAt(this._matrix, this.position.toF32(), target.toF32(), upVec.toF32());
    mat4.invert(this._matrix, this._matrix);
    mat4.scale(this._matrix, this._matrix, this.scale.toF32());

    this._isDirty = false;
    this._isDirtyInverse = true;
  }

  public lookAt2(target: Vector3): void {
    const forward: Vector3 = Vector3.subtract(this.position, target);
    forward.normalize();

    this.rotation = Quaternion.facing(forward, this.up);

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public sLookAt(target: Vector3, t: number): void {
    const forward: Vector3 = Vector3.subtract(this.position, target);
    forward.normalize();

    const targetRot: Quaternion = Quaternion.facing(forward, this.up);

    this.rotation = Quaternion.slerp(this.rotation, targetRot, t);

    this._isDirty = true;
    this._isDirtyInverse = true;
  }

  public getForward(): Vector3 {
    const result: Float32Array = this.forward.clone().toF32();
    vec3.transformMat4(result, result, this.getMatrix());

    return new Vector3(result[0], result[1], result[2]);
  }

  public getRight(): Vector3 {
    const result: Float32Array = this.right.clone().toF32();
    vec3.transformMat4(result, result, this.getInvMatrix());

    return new Vector3(result[0], result[1], result[2]);
  }

  public transformPointRef(point: Vector3): Vector3 {
    const pos: Float32Array = point.toF32();
    vec3.transformMat4(pos, pos, this._matrix);

    point.x = pos[0];
    point.y = pos[1];
    point.z = pos[2];

    return point;
  }

  public transformPoint(point: Vector3): Vector3 {
    const pos: Float32Array = point.toF32();
    vec3.transformMat4(pos, pos, this._matrix);

    return new Vector3(pos[0], pos[1], pos[2]);
  }

  public destruct(): void {
    this.position = null;
    this.scale = null;
    this.rotation = null;

    // super.destruct();
  }
}
export default Transform;
