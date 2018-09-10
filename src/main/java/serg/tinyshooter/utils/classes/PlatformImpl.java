package serg.tinyshooter.utils.classes;

import serg.tinyshooter.utils.interfaces.InteractableObj;
import serg.tinyshooter.utils.interfaces.Platform;

/**
 * Created by jc on 11.02.18.
 */
public class PlatformImpl implements Platform {

    int tilesCount, x, y;

    PlatformImpl(int tilesCount, int x, int y) {

        this.tilesCount = tilesCount;
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean collides(InteractableObj o) {
        return false;
    }

    @Override
    @Deprecated
    public String getInitScript() {
        return null;
    }

    @Override
    public String getInitScript(int i) {
        return "addPlatform(" + tilesCount + ", " + i + ", " + x + ", " + y + ")";
    }
}
