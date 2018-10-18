package serg.tinyshooter.utils.classes;

import serg.tinyshooter.utils.interfaces.SpawnPoint;
import serg.tinyshooter.utils.interfaces.Spawnable;

public class SpawnPointWeapon implements SpawnPoint {

    private int x, y;
    private Spawnable s;

    public SpawnPointWeapon(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public Spawnable getSpawned() {
        return s;
    }

    @Override
    public void setSpawned(Spawnable s) {
        this.s = s;
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
