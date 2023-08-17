import { _decorator, Component, Enum, instantiate, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

import { EnItems, MAX_ITEM_LEVELS } from "./GameData";
import { ItemComponent } from "./ItemComponent";
import { FieldComponent } from "./FieldComponent";

@ccclass("CellComponent")
export class CellComponent extends Component {
    @property({ group: "Available item", visible: true })
    private _isSpawnItem: boolean = false;

    @property({ type: Enum(EnItems), group: "Available item", visible: true })
    private _typeSpawnedItem: EnItems = EnItems.BlueFlower;

    @property({ group: "Available item", visible: true })
    private _levelSpawnedItem: number = 1;

    @property({ type: Prefab, group: "Available item", visible: true })
    private _itemPrefab: Prefab = null;

    private _currentItem: ItemComponent = null;
    private _field: FieldComponent = null;

    protected start(): void {
        this._field = this.node.parent.getComponent(FieldComponent);

        if (this._isSpawnItem) {
            this.spawnItem();
        }
    }

    private spawnItem(): void {
        let newItem = instantiate(this._itemPrefab);
        newItem.parent = this.node.getParent().getParent();

        newItem
            .getComponent(ItemComponent)
            .spawnInit(this._typeSpawnedItem, this._levelSpawnedItem, this.node);
    }

    public moveItem(lastCell: Node, movedItem: ItemComponent): void {
        if (
            !this._currentItem ||
            (movedItem.getTypeItem() == this._currentItem.getTypeItem() &&
                movedItem.getLevelItem() == this._currentItem.getLevelItem() &&
                movedItem.getLevelItem() < MAX_ITEM_LEVELS[movedItem.getTypeItem()])
        ) {
            if (this._currentItem) {
                this._currentItem.upLevel();
                movedItem.deleteItem();
            } else {
                this._currentItem = movedItem;
            }
        } else {
            this._currentItem.changeCurrentCell(this._field.getNearestFreeCell(this).node);
            this._currentItem = movedItem;
        }
    }

    public exitItem(exitedItem: ItemComponent): void {
        if (this._currentItem == exitedItem) {
            this._currentItem = null;
        }
    }

    public isFreeCell(): boolean {
        return this._currentItem == null;
    }
}
