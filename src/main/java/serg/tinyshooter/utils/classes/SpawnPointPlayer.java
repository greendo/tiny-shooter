package serg.tinyshooter.utils.classes;

import serg.tinyshooter.utils.interfaces.SpawnPoint;
import serg.tinyshooter.utils.interfaces.Spawnable;

public class SpawnPointPlayer implements SpawnPoint {

    private int x, y;

    SpawnPointPlayer(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public Spawnable getSpawned() {
        return null;
    }

    @Override
    public void setSpawned(Spawnable s) {

    }

    @Override
    public int getX() {
        return x;
    }

    @Override
    public int getY() {
        return y;
    }
}
