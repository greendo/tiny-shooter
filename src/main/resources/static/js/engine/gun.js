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

            this.sprite.regX = this.sprite.getBounds().width / 2;
            this.sprite.regY = this.sprite.getBounds().height / 2;
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
        /** pizda */
        this.sprite.x = this.player.x - this.sprite.scaleX * playerBounds.width / 2 +
            playerBounds.width / 2 - this.sprite.regX + this.sprite.scaleX * this.sprite.regX;
        this.sprite.y = this.player.y +
            playerBounds.height / 2 + this.sprite.regY * 2;

        try {
            this.mX = info['mX'];
            this.mY = info['mY'];
            this.sprite.rotation = this.angle();
        } catch (e) {}

    }

    angle() {
        let r = Math.atan2(
            this.mY - (this.sprite.y + this.sprite.regY),
            this.mX - (this.sprite.x + this.sprite.regX)
        ) * 180 / Math.PI;
        return this.sprite.scaleX === -1 ? r + 180 : r;
    }

    shoot() {}

    dispose() {}
}

//window.gun.pickUp(window.p);