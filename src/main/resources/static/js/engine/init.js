'use strict';

class Initialiser {

    constructor(biomSpritesURL, playerSpritesURL, gunsSpritesURL, name, roomId) {
        this.biomSpritesURL = biomSpritesURL;
        this.playerSpritesURL = playerSpritesURL;
        this.gunsSpritesURL = gunsSpritesURL;
        this.name = name;
        this.roomId = roomId;
        this.wsclient = new WSClient(this);
    }

    connect() {
        if (!this.wsclient.connected) {
            this.wsclient.connect(this.name);
            this.wsclient.connected = true;
            alert('connected');
        }
    }

    disconnect() {
        if (this.wsclient.connected) {
            this.wsclient.disconnect();
            this.wsclient.connected = false;
            alert('disconnected');
        }
    }

    getPlayer(obj) {
        return this.room.getPlayer(obj.name, this.playerSpritesURL + obj.sprite, obj.health, obj.side, obj.x, obj.y, obj.score, obj.state, this.name);
    }

    delPlayer(name) {
        return this.room.delPlayer(name);
    }

    getWeapon(obj) {}

    delWeapon(name) {}

    getBullet(obj) {}

    delBullet(name) {}

    addPlatform(tiles, index, x, y, callback) {
        this.room.platformsArr.push(
            new Platform(tiles, index, x, y, this.room, callback)
        );
        return this;
    }

    addRoom() {
        let stage = new createjs.Stage('canvas');
        this.room = new Room(this.biomSpritesURL, stage, this.wsclient);
        return this;
    }

}

class WSClient {

    constructor(init) {
        this.connected = false;
        this.sendTo = '/ws/server/' + init.roomId;
        this.receiveFrom = '/room/' + init.roomId;
        this.serverEndpoint = '/server-endpoint';
        this.init = init;
    }

    connect() {

        this.socket = new SockJS(this.serverEndpoint);
        let stompClient = this.stompClient = Stomp.over(this.socket);
        let t = this;

        stompClient.connect({}, function (frame) {

            console.log('Connected: ' + frame);

            stompClient.subscribe(t.receiveFrom, function (message) {

                let body = JSON.parse(message.body);

                let players = body['players'];
                let fp = (obj) => {
                    let p = t.init.getPlayer(obj);
                    if (obj['name'] === t.init.name) {
                        obj['x'] = undefined;
                        obj['y'] = undefined;
                        obj['side'] = undefined;
                        obj['look'] = undefined;
                        obj['state'] = undefined;
                        obj['mX'] = undefined;
                        obj['mY'] = undefined;
                    }
                    p.update(obj);
                };
                for (let i = 0; i < players.length; i++) {
                    fp(players[i]);
                }

                let weapons = body['weapons'];
                let fw = (obj) => {};

                let bullets = body['bullets'];
            });

            /** send message to create new player */
            t.sendMessage(JSON.stringify({name: t.init.name}), t.sendTo + '/join');
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }

    sendMessage(message, path = this.sendTo) {
        if (this.connected) {
            this.stompClient.send(path, {}, message);
        }
    }
}