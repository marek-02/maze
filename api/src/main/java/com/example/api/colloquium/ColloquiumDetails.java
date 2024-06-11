package com.example.api.colloquium;

import javax.persistence.*;

import com.vladmihalcea.hibernate.type.array.IntArrayType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colloquium_details")
@TypeDef(
        typeClass = IntArrayType.class,
        defaultForType = int[].class
)
public class ColloquiumDetails {
    @Id
    private int id;
    private String name;
    private Integer annihilationLimit;

    @Column(
            name = "question_points",
            columnDefinition = "integer[]"
    )
    private int[] questionPoints;
}