import { _decorator, Component, Node, Sprite, Label, resources, SpriteFrame, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PreResult')
export class PreResult extends Component {

    @property(Sprite)
    board: Sprite | null = null;

    @property(Label)
    rltLabel: Label | null = null;

    @property(Sprite)
    rltIcon: Sprite | null = null;

    @property(Sprite)
    nextPage: Sprite | null = null;

    success: string = "result/success/spriteFrame"

    failure: string = "result/failure/spriteFrame"

    init(data: any) {
        let iconUrl = this.failure;
        let text = "很遗憾！此次通关失败！";
        if (data.success) {
            iconUrl = this.success;
            text = "恭喜你！成功通关！";
        }
        resources.load(iconUrl, (err, spriteFrame: SpriteFrame) => {
            if(err)return;
            this.rltIcon.spriteFrame = spriteFrame;
        });

        this.rltLabel.string = text;
    }

    start() {
        this.nextPage.node.on(Node.EventType.TOUCH_END, () => {
            director.loadScene("start");
        }, this.nextPage)
    }

    update(deltaTime: number) {
        
    }
}

