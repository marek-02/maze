package com.example.api.user.dto.response.dashboard;

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
    private Double totalStrollPoints;
    private Double strollPointsForGrade;
    private Double totalAuctionWonPoints; //points won from solved tasks after winning an auction
    private Double totalAuctionBidPoints; //points lost on bidding
    private Double totalAnnihilatedPoints; //points lost by annihilations
    private Double excessPoints; 
    private Double truePoints; 
    private Double totalPoints; 
    private Double firstCaskPoints; 
    private Double otherCaskPoints;
    private Double nextLvlPoints;
    private String rankName;
    private Long badgesNumber;
    private Long completedActivities;
    private Long foundWolfHoles;
    private Long receivedNominations;
}