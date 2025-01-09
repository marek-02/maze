package com.example.api.course.coursemember;

import com.example.api.course.Course;
import com.example.api.group.Group;
import com.example.api.user.hero.HeroType;
import com.example.api.user.model.User;
import com.example.api.user.badge.unlockedbadge.UnlockedBadge;
import com.example.api.user.hero.model.UserHero;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;

import javax.persistence.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="\"courseMember\"")
public class CourseMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double excessPoints; //Excess points from surprises and other activities
    private Long subgroup;
    private String role; //'E','K','S','O','', This field will be moved to ChapterRoles later

    private Long foundWolfHoles;
    private Long receivedNominations;

    @ElementCollection
    private Map<Long,Double> fileTaskPointsMap;

    @ElementCollection
    private Map<Long,Double> graphTaskPointsMap;

    @ElementCollection
    private Map<String,Double> annihilatedPointsMap;

    @ElementCollection
    private Map<String,Double> colloquiumPointsMap;

    @ElementCollection
    private Map<Long,Double> auctionBidPointsMap;

    @ElementCollection
    private Map<Long,Double> auctionWonPointsMap; //points won from auctions after solving their tasks with enough score

    Double firstCaskPoints; //Punkty z Antału 1 do oceny
    Double otherCaskPoints;
    // Double totalAuctionWonPoints; //Punkty z antałów 2-4 (Kolosy minus ewentualna lichwa)

    @Embedded
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserHero userHero;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "course", referencedColumnName = "id")
    private Course course;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "courseMember")
    private List<UnlockedBadge> unlockedBadges = new LinkedList<>();

    public CourseMember(User user, Group group, UserHero userHero) {
        this.user = user;
        this.group = group;
        this.course = group.getCourse();
        this.userHero = userHero;
        this.excessPoints = 0D;
        this.subgroup = 0L; 
        this.role = "";

        this.foundWolfHoles = 0L;
        this.receivedNominations = 0L;

        this.fileTaskPointsMap = new HashMap<>();
        this.graphTaskPointsMap = new HashMap<>();
        this.annihilatedPointsMap = new HashMap<>();
        this.colloquiumPointsMap = new HashMap<>();
        this.auctionBidPointsMap = new HashMap<>();
        this.auctionWonPointsMap = new HashMap<>();
        this.firstCaskPoints = 0.0;
        this.otherCaskPoints = 0.0;
    }

    public String getAlias() {
        return user.getFirstName() + " " + user.getLastName();
    }

    public HeroType getHeroType() {
        return userHero.getHero().getType();
    }

    public void addFileTaskPoints(Double points,Long fileTaskId){
        if(points < 0) return;
        this.fileTaskPointsMap.put(fileTaskId,points);      
        this.recalculatePoints();
    }

    public void addGraphTaskPoints(Double points, Long graphTaskId){
        if(points < 0) return;
        this.graphTaskPointsMap.put(graphTaskId,points); 
        this.recalculatePoints();
    }

    public void addAnnihilatedPoints(Double points,String colloquiumName){
        if(points < 0) return;
        this.annihilatedPointsMap.put(colloquiumName,points);
        this.recalculatePoints();
    }

    public void addColloquiumPoints(Double points,String colloquiumName){
        if(points < 0) return;
        this.colloquiumPointsMap.put(colloquiumName,points);
        this.recalculatePoints();
    }

    public void addAuctionBidPoints(Double points, Long auctionId){
        this.auctionBidPointsMap.put(auctionId,points);
        this.recalculatePoints();
    }

    public void addAuctionWonPoints(Double points,Long auctionId){
        this.auctionWonPointsMap.put(auctionId,points);
        // this.totalAuctionWonPoints += points;
        this.recalculatePoints();
    }

    public void removeAuctionBidPoints(Long auctionId){ //Restores users points after winning auction
        this.auctionBidPointsMap.remove(auctionId);
        this.recalculatePoints();
    }

    public void recalculatePoints(){
        //Antał 1
        Double totalGraphTaskPoints = this.getTotalGraphTaskPoints();
        Double totalFileTaskPoints = this.getTotalFileTaskPoints();
        Double totalAnnihilatedPoints = this.getTotalAnnihilatedPoints();        
        Double trueSurprisesPoints = this.getTrueSurprisesPoints();
        Double totalAuctionBidPoints = this.getTotalAuctionBidPoints(); //Points spent on bidding
        
        Double excessPoints = totalFileTaskPoints + totalGraphTaskPoints 
            - trueSurprisesPoints - totalAnnihilatedPoints - totalAuctionBidPoints; //oil excess according to scenario
       
        Double firstCaskPoints = trueSurprisesPoints + this.getTotalAuctionWonPoints();
        if(excessPoints < 0){
            firstCaskPoints -= Math.abs(excessPoints); //Lichwa (Scenariusz)
            excessPoints = 0.0;
        } 

        //Antał 2 + 3 + 4
        Double colloquiumPoints = this.getTotalColloquiumPoints();
        Double otherCaskPoints = colloquiumPoints;
        if(firstCaskPoints < 0){
            otherCaskPoints -= Math.ceil(21D/20D * Math.abs(firstCaskPoints)); //Lichwa (Scenariusz)
            firstCaskPoints = 0.0;
        } 
 
        this.firstCaskPoints = firstCaskPoints;
        this.otherCaskPoints = otherCaskPoints;
        this.excessPoints = excessPoints;
    }

    public Double getTotalFileTaskPoints(){
        return this.fileTaskPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalGraphTaskPoints(){
        return this.graphTaskPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalAnnihilatedPoints(){
        return this.annihilatedPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalColloquiumPoints(){
        return this.colloquiumPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalAuctionBidPoints(){
        return this.auctionBidPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalAuctionWonPoints(){
        return this.auctionWonPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public int getAuctionWonPointsSize(){
        return this.auctionWonPointsMap.values().size();
    }

    public Double getTrueSurprisesPoints(){
        Double trueSurprisesPoints = Stream.concat(this.fileTaskPointsMap.values().stream(), this.graphTaskPointsMap.values().stream())
            .sorted(Comparator.reverseOrder())
            .limit(3)
            .mapToDouble(Double::doubleValue)
            .sum();
        return trueSurprisesPoints;
    }

    public Double getTruePoints(){ //Punkty do oceny
        return this.firstCaskPoints + this.otherCaskPoints;
    }

    public Double getTotalPoints(){ //Punkty do rangi
        return this.getTruePoints() + Math.max(this.excessPoints,0);
    }

    // public void decreasePoints(Double decreaseValue) { ///?
    //     if (decreaseValue > points) {
    //         throw new IllegalStateException("Cannot decrease points.");
    //     }
    //     points = points - decreaseValue;
    // }
}
