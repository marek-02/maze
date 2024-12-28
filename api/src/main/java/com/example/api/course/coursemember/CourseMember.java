package com.example.api.course.coursemember;

import com.example.api.activity.result.model.AnnihilatedPoints;
import com.example.api.activity.task.dto.response.result.ColloquiumPointsResponse;
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

import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;

import javax.persistence.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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

    // private Integer level; 
    private Double truePoints; //Points excluding excess points
    private Double excessPoints; //Points excess from surprises
    private Long subgroup;
    private String role; //'E','K','S','O','', This field will be moved to ChapterRoles later

    private Long foundWolfHoles;
    private Long receivedNominations;

    // private Double totalFileTaskPoints;
    // private Double totalGraphTaskPoints;
    // private Double trueSurprisesPoints; //Calculated as specified by scenario

    @ElementCollection
    private List<Double> fileTaskPointsList;

    @ElementCollection
    private List<Double> graphTaskPointsList;

    @ElementCollection
    private Map<String,Double> annihilatedPointsMap;

    @ElementCollection
    private Map<String,Double> colloquiumPointsMap;


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
        // this.level = 1;
        this.truePoints = 0D;
        this.excessPoints = 0D;
        this.subgroup = 0L; 
        this.role = "";

        this.foundWolfHoles = 0L;
        this.receivedNominations = 0L;

        this.fileTaskPointsList = new LinkedList<>();
        this.graphTaskPointsList = new LinkedList<>();
        this.annihilatedPointsMap = new HashMap<>();
        this.colloquiumPointsMap = new HashMap<>();
    }

    // public synchronized void changePoints(Double diff) {
    //     if (points + diff < 0) return;
    //     points = points + diff;
    // }

    // public void setPoints(Double points){
    //     this.points = points;
    // }

    public String getAlias() {
        return user.getFirstName() + " " + user.getLastName();
    }

    public HeroType getHeroType() {
        return userHero.getHero().getType();
    }

    public void addFileTaskPoints(Double points){
        if(points < 0) return;
        this.fileTaskPointsList.add(points);      
        this.recalculatePoints();
    }

    public void addGraphTaskPoints(Double points){
        if(points < 0) return;
        this.graphTaskPointsList.add(points); 
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

    private void recalculatePoints(){
        //Antał 1
        Double totalGraphTaskPoints = this.getTotalGraphTaskPoints();
        Double totalFileTaskPoints = this.getTotalFileTaskPoints();
        Double totalAnnihilatedPoints = this.getTotalAnnihilatedPoints();
        
        Double trueSurprisesPoints = this.getTrueSurprisesPoints();
        
        Double excessPoints = totalFileTaskPoints + totalGraphTaskPoints - trueSurprisesPoints - totalAnnihilatedPoints; //oil excess according to scenario

        //Antał 2 + 3 + 4
        Double colloquiumPoints = this.colloquiumPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
 
        this.excessPoints = excessPoints;
        this.truePoints = trueSurprisesPoints + colloquiumPoints;
    }

    public Double getTotalFileTaskPoints(){
        return this.fileTaskPointsList.stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalGraphTaskPoints(){
        return this.graphTaskPointsList.stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalAnnihilatedPoints(){
        return this.annihilatedPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTotalColloquiumPoints(){
        return this.colloquiumPointsMap.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    public Double getTrueSurprisesPoints(){ //True points from ,,Antał I"
        Double trueSurprisesPoints = Stream.concat(this.fileTaskPointsList.stream(), this.graphTaskPointsList.stream())
            .limit(3)
            .mapToDouble(Double::doubleValue)
            .sum();
        return trueSurprisesPoints;
    }

    public Double getTruePoints(){
        return this.truePoints;
    }

    public Double getTotalPoints(){
        return this.truePoints + this.excessPoints;
    }

    // public void decreasePoints(Double decreaseValue) { ///?
    //     if (decreaseValue > points) {
    //         throw new IllegalStateException("Cannot decrease points.");
    //     }
    //     points = points - decreaseValue;
    // }
}
