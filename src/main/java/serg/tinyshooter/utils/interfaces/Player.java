package serg.tinyshooter.utils.interfaces;

import serg.tinyshooter.messages.PlayerPOJO;

/**
 * Created by jc on 22.03.17.
 */
public interface Player extends JSONable {

    void spawn(int coordX, int coordY);
    String getName();
    String getSprite();
    void update(PlayerPOJO p);
    boolean delete();
}
