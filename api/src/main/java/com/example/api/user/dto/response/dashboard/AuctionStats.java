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
    private Double auctionsWon;
    private Double auctionsPoints;
    private Double auctionsParticipations;
    private Double auctionsResolvedCount;
    private Double auctionsCount;
    private Double auctionRanking;
    private String bestAuctioner;
}
