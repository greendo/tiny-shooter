let test = function (biomSpritesURL, playerSpritesURL, gunsSpritesURL) {

    let stage = new createjs.Stage('canvas');


    let playersArr = [];
    let platformsArr = [];

    /** https://jsfiddle.net/k3rgk11e/2/ */
    (createjs.Graphics.Polygon = function(x, y, points) {
        this.x = x;
        this.y = y;
        this.points = points;
    }).prototype.exec = function(ctx) {
        // Start at the end to simplify loop
        let end = this.points[this.points.length - 1];
        ctx.moveTo(end.x, end.y);
        this.points.forEach(function(point) {
            ctx.lineTo(point.x, point.y);
        });
    };
    createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
        let points = [];
        if (Array.isArray(args)) {
            args.forEach(function(point) {
                point = Array.isArray(point) ? {x:point[0], y:point[1]} : point;
                points.push(point);
            });
        } else {
            args = Array.prototype.slice.call(arguments).slice(2);
            let px = null;
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

    window.room = new Room(biomSpritesURL, stage);

    window.poly = new createjs.Shape();
    poly.graphics.beginFill('#ffff00').drawPolygon(0, 0, 0, 0, 150, 100, 100, 60);
    poly.x = 10;
    poly.y = 10;
    window.room.stage.addChild(poly);



    let addPlatform = (tiles, index, x, y, callback) => {
        platformsArr.push(
            new Platform(tiles, index, x, y, room, callback)
        );
    };
    let addPlayer = (callback) => {
        let player1 = new Player('p1', playerSpritesURL + 'bobby/p.png', 100, 1, 300, 20, 0, 'ia', room);
        playersArr.push(player1);
        window.p = player1;

        callback && callback();

        let controller = new PlayerController(player1, stage, platformsArr);
        room.start(controller);
    };

    addPlayer(
        addPlatform(4, 5, 10 * 128, 250,
            addPlatform(4, 4, 10 * 128, 250,
                addPlatform(2, 3, 700, 450,
                    addPlatform(3, 2, 500, 650,
                        addPlatform(5, 1, 10 * 128, 800,
                            addPlatform(10, 0, 0, 900)
                        )
                    )
                )
            )
        )
    );

    window.gun = new Gun(gunsSpritesURL + 'shotgun.png', 0, 0, room, 0);
};