import { _decorator, Component, SpriteFrame } from "cc";
import { EnItems } from "./GameData";
const { ccclass, property } = _decorator;

@ccclass("SpriteItemContainer")
export class SpriteItemContainer extends Component {
    public static instance: SpriteItemContainer = null;

    @property({ type: [SpriteFrame], visible: true })
    private _blowFlowerSprites: SpriteFrame[] = [];
    @property({ type: [SpriteFrame], visible: true })
    private _boxWithBonusSprites: SpriteFrame[] = [];

    private _sprites: SpriteFrame[][] = [];

    protected onLoad(): void {
        if (SpriteItemContainer.instance == null) {
            SpriteItemContainer.instance = this;
            this.init();
        } else {
            this.node.destroy();
        }
    }

    private init(): void {
        this._sprites.push(this._blowFlowerSprites);
        this._sprites.push(this._boxWithBonusSprites);
    }

    public getSpriteFrame(typeItem: EnItems, lvlItem: number): SpriteFrame {
        return this._sprites[typeItem][lvlItem - 1];
    }
}
