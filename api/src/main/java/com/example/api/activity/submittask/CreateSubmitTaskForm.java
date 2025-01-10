package com.example.api.activity.submittask;

import com.example.api.activity.ActivityType;
import com.example.api.activity.CreateActivityForm;
import com.example.api.activity.task.filetask.FileTask;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmitTaskForm extends CreateActivityForm {
    @Schema(required = true)
    private Integer percentageForAuthor;
    @Schema(required = true)
    private Double maxPointsForAuthor;

    public CreateSubmitTaskForm(String title,
                                String description,
                                // Integer posX,
                                // Integer posY,
                                Integer percentageForAuthor,
                                Double maxPointsForAuthor) {
        super(ActivityType.SUBMIT, title, description);
        this.percentageForAuthor = percentageForAuthor;
        this.maxPointsForAuthor = maxPointsForAuthor;
    }

    public CreateSubmitTaskForm(SubmitTask submitTask) {
        super(submitTask);
        this.percentageForAuthor = submitTask.getPercentageForAuthor();
        this.maxPointsForAuthor = submitTask.getMaxPointsForAuthor();
        // this.maxPoints = fileTask.getMaxPoints();
    }

    public static CreateSubmitTaskForm example() {
        return new CreateSubmitTaskForm(
                "Przykładowy tytuł",
                "Przykładowy opis",
                // 0,
                // 0,
                10,
                50D
        );
    }
}
