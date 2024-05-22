package com.example.api.activity.result.model;

import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.MissingAttributeException;
import com.example.api.error.exception.WrongUserTypeException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AdditionalPoints extends ActivityResult {
    private String professorEmail;
    private String description;

    public AdditionalPoints(Long id,
                            Double points,
                            Long sendDateMillis,
                            String professorEmail,
                            String description,
                            Course course,
                            CourseMember courseMember)
            throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        super(id, points, sendDateMillis, course, courseMember);
        this.professorEmail = professorEmail;
        this.description = description;
    }

    public AdditionalPoints(
                            Double points,
                            Long sendDateMillis,
                            String professorEmail,
                            String description,
                            CourseMember courseMember)
            throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        super(points, sendDateMillis, courseMember);
        this.professorEmail = professorEmail;
        this.description = description;
    }

    @Override
    public boolean isEvaluated() {
        return true;
    }
}
