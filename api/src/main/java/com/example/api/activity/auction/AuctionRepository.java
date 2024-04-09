package com.example.api.activity.auction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findAllByResolutionDateIsBeforeAndResolvedIsFalse(LocalDateTime localDateTime);
    List<Auction> findAllByResolvedIsTrue();
}
