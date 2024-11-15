package com.example.api.user.badge;

import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.MissingAttributeException;
import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.activity.result.model.FileTaskResult;
import com.example.api.activity.result.model.GraphTaskResult;
import com.example.api.activity.result.model.LaboratoryPoints;
import com.example.api.activity.result.model.ActivityResult;
import com.example.api.activity.Activity;
import com.example.api.activity.auction.Auction;
import com.example.api.activity.auction.AuctionRepository;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.badge.types.*;
import com.example.api.user.dto.response.dashboard.DashboardResponse;
import com.example.api.user.model.AccountType;
import com.example.api.user.model.User;
import com.example.api.activity.result.service.FileTaskResultService;
import com.example.api.activity.result.service.GraphTaskResultService;
import com.example.api.activity.result.service.LaboratoryPointsService;
import com.example.api.activity.result.service.TaskResultService;
import com.example.api.activity.result.service.ranking.RankingService;
import com.example.api.activity.task.dto.response.result.LaboratoryPointsResponse;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class BadgeVisitor {
    private final TaskResultService taskResultService;
    private final GraphTaskResultService graphTaskResultService;
    private final FileTaskResultService fileTaskResultService;
    private final UserService userService;
    private final RankingService rankingService;
    private final LoggedInUserService authService;
    private final LaboratoryPointsService labPointsService;
    private final AuctionRepository auctionRepository;

    // private final DashboardService dashboardService;

    public boolean visitGeneralBadge(Badge badge){
        log.info("Visiting general badge {}",badge.getTitle());

        if(badge.getTitle().equals("Kronikarz") || badge.getTitle().equals("Arcymotacz") ){
            String targetRoleName = badge.getTitle().equals("Kronikarz") ? "scribe" : "cablemaster"; //which role is important for the badge
            User student = authService.getCurrentUser();
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
            User student = authService.getCurrentUser();
            try{
                List<LaboratoryPoints> allLabPoints = labPointsService.getLaboratoryPointsSimplifiedForAllUsers( badge.getCourse().getId());
                int othersBestScore = 0;
                int userScore = 0;
                Map<Long,Integer> allOccurances = new HashMap<>();
                for(LaboratoryPoints labPoints : allLabPoints){
                    // log.info("role: {} {}",labPoints.getRole(), labPoints.getPoints() );
                    // log.info("{} {}",!labPoints.getRole().equals("econom"),!labPoints.getPoints().equals(Double.valueOf(3.0)));
                    if(!labPoints.getRole().equals("econom") || !labPoints.getPoints().equals(Double.valueOf(3.0))) continue;
                    Long responseUserId = labPoints.getMember().getUser().getId();
                    allOccurances.put(responseUserId, allOccurances.getOrDefault(responseUserId,0)+1);

                    if(responseUserId == student.getId()) userScore++;
                    else othersBestScore = Math.max(allOccurances.get(responseUserId), othersBestScore);
                }
                // log.info("Wynik gorskiego: {}", userScore);
                // log.info("Wynik reszty: {}",othersBestScore);
                return userScore > othersBestScore;
            }catch(EntityNotFoundException e){

            }
            
        }
        else if(badge.getTitle().equals("A.B.Normal")){
            CourseMember member = authService.getCurrentUser().getCourseMember(badge.getCourse().getId()).orElseThrow();

            List<Auction> resolvedAuctions = auctionRepository.findAllResolvedByCourseId(badge.getCourse().getId());
            log.info("Ilość aukcji {}", resolvedAuctions.size());
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
            log.info("Aukcje jerzego {}, reszty {}",thisMemberBestScore,bestScore[0]);
            return thisMemberBestScore > bestScore[0];
        }
        else if(badge.getTitle().equals("Tropiciel")){
            User student = authService.getCurrentUser();
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
        
        return false;
    }

    // public boolean visitActivityNumberBadge(ActivityNumberBadge badge) {
    //     User student = authService.getCurrentUser();
    //     List<? extends ActivityResult> results = taskResultService.getAllResultsForStudent(student, badge.getCourse())
    //             .stream()
    //             .filter(ActivityResult::isEvaluated)
    //             .toList();
    //     int activityNumber = results.size();
    //     return activityNumber >= badge.getActivityNumber();
    // }

    // public boolean visitActivityScoreBadge(ActivityScoreBadge badge) {
    //     User student = authService.getCurrentUser();
    //     List<? extends ActivityResult> results = taskResultService.getGraphAndFileResultsForStudent(student, badge.getCourse())
    //             .stream()
    //             .filter(ActivityResult::isEvaluated)
    //             .toList();

    //     Boolean forOneActivity = badge.getForOneActivity();
    //     if (forOneActivity!= null && forOneActivity) {
    //         BigDecimal activityScore = BigDecimal.valueOf(badge.getActivityScore());
    //         return results.stream().anyMatch(result -> {
    //             Activity activity = result.getActivity();
    //             BigDecimal maxPoints = BigDecimal.valueOf(activity.getMaxPoints());
    //             BigDecimal resultPoints = BigDecimal.valueOf(result.getPoints());
    //             BigDecimal score = resultPoints.divide(maxPoints, 2, RoundingMode.HALF_UP);
    //             return score.compareTo(activityScore) >= 0;
    //         });
    //     }

    //     if (results.size() < 3) {
    //         return false;
    //     }
    //     List<Activity> activities = results.stream()
    //             .map(ActivityResult::getActivity)
    //             .toList();

    //     BigDecimal currentPoints = BigDecimal.valueOf(results.stream()
    //             .mapToDouble(ActivityResult::getPoints)
    //             .sum());
    //     BigDecimal maxPoints = BigDecimal.valueOf(activities.stream()
    //             .mapToDouble(Activity::getMaxPoints)
    //             .sum());

    //     if (maxPoints.compareTo(BigDecimal.valueOf(0)) == 0) {
    //         return badge.getActivityScore() == 0.0;
    //     }
    //     BigDecimal score = currentPoints.divide(maxPoints, 2, RoundingMode.HALF_UP);
    //     return score.compareTo(BigDecimal.valueOf(badge.getActivityScore())) >= 0;
    // }

    // public boolean visitConsistencyBadge(ConsistencyBadge badge) {
    //     User student = authService.getCurrentUser();
    //     List<? extends ActivityResult> results = taskResultService.getAllResultsForStudent(student, badge.getCourse());
    //     Long[] datesInMillis = results.stream()
    //             .filter(ActivityResult::isEvaluated)
    //             .map(ActivityResult::getSendDateMillis)
    //             .sorted()
    //             .toArray(Long[]::new);

    //     int weeksInRow = badge.getWeeksInRow();
    //     int counter = 1;
    //     for (int i=0; i < datesInMillis.length-1; i++) {
    //         long diff = Math.abs(datesInMillis[i] - datesInMillis[i + 1]);
    //         long daysDiff = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

    //         if (daysDiff < 7) {
    //             counter++;
    //         } else {
    //             counter = 0;
    //         }

    //         if (counter >= weeksInRow) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // public boolean visitFileTaskNumberBadge(FileTaskNumberBadge badge) {
    //     User student = authService.getCurrentUser();
    //     List<FileTaskResult> results = fileTaskResultService.getAllFileTaskResultsForStudent(student, badge.getCourse())
    //             .stream()
    //             .filter(FileTaskResult::isEvaluated)
    //             .toList();
    //     int fileTaskNumber = results.size();
    //     return fileTaskNumber >= badge.getFileTaskNumber();
    // }

    // public boolean visitGraphTaskNumberBadge(GraphTaskNumberBadge badge) {
    //     User student = authService.getCurrentUser();
    //     List<GraphTaskResult> results = graphTaskResultService.getAllGraphTaskResultsForStudentAndCourse(student, badge.getCourse())
    //             .stream()
    //             .filter(GraphTaskResult::isEvaluated)
    //             .toList();
    //     int graphTaskNumber = results.size();
    //     return graphTaskNumber >= badge.getGraphTaskNumber();
    // }

    // public boolean visitTopScoreBadge(TopScoreBadge badge) throws WrongUserTypeException, EntityNotFoundException {
    //     User student = authService.getCurrentUser();
    //     List<? extends ActivityResult> results = taskResultService.getGraphAndFileResultsForStudent(student, badge.getCourse())
    //             .stream()
    //             .filter(ActivityResult::isEvaluated)
    //             .toList();

    //     if (results.size() < 5) {
    //         return false;
    //     }

    //     Boolean forGroup = badge.getForGroup();
    //     Long courseId = badge.getCourse().getId();

    //     if (forGroup != null && forGroup) {
    //         BigDecimal rankingInGroupPosition = BigDecimal.valueOf(rankingService.getGroupRankingPosition(courseId));

    //         if (badge.getTopScore() == 0) {
    //             return rankingInGroupPosition.equals(BigDecimal.ONE);
    //         }
    //         BigDecimal numStudentsInGroup = BigDecimal.valueOf(userService.getCurrentUserGroup(courseId)
    //                 .getUsers()
    //                 .stream()
    //                 .filter(user -> user.getAccountType() == AccountType.STUDENT)
    //                 .count());

    //         BigDecimal topScore = rankingInGroupPosition.divide(numStudentsInGroup, 2, RoundingMode.HALF_UP);
    //         return topScore.compareTo(BigDecimal.valueOf(badge.getTopScore())) <= 0;
    //     } else {
    //         BigDecimal rankingPosition = BigDecimal.valueOf(rankingService.getRankingPosition(courseId));

    //         if (badge.getTopScore() == 0) {
    //             return rankingPosition.equals(BigDecimal.ONE);
    //         }

    //         BigDecimal numOfStudents = BigDecimal.valueOf(badge.getCourse().getCourseMembers().size());

    //         BigDecimal topScore = rankingPosition.divide(numOfStudents, 2, RoundingMode.HALF_UP);
    //         return topScore.compareTo(BigDecimal.valueOf(badge.getTopScore())) <= 0;
    //     }
    // }
}

