import Vector3 from './Vector3';
/**
 * Created by mdavids on 31/10/2016.
 */
class Quaternion {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  private _f32Array: Float32Array = new Float32Array(4);

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public setValues(x: number, y: number, z: number, w: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  public copy(from: Quaternion): void {
    this.x = from.x;
    this.y = from.y;
    this.z = from.z;
    this.w = from.w;
  }

  public setFromQuaternion(quaternion: Quaternion): void {
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
    this.w = quaternion.w;
  }

  public setFromEuler(euler: Vector3): void {
    // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
    // 	content/SpinCalc.m

    const c1: number = Math.cos(euler.x / 2);
    const c2: number = Math.cos(euler.y / 2);
    const c3: number = Math.cos(euler.z / 2);
    const s1: number = Math.sin(euler.x / 2);
    const s2: number = Math.sin(euler.y / 2);
    const s3: number = Math.sin(euler.z / 2);

    this.x = s1 * c2 * c3 + c1 * s2 * s3;
    this.y = c1 * s2 * c3 - s1 * c2 * s3;
    this.z = c1 * c2 * s3 + s1 * s2 * c3;
    this.w = c1 * c2 * c3 - s1 * s2 * s3;
  }

  public setFromAxisAngle(axis: Vector3, angle: number): void {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

    // assumes axis is normalized

    const halfAngle: number = angle / 2;
    const s: number = Math.sin(halfAngle);

    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
  }

  public setFromUnitVectors(from: Vector3, to: Vector3): void {
    // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

    // assumes direction vectors vFrom and vTo are normalized

    let v1: Vector3 = new Vector3();
    let r: number = 0;

    const EPS: number = 0.000001;

    r = Vector3.dot(from, to) + 1;

    if (r < EPS) {
      r = 0;

      if (Math.abs(from.x) > Math.abs(from.z)) {
        v1.setValues(-from.y, from.x, 0);
      } else {
        v1.setValues(0, -from.z, from.y);
      }
    } else {
      v1 = Vector3.cross(from, to);
    }

    this.x = v1.x;
    this.y = v1.y;
    this.z = v1.z;
    this.w = r;

    this.normalize();
  }

  public setAxisAngle(axis: Vector3, rad: number): void {
    const r = rad * 0.5;
    const s = Math.sin(r);
    this.x = s * axis.x;
    this.y = s * axis.y;
    this.z = s * axis.z;
    this.w = Math.cos(r);
  }

  public face(forward: Vector3, worldUp: Vector3): void {
    const worldRight: Vector3 = Vector3.cross(worldUp, forward);
    worldRight.normalize();

    const perpWorldUp = Vector3.cross(forward, worldRight);
    perpWorldUp.normalize();

    this.w = Math.sqrt(1.0 + worldRight.x + perpWorldUp.y + forward.z) * 0.5;
    const w4Recip = 1.0 / (4.0 * this.w);
    this.x = (perpWorldUp.z - forward.y) * w4Recip;
    this.y = (forward.x - worldRight.z) * w4Recip;
    this.z = (worldRight.y - perpWorldUp.x) * w4Recip;
  }

  public static rotateTo(from: Vector3, to: Vector3): Quaternion {
    const result: Quaternion = new Quaternion();

    let tmpvec3 = new Vector3();
    const xUnitVec3 = new Vector3(1, 0, 0);
    const yUnitVec3 = new Vector3(0, 1, 0);

    const dot = Vector3.dot(from, to);
    if (dot < -0.999999) {
      tmpvec3 = Vector3.cross(xUnitVec3, from);

      if (tmpvec3.length() < 0.000001) {
        tmpvec3 = Vector3.cross(yUnitVec3, from);
      }

      tmpvec3.normalize();
      result.setAxisAngle(tmpvec3, Math.PI);
      return result;
    }
    if (dot > 0.999999) {
      result.x = 0;
      result.y = 0;
      result.z = 0;
      result.w = 1;
      return result;
    }
    tmpvec3 = Vector3.cross(from, to);
    result.x = tmpvec3.x;
    result.y = tmpvec3.y;
    result.z = tmpvec3.z;
    result.w = 1 + dot;
    result.normalize();

    return result;
  }

  public static facing(forward: Vector3, worldUp: Vector3): Quaternion {
    const quat: Quaternion = new Quaternion();
    quat.face(forward, worldUp);

    return quat;
  }

  public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
    const result: Quaternion = new Quaternion();
    result.setAxisAngle(axis, angle);

    return result;
  }

