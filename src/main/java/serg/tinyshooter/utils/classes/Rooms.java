package serg.tinyshooter.utils.classes;

import serg.tinyshooter.utils.interfaces.Room;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by jc on 08.02.18.
 */
public class Rooms {

    private Rooms() {}

    private static Map<Integer, Room> rooms = new HashMap<>();

    public static synchronized void addRoom(String biom) {
        rooms.put(rooms.size(), new RoomImpl(rooms.size(), biom));
    }

    public static synchronized void delRoom(Integer id) {
        rooms.remove(id);
    }

    public static Room getRoom(Integer id) {
        return rooms.get(id);
    }

    public static Map<Integer, Room> getRooms() {

        if (!rooms.containsKey(0)) {
            addRoom("desert");
            Room r = getRoom(0);
            r.addPlatform(10, 0, 900);
            r.addPlatform(4, 1280, 800);
            r.addPlatform(3, 500, 650);
            r.addPlatform(2, 700, 450);
            r.addPlatform(4, 10 * 128, 250);
        }

        return rooms;
    }
}
