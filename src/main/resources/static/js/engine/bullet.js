'use strict';

class Bullet {

    constructor(id, x, y, angle, room) {

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.room = room;

        this.line = new createjs.Shape();
        this.room.stage.addChild(this.line);
        this.line.graphics.setStrokeStyle(1).beginStroke('#ffffcc');//#ff9900#ffff00
        this.line.graphics.moveTo(120, 305);
        this.line.graphics.lineTo(280, 305);
        this.line.graphics.endStroke();
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