/**
 * Created by mdavids on 21/4/2017.
 */
interface ICameraController {
  gainFocus(): void;
  lockUserInput(lock: boolean): void;

  update(): void;
  destruct(): void;

  // Not ideal, get rid of all of them as soon as possible
  handleMouseDown(e): void;
  handleMouseMove(e): void;
  handleMouseUp(): void;
  handleMouseOut(): void;
  onTouchStart(e): void;
  onTouchMove(e): void;
  onTouchEnd(e): void;
}
export default ICameraController;
