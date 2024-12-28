package com.example.api.user.dto.response.dashboard;

import com.example.api.user.model.Rank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class GeneralStats {
    private Double avgGraphTask;
    private Double avgFileTask;
    private Long surveysNumber;

    private Double totalGraphTaskPoints; //total file task (offline surprises)
    private Double totalFileTaskPoints; //total graph task (online surprises)
    private Double trueSurprisesPoints; //sum of best 3 surprises (graphtask + fileTask)
    private Double totalAnnihilatedPoints; //points lost by annihilations
    private Double excessPoints; //oil excess
    private Double truePoints; //points without excess points
    private Double totalPoints; //poinrs including excess points
    private Double nextLvlPoints;
    private String rankName;
    private Long badgesNumber;
    private Long completedActivities;
    private Long foundWolfHoles;
    private Long receivedNominations;
}