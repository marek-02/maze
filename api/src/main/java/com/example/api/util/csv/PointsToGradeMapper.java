package com.example.api.util.csv;

import com.example.api.activity.result.model.ActivityResult;
import org.springframework.stereotype.Component;

@Component
public class PointsToGradeMapper {

    public Double getGrade(double receivedPoints, double maxPoints) {
        if (maxPoints == 0) return null;

        double gradeFraction = receivedPoints / maxPoints;
        if (gradeFraction < 0) {
            return null;
        }
        if (gradeFraction < 0.5) {
            return 2.0;
        } else if (gradeFraction < 0.6){
            return 3.0;
        } else if (gradeFraction < 0.7) {
            return 3.5;
        } else if (gradeFraction < 0.8) {
            return 4.0;
        } else if (gradeFraction < 0.9) {
            return 4.5;
        } else {
            return 5.0;
        }
    }

    public Double getGrade(ActivityResult activityResult) {
        return getGrade(activityResult.getPoints(), activityResult.getActivity().getMaxPoints());
    }
}
