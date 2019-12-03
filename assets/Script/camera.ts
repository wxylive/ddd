import { GameHelper } from "./common/gameHelper";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    @property(cc.Node)
    robot: cc.Node = null;

    /**
    * 方块生成的父节点
    */
    @property(cc.Node)
    blockNode: cc.Node = null;
    /**
    * 屏幕监听开始点
    */
    start_Lisence_PointY: number = 0;
    /**
     * 右上角的能量值
     */
    @property(cc.Label)
    rightTop_str:cc.Label = null;
    /**
     * 结算框
     */
    @property(cc.Sprite)
    scoreboard:cc.Sprite = null;
    /**
     * Top To Continue
     */
    @property(cc.Sprite)
    topTocontinue:cc.Sprite = null;
    /**
     * 进度条
     */
    @property(cc.Node)
    progress:cc.Node = null;
    /**
     * 结束按钮：重来
     */
    @property(cc.Button)
    endBtn:cc.Button = null;
    /**
     * 关卡背景
     */
    @property(cc.Sprite)
    pass_bg:cc.Sprite = null;
    /**
     * select节点：选择人物，关卡的父节点
     */
    @property(cc.Node)
    select:cc.Node = null;
    

    //屏幕点击起始点
    touch_Start_Point: cc.Vec2 = cc.v2(0, 0);
    robot_Pre_Point: cc.Vec2 = cc.v2(0, 0);
    init() {
        this.node.on(cc.Node.EventType.TOUCH_START, (ev) => {
            let pos = ev.getLocation() as cc.Vec2;
            this.touch_Start_Point = pos;
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (ev) => {
            let pos = ev.getLocation() as cc.Vec2;
            if (this.touch_Start_Point.x == pos.x) return;

            let per = (pos.x - this.touch_Start_Point.x) * 0.8 + this.robot.x;
            //this.robot_Pre_Point = this.node.convertToWorldSpaceAR(this.robot.position);
            let visi = cc.view.getVisibleSize();

            if (per >= visi.width / 2 - this.robot.width / 2) per = visi.width / 2 - this.robot.width / 2;
            if (per <= -visi.width / 2 + this.robot.width / 2) per = -visi.width / 2 + this.robot.width / 2;
            if (this.isVilidPosition(cc.v2(per, this.robot.y))) {
                this.robot.setPosition(per, this.robot.y);
                //     let rigidbody = this.robot.getComponent(cc.RigidBody);
                // rigidbody.linearVelocity = cc.v2(300, -640);
                //console.log(66);
            } else {
                console.log("生成违法");
            }
            this.touch_Start_Point = pos;

        });
        this.node.on(cc.Node.EventType.TOUCH_END, (ev) => {
            GameHelper.GameInfo.moveSpeed = cc.v2(0, -640);
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (ev) => {
            GameHelper.GameInfo.moveSpeed = cc.v2(0, -640);
        });
    }

    /**
    * 判断节点是否可见
    * @param node 节点
    */
    pointDirectionByVisible(node: cc.Node): GameHelper.Direction {
        let visi = cc.view.getVisibleSize();
        if (this.node.y + visi.height / 2 < node.y - node.height / 2) return GameHelper.Direction.Up;
        if (this.node.y - visi.height / 2 > node.y + node.height / 2) return GameHelper.Direction.Down;
        return GameHelper.Direction.Visible;
    }
    isVilidPosition(point: cc.Vec2): boolean {
        let child = this.blockNode.children;
        let r1 = cc.rect(point.x, point.y, this.robot.width, this.robot.height);
        for (const item of child) {
            if (item.name != "bloodNode" && this.pointDirectionByVisible(item) == GameHelper.Direction.Visible) {
                let r2 = cc.rect(item.x, item.y, item.width + 5, item.height - 20);
                if (r1.intersects(r2)) return false;
            }
        }
        return true;
    }
 
    start() {
  
        this.start_Lisence_PointY = this.robot.y - this.robot.height / 2;
        //this.init();
    }
    /**
     * 相机移动flag
     */
    flag: boolean = false;
    lateUpdate() {
        if (this.robot.y > this.node.y && GameHelper.GameInfo.gameFlag) {
            this.flag = true;
            //this.node.setPosition(0, this.robot.y);
        }
        if (this.robot.y < this.node.y && this.flag) {
            this.node.setPosition(0, this.robot.y);
            this.rightTop_str.node.active = true;
            this.rightTop_str.node.position = cc.v2(250, this.robot.y + 400);
            this.scoreboard.node.setPosition(0, this.robot.y);
            this.topTocontinue.node.setPosition(0,this.robot.y - 300);
            this.progress.setPosition(0, this.robot.y + 400);
            this.endBtn.node.setPosition(0,this.robot.y);

        }
        if (this.robot.y <= this.start_Lisence_PointY) {
            this.init();
        }
    }

    /**
     * 相机上移
     */
    upCameraFunc(){
       
        cc.tween(this.node).to(1,{position:cc.v2(0,0)}).call(()=>{
            GameHelper.GameInfo.gameFlag=true;
            this.pass_bg.node.active = false;
            this.select.active = true;
        }).start();
    }
     /**
     * 相机下移
     */
    downCameraFunc(){
        GameHelper.GameInfo.gameFlag=false;
        cc.tween(this.node).to(1,{position:cc.v2(0,-500)}).call(()=>{
            
        }).start();
    }

    // update (dt) {}
}
