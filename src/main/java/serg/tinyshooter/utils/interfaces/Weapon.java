package serg.tinyshooter.utils.interfaces;

/**
 * Created by jc on 08.02.18.
 */
public interface Weapon extends JSONable, InteractableObj, Spawnable {
    Player getPlayer();
    void setPlayer(Player p);
}