  public invert(): void {
    this.conjugate();
    this.normalize();
  }

  public conjugate(): void {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
  }

  public dot(v: Quaternion): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  public lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  public normalize(): void {
    let l: number = this.length();

    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;

      this.x = this.x * l;
      this.y = this.y * l;
      this.z = this.z * l;
      this.w = this.w * l;
    }
  }

  public multiply(q: Quaternion): Quaternion {
    return Quaternion.multiplyQuaternionsRef(this, this, q);
  }

  public rotateVector(v: Vector3): Vector3 {
    // unit quaternion only
    // https://gamedev.stackexchange.com/questions/28395/rotating-vector3-by-a-quaternion

    const u: Vector3 = new Vector3(this.x, this.y, this.z);
    const s: number = this.w;

    const dotUV: number = Vector3.dot(u, v);
    const dotUU: number = Vector3.dot(u, u);
    const crossUV: Vector3 = Vector3.cross(u, v);

    const result: Vector3 = u;
    result.multiplyScalar(2 * dotUV);
    result.add(v.multiplyScalar(s * s - dotUU));
    result.add(crossUV.multiplyScalar(2 * s));

    return result;
  }

  public static multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion {
    const result: Quaternion = new Quaternion();
    Quaternion.multiplyQuaternionsRef(result, a, b);

    return result;
  }

  public static multiplyQuaternionsRef(out: Quaternion, a: Quaternion, b: Quaternion): Quaternion {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

    const qax = a.x;
    const qay = a.y;
    const qaz = a.z;
    const qaw = a.w;
    const qbx = b.x;
    const qby = b.y;
    const qbz = b.z;
    const qbw = b.w;

    const x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    const y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    const z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    const w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    out.setValues(x, y, z, w);

    return out;
  }

  public equals(value: Quaternion): boolean {
    return value.x === this.x && value.y === this.y && value.z === this.z && value.w === this.w;
  }

  public static slerp(qa: Quaternion, qb: Quaternion, t: number):Quaternion {
    return Quaternion.slerpRef(new Quaternion(), qa, qb, t);
  }

  public static slerpRef(out:Quaternion, qa: Quaternion, qb: Quaternion, t: number): Quaternion {
    if (t <= 0) {
      out.setFromQuaternion(qa);
      return out;
    }

    if (t >= 1) {
      out.setFromQuaternion(qb);
      return out;
    }

    out.setFromQuaternion(qa);
    const result: Quaternion = out;

    const x = qa.x;
    const y = qa.y;
    const z = qa.z;
    const w = qa.w;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

    if (cosHalfTheta < 0) {
      result.w = -qb.w;
      result.x = -qb.x;
      result.y = -qb.y;
      result.z = -qb.z;

      cosHalfTheta = -cosHalfTheta;
    } else {
      result.copy(qb);
    }

    if (cosHalfTheta >= 1.0) {
      result.w = w;
      result.x = x;
      result.y = y;
      result.z = z;

      return result;
    }

    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      result.w = 0.5 * (w + result.w);
      result.x = 0.5 * (x + result.x);
      result.y = 0.5 * (y + result.y);
      result.z = 0.5 * (z + result.z);

      return result;
    }

    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    result.w = w * ratioA + result.w * ratioB;
    result.x = x * ratioA + result.x * ratioB;
    result.y = y * ratioA + result.y * ratioB;
    result.z = z * ratioA + result.z * ratioB;

    return result;
  }

  public toF32() {
    this._f32Array[0] = this.x;
    this._f32Array[1] = this.y;
    this._f32Array[2] = this.z;
    this._f32Array[3] = this.w;

    return this._f32Array;
  }
}
export default Quaternion;
