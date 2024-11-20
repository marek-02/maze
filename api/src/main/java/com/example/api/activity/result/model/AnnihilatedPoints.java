package com.example.api.activity.result.model;

import com.example.api.colloquium.ColloquiumDetails;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.MissingAttributeException;
import com.example.api.error.exception.WrongUserTypeException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AnnihilatedPoints extends ActivityResult {
    private String professorEmail;
    private String description;

    @ManyToOne
    @JoinColumn(name = "colloquium_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ColloquiumDetails colloquiumDetails;

    public AnnihilatedPoints(
            Double points,
            Long sendDateMillis,
            String professorEmail,
            String description,
            ColloquiumDetails colloquiumDetails,
            CourseMember courseMember)
            throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        super(points, sendDateMillis, courseMember);
        this.professorEmail = professorEmail;
        this.description = description;
        this.colloquiumDetails = colloquiumDetails;
    }

    @Override
    public boolean isEvaluated() {
        return true;
    }
}
