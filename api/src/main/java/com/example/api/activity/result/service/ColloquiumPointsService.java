package com.example.api.activity.result.service;

import com.example.api.activity.result.dto.request.AddColloquiumPointsForm;
import com.example.api.activity.result.repository.ColloquiumPointsRepository;
import com.example.api.activity.task.dto.response.result.ColloquiumPointsResponse;
import com.example.api.course.Course;
import com.example.api.course.CourseService;
import com.example.api.course.CourseValidator;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import com.example.api.activity.result.model.ColloquiumPoints;
import com.example.api.user.model.User;
import com.example.api.user.repository.UserRepository;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.badge.BadgeService;
import com.example.api.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ColloquiumPointsService {
    private final ColloquiumPointsRepository colloquiumPointsRepository;
    private final UserRepository userRepository;
    private final LoggedInUserService authService;
    private final BadgeService badgeService;
    private final UserValidator userValidator;
    private final CourseService courseService;
    private final CourseValidator courseValidator;

    public void saveColloquiumPoints(AddColloquiumPointsForm form)
            throws RequestValidationException {
        log.info("Saving colloquium points for student with id {}", form.getStudentId());
        User user = userRepository.findUserById(form.getStudentId());
        userValidator.validateStudentAccount(user, form.getStudentId());
        User professor = authService.getCurrentUser();
        Course course = courseService.getCourse(form.getCourseId());
        courseValidator.validateCourseOwner(course, professor);

        ColloquiumPoints colloquiumPoints = new ColloquiumPoints(
                form.getPoints(),
                form.getDateInMillis(),
                professor.getEmail(),
                "",
                form.getColloquiumNumber(),
                user.getCourseMember(course).orElseThrow());
        if (form.getDescription() != null) {
            colloquiumPoints.setDescription(form.getDescription());
        }
        colloquiumPointsRepository.save(colloquiumPoints);
        badgeService.checkAllBadges(user.getCourseMember(course).orElseThrow());
    }

    public List<ColloquiumPointsResponse> getColloquiumPoints(Long courseId) throws EntityNotFoundException {
        User user = authService.getCurrentUser();
        return getColloquiumPoints(user, courseId);
    }

    public List<ColloquiumPointsResponse> getColloquiumPoints(User user, Long courseId) throws EntityNotFoundException {
        log.info("Fetching additional points for user {}", user.getEmail());
        Course course = courseService.getCourse(courseId);
        List<ColloquiumPoints> colloquiumPoints = colloquiumPointsRepository.findAllByUserAndCourse(user, course);
        return colloquiumPoints.stream()
                .map(colloquiumPoint -> {
                    String professorEmail = colloquiumPoint.getProfessorEmail();
                    User professor = userRepository.findUserByEmail(professorEmail);
                    String professorName = professor.getFirstName() + " " + professor.getLastName();
                    return new ColloquiumPointsResponse(colloquiumPoint.getSendDateMillis(),
                            professorName,
                            colloquiumPoint.getPoints(),
                            colloquiumPoint.getDescription());
                })
                .sorted(((o1, o2) -> Long.compare(o2.getDateMillis(), o1.getDateMillis())))
                .toList();
    }
}
