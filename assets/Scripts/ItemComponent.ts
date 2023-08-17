import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    EventTouch,
    Input,
    IPhysics2DContact,
    Node,
    Sprite,
    Vec3,
} from "cc";
import { EnItems } from "./GameData";
import { SpriteItemContainer } from "./SpriteItemContainer";
import { CellComponent } from "./CellComponent";

const { ccclass, property } = _decorator;

@ccclass("ItemComponent")
export class ItemComponent extends Component {
    private _viewItem: Sprite = null;
    private _currentCell: Node = null;

    private _lastCell: Node = null;

    private _typeItem: EnItems = EnItems.BlueFlower;
    private _levelItem: number = 1;

    protected start(): void {
        let collider = this.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    public spawnInit(typeItem: EnItems, levelItem: number, cell: Node): void {
        this._lastCell = cell;
        this._currentCell = cell;
        this.positionToCurrentCell();

        this._typeItem = typeItem;
        this._levelItem = levelItem;

        this.changeSprite();
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ): void {
        this._currentCell = otherCollider.node;
    }

    protected onLoad(): void {
        this._viewItem = this.getComponent(Sprite);

        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {}

    private onTouchMove(event: EventTouch): void {
        let pos_touch = event.getUILocation();
        this.node.setWorldPosition(new Vec3(pos_touch.x, pos_touch.y, 0));
    }

    private onTouchEnd(event: EventTouch): void {
        this.positionToCurrentCell();
    }

    private positionToCurrentCell(): void {
        let new_pos = this._currentCell.getWorldPosition();
        this.node.setWorldPosition(new Vec3(new_pos.x, new_pos.y, 0));

        this._lastCell.getComponent(CellComponent).exitItem(this);
        this._currentCell.getComponent(CellComponent).moveItem(this._lastCell, this);

        this._lastCell = this._currentCell;
    }

    public upLevel() {
        this._levelItem += 1;
        this.changeSprite();
    }

    private changeSprite(): void {
        this._viewItem.spriteFrame = SpriteItemContainer.instance.getSpriteFrame(
            this._typeItem,
            this._levelItem
        );
    }

    public changeCurrentCell(cell: Node): void {
        this._currentCell = cell;
        this.positionToCurrentCell();
    }

    public getTypeItem(): EnItems {
        return this._typeItem;
    }

    public getLevelItem(): number {
        return this._levelItem;
    }

    public deleteItem(): void {
        this._currentCell.getComponent(CellComponent).exitItem(this);
        this.node.destroy();
    }
}
