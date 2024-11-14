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
public class LaboratoryPoints extends ActivityResult {
    private String professorEmail;
    private String description;
    private String role;
    private Long foundWolfHoles;

    public LaboratoryPoints(
            Double points,
            Long sendDateMillis,
            String professorEmail,
            String description,
            String role,
            CourseMember courseMember,
            Long foundWolfHoles)
            throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        super(points, sendDateMillis, courseMember);
        this.professorEmail = professorEmail;
        this.description = description;
        this.role = role;
        this.foundWolfHoles = foundWolfHoles;
    }

    @Override
    public boolean isEvaluated() {
        return true;
    }
}
