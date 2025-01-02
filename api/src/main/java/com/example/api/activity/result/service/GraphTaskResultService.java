package com.example.api.activity.result.service;

import com.example.api.activity.result.repository.ActivityResultRepository;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.error.exception.*;
import com.example.api.activity.result.model.GraphTaskResult;
import com.example.api.activity.result.model.ResultStatus;
import com.example.api.activity.task.graphtask.GraphTask;
import com.example.api.user.model.User;
import com.example.api.activity.result.repository.GraphTaskResultRepository;
import com.example.api.activity.task.graphtask.GraphTaskRepository;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.service.UserService;
import com.example.api.validator.UserValidator;
import com.example.api.activity.validator.ActivityValidator;
import com.example.api.util.calculator.PointsCalculator;
import com.example.api.util.calculator.TimeCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

import static com.example.api.error.exception.ExceptionMessage.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GraphTaskResultService {
    private final GraphTaskResultRepository graphTaskResultRepository;
    private final GraphTaskRepository graphTaskRepository;
    private final PointsCalculator pointsCalculator;
    private final UserValidator userValidator;
    private final TimeCalculator timeCalculator;
    private final LoggedInUserService authService;
    private final UserService userService;
    private final ActivityValidator activityValidator;
    private final ActivityResultRepository taskResultRepository;

    public Long getGraphTaskResultId(Long graphTaskId)
            throws WrongUserTypeException, EntityNotFoundException {
        User student = authService.getCurrentUser();
        userValidator.validateStudentAccount(student);
        GraphTask graphTask = graphTaskRepository.findGraphTaskById(graphTaskId);
        activityValidator.validateActivityIsNotNull(graphTask, graphTaskId);
        GraphTaskResult graphTaskResult = graphTaskResultRepository.findGraphTaskResultByGraphTaskAndUser(graphTask, student);
        return graphTaskResult == null ? null : graphTaskResult.getId();
    }

    public GraphTaskResult saveGraphTaskResult(GraphTaskResult result) {
        return graphTaskResultRepository.save(result);
    }

    public void startGraphTaskResult(Long id) throws EntityNotFoundException, WrongUserTypeException, EntityAlreadyInDatabaseException {
        log.info("Saving graph task result");
        GraphTask graphTask = graphTaskRepository.findGraphTaskById(id);
        activityValidator.validateActivityIsNotNull(graphTask, id);

        CourseMember member = userService.getCurrentUserAndValidateStudentAccount()
                .getCourseMember(graphTask.getCourse(), true);

        if (graphTaskResultRepository.existsByActivityAndMember(graphTask, member)) {
            throw new EntityAlreadyInDatabaseException(graphTaskResultAlreadyExists(id, member.getUser().getId()));
        }

        GraphTaskResult graphTaskResult = new GraphTaskResult(
                graphTask,
                System.currentTimeMillis(),
                ResultStatus.CHOOSE,
                graphTask.getQuestions().get(0),
                member);
        graphTaskResultRepository.save(graphTaskResult);
    }

    public Double getPointsFromClosedQuestions(Long id) throws EntityNotFoundException {
        log.info("Calculating points from closed questions for graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return pointsCalculator.calculatePointsForClosedQuestions(result);
    }

    public Double getPointsFromOpenedQuestions(Long id) throws EntityNotFoundException {
        log.info("Calculating points from opened questions for graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return pointsCalculator.calculatePointsForOpenedQuestions(result);
    }

    public Double getAllPoints(Long id) throws EntityNotFoundException {
        log.info("Fetching points from graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return result.getPoints();
    }

    public Double getMaxAvailablePoints(Long id) throws EntityNotFoundException {
        log.info("Calculating maximum available points for graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return pointsCalculator.calculateMaxAvailablePoints(result);
    }

    public Double getMaxClosedPoints(Long id) throws EntityNotFoundException {
        log.info("Calculating maximum closed points for graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return pointsCalculator.calculateMaxClosedPoints(result);
    }

    public Double getMaxOpenedPoints(Long id) throws EntityNotFoundException {
        log.info("Calculating maximum opened points for graph task result with id {}", id);
        GraphTaskResult result = graphTaskResultRepository.findGraphTaskResultById(id);
        activityValidator.validateTaskResultIsNotNull(result, id);
        return pointsCalculator.calculateMaxOpenedPoints(result);
    }

    public Long getTimeRemaining(Long resultId) throws EntityNotFoundException, EntityRequiredAttributeNullException {
        log.info("Calculating time remaining for graph task result with id {}", resultId);
        GraphTaskResult graphTaskResult = graphTaskResultRepository.findGraphTaskResultById(resultId);
        activityValidator.validateGraphTaskResultExistsAndHasStartDate(graphTaskResult, resultId);
        GraphTask graphTask = graphTaskResult.getGraphTask();
        return timeCalculator.getTimeRemaining(graphTaskResult.getStartDateMillis(), graphTask.getTimeToSolveMillis());
    }

    public Long getTimeLeftAfterEnd(Long resultId) throws EntityNotFoundException, EntityRequiredAttributeNullException {
        log.info("Calculating how much time left after last action for graph task result with id {}", resultId);
        GraphTaskResult graphTaskResult = graphTaskResultRepository.findGraphTaskResultById(resultId);
        activityValidator.validateGraphTaskResultExistsAndHasStartAndEndDate(graphTaskResult, resultId);
        GraphTask graphTask = graphTaskResult.getGraphTask();
        return timeCalculator.getTimeLeftAfterLastAnswer(graphTaskResult.getStartDateMillis(), graphTask.getTimeToSolveMillis(), graphTaskResult.getSendDateMillis());
    }

    public Long getTimeRemaining(GraphTaskResult result) throws EntityNotFoundException, EntityRequiredAttributeNullException {
        log.info("Calculating time remaining for graph task result with id {}", result.getId());
        activityValidator.validateGraphTaskResultExistsAndHasStartDate(result, result.getId());
        GraphTask graphTask = result.getGraphTask();
        return timeCalculator.getTimeRemaining(result.getStartDateMillis(), graphTask.getTimeToSolveMillis());
    }

    public List<GraphTaskResult> getAllGraphTaskResultsForStudentAndCourse(User student, Course course){
        return graphTaskResultRepository.findAllByUserAndCourse(student, course);
    }

    public GraphTaskResult getGraphTaskResultWithGraphTaskAndUser(Long graphTaskId, User user) throws EntityNotFoundException {
        return (GraphTaskResult) taskResultRepository.findByActivity_IdAndMember_User(graphTaskId, user)
                .orElseThrow(() -> new EntityNotFoundException("GraphTaskResult not found"));
    }
}
