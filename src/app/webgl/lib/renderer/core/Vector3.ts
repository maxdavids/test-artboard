import Quaternion from './Quaternion';
class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  private _f32Array: Float32Array = new Float32Array(3);

  // do not change
  public static UP: Vector3 = new Vector3(0, 1, 0);
  public static RIGHT: Vector3 = new Vector3(1, 0, 0);
  public static FORWARD: Vector3 = new Vector3(0, 0, -1);

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public normalized(): Vector3 {
    const l: number = this.length();
    return new Vector3(this.x / l, this.y / l, this.z / l);
  }

  public normalize(): Vector3 {
    const l: number = this.length();
    this.x /= l;
    this.y /= l;
    this.z /= l;
    return this;
  }

  public divideScalar(divider: number): Vector3 {
    this.x /= divider;
    this.y /= divider;
    this.z /= divider;
    return this;
  }

  public multiplyScalar(value: number): Vector3 {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  public multiply(value: Vector3): Vector3 {
    return new Vector3(this.x * value.x, this.y * value.y, this.z * value.z);
  }

  public applyQuaternion(q: Quaternion): void {
    const x: number = this.x;
    const y: number = this.y;
    const z: number = this.z;

    const qx: number = q.x;
    const qy: number = q.y;
    const qz: number = q.z;
    const qw: number = q.w;

    const ix: number = qw * x + qy * z - qz * y;
    const iy: number = qw * y + qz * x - qx * z;
    const iz: number = qw * z + qx * y - qy * x;
    const iw: number = -qx * x - qy * y - qz * z;

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  }

  public add(value: Vector3): Vector3 {
    this.x += value.x;
    this.y += value.y;
    this.z += value.z;
    return this;
  }

  public subtract(value: Vector3): Vector3 {
    this.x -= value.x;
    this.y -= value.y;
    this.z -= value.z;
    return this;
  }

  public subtractScalar(value: number) {
    this.x -= value;
    this.y -= value;
    this.z -= value;
    return this;
  }

  public clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  public copy(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  public setValues(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public setValuesFromVector(vector: Vector3): void {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  }

  public setFloat32(f32: Float32Array): Vector3 {
    this.x = f32[0];
    this.y = f32[1];
    this.z = f32[2];
    return this;
  }

  public static add(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  public static subtract(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  public static subtractRef(a: Vector3, b: Vector3, out: Vector3): Vector3 {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }

  public static multiplyScalar(a: Vector3, scalar: number): Vector3 {
    return new Vector3(a.x * scalar, a.y * scalar, a.z * scalar);
  }

  public static pow(a: Vector3, scalar: number): Vector3 {
    return new Vector3(Math.pow(a.x, scalar), Math.pow(a.y, scalar), Math.pow(a.z, scalar));
  }

  private static lerp1(a: number, b: number, i: number): number {
    return (1 - i) * a + i * b;
  }

  public static lerp(a: Vector3, b: Vector3, i: number): Vector3 {
    return new Vector3((1 - i) * a.x + i * b.x, (1 - i) * a.y + i * b.y, (1 - i) * a.z + i * b.z);
  }

  public static lerpRef(out: Vector3, a: Vector3, b: Vector3, i: number): void {
    out.x = (1 - i) * a.x + i * b.x;
    out.y = (1 - i) * a.y + i * b.y;
    out.z = (1 - i) * a.z + i * b.z;
  }

  public lerp(a: Vector3, b: Vector3, i: number): void {
    this.x = (1 - i) * a.x + i * b.x;
    this.y = (1 - i) * a.y + i * b.y;
    this.z = (1 - i) * a.z + i * b.z;
  }

  public randomize(): void {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = Math.random() * 2 - 1;
  }

  private seedRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  public randomizeSeeded(seed: number): void {
    this.x = this.seedRandom(seed * 3 + 0) * 2 - 1;
    this.y = this.seedRandom(seed * 3 + 1) * 2 - 1;
    this.z = this.seedRandom(seed * 3 + 2) * 2 - 1;
  }

  public static random(): Vector3 {
    return new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
  }

  public static random01(): Vector3 {
    return new Vector3(Math.random(), Math.random(), Math.random());
  }

  public sphereRandom(): void {
    do {
      this.randomize();
    } while (this.length() > 1);
  }

  public static sphereRandom(): Vector3 {
    let r: Vector3 = Vector3.random();
    while (r.length() > 1) {
      r = Vector3.random();
    }
    return r;
  }

  public spherifyRandomSeeded(seed: number): void {
    let _seed = seed;
    do {
      this.randomizeSeeded((_seed += 1));
    } while (this.length() > 1);
  }

  public static sphereRandomSeeded(seed: number): Vector3 {
    let _seed = seed;
    const r: Vector3 = new Vector3();
    do {
      r.randomizeSeeded((_seed += 1));
    } while (r.length() > 1);
    return r;
  }

  /*    private static fract1(x:number):number
   {
   return x - Math.floor(x);
   }*/

  public static fract(p: Vector3): Vector3 {
    return Vector3.subtract(p, Vector3.floor(p));
    // return new Vector3(
    //    p.x - Math.floor(p.x),
    //    p.y - Math.floor(p.y),
    //    p.z - Math.floor(p.z)
    // )
  }

  public static floor(p: Vector3): Vector3 {
    return new Vector3(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z));
  }

  private fract(): void {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
  }

  private sin3(p: Vector3): Vector3 {
    p.x = Math.sin(p.x);
    p.y = Math.sin(p.y);
    p.z = Math.sin(p.z);
    return p;
  }

  public static cross(a, b) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  public static crossRef(a: Vector3, b: Vector3, out: Vector3) {
    out.x = a.y * b.z - a.z * b.y;
    out.y = a.z * b.x - a.x * b.z;
    out.z = a.x * b.y - a.y * b.x;
    return out;
  }

  public static dot(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  public static distance(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public static distanceSquared(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  private smoothstep1(x: number) {
    return x * x * (3.0 - 2.0 * x);
  }

  public smoothstep(): void {
    this.x = this.smoothstep1(this.x);
    this.y = this.smoothstep1(this.y);
    this.z = this.smoothstep1(this.z);
  }

  public hasZeroLength(): boolean {
    return this.x + this.y + this.z < 0.00001;
  }

  public toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  public toF32() {
    this._f32Array[0] = this.x;
    this._f32Array[1] = this.y;
    this._f32Array[2] = this.z;

    return this._f32Array;
  }

  public static fromF32(f32: Float32Array): Vector3 {
    return new Vector3(f32[0], f32[1], f32[2]);
  }
}

export default Vector3;
