package serg.tinyshooter.utils.interfaces;


/**
 * Created by jc on 22.03.17.
 */
public interface Room extends ScriptInitable, JSONable {

    void update();
    Player addPlayer(String name, String sprite);
    void addPlatform(int tilesCount, int x, int y);
    void removePlayer(String name);
    Player getPlayer(String name);
    void initBullet(String playerName, int x0, int y0, int x1, int y1);
    Integer getId();
    String getBiom();
}
