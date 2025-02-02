package com.example.api.user.service;

import com.example.api.course.Course;
import com.example.api.course.CourseService;
import com.example.api.course.StudentNotEnrolledException;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.user.dto.response.BasicUser;
import com.example.api.user.dto.response.grade.GradeResponse;
import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.user.model.User;
import com.example.api.security.LoggedInUserService;
import com.example.api.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GradeService {
    private final UserValidator userValidator;
    private final LoggedInUserService authService;
    private final CourseService courseService;

    public List<GradeResponse> getAllGrades(Long courseId) throws WrongUserTypeException, EntityNotFoundException {
        User professor = authService.getCurrentUser();
        userValidator.validateProfessorAccount(professor);
        Course course = courseService.getCourse(courseId);

        return course
                .getAllStudents()
                .stream()
                .map(student -> getStudentFinalGrade(student, course))
                .sorted(Comparator.comparing(entry -> entry.getStudent().getLastName().toLowerCase() + entry.getStudent().getFirstName().toLowerCase()))
                .toList();
    }

    public GradeResponse getStudentFinalGrade(User student, Course course) {
        CourseMember member;
        try {
            member = student.getCourseMember(course, false);
        } catch (StudentNotEnrolledException e) {
            e.printStackTrace();
            return new GradeResponse(new BasicUser(student), 2.0);
        }
        Double casks = member.getTruePoints() / 72.0; //antały

        Double finalGrade;
        if(casks < 2.0) finalGrade = 2.0;
        else if(casks < 2.4) finalGrade = 3.0;
        else if(casks < 2.8) finalGrade = 3.5;
        else if(casks < 3.2) finalGrade = 4.0;
        else if(casks < 3.6) finalGrade = 4.5;
        else finalGrade = 5.0; 

        return new GradeResponse(new BasicUser(student), finalGrade);
    }
}
