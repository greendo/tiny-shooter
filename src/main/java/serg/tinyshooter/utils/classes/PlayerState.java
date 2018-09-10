package serg.tinyshooter.utils.classes;

/**
 * Created by jc on 16.01.18.
 */
public enum PlayerState {

    IDLE("i"),
    IN_AIR("a"),
    IN_AIR_ATTACK_MELEE("amg"),
    IN_AIR_ATTACK_RANGE("arg"),
    RUN("r"),
    RUN_REVERSE("R"),
    STRUCK("sg"),
    STRUCK_AIR("sa"),
    DEAD("d"),
    ATTACK_MELEE("ama"),
    ATTACK_RANGE("ara");

    private String state;

    public String getState() {
        return state;
    }

    PlayerState(String state) {
        this.state = state;
    }

    static PlayerState getStateByValue(String v) {

        switch (v) {
            case "i": return IDLE;
            case "a": return IN_AIR;
            case "amg": return IN_AIR_ATTACK_MELEE;
            case "arg": return IN_AIR_ATTACK_RANGE;
            case "r": return RUN;
            case "R": return RUN_REVERSE;
            case "sg": return STRUCK;
            case "sa": return STRUCK_AIR;
            case "d": return DEAD;
            case "ama": return ATTACK_MELEE;
            case "ara": return ATTACK_RANGE;
            default: return IDLE;
        }
    }
}
