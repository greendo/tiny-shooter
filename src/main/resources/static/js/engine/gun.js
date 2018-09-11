'use strict';

class Gun {

    constructor(name, x, y, room) {

        let preload = new createjs.LoadQueue();

        preload.loadFile({id: name, src: name + '.png'});

        let handleCompleteLoad = () => {

            let result = preload.getResult(name);
            this.sprite = new createjs.Bitmap(result);
            room.weaponsContainer.addChild(this.sprite);
            this.sprite.x = x;
            this.sprite.y = y;
            this.canBePicked = true;
            this.sprite.regX = this.sprite.width / 2;
            this.sprite.regY = this.sprite.height / 2;
        };

        preload.on('complete', handleCompleteLoad);
        preload.load();
    }

    pickUp(player) {

        if (this.canBePicked) {
            this.player = player;
            this.canBePicked = false;
            this.player.gun = this;
        }
    }

    update(info) {

        let playerBounds = this.player.getBounds();

        this.sprite.scaleX = this.player.look;
        this.sprite.x = this.player.x - this.sprite.scaleX * playerBounds.width / 2 +
            playerBounds.width / 2 - this.sprite.getBounds().width / 2;
        this.sprite.y = this.player.y +
            playerBounds.height / 2 + this.sprite.getBounds().height / 2;

        try {
            this.mX = info['mX'];
            this.mY = info['mY'];
            this.sprite.rotation = this.angle(this.sprite.regX, this.sprite.regY, this.mX, this.mY);
        } catch (e) {}

    }

    angle(cx, cy, ex, ey) {
        return 0;
    }

    shoot() {}

    dispose() {}
}

//window.gun.pickUp(window.p);