import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PotatoContactCallBack')
export class PotatoContactCallBack extends Component {

    public coverList: any[] = [];
    public sort: number = 0;
    @property(Sprite)
    public icon: Sprite | null = null;

    start() {
        
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        const tarContact = otherCollider.node.getComponent(PotatoContactCallBack) as PotatoContactCallBack;

        console.log(this.sort, tarContact.sort)

        if (tarContact.sort > this.sort) {
            this.coverList.push(otherCollider);
            this.icon.grayscale = true;
        }

         // 只在两个碰撞体开始接触时被调用一次
         console.log('onBeginContact');
    }
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次

        console.log(this.sort)

        const tarContact = otherCollider.node.getComponent(PotatoContactCallBack) as PotatoContactCallBack;

        console.log(this.coverList)


        console.log('onEndContact');
    }

    update(deltaTime: number) {
        
    }
}

