package com.example.api.activity.result.model;

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
public class ColloquiumPoints extends ActivityResult {
    private String professorEmail;
    private String description;
    private Long colloquiumNumber;

    public ColloquiumPoints(
            Double points,
            Long sendDateMillis,
            String professorEmail,
            String description,
            Long colloquiumNumber,
            CourseMember courseMember)
            throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        super(points, sendDateMillis, courseMember);
        this.professorEmail = professorEmail;
        this.description = description;
        this.colloquiumNumber = colloquiumNumber;
    }

    @Override
    public boolean isEvaluated() {
        return true;
    }
}
