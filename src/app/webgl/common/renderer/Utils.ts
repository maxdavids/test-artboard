import Vector3 from './core/Vector3';
import Vector2 from './core/Vector2';
import Vector4 from './core/Vector4';
class Utils {
  private static whitespaceBothSides: string = '/^s+|s+$/mg';

  public static trim_string(str: string): string {
    // @ts-ignore
    return String.prototype.replace.call(str, Utils.whitespaceBothSides, '');
  }

  private static browserPrefixes = ['webkit', 'moz', 'ms', 'o'];

  public static get_prefixed_method(object: any, name: string) {
    let fn = object[name];
    if (typeof fn === 'function') {
      return fn;
    }

    const _name = name[0].toUpperCase() + name.substr(1);
    for (let i = 0; i < Utils.browserPrefixes.length; i += 1) {
      fn = object[Utils.browserPrefixes[i] + _name];
      if (typeof fn === 'function') {
        return fn.bind(object);
      }
    }
    return null;
  }

  public static loadText(path: string, callback: (text: string) => void) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

  public static loadBinary(path: string, callback: (text: ArrayBuffer) => void) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        callback(xhr.response);
      }
    };
    xhr.open('GET', path, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();
  }

  public static loadImage(path: string, callback: (image: HTMLImageElement) => void) {
    const image = new Image();
    image.onload = () => {
      callback(image);
    };
    image.src = path;
  }

  public static loadMultipleImages(
    paths: string[],
    callback: (images: HTMLImageElement[]) => void,
  ) {
    let toGo = paths.length;
    const images: HTMLImageElement[] = [];

    const receive = (i: number) => (image: HTMLImageElement) => {
      toGo -= 1;
      images[i] = image;
      if (toGo === 0) {
        callback.call(this, images);
      }
    };

    for (let i = 0; i < paths.length; i += 1) {
      Utils.loadImage(paths[i], receive(i));
    }
  }

  public static loadMultipleTexts(paths: string[], callback: (texts: string[]) => void) {
    let toGo = paths.length;
    const texts: string[] = [];

    const receive = (i: number) => (text: string) => {
      toGo -= 1;
      texts[i] = text;
      if (toGo === 0) {
        callback.call(this, texts);
      }
    };

    for (let i = 0; i < paths.length; i += 1) {
      Utils.loadText(paths[i], receive(i));
    }
  }

  public static posMod(x: number, m: number): number {
    return ((x % m) + m) % m;
  }

  public static fract(x: number): number {
    return x - Math.floor(x);
  }

  public static lerp(a: number, b: number, i: number): number {
    return (1 - i) * a + i * b;
  }

  public static clamp01(x: number): number {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  public static smootherStep01(x: number): number {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  public static smoothStep01(x: number): number {
    return x * x * (3 - 2 * x);
  }

  public static smoothStep(e0: number, e1: number, x: number): number {
    const _x = Utils.clamp((x - e0) / (e1 - e0), 0.0, 1.0);
    return _x * _x * (3 - 2 * _x);
  }

  public static randomFloat(): number {
    return -1.0 + Math.random() * 2.0;
  }

  public static randomPoint(): number[] {
    return [this.randomFloat(), this.randomFloat(), this.randomFloat()];
  }

  public static arrayToString(ar: Float32Array): string {
    let message: string = '';
    for (let i: number = 0; i < ar.length; i += 1) {
      message += ar[i];
      message += ', ';
    }
    return message;
  }

  public static componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  public static rgbToHex(r: number, g: number, b: number): string {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  public static normalizedGreyToHex(x: number): string {
    const i: number = Math.round(x * 255);
    return this.rgbToHex(i, i, i);
  }

  public static hexToRGB(hex: number): Vector3 {
    return new Vector3(((hex >> 16) & 0xff) / 255, ((hex >> 8) & 0xff) / 255, (hex & 0xff) / 255);
  }

  public static hexToRGBA(hex: number): Vector4 {
    return new Vector4(
      ((hex >> 16) & 0xff) / 255,
      ((hex >> 8) & 0xff) / 255,
      (hex & 0xff) / 255,
      ((hex >> 24) & 0xff) / 255,
    );
  }

  public static sign(f: number): number {
    return f > 0 ? 1 : f < 0 ? -1 : 0;
  }

  public static clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  public static degToRad(d: number): number {
    return d * (Math.PI / 180);
  }

  public static radToDeg(r: number): number {
    return r * (180 / Math.PI);
  }

  public static intersectPlane(
    rayPosition: Vector3,
    rayForward: Vector3,
    planePos: Vector3,
    planeNormal: Vector3,
  ): Vector3 {
    let result: Vector3 = new Vector3();

    if (Vector3.dot(rayForward, planeNormal) !== 0) {
      const offset: Vector3 = Vector3.subtract(planePos, rayPosition);
      const d = Vector3.dot(offset, planeNormal) / Vector3.dot(rayForward, planeNormal);
      rayForward.multiplyScalar(d);
      result = Vector3.add(rayForward, rayPosition);
    }

    return result;
  }

  public static intersectRect(
    x: number,
    y: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
  ): Vector2 {
    if (minX <= x && x <= maxX && (minY <= y && y <= maxY)) {
      // A bit hacky, I know
      return new Vector2(999999, 999999);
    }

    const midX: number = (minX + maxX) / 2;
    const midY: number = (minY + maxY) / 2;

    const m: number = (midY - y) / (midX - x);

    if (x <= midX) {
      const minXy = m * (minX - x) + y;
      if (minY < minXy && minXy < maxY) return new Vector2(minX, minXy);
    }

    if (x >= midX) {
      const maxXy = m * (maxX - x) + y;
      if (minY < maxXy && maxXy < maxY) return new Vector2(maxX, maxXy);
    }

    if (y <= midY) {
      const minYx = (minY - y) / m + x;
      if (minX < minYx && minYx < maxX) return new Vector2(minYx, minY);
    }

    if (y >= midY) {
      const maxYx = (maxY - y) / m + x;
      if (minX < maxYx && maxYx < maxX) return new Vector2(maxYx, maxY);
    }

    return new Vector2();
  }

  public static intersectSphere(
    rayPosition: Vector3,
    rayForward: Vector3,
    spherePos: Vector3,
    radius: number,
  ): Vector3 {
    const a: number = 1;
    const b: number =
      2 * rayForward.x * (rayPosition.x - spherePos.x) +
      2 * rayForward.y * (rayPosition.y - spherePos.y) +
      2 * rayForward.z * (rayPosition.z - spherePos.z);
    const c: number =
      spherePos.lengthSquared() +
      rayPosition.lengthSquared() -
      2 *
        (spherePos.x * rayPosition.x + spherePos.y * rayPosition.y + spherePos.z * rayPosition.z) -
      radius * radius;

    const D: number = b * b - 4 * a * c;

    // No intersection
    if (D < 0) {
      return new Vector3(999999, 999999, 999999);
    }

    const t: number = (-b - Math.sqrt(D)) / (2 * a);

    return new Vector3(
      rayPosition.x + t * rayForward.x,
      rayPosition.y + t * rayForward.y,
      rayPosition.z + t * rayForward.z,
    );
  }
}
export default Utils;
