package com.example.api.activity.result.service;

import com.example.api.activity.result.dto.request.AddLaboratoryPointsForm;
import com.example.api.activity.result.model.LaboratoryPoints;
import com.example.api.activity.result.repository.LaboratoryPointsRepository;
import com.example.api.activity.task.dto.response.result.LaboratoryPointsResponse;
import com.example.api.course.Course;
import com.example.api.course.CourseService;
import com.example.api.course.CourseValidator;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
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
public class LaboratoryPointsService {
    private final LaboratoryPointsRepository laboratoryPointsRepository;
    private final UserRepository userRepository;
    private final LoggedInUserService authService;
    private final BadgeService badgeService;
    private final UserValidator userValidator;
    private final CourseService courseService;
    private final CourseValidator courseValidator;

    public void saveLaboratoryPoints(AddLaboratoryPointsForm form)
            throws RequestValidationException {
        log.info("Saving laboratory points for student with id {}", form.getStudentId());
        User user = userRepository.findUserById(form.getStudentId());
        userValidator.validateStudentAccount(user, form.getStudentId());
        User professor = authService.getCurrentUser();
        Course course = courseService.getCourse(form.getCourseId());
        courseValidator.validateCourseOwner(course, professor);

        LaboratoryPoints laboratoryPoints = new LaboratoryPoints(
                form.getPoints(),
                form.getDateInMillis(),
                professor.getEmail(),
                "",
                user.getCourseMember(course).orElseThrow());
        if (form.getDescription() != null) {
            laboratoryPoints.setDescription(form.getDescription());
        }
        laboratoryPointsRepository.save(laboratoryPoints);
        badgeService.checkAllBadges(user.getCourseMember(course).orElseThrow());
    }

    public List<LaboratoryPointsResponse> getLaboratoryPoints(Long courseId) throws EntityNotFoundException {
        User user = authService.getCurrentUser();
        return getLaboratoryPoints(user, courseId);
    }

    public List<LaboratoryPointsResponse> getLaboratoryPoints(User user, Long courseId) throws EntityNotFoundException {
        log.info("Fetching laboratory points for user {}", user.getEmail());
        Course course = courseService.getCourse(courseId);
        List<LaboratoryPoints> laboratoryPoints = laboratoryPointsRepository.findAllByUserAndCourse(user, course);
        return laboratoryPoints.stream()
                .map(laboratoryPoint -> {
                    String professorEmail = laboratoryPoint.getProfessorEmail();
                    User professor = userRepository.findUserByEmail(professorEmail);
                    String professorName = professor.getFirstName() + " " + professor.getLastName();
                    return new LaboratoryPointsResponse(laboratoryPoint.getSendDateMillis(),
                            professorName,
                            laboratoryPoint.getPoints(),
                            laboratoryPoint.getDescription());
                })
                .sorted(((o1, o2) -> Long.compare(o2.getDateMillis(), o1.getDateMillis())))
                .toList();
    }
}
