import { _decorator, Component, Node, Label, Button, Prefab, Sprite, resources, SpriteFrame, math, NodeEventType, Vec3, tween, Tween, instantiate } from 'cc';
import { PreResult } from '../prefab/PreResult';
import { PotatoTemplate } from './PotatoTemplate';
const { ccclass, property } = _decorator;

@ccclass('EffaceList')
export class EffaceList extends Component {

    // 需要消除的组件
    public efface: any[] = []
    
    // 7个位置 世界坐标
    public effacePos: math.Vec3[] = []

    public needToEfface: any[] = [];

    @property(Prefab)
    resutlPrefab: Prefab | null = null;

    onLoad() {
        for (let i = 0; i < 7; i++) {
            this.effacePos.push(new math.Vec3(125 + ( i * 120), 360));
        }
    }

    pushEffaceNode(item: any) {

        if (this.efface.length > 6) {
            return
        }

        let sameEfface = [];
        let p = this.efface.length;

        for (let i = 0; i < this.efface.length; i++) {
            const ef = this.efface[i];
        
            if (ef.tag === item.tag && ef.status === 0) {
                sameEfface.push(ef)
                p = i + 1;
            }
        }

        // 需要消除的标记
        if (sameEfface.length > 1) {
            sameEfface.push(item);
            sameEfface.forEach((i) => i.status = 1);
        } 


        this.efface.splice(p, 0, item);

        // 重新排列
        this.effaceSort(p)

        if (sameEfface.length > 2) {
            this.needToEfface = sameEfface;
            // 从数组移除
            this.efface.splice(p - 2, 3);
            this.effaceNode();
        }

        // 移动
        item.node.setSiblingIndex(1000)
            
        // 关闭点击事件
        item.node.off(NodeEventType.TOUCH_END)

        this.scheduleOnce(function() {
            if (this.efface.length > 6) {
                this.result(false)
            }
        }, 0.3);

    }

    effaceNode() {
        console.log("执行消除操作")

        for (let i = 0; i < this.needToEfface.length; i++) {
            const { node } = this.needToEfface[i];

            const starTemplate = node.getComponent("PotatoTemplate") as PotatoTemplate

            starTemplate.dissolve()
        }

        this.needToEfface = [];

        this.scheduleOnce(function() {
            this.effaceSort(0);
        }, 0.6);

    }

    effaceSort(index) {
        for (let i = index; i < this.efface.length; i++) {
            const node = this.efface[i].node as Node;
            tween(node).to(0.2, { worldPosition: this.effacePos[i] }).start()
        }
    }

    result(success) {
        const resultNode = instantiate(this.resutlPrefab);

        const resultCom = resultNode.getComponent("PreResult") as PreResult;

        resultCom.init({ success })

        this.node.parent.addChild(resultNode)
        
    }
}