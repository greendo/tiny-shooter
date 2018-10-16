'use strict';

class Initialiser {

    constructor(biomSpritesURL, playerSpritesURL, gunsSpritesURL, name, roomId) {
        this.biomSpritesURL = biomSpritesURL;
        this.playerSpritesURL = playerSpritesURL;
        this.gunSpritesURL = gunsSpritesURL;
        this.name = name;
        this.roomId = roomId;
        this.wsclient = new WSClient(this);

        /** https://jsfiddle.net/k3rgk11e/2/ */
        (createjs.Graphics.Polygon = function(x, y, points) {
            this.x = x;
            this.y = y;
            this.points = points;
        }).prototype.exec = function(ctx) {
            // Start at the end to simplify loop
            var end = this.points[this.points.length - 1];
            ctx.moveTo(end.x, end.y);
            this.points.forEach(function(point) {
                ctx.lineTo(point.x, point.y);
            });
        };
        createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
            var points = [];
            if (Array.isArray(args)) {
                args.forEach(function(point) {
                    point = Array.isArray(point) ? {x:point[0], y:point[1]} : point;
                    points.push(point);
                });
            } else {
                args = Array.prototype.slice.call(arguments).slice(2);
                var px = null;
                args.forEach(function(val) {
                    if (px === null) {
                        px = val;
                    } else {
                        points.push({x: px, y: val});
                        px = null;
                    }
                });
            }
            return this.append(new createjs.Graphics.Polygon(x, y, points));
        };
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

    getWeapon(obj) {
        return this.room.getPlayer(obj.name, this.gunSpritesURL + obj.sprite, obj.x, obj.y);
    }

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
                let fw = (obj) => {
                    let w = t.init.getWeapon(obj);
                    if (obj['playerName']) {
                        //TODO: here may be problems
                        let p = t.init.getPlayer({name: obj['playerName']});
                        if (p.gun === null) {
                            w.pickUp(p);
                        }
                    }
                };
                for (let i = 0; i < weapons.length; i++) {
                    fw(weapons[i]);
                }

                let bullets = body['bullets'];
                let fb = (obj) => {
                    //TODO: BULLET UPDATE LOGIC
                }
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