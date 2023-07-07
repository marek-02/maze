package com.example.api.course.dto.response;

import com.example.api.course.model.Course;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseDTO {
    @Schema(required = true) private final Long id;
    @Schema(required = true) private final String name;
    @Schema(required = true) private final String description;

    public CourseDTO(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.description = course.getDescription();
    }
}
