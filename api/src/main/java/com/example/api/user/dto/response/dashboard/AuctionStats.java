package com.example.api.user.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class AuctionStats {
    private Integer auctionsWon;
    private Double auctionsPoints;
    private Integer auctionsParticipations;
    private Integer auctionsResolvedCount;
    private Integer auctionsCount;
    private Integer auctionRanking;
    private String bestAuctioner;
}
