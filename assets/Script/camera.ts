import { GameHelper } from "./common/gameHelper";
import GameScene from "./gameScene";

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
    rightTop_str: cc.Label = null;
    /**
     * 结算框
     */
    @property(cc.Sprite)
    scoreboard: cc.Sprite = null;
    /**
     * Top To Continue
     */
    @property(cc.Sprite)
    topTocontinue: cc.Sprite = null;
    /**
     * 进度条
     */
    @property(cc.Node)
    progress: cc.Node = null;
    /**
     * 结束按钮：重来
     */
    @property(cc.Button)
    endBtn: cc.Button = null;
    /**
     * 关卡背景
     */
    @property(cc.Sprite)
    pass_bg: cc.Sprite = null;
    /**
     * select节点：选择人物，关卡的父节点
     */
    @property(cc.Node)
    select: cc.Node = null;
    /**
     * 关卡退出
     */
    @property(cc.Sprite)
    pass_exitBtn: cc.Sprite = null;
    /**
     * 菜单界面
     */
    @property(cc.Node)
    muen: cc.Node = null;
    /**
     * 条件显示节点
     */
    @property(cc.Node)
    condition: cc.Node = null;


    /**
    * 确认选关之后在开始场景显示Label
    */
    @property(cc.Label)
    confirm_pass: cc.Label = null;


    recond_robot_X: Number = 0;





    //屏幕点击起始点
    touch_Start_Point: cc.Vec2 = cc.v2(0, 0);
    robot_Pre_Point: cc.Vec2 = cc.v2(0, 0);
    init() {
        this.node.on(cc.Node.EventType.TOUCH_START, (ev) => {
            if (GameHelper.GameInfo.gameOver) return;

            let pos = ev.getLocation() as cc.Vec2;
            this.recond_robot_X = this.robot.x;
            this.touch_Start_Point = pos;
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (ev) => {

            if (GameHelper.GameInfo.gameOver) return;

            let pos = ev.getLocation() as cc.Vec2;
            if (this.touch_Start_Point.x == pos.x) return;

            let per = pos.x - this.touch_Start_Point.x;
            if (Math.abs(per) >= this.robot.width) {
                per = per > 0 ? this.robot.width : -this.robot.width;
            }
            per += this.robot.x;
            let visi = cc.view.getVisibleSize();
            if (per >= visi.width / 2 - this.robot.width / 2) per = visi.width / 2 - this.robot.width / 2;
            if (per <= -visi.width / 2 + this.robot.width / 2) per = -visi.width / 2 + this.robot.width / 2;




            if (this.isVilidPosition(cc.v2(per, this.robot.y))) {
                this.robot.setPosition(cc.v2(per, this.robot.y));
                if (this.recond_robot_X !== this.robot.x) {
                    if (this.recond_robot_X > this.robot.x) {
                        // cc.log('向左移动')

                        if (this.robot.angle === -205) { } else {
                            cc.tween(this.robot)
                                .to(0.05, { angle: -205 })//  旋转弧度
                                .to(0.2, { angle: -180 })
                                .start()
                        }

                    } else {
                        // cc.log('向右移动')
                        if (this.robot.angle === -155) { } else {
                            cc.tween(this.robot)
                                .to(0.05, { angle: -155 })//  旋转弧度
                                .to(0.2, { angle: -180 })
                                .start()
                        }
                    }
                } else {
                    cc.tween(this.robot)
                        .to(0.2, { angle: -180 }).start()
                }

            }
            this.recond_robot_X = this.robot.x
            this.touch_Start_Point = pos;

        });
        this.node.on(cc.Node.EventType.TOUCH_END, (ev) => {
            if (GameHelper.GameInfo.gameOver) return;

            // GameHelper.GameInfo.moveSpeed = cc.v2(0, -640);
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (ev) => {
            if (GameHelper.GameInfo.gameOver) return;

            // GameHelper.GameInfo.moveSpeed = cc.v2(0, -640);
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
        let r1 = cc.rect(point.x - (this.robot.width / 2), point.y - (this.robot.height / 2), this.robot.width, this.robot.height);
        for (const item of child) {
            if (item.name != "bloodNode" && ((this.robot.x > point.x && item.x < this.robot.x) || (this.robot.x < point.x && item.x > this.robot.x)) && this.pointDirectionByVisible(item) == GameHelper.Direction.Visible) {
                let r2 = cc.rect(item.x - (item.width / 2), item.y - ((item.height - 20) / 2), item.width, item.height - 20);
                if (r1.intersects(r2)) {
                    let p = cc.v2(0, 0);
                    if (this.robot.x > r2.x) p = cc.v2(r2.x + item.width / 2 + this.robot.width / 2, this.robot.y);
                    else p = cc.v2(r2.x - item.width / 2 - this.robot.width / 2, this.robot.y);
                    return false;
                }
            }
        }
        return true;
    }

    camera: cc.Camera = null;
    cameraScale: number = 1;
    cameraPos: cc.Vec2 = cc.v2(0, -65);

    start() {
        this.camera = this.node.getComponent(cc.Camera);
        this.start_Lisence_PointY = this.robot.y - this.robot.height / 2;
        //this.init();

        // this.camera.zoomRatio = this.cameraScale;
        this.node.position = this.cameraPos;
    }
    /**
     * 相机移动flag
     */
    flag: boolean = false;
    /**
     * 移动到最后的标识
     */
    move_end = true;


    /**
    * 最后结束的时候的背景图
    */
    @property(cc.Sprite)
    end_bg: cc.Sprite = null;
    /**
     * 到达地底
     */
    @property(cc.Node)
    level_pass: cc.Node = null;



    lateUpdate() {



        if (this.robot.y > this.node.y && GameHelper.GameInfo.gameFlag) {
            this.flag = true;
        }
        // if (this.flag) {
        //     if (this.robot.y - 100 < this.node.y && this.flag) {



        if (!GameScene.instance.isDraw) return;

        let y = this.node.y;
        this.node.setPosition(0, this.robot.y + this.robot.height + 35);
        this.rightTop_str.node.position = cc.v2(260, this.robot.y + 600);
        /************2019-12-16************ */
        this.scoreboard.node.setPosition(0, this.robot.y + 200);
        this.topTocontinue.node.setPosition(0, this.robot.y - 150);
        /*********************************** */
        this.progress.setPosition(0, this.robot.y + 600);
        this.condition.setPosition(200, this.robot.y + 600)
        this.endBtn.node.setPosition(0, this.robot.y - 100);
        // this.end_bg.node.setPosition(0, this.robot.y - 150);
        // this.level_pass.setPosition(0, this.robot.y + 250);

        if (this.robot.y <= this.start_Lisence_PointY) {
            this.init();
        }

        // }

    }




    /**
     * 相机上移
     */
    upCameraFunc() {
        this.pass_exitBtn.node.active = false;
        this.camera.getComponent(cc.Camera).zoomRatio = 1;
        cc.tween(this.node).to(1, { position: cc.v2(0, -50) }).call(() => { /**************2019-12-17******************** */
            GameHelper.GameInfo.gameFlag = true;
            this.pass_bg.node.active = false;
            this.confirm_pass.node.active = true;
            this.camera.getComponent(cc.Camera).zoomRatio = 2.9;
        }).start();
    }
    upCameraFunExit() {
        this.pass_exitBtn.node.active = false;
        this.muen.active = true;
        cc.tween(this.node).to(1, { position: cc.v2(0, -50) }).call(() => { /**************2019-12-17******************** */
            GameHelper.GameInfo.gameFlag = true;
            this.pass_bg.node.active = false;
            this.select.active = true;
            this.confirm_pass.node.active = false;

            this.camera.getComponent(cc.Camera).zoomRatio = 2.9;
        }).start();
    }


    /**
    * 相机下移
    */
    downCameraFunc() {
        // debugger
        this.camera.getComponent(cc.Camera).zoomRatio = 1;
        GameHelper.GameInfo.gameFlag = false;
        this.muen.active = false;
        cc.tween(this.node).to(1, { position: cc.v2(0, -400) }).call(() => {
            this.pass_exitBtn.node.active = true;
        }).start();
    }

    // update (dt) {}
}
