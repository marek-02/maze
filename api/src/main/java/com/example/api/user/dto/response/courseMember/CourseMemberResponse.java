package com.example.api.user.dto.response.courseMember;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.lang.String;

@Data
@AllArgsConstructor
@Getter
@Setter
public class CourseMemberResponse {
    private Long id;
    private String firstName;
    private String lastName;
}
