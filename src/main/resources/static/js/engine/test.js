let test = function (biomSpritesURL, playerSpritesURL, gunsSpritesURL) {

    let stage = new createjs.Stage('canvas');

    // window.addEventListener('resize', function () {
    //     stage.canvas.width = window.innerWidth;
    //     stage.canvas.height = window.innerHeight;
    // }, false);

    let playersArr = [];
    let platformsArr = [];

    window.room = new Room(biomSpritesURL, stage, playersArr, platformsArr);

    // platformsArr.push(
    //     new Platform(10, 0, 0, 1028 - 128, room, callback)
    // );
    // platformsArr.push(
    //     new Platform(4, 1, 10 * 128, 800, room, callback)
    // );
    // platformsArr.push(
    //     new Platform(3, 2, 500, 650, room, callback)
    // );
    // platformsArr.push(
    //     new Platform(2, 3, 700, 450, room, callback)
    // );
    // platformsArr.push(
    //     new Platform(4, 4, 10 * 128, 250, room, callback)
    // );
    // platformsArr.push(
    //     new Platform(4, 4, 10 * 128, 250, room, callback)
    // );

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

        // document.getElementById("left").onmousedown = function() {
        //     controller.pressA();
        // };
        // document.getElementById("left").ontouchstart = function() {
        //     controller.pressA();
        // };
        // document.getElementById("left").onmouseup = function() {
        //     controller.releaseA();
        // };
        // document.getElementById("left").ontouchend = function() {
        //     controller.releaseA();
        // };
        // document.getElementById("right").onmousedown = function() {
        //     controller.pressD();
        // };
        // document.getElementById("right").ontouchstart = function() {
        //     controller.pressD();
        // };
        // document.getElementById("right").onmouseup = function() {
        //     controller.releaseD();
        // };
        // document.getElementById("right").ontouchend = function() {
        //     controller.releaseD();
        // };
        // document.getElementById("jump").onclick = function() {
        //     controller.pressSpace();
        // };
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

    window.gun = new Gun(gunsSpritesURL + 'shotgun', 0, 0, room);
};