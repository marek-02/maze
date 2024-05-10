package com.example.api.user.hero;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class HeroTypeStatsDTO {
    private String heroType;
    private Integer rankPosition;
    private Long rankLength;
    private Integer overallRankPosition;
    private Long overallRankLength;
    private Double betterPlayerPoints;
    private Double worsePlayerPoints;
    private Double betterPlayerPointsOverall;
    private Double worsePlayerPointsOverall;
}
