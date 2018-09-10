package serg.tinyshooter.utils.classes;

import org.json.JSONObject;
import serg.tinyshooter.messages.PlayerPOJO;
import serg.tinyshooter.utils.interfaces.InteractableObj;
import serg.tinyshooter.utils.interfaces.Player;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by jc on 16.01.18.
 */
public class PlayerImpl implements Player, InteractableObj {

    private Map<String, Integer> values;
    private String state, name, sprite;

    PlayerImpl(String name, String sprite) {

        values = new HashMap<>();
        this.name = name;
        this.sprite = sprite;
    }

    @Override
    public boolean collides(InteractableObj o) {
        return false;
    }

    @Override
    public void spawn(int x, int y) {

        state = "a";
        values.put("side", 1); //1: right, -1: left
        values.put("look", 1); //1: right, -1: left
        values.put("x", x);
        values.put("y", y);
        values.put("health", 100);
        values.put("score", 0);
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getSprite() {
        return sprite;
    }

    @Override
    public void update(PlayerPOJO p) {

        state = p.getState();
        values.put("x", p.getX());
        values.put("y", p.getY());
        values.put("side", p.getSide());
        values.put("look", p.getLook());
    }

    @Override
    public JSONObject toJSONObject() {

        JSONObject result = new JSONObject();

        result.put("name", name);
        result.put("state", state);
        result.put("sprite", sprite);

        for (Map.Entry<String, Integer> e : values.entrySet()) {
            result.put(e.getKey(), e.getValue());
        }

        return result;
    }

}
