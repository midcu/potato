import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Button, math, Sprite, UITransform } from 'cc';
import { EffaceList } from './EffaceList';
import { PotatoContactCallBack } from './PotatoContactCallBack';
import { ItemProp, PotatoTemplate } from './PotatoTemplate';
const { ccclass, property } = _decorator;


@ccclass('Potato')
export class Item {

    @property
    id = 0;
    
    @property
    itemName = '';

    @property(SpriteFrame)
    iconSF: SpriteFrame | null = null;

    @property(math.Vec2)
    position: math.Vec2 | null = null;
}

@ccclass('PotatoList')
export class PotatoList extends Component {

    @property(EffaceList)
    effaceList: EffaceList | null = null;

    @property(Prefab)
    itemPrefab: Prefab | null = null;

    public dissolveLen: number = 0;

    scene: any[] = [];

    public icons: string[] = [
        "main/sprite/bell-pepper/spriteFrame",
        "main/sprite/broccoli/spriteFrame",
        "main/sprite/carrot/spriteFrame",
        "main/sprite/cauliflower/spriteFrame",
        "main/sprite/chili/spriteFrame",
        "main/sprite/corn/spriteFrame",
        "main/sprite/eggplant/spriteFrame",
        "main/sprite/lettuce/spriteFrame",
        "main/sprite/onion/spriteFrame",
        "main/sprite/pea/spriteFrame",
        "main/sprite/potato/spriteFrame",
        "main/sprite/tomato/spriteFrame",
    ];

    public maxLevel: number = 12;

    public list: PotatoTemplate[] = []

    start() {
        this.scene = this.makeScene(12)

        this.checkCover()
    }

    makeScene(level) {
        // 获取当前关卡
        const curLevel = Math.min(this.maxLevel, level);
        // 获取当前关卡应该拥有的icon数量
        const iconPool = this.icons.slice(0, 2 * curLevel);

        // 算出偏移量范围具体细节范围
        const offsetPool = [0, 60, -60];

        //  最终的元数据数组
        const scene = [];
        // 确定范围
        //在一般情下 translate 的偏移量，如果是百分比的话，是按照自身的宽度或者高度去计算的，所以最大的偏移范围是百分800%
        // 然后通过Math.random 会小于百分之八百
        // 所以就会形成当前区间的随机数
        const range = [
            [2, 6],
            [1, 6],
            [1, 7],
            [0, 7],
            [0, 8],
        ][Math.min(1, curLevel - 1)];


        const randomSet = (icon: string) => {
            // 求偏移量
            let offset = offsetPool[Math.floor(offsetPool.length * Math.random())];
            // 偏移求列数
            const row = range[0] + Math.floor((range[1] - range[0]) * Math.random());
            // 求偏移行数
            const column = range[0] + Math.floor((range[1] - range[0]) * Math.random());

            if (column === 1 || column === 6) {
                offset = 0;
            }

            const itemProp = new ItemProp();
            itemProp.position = new math.Vec2(column * 120 + offset, row * -140 + offset);
            itemProp.icon = icon;
            itemProp.sort = scene.length;
            itemProp.tag = String(scene.length);
            itemProp.isCover = false;
            itemProp.status = 0;

            const item = instantiate(this.itemPrefab);

            const template = (item.getComponent(PotatoTemplate) as PotatoTemplate);

            // 数据初始化
            template.init(itemProp)

            this.node.addChild(item);

            // 生成元数据对象
            scene.push(itemProp);

            this.list.push(template);
        };

        // 生成元数据，初始状态下 iconPool的内容少生 随着增加，就会越来越难
        for (const icon of iconPool) {
            for (let i = 0; i < 6; i++) {
                randomSet(icon);
            }
        }

        // 返回元数据
        return scene;
    }


    // 检查是否被覆盖
    checkCover() {
        // 深拷贝一份
        const updateScene = this.list.slice();
        // 是否覆盖算法
        // 遍历所有的元数据
        // 双重for循环来找到每个元素的覆盖情况
        for (let i = 0; i < updateScene.length; i++) {
            // 当前item对角坐标
            const item = updateScene[i];
            const cur = updateScene[i].itemProps;
            // 先假设他都不是覆盖的
            cur.isCover = false;
            // 如果status 不为0 说明已经被选中了，不用再判断了
            if (cur.status !== 0) continue;
            // 拿到坐标
            const { x: x1, y: y1 } = item.node.worldPosition;
            // 为了拿到他们的对角坐标，所以要加上100
            //之所以要加上100 是由于 他的总体是800% 也就是一个格子的换算宽度是100
            const x2 = x1 + 100,
                y2 = y1 + 120;
            // 第二个来循环来判断他的覆盖情况
            for (let j = i + 1; j < updateScene.length; j++) {
                const compare = updateScene[j];
                if (compare.itemProps.status !== 0) continue;
        
                const { x, y } = compare.node.worldPosition;
                // 处理交集也就是选中情况
                // 两区域有交集视为选中
                // 两区域不重叠情况取反即为交集
                if (!(y + 120 <= y1 || y >= y2 || x + 100 <= x1 || x >= x2)) {
                    // 由于后方出现的元素会覆盖前方的元素，所以只要后方的元素被选中了，前方的元素就不用再判断了
                    // 又由于双层循环第二层从j 开始，所以不用担心会重复判断
                    cur.isCover = true;
                    break;
                }
            }
        }
    }

    dissolve() {
        this.dissolveLen++;
        if (this.dissolveLen === this.list.length) {
            this.effaceList.result(true);
        }
    }

}

