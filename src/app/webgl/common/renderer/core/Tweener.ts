/**
 * Created by mdavids on 26/04/2016.
 */
class Tweener {
  constructor() {}

  public static linear(from: number, change: number, currentTime: number, endTime: number): number {
    if (currentTime >= endTime) return from + change;

    return (change * currentTime) / endTime + from;
  }

  public static easeInQuad(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    return change * (_currentTime /= endTime) * _currentTime + from;
  }

  public static easeOutQuad(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    return -change * (_currentTime /= endTime) * (_currentTime - 2.0) + from;
  }

  public static easeInOutQuad(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    _currentTime /= endTime * 0.5;
    if (_currentTime < 1.0) {
      return change * 0.5 * _currentTime * _currentTime + from;
    }

    _currentTime -= 1;
    return -change * 0.5 * (_currentTime * (_currentTime - 2.0) - 1.0) + from;
  }

  public static easeInOutCubic(from: number, change: number, currentTime: number, endTime: number) {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    _currentTime /= endTime * 0.5;
    if (_currentTime < 1.0) {
      return change * 0.5 * Math.pow(_currentTime, 3.0) + from;
    }

    return change * 0.5 * (Math.pow(_currentTime - 2.0, 3.0) + 2.0) + from;
  }

  public static easeInCatmullrom(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    _currentTime /= endTime;
    _currentTime = Tweener.catmullrom(_currentTime, 0, 0, 1, 10); // Q, 0, 1, T

    return change * _currentTime + from;
  }

  public static easeOutCatmullrom(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    _currentTime /= endTime;
    _currentTime = Tweener.catmullrom(_currentTime, -10, 0, 1, 1); // Q, 0, 1, T

    return change * _currentTime + from;
  }

  public static easeInOutCatmullrom(
    from: number,
    change: number,
    currentTime: number,
    endTime: number,
  ): number {
    let _currentTime = currentTime;
    if (_currentTime >= endTime) return from + change;

    _currentTime /= endTime * 0.5;
    if (_currentTime < 1.0) {
      _currentTime = Tweener.catmullrom(_currentTime, 0, 0, 1, 10); // Q, 0, 1, T
      return change * 0.5 * _currentTime + from;
    }

    _currentTime = Tweener.catmullrom(_currentTime - 1.0, -10, 0, 1, 1); // Q, 0, 1, T
    return change * 0.5 * _currentTime + change * 0.5 + from;
  }

  private static catmullrom(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
    );
  }
}
export default Tweener;
