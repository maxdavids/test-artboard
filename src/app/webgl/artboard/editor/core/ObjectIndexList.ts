import IComponent from "./components/IComponent";

export default class ObjectIndexList {
    protected _indexMapping: Map<number, IComponent> = new Map<number, IComponent>();

    protected _newIndex: number = 1;
    protected _availableIndexes: number[] = [];

    public createIndex(): number {
        let result: number = 0;

        if (this._availableIndexes.length <= 0) {
            result = this._newIndex;
            this._newIndex += 1;

        } else {
            result = this._availableIndexes.shift();
        }

        return result;
    }

    public addComponent(component: IComponent): void {
        const index: number = this.createIndex();
        this._indexMapping.set(index, component);
    }

    public removeComponent(component: IComponent): void {
        const index: number = this.getComponentIndex(component);
        this._indexMapping.delete(index);
        this._availableIndexes.push(index);
    }

    public getComponent(index: number): IComponent {
        return this._indexMapping.get(index);
    }

    public getComponentIndex(component: IComponent): number {
        this._indexMapping.forEach((value, key) => {
            if (value === component) return key;
        });

        return -1;
    }
}
