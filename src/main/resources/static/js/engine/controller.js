'use strict';

const KEYCODES = {
    KEYCODE_ENTER: 13,
    KEYCODE_SPACE: 32,
    KEYCODE_UP: 38,
    KEYCODE_LEFT: 37,
    KEYCODE_RIGHT: 39,
    KEYCODE_W: 87,
    KEYCODE_A: 65,
    KEYCODE_D: 68
};

class PlayerController {

    constructor(player, stage, platformsArr) {

        if (!player instanceof Player) {
            throw new Error('expected instance of class Player');
        }

        this.stage = stage;
        this.player = player;
        this.platformsArr = platformsArr;

        /** SET LISTENERS FOR CONTROLS */
        window.onkeydown = (e) => {
            switch (e.keyCode) {
                case KEYCODES.KEYCODE_A:
                    this.pressA();
                    break;
                case KEYCODES.KEYCODE_D:
                    this.pressD();
                    break;
                case KEYCODES.KEYCODE_SPACE:
                    this.pressSpace();
            }
        };
        window.onkeyup = (e) => {
            switch (e.keyCode) {
                case KEYCODES.KEYCODE_A:
                    this.releaseA();
                    break;
                case KEYCODES.KEYCODE_D:
                    this.releaseD();
                    break;
                case KEYCODES.KEYCODE_SPACE:
                    this.releaseSpace();
            }
        };
        stage.addEventListener("stagemousedown", (event) => {
            /** RIGHT MOUSE CLICK */
            if(event.nativeEvent.button === 2) {
                this.pressRM(event);
            } /** LEFT */ else if(event.nativeEvent.button === 0) {
                this.pressLM(event)
            }
        });
    }

    pressA() {
        // console.log('pressA');
        this.player.accelerateX = true;
        this.player.side = -1;
    }

    releaseA() {
        // console.log('releaseA');
        this.player.accelerateX = false;
    }

    pressD() {
        // console.log('pressD');
        this.player.accelerateX = true;
        this.player.side = 1;
    }

    releaseD() {
        // console.log('releaseD');
        this.player.accelerateX = false;
    }

    pressSpace() {
        // console.log('pressSpace');

        /** AVOID MULTIPLE JUMPS */
        if (this.player.state === STATES.inAir) {
            return;
        }

        /** AVOID JUMP IN AIR AFTER RUNNING FROM PLATFORM */
        if (this.player.velY !== 0) {
            return;
        }

        this.player.update({state: STATES.inAir});

        this.player.velY = PLAYER_RESTRICTIONS.playerMaxSpeedY;
        this.player.y += this.player.velY;
    }

    releaseSpace() {
        // console.log('releaseSpace');
    }

    pressLM(event) {

        // let info = {};
        //
        // info.state = (this.player.state === STATES.inAir || this.player.state === STATES.inAirHold)
        //     ? STATES.attackRangeAir : STATES.attackRange;
        // /** LOOK THE WAY YOU SHOOT */
        // info.side = (event.stageX > this.player.x + this.player.getBounds().width / 2) ? 1 : -1;
        //
        // this.player.update(info);
    }

    pressRM(event) {

        // let info = {};
        //
        // info.state = (this.player.state === STATES.inAir || this.player.state === STATES.inAirHold)
        //     ? STATES.attackMeleeAir : STATES.attackMelee;
        // /** LOOK THE WAY YOU STRIKE */
        // info.side = (event.stageX > this.player.x + this.player.getBounds().width / 2) ? 1 : -1;
        //
        // this.player.update(info);
    }

    activateMouseListener() {

        let f = (evt) => {

            if (this.player.x > evt.stageX && this.player.look > 0) {
                this.player.update({look: -1});
            } else if (this.player.x < evt.stageX && this.player.look < 0) {
                this.player.update({look: 1});
            }
        };

        this.stage.on("stagemousemove", f);
    }

    calculate() {

        /** STAY IN SCREEN */
        this.player.checkScreenBounds();

        /** did not hit platform */
        let velY = this.player.velY + PLAYER_RESTRICTIONS.playerGravity;

        for (let i = 0; i < this.platformsArr.length; i++) {
            if (this.player.platformHitTest(this.platformsArr[i])) {
                /** hit platform */
                this.player.y = this.platformsArr[i].getGround() - this.player.getBounds().height;
                velY = 0;
                break;
            }
        }

        /** UPDATE PLAYER COORDINATES */
        if (this.player.accelerateX) {
            this.player.velX = PLAYER_RESTRICTIONS.playerMaxSpeedX;
        } else {
            this.player.velX = 0;
        }
        this.player.velY = velY;
        this.player.x += this.player.velX * this.player.side;
        this.player.y += velY;

        let info = {};

        if (this.player.velY === 0 && this.player.velX === 0) {
            info.state = STATES.idle;
        } else if (this.player.velY === 0 && this.player.velX !== 0) {
            info.state = this.player.side === this.player.look ? STATES.run : STATES.runReverse;
        } else if (this.player.velY < 0) {
            info.state = STATES.inAir;
        }

        this.player.update(info);
    };
}