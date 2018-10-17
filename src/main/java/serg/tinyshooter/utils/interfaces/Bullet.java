package serg.tinyshooter.utils.interfaces;

/**
 * Created by jc on 22.03.17.
 */
public interface Bullet extends JSONable, InteractableObj {

    Integer getId();
    void hit(Player p);
    void hit(Terrain t);
    boolean hitOccured();
}
