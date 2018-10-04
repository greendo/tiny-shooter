'use strict';

class Bullet {

    constructor(id, x, y, angle, room) {

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.room = room;

        this.line = new createjs.Shape();
        this.line.graphics.moveTo(220,60).setStrokeStyle(1).beginStroke("#ff9900").lineTo(300,60);
        //border #663d00
    }

    // addToStage() {
    //     let currentLineThickness = 5;
    //     let g = new createjs.Graphics().ss(currentLineThickness,"round", "round").s("#000000").moveTo(midPoint.x, midPoint.y).curveTo(oldX, oldY, oldMidX, oldMidY);
    //     this.room.stage.addChild(new createjs.Shape().set({graphics:g}));
    // }

    update(info) {

        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.angle = info.a;

        if (info.s === 'h') {
            this.gotoAndPlay('hit');
            this.on("animationend", delete this);
        }
    }
}