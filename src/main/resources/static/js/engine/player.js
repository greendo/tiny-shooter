'use strict';

const STATES = {
    idle: 'i',
    inAir: 'a',
    run: 'r',
    runReverse: 'R',
    struck: 'sg',
    struckAir: 'sa',
    dead: 'd',
    attackMelee: 'amg',
    attackRange: 'arg',
    attackMeleeAir: 'ama',
    attackRangeAir: 'ara'
};

const PLAYER_RESTRICTIONS = {
    playerMaxSpeedX: 15,
    playerMaxSpeedY: -18,
    playerAcceleration: 3,
    playerDeceleration: -1.5,
    playerGravity: 0.9
};

const MAXIMUM_PLATFORM_COLLISION_GAP = 50;

class Player {

    constructor(name, spriteURL, health, side, x, y, score, state, room, callback) {

        let preload = new createjs.LoadQueue();

        let handleCompleteLoad = () => {

            console.log('added player');

            let obj = {
                framerate: 5,
                images: [preload.getResult(this.name)],
                frames: {width: 588 / 6, height: 1316 / 7, count: 38, regX: 0, regY: 0, spacing: 0, margin: 0},
                animations: {
                    static: [0, 0],
                    i: [0, 0],
                    a: [1, 7, false],
                    r: [7, 22, true],
                    R: [22, 37, true],
                    s: [0, 0, 'i'],
                    sa: [0, 0, 'a'],
                    d: [0, 0],
                    am: [0, 0, 'i'],
                    ar: [0, 0, 'i'],
                    ama: [0, 0, 'ia'],
                    ara: [0, 0, 'ia']
                }
            };

            this.sprite = new createjs.Sprite(new createjs.SpriteSheet(obj), 0);
            this.container = new createjs.Container();
            this.gotoAndPlay(this.state);
            this.text = new createjs.Text(name, "25px Arial", "#000000");
            this.text.textBaseline = "alphabetic";
            this.container.addChild(this.sprite);
            this.container.addChild(this.text);
            this.text.x = 0;
            this.text.y = 0;
            this.container.x = 0;
            this.container.y = 0;
            this.room.playersContainer.addChild(this.container);

            this.loaded = true;

            callback && callback();
        };

        try {

            console.log('adding player');

            preload.loadFile({id: name, src: spriteURL});

            this.name = name;
            this.health = health;
            this.x = x;
            this.y = y;
            this.side = side;
            this.look = side;
            this.score = score;
            this.stage = room.stage;
            this.room = room;
            this.gun = null;
            this.accelerateX = false;

            this.state = state;

            this.velX = 0;
            this.velY = PLAYER_RESTRICTIONS.playerGravity;
            this.loaded = false;

            preload.on('complete', handleCompleteLoad);
            preload.load();
        } catch (e) {
            alert(e);
        }
    }

    /** GET JSON TO SEND TO SERVER */
    getInfo() {
        return JSON.stringify(
            {
                name: this.name,
                state: this.state,
                side: this.side,
                look: this.look,
                x: this.x,
                y: this.y,
                fall: this.checkFallingBounds()
            }
        );
    }

    /** ALL ANIMATION HAPPENS HERE */
    update(info) {

        let setProps = (keys) => {

            for(let i = 0; i < keys.length; i++) {
                if(info.hasOwnProperty(keys[i]) && info[keys[i]] !== undefined) {
                    this[keys[i]] = info[keys[i]];
                }
            }
        };

        try {

            setProps(['health', 'x', 'y', 'side', 'look', 'score', 'mX', 'mY']);

            if (this.x > this.mX) {
                this.look = -1;
                this.text.x = -98;
            } else if (this.x < this.mX) {
                this.look = 1;
                this.text.x = 0;
            }

            // this.text.x = 0;

            this.container.x = this.x - this.look * this.getBounds().width / 2;
            this.container.y = this.y;
            this.gun && this.gun.update({mX: this.mX, mY: this.mY});
            this.sprite.scaleX = this.look;

            if (info.hasOwnProperty('state') && info.state !== this.state && info.state !== undefined) {
                this.state = info.state;

                for (let v in STATES) {
                    if (STATES[v] === info.state) {
                        this.gotoAndPlay(info.state);
                        break;
                    }
                }
            }

            if (info.hasOwnProperty('delete')) {
                this.gun && this.room.delWeapon(this.gun.name);
                this.room.delPlayer(this.name);
            }
        } catch (e) {/** not loaded yet? */}
    }

    gotoAndPlay(anim) {
        this.sprite.gotoAndPlay(anim);
    }

    getBounds() {
        return this.sprite.getBounds();
    }

    platformHitTest(area) {

        let y00 = this.y;
        let x01 = this.x;
        let y01 = this.getBounds().height + y00;

        let x10 = area.getBounds().x;
        let y10 = area.getBounds().y;
        let x11 = area.getBounds().x + area.getBounds().width;

        let checkPoint = (a0, a1, b) => {
            return(b >= a0 && b <= a1);
        };

        return (
            checkPoint(y10, y10 + MAXIMUM_PLATFORM_COLLISION_GAP, y01) &&
                checkPoint(x10, x11, x01)
        );
    }

    checkScreenBounds() {

        this.x = this.x < 0 ? 0 :
            this.x > this.room.width ?
                this.room.width :
                this.x;
    }

    /** SERVER HAS TO DECIDE TO RESPAWN PLAYER ON FALLING */
    checkFallingBounds() {
        return this.room.height < this.y;
    }

    setCoords(x, y) {

        this.x = x;
        this.y = y;
        this.state = STATES.inAir;
        this.velY = 0;
        this.velX = 0;
    }
}