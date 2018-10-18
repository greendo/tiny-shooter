package serg.tinyshooter.utils.interfaces;

public interface SpawnPoint {

    Spawnable getSpawned();
    void setSpawned(Spawnable s);
    int getX();
    int getY();
}
