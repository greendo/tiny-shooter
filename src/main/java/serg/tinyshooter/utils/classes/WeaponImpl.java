package serg.tinyshooter.utils.classes;

import org.json.JSONObject;
import serg.tinyshooter.utils.interfaces.Weapon;

public class WeaponImpl implements Weapon {

    private Integer x, y;
    private String playerName;

    @Override
    public JSONObject toJSONObject() {
        return null;
    }
}
