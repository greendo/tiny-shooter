package serg.tinyshooter.utils.classes;

import org.json.JSONObject;
import serg.tinyshooter.utils.interfaces.InteractableObj;
import serg.tinyshooter.utils.interfaces.Player;
import serg.tinyshooter.utils.interfaces.Weapon;

public class WeaponImpl implements Weapon {

    private Integer x, y;
    private Player player;
    private String sprite;

    WeaponImpl(String sprite, int x, int y) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }

    @Override
    public JSONObject toJSONObject() {
        JSONObject json = new JSONObject();
        if (player == null) {
            json.put("x", x).put("y", y);
        } else {
            json.put("playerName", player.getName());
        }
        json.put("sprite", sprite);
        return json;
    }

    @Override
    public boolean collides(InteractableObj o) {
        return false;
    }

    @Override
    public Player getPlayer() {
        return player;
    }

    @Override
    public void setPlayer(Player player) {
        this.player = player;
    }
}
