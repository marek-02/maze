package com.example.api.activity.result.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddColloquiumPointsForm {
    @Schema(required = true) private Long studentId;
    @Schema(required = true) private Long courseId;
    @Schema(required = true) private Double points;
    @Schema(required = true) private Long colloquiumNumber;
    @Schema(required = false) private String description;
    @Schema(required = true) private Long annihilatedQuestions;
    @Schema(required = true) private Long annihilatedPoints;
    @Schema(required = true) private Long dateInMillis;
}
