package serg.tinyshooter.utils.classes.factory;

import serg.tinyshooter.utils.classes.RoomImpl;
import serg.tinyshooter.utils.interfaces.Room;

public class RoomFactory {

    private RoomFactory() {}

    public static Room produce(int id) {
        return produceDefault(id);
    }

    private static Room produceDefault(int id) {

        Room r = new RoomImpl(id, "desert");

        r.addPlatform(15, 0, 900);
        r.addPlatform(4, 11 * 128, 670);
        r.addPlatform(4, 0, 670);
        r.addPlatform(5, (5 * 128), 440);
        r.addPlatform(4, 0, 210);
        r.addPlatform(4, 11 * 128, 210);

        r.addPlayerSpawn(600, 20);
        r.addWeaponSpawn(300, 20);

        return r;
    }
}
