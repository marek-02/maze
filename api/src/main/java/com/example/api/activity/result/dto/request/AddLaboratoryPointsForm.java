package com.example.api.activity.result.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddLaboratoryPointsForm {
    @Schema(required = true) private Long studentId;
    @Schema(required = true) private Long courseId;
    @Schema(required = true) private Double points;
    @Schema(required = true) private String role;
    @Schema(required = false) private String description;
    @Schema(required = true) private Long dateInMillis;
}
