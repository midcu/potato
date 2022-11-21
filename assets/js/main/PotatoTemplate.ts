import { _decorator, Component, Node, Label, Button, Prefab, Sprite, resources, SpriteFrame, math, NodeEventType, tween, Vec3 } from 'cc';
import { PotatoList } from './PotatoList';
const { ccclass, property } = _decorator;

export class ItemProp {

    id: number;
    icon: string;
    sort: number;
    status: number;
    position: math.Vec2;
    tag: string;
    isCover: boolean;
}

@ccclass('PotatoTemplate')
export class PotatoTemplate extends Component {

    @property
    public id = 0;

    @property(Sprite)
    public iconSF: Sprite | null = null;

    @property(Sprite)
    public iconBg: Sprite | null = null;

    public itemProps: ItemProp | null = null;

    public fixedPos: any = { x: 0, y: 0 };

    public tag: string = '';

    public sort: number = 0;

    public cleanStar: string = "main/sprite/star-formation/spriteFrame"

    potatoList: PotatoList = null;

    init(data: ItemProp) {
        this.id = data.id;

        this.tag = data.icon;

        this.sort = data.sort;
        
        this.loadImage(data.icon);

        this.node.setPosition(data.position.x, data.position.y)

        this.itemProps = data;

        
    }
    
    loadImage(url: string) {
        resources.load(url, (err, spriteFrame: SpriteFrame) => {
            if(err)return;
            this.iconSF.spriteFrame = spriteFrame;
        });
    }
    
    onLoad() {
        
        this.potatoList = this.node.getParent().getComponent("PotatoList") as PotatoList
        
        this.node.on(NodeEventType.TOUCH_END, () => {

            if (this.itemProps.isCover) {
                return
            }

            this.potatoList.effaceList.pushEffaceNode({ node: this.node, tag: this.tag, status: 0 })

            // 无需再判断
            this.itemProps.status = 1;

            this.potatoList.checkCover()
        })

    }

    dissolve() {
        this.scheduleOnce(function() {
            resources.load(this.cleanStar, (err, spriteFrame: SpriteFrame) => {
                if(err)return;
                this.iconBg.spriteFrame = null;
                this.iconSF.spriteFrame = spriteFrame;
                tween(this.node).delay(0.3).removeSelf().call(() => {
                    this.potatoList.dissolve()
                }).start()
            });
        }, 0.3);
    }

    update(deltaTime: number) {
        if (this.itemProps.isCover) {
            this.iconSF.grayscale = true;
        } else {
            this.iconSF.grayscale = false;
        }
    }
}

