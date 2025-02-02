package com.example.api.activity.result.service;

import com.example.api.activity.task.dto.response.result.AdditionalPointsListResponse;
import com.example.api.activity.task.dto.response.result.TaskPointsStatisticsResponse;
import com.example.api.activity.task.dto.response.result.TotalPointsResponse;
import com.example.api.course.Course;
import com.example.api.course.CourseService;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.user.model.User;
import com.example.api.user.repository.UserRepository;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.service.UserService;
import com.example.api.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
// import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AllPointsService {
    private final UserRepository userRepository;
    private final LoggedInUserService authService;
    private final UserValidator userValidator;
    private final TaskResultService taskResultService;
    private final AdditionalPointsService additionalPointsService;
    private final UserService userService;
    private final CourseService courseService;

    public List<?> getAllPointsListForProfessor(Long courseId, String studentEmail) throws WrongUserTypeException, EntityNotFoundException {
        User professor = authService.getCurrentUser();
        userValidator.validateProfessorAccount(professor);
        log.info("Fetching student all points {} for professor {}", studentEmail, professor.getEmail());
        return getAllPointsList(courseId, studentEmail);
    }

    public List<?> getAllPointsListForStudent(Long courseId) throws WrongUserTypeException, EntityNotFoundException {
        String studentEmail = authService.getCurrentUser().getEmail();
        log.info("Fetching all points for student {}", studentEmail);
        return getAllPointsList(courseId, studentEmail);
    }

    public TotalPointsResponse getAllPointsTotal(Long courseId) throws WrongUserTypeException, EntityNotFoundException {        
        User student = userService.getCurrentUserAndValidateStudentAccount();
        log.info("Fetching student all points total {}", student.getEmail());
        CourseMember member = student.getCourseMember(courseId, true);

        return new TotalPointsResponse(member.getTruePoints(), 288.0D); //total to 4 antały
    }

    private List<?> getAllPointsList(Long courseId, String studentEmail) throws WrongUserTypeException, EntityNotFoundException {
        User student = userRepository.findUserByEmail(studentEmail);
        userValidator.validateUserIsNotNull(student, studentEmail);
        userValidator.validateStudentAccount(student);

        Course course = courseService.getCourse(courseId);

        List<TaskPointsStatisticsResponse> taskPoints = taskResultService.getUserPointsStatistics(student, course);
        List<AdditionalPointsListResponse> additionalPointsList = additionalPointsService
                .getAdditionalPoints(student, courseId)
                .stream()
                .map(AdditionalPointsListResponse::new)
                .toList();

        return Stream.of(taskPoints, additionalPointsList)
                .flatMap(Collection::stream)
                .sorted(((o1, o2) -> Long.compare(o2.getDateMillis(), o1.getDateMillis())))
                .toList();
    }
}
