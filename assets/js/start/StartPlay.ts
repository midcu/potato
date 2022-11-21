import { _decorator, Component, Node, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('StartPlay')
export class StartPlay extends Component {
    start() {

        director.preloadScene("main", function () {
            console.log('main scene preloaded');
        });

        this.node.on(Node.EventType.TOUCH_END, (event) => {
            director.loadScene("main");
        }, this)
    }

    update(deltaTime: number) {
        
    }
}

