package serg.tinyshooter.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import serg.tinyshooter.messages.NewPlayerPOJO;
import serg.tinyshooter.messages.PlayerPOJO;
import serg.tinyshooter.utils.classes.Rooms;
import serg.tinyshooter.utils.interfaces.Player;
import serg.tinyshooter.utils.interfaces.Room;

import java.util.Map;

/**
 * Created by jc on 23.02.18.
 */

@EnableScheduling
@Controller
public class WebSocketController {

    @Autowired
    public SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/server/{roomId}/join")
    public void acceptNewPlayer(@DestinationVariable String roomId, NewPlayerPOJO p) {
        Room room = Rooms.getRoom(Integer.parseInt(roomId));
        try {
            Player pl = room.addPlayer(p.getName(), "bobby");
            pl.spawn(300, 20);
        } catch (NullPointerException e) {
            System.out.println("Player with this name already exists!");
        }
    }

    @MessageMapping("/server/{roomId}")
    public void acceptPlayer(@DestinationVariable String roomId, PlayerPOJO p) {
        Room room = Rooms.getRoom(Integer.parseInt(roomId));
        Player pl = room.getPlayer(p.getName());
        pl.update(p);
    }

    @Scheduled(fixedDelay = 30)
    private void updateAllClients() {

        for (Map.Entry<Integer, Room> roomEntry : Rooms.getRooms().entrySet()) {
            Room room = roomEntry.getValue();
            room.update();

            String path = "/room/" + room.getId();
            System.out.println("path: " + path);
            JSONObject j = room.toJSONObject();
            System.out.println("roomJSON: " + j.toString());

            try {
                simpMessagingTemplate.convertAndSend(path, j.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
