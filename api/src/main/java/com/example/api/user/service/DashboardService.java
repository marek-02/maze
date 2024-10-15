package com.example.api.user.service;

import com.example.api.activity.Activity;
import com.example.api.activity.auction.Auction;
import com.example.api.activity.auction.bid.Bid;
import com.example.api.activity.auction.bid.BidRepository;
import com.example.api.activity.info.Info;
import com.example.api.activity.info.InfoService;
import com.example.api.activity.auction.AuctionRepository;
import com.example.api.activity.result.dto.response.RankingResponse;
import com.example.api.activity.result.model.FileTaskResult;
import com.example.api.activity.result.model.GraphTaskResult;
import com.example.api.activity.result.model.SurveyResult;
import com.example.api.activity.result.model.ActivityResult;
import com.example.api.activity.result.repository.AdditionalPointsRepository;
import com.example.api.activity.result.repository.FileTaskResultRepository;
import com.example.api.activity.result.repository.GraphTaskResultRepository;
import com.example.api.activity.result.repository.SurveyResultRepository;
import com.example.api.activity.result.service.ActivityResultService;
import com.example.api.activity.result.service.ranking.RankingService;
import com.example.api.activity.submittask.SubmitTask;
import com.example.api.activity.submittask.SubmitTaskService;
import com.example.api.activity.submittask.result.SubmitTaskResult;
import com.example.api.activity.submittask.result.SubmitTaskResultRepository;
import com.example.api.activity.submittask.result.SubmitTaskStatus;
import com.example.api.activity.survey.Survey;
import com.example.api.activity.survey.SurveyService;
import com.example.api.activity.task.filetask.FileTask;
import com.example.api.activity.task.filetask.FileTaskService;
import com.example.api.activity.task.graphtask.GraphTask;
import com.example.api.activity.task.graphtask.GraphTaskService;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.course.CourseService;
import com.example.api.course.coursemember.CourseMemberRepository;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.MissingAttributeException;
import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.activity.ActivityType;
import com.example.api.chapter.Chapter;
import com.example.api.chapter.requirement.model.Requirement;
import com.example.api.chapter.ChapterService;
import com.example.api.user.badge.BadgeService;
import com.example.api.user.dto.response.dashboard.DashboardResponse;
import com.example.api.user.dto.response.dashboard.GeneralStats;
import com.example.api.user.dto.response.dashboard.AuctionStats;
import com.example.api.user.dto.response.dashboard.LastAddedActivity;
import com.example.api.user.dto.response.dashboard.SubmitStats;
import com.example.api.user.hero.HeroStatsDTO;
import com.example.api.user.hero.HeroTypeStatsDTO;
import com.example.api.user.model.Rank;
import com.example.api.user.model.User;
import com.example.api.util.calculator.PointsCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DashboardService {
    private final RankingService rankingService;
    private final GraphTaskResultRepository graphTaskResultRepository;
    private final FileTaskResultRepository fileTaskResultRepository;
    private final SurveyResultRepository surveyResultRepository;
    private final AdditionalPointsRepository additionalPointsRepository;
    private final CourseMemberRepository courseMemberRepository;
    private final BidRepository bidRepository;
    private final GraphTaskService graphTaskService;
    private final FileTaskService fileTaskService;
    private final AuctionRepository auctionRepository;
    private final SurveyService surveyService;
    private final SubmitTaskResultRepository submitTaskResultRepository;
    private final InfoService infoService;
    private final ChapterService chapterService;
    private final RankService rankService;
    private final BadgeService badgeService;
    private final UserService userService;
    private final CourseService courseService;
    private final ActivityResultService activityResultService;

    private final long MAX_LAST_ACTIVITIES_IN_DASHBOARD = 8;

    public DashboardResponse getStudentDashboard(Long courseId) throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        log.info("getStudentDashboard");
        User student = userService.getCurrentUserAndValidateStudentAccount();
        CourseMember member = student.getCourseMember(courseId).orElseThrow();
        Course course = courseService.getCourse(courseId);

        badgeService.checkAllBadges(member);

        return new DashboardResponse(
                getHeroTypeStats(member),
                getGeneralStats(student, course, member),
                getLastAddedActivities(course),
                getHeroStats(member),
                getSubmitStats(member),
                getAuctionStats(member,courseId),
                member.getUser().getEmail()
        );
    }

    public DashboardResponse getSpecifiedStudentDashboard(Long userId,Long courseId) throws WrongUserTypeException, EntityNotFoundException, MissingAttributeException {
        log.info("getSpecifiedStudentDashboard");
        User student = userService.getUser(userId);
        CourseMember member = student.getCourseMember(courseId).orElseThrow();
        Course course = courseService.getCourse(courseId);

        badgeService.checkAllBadges(member);

        return new DashboardResponse(
                getHeroTypeStats(member),
                getGeneralStats(student, course, member),
                getLastAddedActivities(course),
                getHeroStats(member),
                getSubmitStats(member),
                getAuctionStats(member,courseId),
                member.getUser().getEmail()
        );
    }

    private List<RankingResponse> getRanking(CourseMember member) throws EntityNotFoundException {
        log.info("getRanking");

        List<RankingResponse> ranking = rankingService.getRanking(member.getCourse().getId());

        return ranking;
    }

    private List<RankingResponse> getOverallRanking(CourseMember member) throws EntityNotFoundException {
        log.info("getOverallRanking");
        if(member.getCourse().getCourseType() == null) return  getRanking(member);

        List<Course> coursesForOverallRanking = courseService.getCoursesByCourseType(member.getCourse().getCourseType());
        List<RankingResponse> overallRanking = coursesForOverallRanking.stream()
                .flatMap(course -> rankingService.getRanking(course.getId()).stream()).toList();

        return overallRanking;
    }

    private HeroTypeStatsDTO getHeroTypeStats(CourseMember member) throws EntityNotFoundException {
        log.info("getHeroTypeStats");
        String heroType = String.valueOf(member.getHeroType());

        List<RankingResponse> ranking = rankingService.getRanking(member.getCourse().getId());
        RankingResponse rank = getRank(member.getUser(), ranking);

        if (rank == null) {
            log.error("Student {} not found in ranking", member.getUser().getId());
            throw new EntityNotFoundException("Student " + member.getUser().getId() + " not found in ranking");
        }

        Integer rankPosition = rank.getPosition();
        Long rankLength = (long) ranking.size();

        Double betterPlayerPoints = rankPosition > 1 ? ranking.get(rankPosition - 2).getPoints() : null;
        Double worsePlayerPoints = rankPosition < rankLength ? ranking.get(rankPosition).getPoints() : null;

        List<RankingResponse> overallRanking = getOverallRanking(member);
        RankingResponse overallRank = getRank(member.getUser(), overallRanking);

        Integer overallRankPosition = overallRank.getPosition();
        Long overallRankLength = (long) overallRanking.size();

        Double betterPlayerPointsOverall = overallRankPosition > 1 ? overallRanking.get(overallRankPosition - 2).getPoints() : null;
        Double worsePlayerPointsOvearll = overallRankPosition < overallRankLength ? overallRanking.get(overallRankPosition).getPoints() : null;


        return new HeroTypeStatsDTO(heroType, rankPosition, rankLength, overallRankPosition, overallRankLength, betterPlayerPoints, worsePlayerPoints, betterPlayerPointsOverall, worsePlayerPointsOvearll, ranking, overallRanking);
    }

    private RankingResponse getRank(User student, List<RankingResponse> ranking) {
        return ranking
                .stream()
                .filter(rankingResponse -> rankingResponse.getEmail().equals(student.getEmail()))
                .findAny()
                .orElse(null);
    }

    private AuctionStats getAuctionStats(CourseMember member, Long courseId) {
        log.info("getAuctionStats");

        Integer auctionsWon = getStudentAuctionsWonCount(member,courseId);
        Double auctionsPoints = getStudentAuctionsPoints(member,courseId);
        Integer auctionsParticipations = getStudentAuctionsParticipations(member,courseId);
        Integer auctionsResolvedCount = getAuctionsResolvedCount(courseId);
        Integer auctionsCount = getAuctionsCount(courseId);
        Integer auctionRanking = getStudentAuctionRankingPosition(member,courseId);
        String bestAuctioner = getBestStudentRanking(courseId);

        return new AuctionStats(
                auctionsWon,
                auctionsPoints,
                auctionsParticipations,
                auctionsResolvedCount,
                auctionsCount,
                auctionRanking,
                bestAuctioner
        );
    }

    private List<Long> getStudentAuctionRanking(Long courseId){
        List<Auction> resolvedAuctions = getResolvedAuctions(courseId);
        Map<Long, List<Number>> ranking = new HashMap<>();

        if(!resolvedAuctions.isEmpty()) {
            for (Auction auction : resolvedAuctions) {
                long id = auction.getHighestBid().get().getMember().getId();
                double points = auction.getMaxPoints();

                List<Number> curr = ranking.getOrDefault(id, Arrays.asList(0, 0.0));
                ranking.put(id, Arrays.asList(curr.get(0).intValue() + 1, curr.get(1).doubleValue() + points));
            }
        }

        List<Map.Entry<Long, List<Number>>> rankingList = new ArrayList<>(ranking.entrySet());

        rankingList.sort((entry1, entry2) -> {
            int compareValue = entry2.getValue().get(0).intValue() - entry1.getValue().get(0).intValue();
            if (compareValue == 0) {
                return Double.compare(entry2.getValue().get(1).doubleValue(), entry1.getValue().get(1).doubleValue());
            } else {
                return compareValue;
            }
        });

        // Convert the sorted list of map entries to a list of student IDs
        List<Long> sortedStudentIds = rankingList.stream()
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return sortedStudentIds;
    }
    private String getBestStudentRanking(Long courseId) {
        List<Long> ranking = getStudentAuctionRanking(courseId);
        if (!ranking.isEmpty()) {
            CourseMember courseMember = courseMemberRepository.getById(ranking.get(0));

            if (courseMember != null) {
                return courseMember.getAlias();
            } else {
                return "Brak aktualnego lidera";
            }

        } else {
            return "Brak aktualnego lidera";
        }
    }

    private Integer getStudentAuctionRankingPosition(CourseMember member, Long courseId) {
        List<Long> ranking = getStudentAuctionRanking(courseId);
        long id = member.getId();

        int index = ranking.indexOf(id);
        if (index != -1) {
            return (index + 1);
        } else {
            return (ranking.size() + 1);
        }
    }

    private GeneralStats getGeneralStats(User student, Course course, CourseMember member) {
        log.info("getGeneralStats");

        Double avgGraphTask = getAvgGraphTask(member);
        Double avgFileTask = getAvgFileTask(member);
        Long surveysNumber = getSurveysNumber(member);
        Double graphTaskPoints = getGraphTaskPoints(member);
        Double fileTaskPoints = getFileTaskPoints(member);
        Double bestGraphTaskPoints = getBestGraphTaskPoints(member, 3);
        Double bestFileTaskPoints = getBestFileTaskPoints(member, 3);
        Double bonusPoints = fileTaskPoints - bestFileTaskPoints + graphTaskPoints - bestGraphTaskPoints;
        Double userPoints = member.getPoints();
        Double maxPoints = getMaxPoints(student, course);

        return new GeneralStats(
                avgGraphTask,
                avgFileTask,
                surveysNumber,
                graphTaskPoints,
                fileTaskPoints,
                userPoints,
                maxPoints,
                bonusPoints
        );
    }

    private SubmitStats getSubmitStats(CourseMember member) {
        return new SubmitStats(
                submitTaskResultRepository.countSubmitTaskResultByMember(member),
                submitTaskResultRepository.countSubmitTaskResultByMemberAndStatus(member, SubmitTaskStatus.ACCEPTED),
                submitTaskResultRepository.findAllByMember(member).stream().mapToDouble(SubmitTaskResult:: getPoints).sum()
        );
    }

    private Double getAvgGraphTask(CourseMember member) {
        OptionalDouble avg = graphTaskResultRepository.findAllByMember(member)
                .stream()
                .filter(GraphTaskResult::isEvaluated)
                .mapToDouble(result -> 100 * result.getPoints() / result.getGraphTask().getMaxPoints())
                .average();
        return avg.isPresent() ? PointsCalculator.round(avg.getAsDouble(), 2) : null;
    }

    private Double getAvgFileTask(CourseMember member) {
        OptionalDouble avg = fileTaskResultRepository.findAllByMember(member)
                .stream()
                .filter(FileTaskResult::isEvaluated)
                .mapToDouble(result -> 100 * result.getPoints() / result.getFileTask().getMaxPoints())
                .average();
        return avg.isPresent() ? PointsCalculator.round(avg.getAsDouble(), 2) : null;
    }

    private Long getSurveysNumber(CourseMember member) {
        return surveyResultRepository.countAllByMember(member);
    }

    private List<Auction> getResolvedAuctions(Long courseId) {
        return auctionRepository.findAllResolvedByCourseId(courseId);
    }

    private Integer getStudentAuctionsWonCount(CourseMember member, Long courseId) {
        int count = 0;
        List<Auction> resolvedAuctions = getResolvedAuctions(courseId);

        if(!resolvedAuctions.isEmpty()) {
            for (Auction auction : resolvedAuctions) {
                if (auction.getHighestBid().get().getMember().getId().equals(member.getId())) {
                    count = count + 1;
                }
            }
        }
        return count;
    }

    private Integer getAuctionsResolvedCount(Long courseId) {
        List<Auction> resolvedAuctions = getResolvedAuctions(courseId);

        if(!resolvedAuctions.isEmpty()) {
            return resolvedAuctions.size();
        }

        else {
            return 0;
        }

    }
    private Integer getAuctionsCount(Long courseId) {
        List<Auction> resolvedAuctions = auctionRepository.findAllByCourseId(courseId);

        if(!resolvedAuctions.isEmpty()) {
            return resolvedAuctions.size();
        }

        else {
            return 0;
        }
    }

    private Integer getStudentAuctionsParticipations(CourseMember member, Long courseId) {
        return bidRepository.findAllByMemberAndCourse(member,courseId).size();
    }

    private Double getStudentAuctionsPoints(CourseMember member, Long courseId) {
        double points = 0;
        List<Auction> resolvedAuctions = getResolvedAuctions(courseId);

        if(!resolvedAuctions.isEmpty()) {
            for (Auction auction : resolvedAuctions) {
                Bid bid = auction.getHighestBid().get();

                if (bid.getMember().getId().equals(member.getId())) {
                  points = points + bid.getPoints();
                }
            }
        }
        return points;
    }
    private Double getGraphTaskPoints(CourseMember member) {
        return getTaskPoints(graphTaskResultRepository.findAllByMember(member));
    }


    private Double getFileTaskPoints(CourseMember member) {
        return getTaskPoints(fileTaskResultRepository.findAllByMember(member));
    }

    private Double getAdditionalPoints(CourseMember member) {
        return getTaskPoints(additionalPointsRepository.findAllByMember(member));
    }

    private Double getSurveyPoints(CourseMember member) {
        return getTaskPoints(surveyResultRepository.findAllByMember(member));
    }


    private Double getBestFileTaskPoints(CourseMember member, int count) {
        List<? extends ActivityResult> taskResults = fileTaskResultRepository.findAllByMember(member);

        return taskResults
                .stream()
                .filter(ActivityResult::isEvaluated) // Filtrowanie ocenionych wyników
                .mapToDouble(ActivityResult::getPoints) // Pobieranie punktów
                .boxed() // Konwersja na Double, aby można było sortować
                .sorted(Comparator.reverseOrder()) // Sortowanie malejąco
                .limit(count) // Ograniczenie do najlepszych 'count' wyników
                .mapToDouble(Double::doubleValue) // Powrót do strumienia double
                .sum(); // Sumowanie wyników
    }

    private Double getBestGraphTaskPoints(CourseMember member, int count) {
        List<? extends ActivityResult> taskResults = graphTaskResultRepository.findAllByMember(member);

        return taskResults
                .stream()
                .filter(ActivityResult::isEvaluated) // Filtrowanie ocenionych wyników
                .mapToDouble(ActivityResult::getPoints) // Pobieranie punktów
                .boxed() // Konwersja na Double, aby można było sortować
                .sorted(Comparator.reverseOrder()) // Sortowanie malejąco
                .limit(count) // Ograniczenie do najlepszych 'count' wyników
                .mapToDouble(Double::doubleValue) // Powrót do strumienia double
                .sum(); // Sumowanie wyników
    }

    private Double getTaskPoints(List<? extends ActivityResult> taskResults) {
        return taskResults
                .stream()
                .filter(ActivityResult::isEvaluated)
                .mapToDouble(ActivityResult::getPoints)
                .sum();
    }

    private int getTaskCount(List<? extends ActivityResult> taskResults) {
        return (int) taskResults
                .stream()
                .filter(ActivityResult::isEvaluated)
                .count();
    }

    private Double getMaxPoints(User student, Course course) {
        Double maxPointsGraphTask = graphTaskResultRepository.findAllByUserAndCourse(student, course)
                .stream()
                .filter(GraphTaskResult::isEvaluated)
                .mapToDouble(result -> result.getGraphTask().getMaxPoints())
                .sum();
        Double maxPointsFileTask = fileTaskResultRepository.findAllByMember_UserAndMember_Course(student, course)
                .stream()
                .filter(FileTaskResult::isEvaluated)
                .mapToDouble(result -> result.getFileTask().getMaxPoints())
                .sum();
        Double maxPointsSurvey = surveyResultRepository.findAllByUserAndCourse(student, course)
                .stream()
                .filter(SurveyResult::isEvaluated)
                .mapToDouble(result -> result.getSurvey().getMaxPoints())
                .sum();
        return maxPointsGraphTask + maxPointsFileTask + maxPointsSurvey;
    }

    private List<LastAddedActivity> getLastAddedActivities(Course course) {
        log.info("getLastAddedActivities");
        List<GraphTask> graphTasks = graphTaskService.getStudentGraphTasks(course);
        List<FileTask> fileTasks = fileTaskService.getStudentFileTasks(course);
        List<Survey> surveys = surveyService.getStudentSurvey(course);
        List<Info> infos = infoService.getStudentInfos(course);

        return Stream.of(graphTasks, fileTasks, surveys, infos)
                .flatMap(Collection::stream)
                .sorted(((o1, o2) -> Long.compare(o2.getCreationTime(), o1.getCreationTime())))
                .limit(MAX_LAST_ACTIVITIES_IN_DASHBOARD)
                .map(this::toLastAddedActivity)
                .toList();
    }

    private LastAddedActivity toLastAddedActivity(Activity activity) {
        Chapter chapter = chapterService.getChapterWithActivity(activity);
        String chapterName = Objects.nonNull(chapter) ? chapter.getName() : null;
        String activityType = activity.getActivityType().toString();
        Double points = activity.getMaxPoints();
        if (activity.getActivityType().equals(ActivityType.INFO)) {
            points = 0D;
        }

        Requirement requirement = activity.getRequirements()
                .stream()
                .filter(req -> req.getSelected() && Objects.nonNull(req.getDateToMillis()))
                .findAny()
                .orElse(null);
        Long availableUntil = Objects.nonNull(requirement) ? requirement.getDateToMillis() : null;
        return new LastAddedActivity(chapterName, activityType, points, availableUntil);

    }

    private HeroStatsDTO getHeroStats(CourseMember member) {
        log.info("getHeroStats");
        Double experiencePoints = member.getPoints();
        Double nextLvlPoints = getNexLvlPoints(member);

        Rank rank = rankService.getCurrentRank(member);
        String rankName = rank != null ? rank.getName() : null;
        Long badgesNumber = (long) member.getUnlockedBadges().size();
        Long completedActivities = activityResultService.countCompletedActivities(member);

        return new HeroStatsDTO(
                experiencePoints,
                nextLvlPoints,
                rankName,
                badgesNumber,
                completedActivities
        );
    }

    private Double getNexLvlPoints(CourseMember member) {
        List<Rank> sortedRanks = rankService.getSortedRanksForHeroType(member);
        for (int i=sortedRanks.size()-1; i >= 0; i--) {
            if (member.getPoints() >= sortedRanks.get(i).getMinPoints()) {
                if (i == sortedRanks.size() - 1) return null;
                else return sortedRanks.get(i+1).getMinPoints();
            }
        }
        return null;
    }
}
