package serg.tinyshooter.utils.classes;

import serg.tinyshooter.utils.classes.factory.RoomFactory;
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
        rooms.put(rooms.size(), RoomFactory.produce(rooms.size()));
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
        }

        return rooms;
    }
}
