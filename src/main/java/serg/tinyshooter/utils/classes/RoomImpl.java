package serg.tinyshooter.utils.classes;

import org.json.JSONArray;
import org.json.JSONObject;
import serg.tinyshooter.utils.interfaces.*;

import java.util.*;

/**
 * Created by jc on 08.02.18.
 */
public class RoomImpl implements Room, JSONable {

    private Integer id;
    private String biom;
    private List<Platform> platforms;
    private Map<String, Player> players;
    private List<Bullet> bullets;
    private List<Weapon> weapons;
    private static final double WEAPON_SPAWN_DELAY = 3000;
    private Date lastWeaponSpawnDate;

    RoomImpl(Integer id, String biom) {

        this.id = id;
        this.biom = biom;
        platforms = new ArrayList<>();
        players = new HashMap<>();
        bullets = new ArrayList<>();
        weapons = new ArrayList<>();
    }

    private void calcPlayer2Player() {}

    private void calcPlayer2Bullet() {}

    private void calcBullet2Terrain() {}

    private void calcPlayer2Weapon() {

        /** ArrayList iteration works faster with indexed loops */
        for (int i = 0; i < weapons.size(); i++) {
            for (Map.Entry<String, Player> entry : players.entrySet()) {
                Player p = entry.getValue();
                Weapon w = weapons.get(i);

                if (w.getPlayer() != null) {
                    w.setPlayer(p);
                }
            }
        }
    }

    @Override
    public void update() {
        //TODO: SPAWN WEAPONS, RESPAWN PLAYERS, CHECK COLLISION BETWEEN PLAYERS, WEAPONS AND BULLETS
        calcPlayer2Weapon();

        if (weapons.size() < 4) {
            spawnWeapon();
        }
    }

    @Override
    public void spawnWeapon() {
        Date tmp = new Date();
        if (lastWeaponSpawnDate == null
        || tmp.getTime() - lastWeaponSpawnDate.getTime() >= WEAPON_SPAWN_DELAY) {
            //TODO: SPAWN GUNS AT DIFFERENT POINTS
//            Weapon w = new WeaponImpl();
//            weapons.add(w);
//            lastWeaponSpawnDate = new Date();
        }
    }

    @Override
    public Player addPlayer(String name, String sprite) {

        if (!players.containsKey(name)) {
            Player p = new PlayerImpl(name, sprite);
            players.put(name, p);
            return p;
        }
        return null;
    }

    @Override
    public void addPlatform(int tilesCount, int x, int y) {
        platforms.add(new PlatformImpl(tilesCount, x, y));
    }

    @Override
    public void removePlayer(String name) {
        players.remove(name);
    }

    @Override
    public Player getPlayer(String name) {
        return players.get(name);
    }

    @Override
    public void initBullet(String playerName, int x0, int y0, int x1, int y1) {

    }

    @Override
    public String getInitScript() {
//        StringBuilder sb = new StringBuilder("init.addRoom(\"" + biom + "\")");
        StringBuilder sb = new StringBuilder("init.addRoom()");

        int i = 0;
        for (Platform p : platforms) {
            sb.append('.').append(p.getInitScript(i));
            ++i;
        }

        return sb.append(';').toString();
    }

    @Override
    @Deprecated
    public String getInitScript(int i) {
        return null;
    }

    @Override
    public JSONObject toJSONObject() {

        JSONObject result = new JSONObject();

        result.put("players", constructBigJSONArray(players));
        result.put("weapons", constructBigJSONArray(weapons));
        result.put("bullets", constructBigJSONArray(bullets));

        deleteDisconnectedPlayers();

        return result;
    }

    private JSONArray constructBigJSONArray(Map<?, ?> map) throws ClassCastException {

        JSONArray result = new JSONArray();

        for (Map.Entry<?, ?> e : map.entrySet()) {
            JSONable v = (JSONable) e.getValue();
            result.put(v.toJSONObject());
        }

        return result;
    }

    private JSONArray constructBigJSONArray(List<?> list)  throws ClassCastException {

        JSONArray result = new JSONArray();

        for (int i = 0; i < list.size(); i++) {
            JSONable j = (JSONable) list.get(i);
            JSONObject jo = j.toJSONObject();
            jo.put("name", i);
            result.put(jo);
        }

        return result;
    }

    private void deleteDisconnectedPlayers() {

        List<String> dn = new ArrayList<>(players.size());

        for (Map.Entry<String, Player> e : players.entrySet()) {
            String n = e.getKey();
            Player p = e.getValue();
            if (p.delete()) {
                dn.add(n);
            }
        }

        for (int i = 0; i < dn.size(); i++) {
            players.remove(dn.get(i));
        }
    }

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public String getBiom() {
        return biom;
    }
}