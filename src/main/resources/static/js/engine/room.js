'use strict';

class Room {

    constructor(biom, stage, wsclient) {

        this.width = 1920;
        this.height = 1080;

        this.playersArr = [];
        this.platformsArr = [];
        this.biom = biom;

        this.stage = stage;
        this.platformsContainer = new createjs.Container();
        this.playersContainer = new createjs.Container();
        this.weaponsContainer = new createjs.Container();

        this.back = new createjs.Bitmap(biom + 'back.png');

        this.objectsLoaded = false;

        stage.addChild(this.back);
        stage.addChild(this.platformsContainer);
        stage.addChild(this.playersContainer);
        stage.addChild(this.weaponsContainer);
        this.stage.update();

        this.wsclient = wsclient;
    }

    start(controller) {

        this.controller = controller;

        let tick = (e) => {

            if (this.objectsLoaded) {
                this.controller.calculate();
                this.stage.update();

                this.wsclient.sendMessage(this.localPlayer.getInfo());

            } else this.checkIfLoaded();
        };

        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", tick);
    }

    checkIfLoaded() {

        for (let i = 0; i < this.platformsArr.length; i++) {
            if (!this.platformsArr[i].loaded) {
                return;
            }
        }
        for (let i = 0; i < this.playersArr.length; i++) {
            if (!this.playersArr[i].loaded) {
                return;
            }
        }
        this.objectsLoaded = true;
        this.controller.activateMouseListener();
    }

    addPlatform(tiles, index, x, y, callback) {
        this.objectsLoaded = false;
        this.platformsArr.push(
            new Platform(tiles, index, x, y, this, callback)
        );
    }

    getPlayer(name, sprite, health, side, x, y, score, state, localPlayerName) {

        for (let i = 0; i < this.playersArr.length; i++) {
            if (this.playersArr[i].name === name) {
                return this.playersArr[i];
            }
        }

        this.objectsLoaded = false;
        let player = new Player(name, sprite + '/p.png', health, side, x, y, score, state, this);
        this.playersArr.push(player);

        if (name === localPlayerName) {
            this.start(new PlayerController(player, this.stage, this.platformsArr));
            this.localPlayer = player;
        }

        console.log('added player ' + name);
        return player;
    }

    delPlayer(name) {
        this.objectsLoaded = false;
        for (let i = 0; i < this.playersArr.length; i++) {
            if (this.playersArr[i].name === name) {
                this.playersArr.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}

class Platform {

    constructor(tilesCount, index, x, y, room, callback = null) {

        if (tilesCount < 2) {
            throw new Error('insufficient tiles count');
        }

        if (!room instanceof Room) {
            throw new Error('wrong arg type');
        }

        // console.log('creating platform #' + index);

        this.platform = [];
        this.room = room;
        this.tilesCount = tilesCount;
        this.x = x;
        this.y = y;
        this.index = index;
        this.loaded = false;

        let preload = new createjs.LoadQueue();

        let rnd = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        for (let i = 0; i < tilesCount; i++) {

            let path = i === 0 ? room.biom + 't_01.png' :
                i === tilesCount - 1 ?
                    room.biom + 't_04.png' :
                    room.biom + 't_0' + rnd(2, 4) + '.png';

            preload.loadFile({id: 'img_' + this.index + '_' + i, src: path});
        }

        let handleCompleteLoad = () => {

            let addBlock = (i) => {

                let image = preload.getResult('img_' + this.index + '_' + i);
                this.platform[i] = new createjs.Bitmap(image);

                this.room.platformsContainer.addChild(this.platform[i]);
            };

            let positionBlock = (i) => {
                this.platform[i].x = i === 0 ? this.x : this.x + 128 * i;
                this.platform[i].y = this.y;
            };

            for (let i = 0; i < this.tilesCount; i++) {
                addBlock(i);
                positionBlock(i);
            }

            this.loaded = true;
            this.room.stage.update();

            callback && callback();
        };

        preload.on('complete', handleCompleteLoad);
        preload.load();
    }

    getBounds() {

        return {
            x: this.platform[0].x,
            y: this.platform[0].y,
            width: 128 * this.tilesCount,
            height: 128
        };
    }

    getGround() {
        return this.platform[0].y;
    }
}