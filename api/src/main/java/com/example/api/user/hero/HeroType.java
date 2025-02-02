package com.example.api.user.hero;

public enum HeroType {
    UNFORTUNATE("Nieszczęśnik"),
    SHEUNFORTUNATE("Nieszczęśnica");

    private final String type;

    HeroType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public String getPolishTypeName() {
        return switch (this.type) {
            case "UNFORTUNATE" -> "NIESZCZĘŚNIK";
            case "SHEUNFORTUNATE" -> "NIESZCZĘŚNICA";
            default -> "";
        };
    }
}
