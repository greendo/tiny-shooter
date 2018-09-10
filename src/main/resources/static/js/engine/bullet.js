'use strict';

export class Bullet extends createjs.Sprite {

    constructor(id, sprite, x, y, angle, container) {

        let obj = {
            framerate: 5,
            images: sprite,
            frames: {},
            animations: {
                static: [0, 0],
                hit: [1, 3]
            }
        };

        try {

            super(new createjs.SpriteSheet(obj), 0);

            this.id = id;
            this.x = x;
            this.y = y;
            this.angle = angle;

            this.gotoAndStop('static');

            container.addChild(this);
        } catch (e) {
            alert(e);
        }
    }

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