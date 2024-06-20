package com.example.api.user.hero.model;

// import com.example.api.activity.result.dto.response.SuperPowerResponse;
import com.example.api.activity.result.model.GraphTaskResult;
import com.example.api.course.Course;
// import com.example.api.course.coursemember.CourseMember;
// import com.example.api.error.exception.RequestValidationException;
// import com.example.api.question.Question;
import com.example.api.user.hero.HeroType;
// import com.example.api.user.model.User;
// import com.example.api.util.message.HeroMessage;
// // import com.example.api.user.hero.HeroVisitor;
// import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Hero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private HeroType type;
    private Long coolDownTimeMillis;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Course course;

    public Hero(HeroType type, Course course) {
        this.type = type;
        // this.coolDownTimeMillis = coolDownTimeMillis;
        this.course = course;
    }

    // public abstract SuperPowerResponse<?> useSuperPower(HeroVisitor visitor,
    //                                                     User user,
    //                                                     GraphTaskResult result,
    //                                                     Question question) throws RequestValidationException;

    // public abstract Boolean isResultStatusCorrect(GraphTaskResult result);
    // public abstract void changeValue(Double value);

    // public Boolean canPowerBeUsed(GraphTaskResult result) {
    //     if (isResultFinishedOrStatusIncorrect(result)) {
    //         return false;
    //     }
    //     return !isCoolDownActive(result.getMember());
    // }

    // public Boolean canPowerBeUsed(GraphTaskResult result, double multiplier) {
    //     if (isResultFinishedOrStatusIncorrect(result)) {
    //         return false;
    //     }
    //     CourseMember member =  result.getMember();
    //     int timesSuperPowerUsedInResult = member.getUserHero().getTimesSuperPowerUsedInResult();
    //     if (timesSuperPowerUsedInResult != 0) {
    //         int level = member.getLevel();
    //         long timesSuperPowerCanBeUsed = Math.round(multiplier * level);
    //         return timesSuperPowerUsedInResult < timesSuperPowerCanBeUsed;
    //     } else {
    //         return !isCoolDownActive(member);
    //     }
    // }

    // protected Boolean isResultFinishedOrStatusIncorrect(GraphTaskResult result) {
    //     boolean isFinished = result.isFinished();
    //     if (isFinished) {
    //         return true;
    //     }
    //     return !isResultStatusCorrect(result);
    // }

    // protected Boolean isCoolDownActive(CourseMember member) {
    //     Long currentTimeMillis = System.currentTimeMillis();
    //     Long lastPowerUsageDateMillis = member.getUserHero().getLastSuperPowerUsageTimeMillis();
    //     return currentTimeMillis - lastPowerUsageDateMillis < coolDownTimeMillis;
    // }

    // public String getCanBeUsedMessage(GraphTaskResult result) {
    //     if (result.isFinished()) {
    //         return HeroMessage.RESULT_FINISHED;
    //     }
    //     if (!isResultStatusCorrect(result)) {
    //         return HeroMessage.INCORRECT_STATUS;
    //     }
    //     // if (isCoolDownActive(result.getMember())) {
    //     //     return HeroMessage.COOL_DOWN_ACTIVE;
    //     // }
    //     return HeroMessage.POWER_READY_TO_BE_USED;
    // }
}
