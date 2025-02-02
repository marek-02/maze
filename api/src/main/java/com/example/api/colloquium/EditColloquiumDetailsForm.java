package com.example.api.colloquium;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditColloquiumDetailsForm {
    @Schema(required = true) private int maxPoints;
    @Schema(required = true) private int annihilationLimit;
    @Schema(required = true) private int[] questionPoints;
}