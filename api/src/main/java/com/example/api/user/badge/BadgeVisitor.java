package com.example.api.user.badge;

import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.activity.result.model.LaboratoryPoints;
import com.example.api.activity.auction.Auction;
import com.example.api.activity.auction.AuctionRepository;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.badge.types.*;
import com.example.api.user.model.AccountType;
import com.example.api.user.model.User;
import com.example.api.activity.result.service.LaboratoryPointsService;
import com.example.api.activity.submittask.result.SubmitTaskResultRepository;
import com.example.api.activity.submittask.result.SubmitTaskStatus;
import com.example.api.course.coursemember.CourseMember;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;;

@Service
@RequiredArgsConstructor
@Slf4j
public class BadgeVisitor {
    private final LoggedInUserService authService;
    private final LaboratoryPointsService labPointsService;
    private final AuctionRepository auctionRepository;
    private final SubmitTaskResultRepository submitTaskResultRepository;

    public boolean visitGeneralBadge(Badge badge){
        log.info("Visiting general badge {}",badge.getTitle());
        User student = authService.getCurrentUser();
        if(!student.getAccountType().equals(AccountType.STUDENT)) return false;

        if(badge.getTitle().equals("Kronikarz") || badge.getTitle().equals("Arcymotacz") ){
            String targetRoleName = badge.getTitle().equals("Kronikarz") ? "scribe" : "cablemaster"; //which role is important for the badge
            // User student = authService.getCurrentUser();
            try {
                List<LaboratoryPoints> allLabPoints = labPointsService.getLaboratoryPointsSimplified(student, badge.getCourse().getId());

                int occurrences = 0;
                for(LaboratoryPoints labPoints : allLabPoints){
                    if(labPoints.getRole().equals(targetRoleName) && labPoints.getPoints().equals(Double.valueOf(3.0)) ){
                        occurrences++;
                    }
                }

                return occurrences >= 3;
            } catch (EntityNotFoundException e) {                
                e.printStackTrace();
            }           
        }
        else if(badge.getTitle().equals("Dzierżymorda")){
            // User student = authService.getCurrentUser();
            try{
                List<LaboratoryPoints> allLabPoints = labPointsService.getLaboratoryPointsSimplifiedForAllUsers( badge.getCourse().getId());
                int othersBestScore = 0;
                int userScore = 0;
                Map<Long,Integer> allOccurances = new HashMap<>();
                for(LaboratoryPoints labPoints : allLabPoints){
                    if(!labPoints.getRole().equals("econom") || !labPoints.getPoints().equals(Double.valueOf(3.0))) continue;
                    Long responseUserId = labPoints.getMember().getUser().getId();
                    allOccurances.put(responseUserId, allOccurances.getOrDefault(responseUserId,0)+1);

                    if(responseUserId == student.getId()) userScore++;
                    else othersBestScore = Math.max(allOccurances.get(responseUserId), othersBestScore);
                }
                return userScore > othersBestScore;
            }catch(EntityNotFoundException e){

            }
            
        }
        else if(badge.getTitle().equals("A.B.Normal")){
            CourseMember member = authService.getCurrentUser().getCourseMember(badge.getCourse().getId()).orElseThrow();

            List<Auction> resolvedAuctions = auctionRepository.findAllResolvedByCourseId(badge.getCourse().getId());
            // log.info("Ilość aukcji {}", resolvedAuctions.size());
            Map<Long,Integer> allOccurances = new HashMap<>();
            int[] bestScore = {0}; //to make Java happy, int is wrapped in an array to be used in lambda
            if (!resolvedAuctions.isEmpty()) {
                for (Auction auction : resolvedAuctions) {                    
                    auction.getHighestBid().ifPresent(bid -> {
                        Long auctionMemberId = bid.getMember().getId();
                        int numOccurancesBefore = allOccurances.getOrDefault(auctionMemberId,0);

                        allOccurances.put(auctionMemberId, numOccurancesBefore+1);
                        bestScore[0] = Math.max(bestScore[0],numOccurancesBefore);                       
                    });                   
                }
            }

            int thisMemberBestScore =  allOccurances.getOrDefault(member.getId(),0);
            return thisMemberBestScore > bestScore[0];
        }
        else if(badge.getTitle().equals("Tropiciel")){
            // User student = authService.getCurrentUser();
            try{
                List<LaboratoryPoints> allLabPoints = labPointsService.getLaboratoryPointsSimplified(student, badge.getCourse().getId());
                int totalWolfHoles = 0;
                for(LaboratoryPoints labPoints : allLabPoints){
                    totalWolfHoles += labPoints.getFoundWolfHoles();
                }
                return totalWolfHoles >= 3;
            }catch(EntityNotFoundException e){

            }
        }
        else if(badge.getTitle().equals("Grim Reaper")){
            CourseMember member = authService.getCurrentUser().getCourseMember(badge.getCourse().getId()).orElseThrow();
            long res = submitTaskResultRepository.countSubmitTaskResultByMemberAndStatus(member, SubmitTaskStatus.ACCEPTED);
            return res > 2;
        }
        else if(badge.getTitle().equals("E.U.geniusz")){
            // User student = authService.getCurrentUser();
            try{
                List<LaboratoryPoints> allLabPoints = labPointsService.getLaboratoryPointsSimplifiedForAllUsers( badge.getCourse().getId());
                Long othersBestScore = Long.valueOf(0);
                Map<Long,Long> allOccurances = new HashMap<>();
                for(LaboratoryPoints labPoints : allLabPoints){
                    Long responseUserId = labPoints.getMember().getUser().getId();
                    allOccurances.put(responseUserId, allOccurances.getOrDefault(responseUserId,Long.valueOf(0) )+labPoints.getReceivedNominations());

                    if(responseUserId != student.getId()) othersBestScore = Math.max(allOccurances.get(responseUserId), othersBestScore);
                }
                return othersBestScore < allOccurances.getOrDefault(student.getId(),Long.valueOf(0));
            }
            catch(EntityNotFoundException e ){

            }
        }
        
        return false;
    }

}

