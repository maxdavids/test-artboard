/**
 * Created by mdavids on 14/12/2016.
 */
interface IAsset {
  readonly name: string;

  load(onSuccess: (asset: IAsset) => void, onFailure: (asset: IAsset) => void): void;
  cancel(): void;
  getIsLoaded(): boolean;

  destruct(): void;
}
export default IAsset;
