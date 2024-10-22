package com.example.api.config;

import com.example.api.activity.result.model.*;
import com.example.api.activity.result.repository.AdditionalPointsRepository;
import com.example.api.activity.result.repository.ColloquiumPointsRepository;
import com.example.api.activity.result.repository.LaboratoryPointsRepository;
import com.example.api.activity.result.repository.SurveyResultRepository;
import com.example.api.activity.task.filetask.FileTask;
import com.example.api.activity.task.graphtask.GraphTask;
import com.example.api.activity.task.Task;
import com.example.api.activity.info.Info;
import com.example.api.activity.survey.Survey;
import com.example.api.activity.task.graphtask.GraphTaskService;
import com.example.api.chapter.requirement.model.*;
import com.example.api.colloquium.ColloquiumDetails;
import com.example.api.colloquium.ColloquiumDetailsRepository;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.course.coursemember.CourseMemberRepository;
import com.example.api.course.CourseRepository;
import com.example.api.course.coursemember.CourseMemberService;
import com.example.api.course.coursetype.CourseType;
import com.example.api.course.coursetype.CourseTypeRepository;
import com.example.api.group.accessdate.AccessDate;
import com.example.api.group.Group;
import com.example.api.map.ActivityMap;
import com.example.api.chapter.Chapter;
import com.example.api.question.Difficulty;
import com.example.api.question.option.Option;
import com.example.api.question.Question;
import com.example.api.question.QuestionType;
import com.example.api.user.badge.BadgeRepository;
import com.example.api.user.badge.types.*;
import com.example.api.user.hero.HeroRepository;
import com.example.api.user.hero.model.*;
import com.example.api.user.model.AccountType;
import com.example.api.user.hero.HeroType;
import com.example.api.user.model.Rank;
import com.example.api.user.model.User;
import com.example.api.file.File;
import com.example.api.file.image.Image;
import com.example.api.file.image.ImageType;
import com.example.api.util.model.Url;
import com.example.api.chapter.ChapterRepository;
import com.example.api.chapter.requirement.RequirementRepository;
import com.example.api.user.repository.*;
import com.example.api.file.FileRepository;
import com.example.api.util.repository.UrlRepository;
import com.example.api.activity.Activity;
import com.example.api.activity.feedback.ProfessorFeedbackService;
import com.example.api.activity.survey.SurveyResultService;
import com.example.api.activity.result.service.FileTaskResultService;
import com.example.api.activity.result.service.GraphTaskResultService;
import com.example.api.activity.task.filetask.FileTaskService;
import com.example.api.activity.info.InfoService;
import com.example.api.activity.survey.SurveyService;
import com.example.api.group.accessdate.AccessDateService;
import com.example.api.group.GroupService;
import com.example.api.map.ActivityMapService;
import com.example.api.chapter.requirement.RequirementService;
import com.example.api.question.option.OptionService;
import com.example.api.question.QuestionService;
import com.example.api.user.badge.BadgeService;
import com.example.api.user.service.UserService;
import com.example.api.util.message.MessageManager;
import lombok.AllArgsConstructor;

import org.aspectj.apache.bcel.classfile.Module.Require;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.lang.String;

import javax.imageio.ImageIO;
import javax.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Configuration
@AllArgsConstructor
@Transactional
public class DatabaseConfig {
    private final UrlRepository urlRepository;
    private final ChapterRepository chapterRepository;
    private final RankRepository rankRepository;
    private final AdditionalPointsRepository additionalPointsRepository;
    private final SurveyResultRepository surveyResultRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final RequirementRepository requirementRepository;
    private final HeroRepository heroRepository;
    private final CourseRepository courseRepository;
    private final ColloquiumDetailsRepository colloquiumDetailsRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final CourseMemberRepository courseMemberRepository;
    private final PasswordEncoder passwordEncoder= new BCryptPasswordEncoder();

    @Bean
    public CommandLineRunner commandLineRunner(UserService userService, CourseMemberService courseMemberService, ProfessorFeedbackService professorFeedbackService,
                                               SurveyResultService surveyResultService, GraphTaskService graphTaskService,
                                               GraphTaskResultService graphTaskResultService, GroupService groupService,
                                               ActivityMapService activityMapService, QuestionService questionService,
                                               FileTaskResultService fileTaskResultService, OptionService optionService,
                                               AccessDateService accessDateService, RequirementService requirementService,
                                               FileTaskService fileTaskService, InfoService infoService,
                                               SurveyService surveyService, BadgeService badgeService){
        return args -> {
    
            
            //TYPY KURSOW
            CourseType courseType1 = new CourseType("Sieci komputerowe");            
            courseTypeRepository.save(courseType1);


            //ZAKLADANIE KURSOW (WYMAGA ZDEFINIOWANEGO WYŻEJ TYPU KURSU CHYBA)
            Course course1 = new Course(null, "Sieci komputerowe", "Kurs przedmiotu sieci komputerowe", null);
            courseRepository.save(course1);


            // HEROES for COURSES
            Hero unfortunate1 = new Hero(HeroType.UNFORTUNATE,course1);
            Hero sheUnfortunate1 = new Hero(HeroType.SHEUNFORTUNATE, course1);
            heroRepository.saveAll(List.of(unfortunate1, sheUnfortunate1));

 
            //STUDENT CREATION (1 LIST == 1 GROUP)
            List<User> students1 = Collections.synchronizedList(new ArrayList<>());
            students1.add(createStudent("jgorski@student.agh.edu.pl", "Jerzy", "Górski", 123456));
            students1.add(createStudent("smazur@student.agh.edu.pl", "Szymon", "Mazur", 123457));
            students1.add(createStudent("murbanska@student.agh.edu.pl", "Matylda", "Urbańska",123458));
            students1.add(createStudent("pwasilewski@student.agh.edu.pl", "Patryk", "Wasilewski",123459));
            students1.add(createStudent("awojcik@student.agh.edu.pl", "Amelia", "Wójcik",223456));
            students1.add(createStudent("kkruk@student.agh.edu.pl", "Kornel", "Kruk",323456));
            students1.add(createStudent("mdabrowska@student.agh.edu.pl", "Maria", "Dąbrowska",423456));
            students1.add(createStudent("aczajkowski@student.agh.edu.pl", "Antoni", "Czajkowski",523456));
            userRepository.saveAll(students1);

            List<User> students2 = Collections.synchronizedList(new ArrayList<>());
            students2.add(createStudent("mnowak@student.agh.edu.pl", "Magdalena", "Nowak", 623456));
            students2.add(createStudent("jlewandowska@student.agh.edu.pl", "Julia", "Lewandowska", 723456));
            students2.add(createStudent("mwojcik@student.agh.edu.pl", "Milena", "Wójcik", 823456));
            students2.add(createStudent("kpaluch@student.agh.edu.pl", "Kacper", "Paluch", 923456));
            students2.add(createStudent("fzalewski@student.agh.edu.pl", "Filip", "Zalewski", 133456));
            students2.add(createStudent("jmichalak@student.agh.edu.pl", "Jan", "Michalak", 143456));
            students2.add(createStudent("kostrowska@student.agh.edu.pl", "Karina", "Ostrowska", 153456));
            students2.add(createStudent("dkowalska@student.agh.edu.pl", "Dominika", "Kowalska", 163456));
            students2.add(createStudent("manowak@student.agh.edu.pl", "Małgorzata Anna", "Kowalska", 163457));
            userRepository.saveAll(students2);

            List<User> students3 = Collections.synchronizedList(new ArrayList<>());
            students3.add(createStudent(  "jmalina@student.agh.edu.pl", "Jacek", "Malina", 184434));
            students3.add(createStudent(  "wwisienka@student.agh.edu.pl", "Wojciech", "Wiesienka", 192345));
            students3.add(createStudent(  "ckowalski@student.agh.edu.pl", "Cyprian", "Kowalski", 113560));
            students3.add(createStudent(  "wdabrowski@student.agh.edu.pl", "Wiktor", "Dabrowski", 111678));
            students3.add(createStudent(  "amisiewski@student.agh.edu.pl", "Aleksander", "Misiewski", 114632));
            students3.add(createStudent(  "zwalczak@student.agh.edu.pl", "Zuzanna", "Walczak", 111233));
            students3.add(createStudent(  "asuchacka@student.agh.edu.pl", "Anna", "Suchacka", 116784));
            students3.add(createStudent(  "ptuteja@student.agh.edu.pl", "Pola", "Tuteja", 113455));
            userRepository.saveAll(students3);
            
            
            //GROUP CREATION
            Group group1_course1 = createGroup("pn-1440-A", students1, course1, groupService);
            Group group2_course1 = createGroup("pn-1440-B", students2, course1, groupService);
            Group group3_course1 = createGroup("pt-1500-A", students3, course1, groupService);        
            List<Group> groups_course1 = List.of(group1_course1,group2_course1 ,group3_course1);

                
            //STUDENT ASSIGNMENT TO GROUPS
            List<List<User>> students = List.of(students1,students2,students3);   

            for(int i=0; i<students.size(); i++){
                int noStudentsInGroup = students.get(i).size();
                for(int j=0; j<noStudentsInGroup;j++){
                    String name = students.get(i).get(j).getFirstName();
                    int nameLen = name.length();

                    if(name.charAt(nameLen-1)=='a'){ //dziewczyna
                        addToGroup(students.get(i).get(j), groups_course1.get(i), sheUnfortunate1);
                    }
                    else{ //chlop
                        addToGroup(students.get(i).get(j), groups_course1.get(i), unfortunate1);
                    }
                }       
            }
                

            //PROFESSOR CREATION AND COURSE ASSIGNMENT
            User professor1 = new User("bmaj@agh.edu.pl","Bernard","Maj",AccountType.PROFESSOR);
            professor1.setPassword(passwordEncoder.encode("12345"));
            professor1.getCourses().add(course1);

            User professor2 = new User("szielinski@agh.edu.pl","Sławomir","Zieliński",AccountType.PROFESSOR);
            professor2.setPassword(passwordEncoder.encode("12345"));
            userRepository.saveAll(List.of(professor1, professor2));  
            professor2.getCourses().add(course1);
            

            //COURSE FINALE CONFIGURATION
            course1.setOwner(professor1);  

            userRepository.save(professor1);
            userRepository.save(professor2);

            course1.setGroups(groups_course1);

            courseRepository.save(course1);
            courseTypeRepository.save(courseType1); //?
            

            //ACCESS DATES
            AccessDate ac1 = new AccessDate(null, System.currentTimeMillis(), System.currentTimeMillis(), List.of(group1_course1));
            AccessDate ac2 = new AccessDate(null, System.currentTimeMillis(), System.currentTimeMillis(), List.of(group2_course1));
            accessDateService.saveAccessDate(ac1);
            accessDateService.saveAccessDate(ac2);

            //COLLOQUIMS
            colloquiumDetailsRepository.save(new ColloquiumDetails(1, "Gon Listopadowy",72,4, new int[] {4, 5, 6, 5, 6, 5, 8, 4, 7, 8, 9, 5}));
            colloquiumDetailsRepository.save(new ColloquiumDetails(2, "Wielki Mróz",72,4, new int[] {6, 3, 3, 6, 3, 5, 6, 9, 10, 10, 9,2}));
            colloquiumDetailsRepository.save(new ColloquiumDetails(3, "Kolokwium praktyczne",56,0, new int[] {24,20,12}));
            colloquiumDetailsRepository.save(new ColloquiumDetails(4, "Kolokwium ustne - teoria",16,1, new int[] {8,8}));


            //GRAPH TASKS (EXPEDITIONS, NIESPODZIANKI ONLINE)
            List<Question> questions = addQuestionSet(course1, questionService, optionService);
            GraphTask graphTask4_1 = new GraphTask();
            setGraphTaskDataAndSave(graphTask4_1,
                "(Nie)spodzianka II",
                "model OSI, funkcje warstwy II oraz zasady przełączania.",
                "model OSI, funkcje warstwy II oraz zasady przełączania",
                5,4,professor1,20.0,course1,null,questions,12L,graphTaskService
            );

            List<Question> questions2 = addQuestionSet(course1, questionService, optionService);
            GraphTask graphTask4_2 = new GraphTask();
            setGraphTaskDataAndSave(graphTask4_2,
                "Spodziewana Niespodzianka",
                "model OSI, funkcje warstwy II oraz zasady przełączania.",
                "Zapraszam chętnych...",
                5,5,professor1,20.0,course1,requirementService.getDefaultRequirements(true),questions2,20L,graphTaskService
            );

            List<Question> questions3 = addQuestionSet2(course1, questionService, optionService);
            GraphTask graphTask3_1 = new GraphTask();
            setGraphTaskDataAndSave(graphTask3_1,
                "(Nie)spodzianka I",
                "model OSI, funkcje warstwy III oraz zasady przełączania.",
                "Zapraszam chętnych...",
                5,5,professor1,20.0,course1,requirementService.getDefaultRequirements(true),questions3,20L,graphTaskService
            );


            //FILE TASKS (ZADANIA BOJOWE)
            FileTask fileTask4_1 = new FileTask();
            setFileTaskDataAndSave(fileTask4_1,
                "Niespodzianka",
                "Pochwal się wiedzą na temat okablowania szkieletowego",
                "",
                3,3,professor1,20.0,course1,null,fileTaskService
            );


            //INFOS (OGŁOSZENIA)
            Info info1_1 = new Info();
            setInfoDataAndSave(info1_1,
                "Konsultacje",
                "Link do konsultacji",
                0,0,professor1,0.0,course1,null,infoService,
                List.of("https://mche.webex.com/wbxmjs/joinservice/sites/mche/meeting/download/6A5E9486079F2D17E0531AA2FD0A881B")
            );

            Info info2_1 = new Info();
            setInfoDataAndSave(info2_1,
                "Konsole - dostep",
                "Jak dostac sie do konsoli wybranego urzadzenia",
                0,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70580/mod_resource/content/2/4.23-podstawy-v0.5.pdf")
            );

            Info info3_1 = new Info();
            setInfoDataAndSave(info3_1,
                "VLAN - Slajdy",
                "Slajdy z laboratorium VLAN",
                0,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70581/mod_resource/content/1/lsk-lab03-vlan.pdf")
            );

            Info info4_1 = new Info();
            setInfoDataAndSave(info4_1,
                "STP - Slajdy",
                "Poniżej znajduje się link do slajdów z laboratorium",
                3,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70582/mod_resource/content/1/STP-lab-v1.0.pdf")
            );

            Info info4_2 = new Info();
            setInfoDataAndSave(info4_2,
                "STP - Komendy",
                "Przydatne komendy - link ponizej",
                4,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70583/mod_resource/content/0/stp-komendy.txt")
            );

            Info info5_1 = new Info();
            setInfoDataAndSave(info5_1,
                "DHCP - Slajdy",
                "Przebieg laboratorium z DHCP",
                0,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70586/mod_resource/content/0/DHCP-lab.pdf")
            );

            Info info6_1 = new Info();
            setInfoDataAndSave(info6_1,
                "ARP - Slajdy",
                "Przebieg laboratorium z ARP",
                0,0,professor1,0.0,course1,null,infoService,
                List.of("https://upel.agh.edu.pl/pluginfile.php/70585/mod_resource/content/1/ARP-lab.pdf")
            );
            

            //SURVEYS
            Survey survey4_1 = new Survey();
            setSurveyDataAndSave(survey4_1,
                "Tytul ankietki",
                "Pomóż nam polepszyć kurs dzieląc się swoją opinią!",
                7,3,null,2.0,course1,null,surveyService
            );

            
            //ACTIVITY MAPS
            ActivityMap activityMap1 = new ActivityMap();
            setActivityMapAndSave(activityMap1, null,null, List.of(info1_1),
            null,"src/main/resources/images/chapter_image.png", activityMapService);

            ActivityMap activityMap2 = new ActivityMap();
            setActivityMapAndSave(activityMap2, List.of(graphTask4_1),null, List.of(info2_1),
            null,"src/main/resources/images/chapter_image.png", activityMapService);

            ActivityMap activityMap3 = new ActivityMap();
            setActivityMapAndSave(activityMap3, List.of(graphTask3_1),null, List.of(info3_1),
            null,"src/main/resources/images/chapter_image.png", activityMapService);

            ActivityMap activityMap4 = new ActivityMap();
            setActivityMapAndSave(activityMap4, List.of(graphTask4_2),List.of(fileTask4_1), List.of(info4_1,info4_2),
            null,"src/main/resources/images/chapter_image.png", activityMapService);

            // ActivityMap activityMap5 = new ActivityMap();
            // setActivityMapAndSave(activityMap4, List.of(),List.of(), List.of(),
            // null,"src/main/resources/images/chapter_image.png", activityMapService);

            // ActivityMap activityMap6 = new ActivityMap();
            // setActivityMapAndSave(activityMap4, List.of(),List.of(), List.of(),
            // null,"src/main/resources/images/chapter_image.png", activityMapService);

        

            //CHAPTERS
            Chapter chapter1 = new Chapter();
            setChapterDataAndSave(chapter1,"Lab1 - Wstep",0,0,activityMap1,null,false,course1);
            
            Chapter chapter2 = new Chapter();
            setChapterDataAndSave(chapter2,"Lab2 - Switche",0,1,activityMap2,null,false,course1);
            
            Chapter chapter3 = new Chapter();
            setChapterDataAndSave(chapter3,"Lab3 - VLAN",0,2,activityMap3,null,false,course1);
            
            Chapter chapter4 = new Chapter();
            setChapterDataAndSave(chapter4,"Lab4 - STP",0,3,activityMap4,null,false,course1);

            // Chapter chapter5 = new Chapter();
            // setChapterDataAndSave(chapter5,"Lab5 - ARP",0,3,activityMap5,null,false,course1);

            // Chapter chapter6 = new Chapter();
            // setChapterDataAndSave(chapter6,"Lab6 - Routing statyczny",0,3,activityMap6,null,false,course1);
             

            //GRAPHTASK RESULTS
            Calendar calendar = Calendar.getInstance();   
            calendar.set(2024, Calendar.JUNE, 15);         
            List<Double> graphTask3_1_points_students1 = new ArrayList<Double>(Arrays.asList(20.0, 20.0, 20.0, 5.0, 2.0, 0.0, 15.0, 19.5));
            List<Double> graphTask3_1_points_students2 = new ArrayList<Double>(Arrays.asList(20.0, 20.0, 20.0, 5.0, 2.0, 5.0, 15.0, 19.5));
            List<Double> graphTask3_1_points_students3 = new ArrayList<Double>(Arrays.asList(20.0, 20.0, 18.0, 18.0, 2.0, 19.0, 15.0, 19.5));

            List<Double> graphTask4_1_points_students1 = new ArrayList<Double>(Arrays.asList(20.0, 12.0, 10.0, 5.0, 2.0, 13.0, 15.0, 7.5));
            List<Double> graphTask4_1_points_students2 = new ArrayList<Double>(Arrays.asList(2.0, 2.0, 10.0, 15.0, 20.0, 3.0, 5.0, 7.5));
            List<Double> graphTask4_1_points_students3 = new ArrayList<Double>(Arrays.asList(20.0, 20.0, 18.0, 16.0, 20.0, 20.0, 15.0, 17.5));

            List<Double> graphTask4_2_points_students2 = new ArrayList<Double>(Arrays.asList(5.0, 3.0, 12.0, 15.0, 20.0, 3.0, 5.0, 17.5));
            List<Double> graphTask4_2_points_students3 = new ArrayList<Double>(Arrays.asList(20.0, 20.0, 20.0, 15.0, 20.0, 20.0, 19.0, 17.5));

            
            int students1Len = 8; //for some reason students1.size() returns 16!? Fix it if you know how
            for(int i=0; i<students1Len; i++){
                // GraphTaskResult result3_1_students1 = new GraphTaskResult();
                // setGraphTaskResAndSave(students1.get(i).getCourseMember(course1).orElseThrow(),
                //     result3_1_students1,graphTask3_1,graphTask3_1_points_students1.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                // );

                GraphTaskResult result3_1_students2 = new GraphTaskResult();
                setGraphTaskResAndSave(students2.get(i).getCourseMember(course1).orElseThrow(),
                    result3_1_students2,graphTask3_1,graphTask3_1_points_students2.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result3_1_students3 = new GraphTaskResult();
                setGraphTaskResAndSave(students3.get(i).getCourseMember(course1).orElseThrow(),
                    result3_1_students3,graphTask3_1,graphTask3_1_points_students3.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result4_1_students1 = new GraphTaskResult();
                setGraphTaskResAndSave(students1.get(i).getCourseMember(course1).orElseThrow(),
                    result4_1_students1,graphTask4_1,graphTask4_1_points_students1.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result4_1_students2 = new GraphTaskResult();
                setGraphTaskResAndSave(students2.get(i).getCourseMember(course1).orElseThrow(),
                    result4_1_students2,graphTask4_1,graphTask4_1_points_students2.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result4_1_students3 = new GraphTaskResult();
                setGraphTaskResAndSave(students3.get(i).getCourseMember(course1).orElseThrow(),
                    result4_1_students3,graphTask4_1,graphTask4_1_points_students3.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result4_2_students2 = new GraphTaskResult();
                setGraphTaskResAndSave(students2.get(i).getCourseMember(course1).orElseThrow(),
                    result4_2_students2,graphTask4_2,graphTask4_2_points_students2.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );

                GraphTaskResult result4_2_students3 = new GraphTaskResult();
                setGraphTaskResAndSave(students3.get(i).getCourseMember(course1).orElseThrow(),
                    result4_2_students3,graphTask4_2,graphTask4_2_points_students3.get(i), 10 * 60,calendar.getTimeInMillis(),graphTaskResultService
                );                
            }

           
            //FILETASK RESULTS (not important for scenario)
            for(int i=0; i<students1Len; i++){ 
                FileTaskResult result4_1 = new FileTaskResult();
                setFileTaskResAndSave(students1.get(i).getCourseMember(course1).orElseThrow(),
                    result4_1,fileTask4_1,Long.valueOf(i),calendar.getTimeInMillis(),"moja szczera odpowiedz",fileTaskResultService
                );
            }        


            //SURVEY RESULTS (WE DONT GIVE POINTS FOR THEM)
            for(int i=0; i<students1Len/2;i++){
                SurveyResult surveyResult4_1 = new SurveyResult();
                setSurveyResAndSave(students1.get(i).getCourseMember(course1).orElseThrow(),
                    surveyResult4_1, survey4_1, Long.valueOf(i), calendar.getTimeInMillis());
            }
            
            //ADDITIONAL POINTS
            // AdditionalPoints additionalPoints = new AdditionalPoints();
            // additionalPoints.setId(1L);
            // CourseMember additionalPointsMember = students1.get(0).getCourseMember(course1).orElseThrow();
            // additionalPoints.setMember(additionalPointsMember);
            // additionalPoints.setPoints(100D);
            // additionalPoints.setSendDateMillis(calendar.getTimeInMillis());
            // additionalPoints.setProfessorEmail(professor1.getEmail());
            // additionalPoints.setDescription("Good job");
            // addReceivedPointsForUser(additionalPointsMember, additionalPoints.getPoints());
            // additionalPointsRepository.save(additionalPoints);


            initAllRanks(course1);
            initBadges(course1);
        };
    }

    private static Group createGroup(String name, List<User> students, Course course, GroupService groupService) {
        Group group = new Group();
        group.setInvitationCode(name);
        group.setName(name);
        group.setUsers(students);
        group.setCourse(course);
        groupService.saveGroup(group);
        return group;
    }

    public void setBasicActivityData(Activity activity,String title,String description,
        int posX,int posY,User professor,Double maxPoints,Course course, List<Requirement> requirements){
        activity.setTitle(title);        
        activity.setDescription(description);
        activity.setPosX(posX);
        activity.setPosY(posY);
        activity.setProfessor(professor);
        activity.setMaxPoints(maxPoints);
        activity.setExperience(maxPoints);
        activity.setCourse(course);
        activity.setIsBlocked(false);
        if(requirements == null) activity.setRequirements(createDefaultRequirements());
        else activity.setRequirements(requirements);
        
    }

    public void setBasicTaskData(Task task,String title,String taskContent,String description,
        int posX,int posY,User professor,Double maxPoints,Course course,List<Requirement> requirements){

        setBasicActivityData(task, title, description, posX, posY, professor, maxPoints, course,requirements);
        task.setTaskContent(taskContent);      
    }    

    //Ekspedycja
    public void setGraphTaskDataAndSave(GraphTask graphTask,String title,String taskContent,String description,
        int posX,int posY,User professor,Double maxPoints,Course course,List<Requirement> requirements,
        List<Question> questions, Long timeToSolveMinutes,GraphTaskService graphTaskService){
        
        setBasicTaskData(graphTask, title,taskContent, description, posX, posY, professor, maxPoints, course,requirements);        
        graphTask.setQuestions(questions);
        graphTask.setTimeToSolveMillis(timeToSolveMinutes * 60 * 1000L);
        // graphTask.setId(1L);
        graphTaskService.saveGraphTask(graphTask);      
    }    

    //Zadanie bojowe
    public void setFileTaskDataAndSave(FileTask fileTask,String title,String taskContent,String description,
        int posX,int posY,User professor,Double maxPoints,Course course,List<Requirement> requirements,FileTaskService fileTaskService){
        
        setBasicTaskData(fileTask, title,taskContent, description, posX, posY, professor, maxPoints, course,requirements);        
        fileTaskService.saveFileTask(fileTask);      
    }    

    //Ogloszenia duszpasterskie
    public void setInfoDataAndSave(Info info,String title,String description,
        int posX,int posY,User professor,Double maxPoints,Course course,List<Requirement> requirements,InfoService infoService,List<String> urlStrings){
        
        setBasicActivityData(info, title, description, posX, posY, professor, maxPoints, course,requirements);
        
        List<Url> urls = new ArrayList<>();
        for(String urlStr : urlStrings){
            Url url= new Url(urlStr);
            urlRepository.save(url);
            urls.add(url);
        }  
        info.setImageUrls(urls);
        infoService.saveInfo(info);      
    }    

    //Ankiety
    public void setSurveyDataAndSave(Survey survey,String title,String description,
        int posX,int posY,User professor,Double maxPoints,Course course,List<Requirement> requirements,SurveyService surveyService){
        
        setBasicActivityData(survey, title, description, posX, posY, professor, maxPoints, course,requirements);        
        surveyService.saveSurvey(survey);      
    }    

    
    public void setActivityMapAndSave(ActivityMap map,List<GraphTask> graphTasks, List<FileTask> fileTasks, List<Info> infos,
         List<Survey> surveys,String imageStr, ActivityMapService mapService) throws IOException{

        map.setMapSizeY(5);
        map.setMapSizeX(8);
        map.setGraphTasks(graphTasks);
        map.setFileTasks(fileTasks);
        map.setInfos(infos);
        map.setSurveys(surveys);
        map.setImage(createImageForChapter(imageStr));
        mapService.saveActivityMap(map);
    }


    public void setChapterDataAndSave(Chapter chapter,String name,int posX,int posY,ActivityMap activityMap,List<Requirement> requirements,
        boolean isBlocked, Course course){
        
        chapter.setName(name);
        chapter.setPosX(posX);
        chapter.setPosY(posY);
        chapter.setActivityMap(activityMap);
        if(requirements == null) chapter.setRequirements(createDefaultRequirements());
        else chapter.setRequirements(requirements);
        chapter.setIsBlocked(isBlocked);
        chapter.setCourse(course);
        chapterRepository.save(chapter);
    }

    public void setGraphTaskResAndSave(CourseMember member,GraphTaskResult result,GraphTask graphTask,Double points,
        int timeSpentSec,Long startTimeMillis,GraphTaskResultService resultService){
        result.setMember(member);
        result.setGraphTask(graphTask);
        result.setPoints(points);
        result.setTimeSpentSec(timeSpentSec);
        result.setStartDateMillis(startTimeMillis);
        result.setSendDateMillis(  startTimeMillis + timeSpentSec/1000 );
        //addReceivedPointsForUser(member, points);
        
        resultService.saveGraphTaskResult(result);        
        courseMemberRepository.save(member);
    }

    public void setFileTaskResAndSave(CourseMember member,FileTaskResult result,FileTask fileTask, Long taskId,
        Long sendTimeMillis,String answer,FileTaskResultService resultService){
        result.setMember(member);
        result.setFileTask(fileTask);
        result.setEvaluated(false);
        result.setSendDateMillis(sendTimeMillis);
        result.setId(taskId);
        result.setAnswer(answer);
        resultService.saveFileTaskResult(result);
    }

    public void setSurveyResAndSave(CourseMember member,SurveyResult result,Survey survey, Long surveyId,
        Long sendTimeMillis){
        result.setMember(member);
        result.setSurvey(survey);
        result.setPoints(0.0);
        result.setSendDateMillis(sendTimeMillis);
        result.setId(surveyId);
        surveyResultRepository.save(result);
    }


    public Image createImageForChapter(String source) throws IOException{
        byte[] chapterImageBytes = getByteArrayForFile(source);
        Image chapterImage = new Image("myImageForChapter", chapterImageBytes, ImageType.CHAPTER);
        fileRepository.save(chapterImage);
        return chapterImage;
    }

    public Image createImageForRank(String source) throws IOException{
        byte[] chapterImageBytes = getByteArrayForFile(source);
        Image chapterImage = new Image("myImageForRank", chapterImageBytes, ImageType.RANK);
        fileRepository.save(chapterImage);
        return chapterImage;
    }

    public Image createImageForBadge(String source) throws IOException{
        byte[] chapterImageBytes = getByteArrayForFile(source);
        Image chapterImage = new Image("myImageForBadge", chapterImageBytes, ImageType.BADGE);
        fileRepository.save(chapterImage);
        return chapterImage;
    }


    private void addToGroup(User user, Group group, Hero hero) {
        UserHero userHero = userHero(hero);
        CourseMember cm = new CourseMember(user, group, userHero);
        courseMemberRepository.save(cm);
        user.getCourseMemberships().add(cm);
        group.getMembers().add(cm);
        group.getUsers().add(user);
        userRepository.save(user);
    }

    private List<Requirement> createDefaultRequirements() {
        DateFromRequirement dateFromRequirement = new DateFromRequirement(MessageManager.DATE_FROM_REQ_NAME,false,null);
        DateToRequirement dateToRequirement = new DateToRequirement(MessageManager.DATE_TO_REQ_NAME,false,null);
        FileTasksRequirement fileTasksRequirement = new FileTasksRequirement(MessageManager.FILE_TASKS_REQ_NAME,false,new LinkedList<>());      
        GraphTasksRequirement graphTasksRequirement = new GraphTasksRequirement(MessageManager.GRAPH_TASKS_REQ_NAME,false,new LinkedList<>());
        GroupsRequirement groupsRequirement = new GroupsRequirement(MessageManager.GROUPS_REQ_NAME,false,new LinkedList<>());
        MinPointsRequirement minPointsRequirement = new MinPointsRequirement(MessageManager.MIN_POINTS_REQ_NAME,false,null);
        StudentsRequirement studentsRequirement = new StudentsRequirement(MessageManager.STUDENTS_REQ_NAME,false,new LinkedList<>());
        List<Requirement> requirements = List.of(
                dateFromRequirement,
                dateToRequirement,
                minPointsRequirement,
                groupsRequirement,
                studentsRequirement,
                graphTasksRequirement,
                fileTasksRequirement
        );
        requirementRepository.saveAll(requirements);
        return requirements;
    }

    private void initAllRanks(Course course) throws IOException {
        List<Image> sheUnfortunateImages = Collections.synchronizedList(new ArrayList<>());
        for(int i=0;i<7;i++){
            String source = "src/main/resources/images/sheUnfortunate" + (i+1) + ".png";
            sheUnfortunateImages.add(createImageForRank(source));
        }

        List<Image> unfortunateImages = Collections.synchronizedList(new ArrayList<>());
        for(int i=0;i<7;i++){
            String source = "src/main/resources/images/unfortunate" + (i+1) + ".png";
            unfortunateImages.add(createImageForRank(source));
        }        

        Rank SheUnfortunateRank1 = new Rank(null, HeroType.SHEUNFORTUNATE, "Nornica", 0.0, sheUnfortunateImages.get(0), course);
        Rank SheUnfortunateRank2 = new Rank(null, HeroType.SHEUNFORTUNATE, "Mamuna", 20.0, sheUnfortunateImages.get(1), course);
        Rank SheUnfortunateRank3 = new Rank(null, HeroType.SHEUNFORTUNATE, "Fochna", 50.0, sheUnfortunateImages.get(2), course);
        Rank SheUnfortunateRank4 = new Rank(null, HeroType.SHEUNFORTUNATE, "Ognista Potwora", 80.0, sheUnfortunateImages.get(3), course);
        Rank SheUnfortunateRank5 = new Rank(null, HeroType.SHEUNFORTUNATE, "Busianna", 120.0, sheUnfortunateImages.get(4), course);
        Rank SheUnfortunateRank6 = new Rank(null, HeroType.SHEUNFORTUNATE, "Lubawa", 160.0, sheUnfortunateImages.get(5), course);
        Rank SheUnfortunateRank7 = new Rank(null, HeroType.SHEUNFORTUNATE, "Ciotka Jaga", 200.0, sheUnfortunateImages.get(6), course);

        Rank UnfortunateRank1 = new Rank(null, HeroType.UNFORTUNATE, "Chomik", 0.0, unfortunateImages.get(0), course);
        Rank UnfortunateRank2 = new Rank(null, HeroType.UNFORTUNATE, "Woj Wit", 20.0, unfortunateImages.get(1), course);
        Rank UnfortunateRank3 = new Rank(null, HeroType.UNFORTUNATE, "Mirmił", 50.0, unfortunateImages.get(2), course);
        Rank UnfortunateRank4 = new Rank(null, HeroType.UNFORTUNATE, "Miluś", 80.0,unfortunateImages.get(3), course);
        Rank UnfortunateRank5 = new Rank(null, HeroType.UNFORTUNATE, "Kajko", 120.0, unfortunateImages.get(4), course);
        Rank UnfortunateRank6 = new Rank(null, HeroType.UNFORTUNATE, "Kokosz", 160.0, unfortunateImages.get(5), course);
        Rank UnfortunateRank7 = new Rank(null, HeroType.UNFORTUNATE, "Łamignat", 200.0, unfortunateImages.get(6), course);


        rankRepository.saveAll(List.of(SheUnfortunateRank1, SheUnfortunateRank2, SheUnfortunateRank3, SheUnfortunateRank4, SheUnfortunateRank5
        , SheUnfortunateRank6, SheUnfortunateRank7));

        rankRepository.saveAll(List.of(UnfortunateRank1, UnfortunateRank2, UnfortunateRank3, UnfortunateRank4, UnfortunateRank5,
        UnfortunateRank6,UnfortunateRank7));

        courseRepository.save(course);
    }

    private byte[] getByteArrayForFile(String path) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new java.io.File(path));
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", output);
        return output.toByteArray();
    }

    private void initBadges(Course course) throws IOException {        
        Image badgeImage1 = createImageForBadge("src/main/resources/images/badge/dzierzymorda.png");
        Image badgeImage2 = createImageForBadge("src/main/resources/images/badge/tropiciel.png");
        Image badgeImage3 = createImageForBadge("src/main/resources/images/badge/kronikarz.png");
        Image badgeImage4 = createImageForBadge("src/main/resources/images/badge/arcymotacz.png");
        Image badgeImage5 = createImageForBadge("src/main/resources/images/badge/eugenius.png");
        Image badgeImage6 = createImageForBadge("src/main/resources/images/badge/abnormal.png");
        Image badgeImage7 = createImageForBadge("src/main/resources/images/badge/grimreaper.png");

        Badge badge1 = new ActivityScoreBadge(
                null,
                "Dzierżymorda",
                "Dzierżymordą zostaje Nieszczęśnik, który najwięcej razy uzyskał maksymalną nagrodę pełniąc rolę Ekonoma",
                badgeImage1,
                30.0,
                true,
                course
        );

        Badge badge2 = new ActivityScoreBadge(
                null,
                "Tropiciel",
                "Każdy, kto znalazl przynajmniej trzy wilcze doły.",
                badgeImage2,
                60.0,
                true,
                course
        );

        Badge badge3 = new ActivityScoreBadge(
                null,
                "Kronikarz",
                "Każdy, który będąc skrybą wykonał przynajmniej trzy bardzo dobre (100% nagrody) dokumentacje",
                badgeImage3,
                90.0,
                true,
                course
        );

        Badge badge4 = new ActivityScoreBadge(
                null,
                "Arcymotacz",
                "Każdy, który będąc kabelmistrzem wykonał przynajmniej trzy bardzo dobre (100% nagrody) topologie",
                badgeImage4,
                300.0,
                true,
                course
        );
        
        Badge badge5 = new ActivityScoreBadge(
                null,
                "E.U.geniusz",
                "Ten, który najwięcej razy wskutek udzielonej w czasie spaceru pomocy został do tego glejtu nominowany przez nie swoją grupę",
                badgeImage5,
                30.0,
                true,
                course
        );

        Badge badge6 = new ActivityScoreBadge(
                null,
                "A.B.Normal",
                "Ten, który wygrał i rozwiązał najwięcej licytacji o zadania",
                badgeImage6,
                30.0,
                true,
                course
        );

        Badge badge7 = new ActivityScoreBadge(
                null,
                "Grim Reaper",
                "Każdy, kto co najmniej trzy razy został Zausznikiem Krwiopijcy",
                badgeImage7,
                30.0,
                true,
                course
        );       

        // Badge badge8 = new ConsistencyBadge( 
        //         null,
        //         "To dopiero początek",
        //         "Wykonaj co najmniej jedną aktywność w przeciągu tygodnia od poprzedniej aktywności (7 dni) przez okres miesiąca",
        //         badgeImage1,
        //         4,
        //         course
        // );

        // Badge badge9 = new TopScoreBadge(
        //         null,
        //         "Topowowa dwudziestka",
        //         "Bądź w 20% najepszych użytkowników (liczone po wykonaniu 5 ekspedycji lub zadań bojowych)",
        //         badgeImage2,
        //         0.2,
        //         false,
        //         course
        // );

        // Badge badge10 = new GraphTaskNumberBadge(
        //         null,
        //         "Pierwsze kroki w ekspedycji",
        //         "Wykonaj swoją pierwszą ekspedycję",
        //         badgeImage1,
        //         1,
        //         course
        // );

        // Badge badge11 = new FileTaskNumberBadge(
        //         null,
        //         "Pierwsze kroki w zadaniu bojowym",
        //         "Wykonaj swoje pierwsze zadanie bojowe",
        //         badgeImage2,
        //         1,
        //         null
        // );

        // Badge badge12 = new ActivityNumberBadge(
        //         null,
        //         "Doświadczony w aktywnościach",
        //         "Wykonaj 30 aktywności",
        //         badgeImage1,
        //         30,
        //         course
        // );  

        // Badge badge13 = new ActivityScoreBadge(
        //         null,
        //         "Uśmiech prowadzącego",
        //         "Posiadaj ponad 80% ze wszystkich punktów z wykonanych ekspedycji oraz zadań bojowych (liczone po wykonaniu 3 ekspedycji lub zadań bojowych)",
        //         badgeImage1,
        //         0.8,
        //         false,
        //         course
        // );

        // Badge badge14 = new ActivityScoreBadge(
        //         null,
        //         "Uścisk dłoni prowadzącego",
        //         "Posiadaj ponad 95% ze wszystkich punktów z wykonanych ekspedycji oraz zadań bojowych (liczone po wykonaniu 3 ekspedycji lub zadań bojowych)",
        //         badgeImage2,
        //         0.95,
        //         false,
        //         course
        // );

        // Badge badge15 = new ActivityScoreBadge(
        //         null,
        //         "W sam środek tarczy",
        //         "Posiadaj 100% z ekspedycji lub zadania bojowego",
        //         badgeImage1,
        //         1.0,
        //         true,
        //         course
        // );

        badgeRepository.saveAll(List.of(badge1, badge2, badge3, badge4, badge5, badge6, badge7));
    }

    private void addReceivedPointsForUser(CourseMember student, Double points){
        student.changePoints(points);
        courseMemberRepository.save(student);
    }

    private User createStudent(String email,
                               String name,
                               String lastName,
                               Integer indexNumber) {
        User student = new User(email,
                name,
                lastName,
                AccountType.STUDENT);
        student.setPassword(passwordEncoder.encode("12345"));
        student.setIndexNumber(indexNumber);
        student.setPersonality(new HashMap<>());
        return student;
    }

    private UserHero userHero(Hero hero) {
        return new UserHero(hero);
    }

    private List<Question> addQuestionSet(Course course, QuestionService questionService, OptionService optionService) {
        Question startQuestion = new Question();
        Option option1_1 = new Option("MTU", true, null);
        Option option1_2 = new Option("mostek", true, null);
        Option option1_3 = new Option("WAN", true, null);
        Option option1_4 = new Option("drukarka sieciowa", false, null);
        List<Option> options_q1 = List.of(option1_1,option1_2,option1_3,option1_4);
        Question question1 = new Question(QuestionType.MULTIPLE_CHOICE, "Spośród poniższych wybierz pojęcia warstwy łącza danych", "",
                Difficulty.EASY, List.of(option1_1, option1_2, option1_3, option1_4), 5.0, new LinkedList<>(), null);
        startQuestion.getNext().addAll(List.of(question1));
        options_q1.forEach((option -> option.setQuestion(question1)));

        
        Option option2_1 = new Option("Prawda", false, null);
        Option option2_2 = new Option("Fałsz", true, null);
        List<Option> options_q2 = List.of(option2_1,option2_2);
        Question question2 = new Question(QuestionType.SINGLE_CHOICE, "Czy z uwagi na wymaganie minimalizacji opóźnienia dla ruchu głosowego szybsze porty switcha asymetrycznego powinny być wykorzystywane do podłączania telefonów IP?",
                "", Difficulty.MEDIUM, List.of(option2_1, option2_2), 5.0, new LinkedList<>(), null);
        question1.getNext().addAll(List.of(question2));
        options_q2.forEach((option -> option.setQuestion(question2)));

        Option option3_1 = new Option("Dopełnianie ramek", true, null);
        Option option3_2 = new Option("Używanie specjalnych symboli sterujących w miejsce IFG", true, null);
        Option option3_3 = new Option("Kodowanie 4DPAM5", true, null);
        Option option3_4 = new Option("dwukrotne zwiększenie szczeliny czasowej", false, null);
        List<Option> options_q3 = List.of(option3_1,option3_2,option3_3,option3_4);
        Question question3 = new Question(QuestionType.MULTIPLE_CHOICE, "Zaznacz techniki stosowane w sieci Ethernet 1Gb/s na skrętce kategorii 5e:",
                "", Difficulty.MEDIUM, List.of(option3_1, option3_2,option3_3,option3_4), 5.0, new LinkedList<>(), null);
        question2.getNext().addAll(List.of(question3));
        options_q3.forEach((option -> option.setQuestion(question3)));

        Option option4_1 = new Option("dla zapewnienia samosynchronizacji sygnałów", true, null);
        Option option4_2 = new Option("dla zmniejszenia zapotrzebowania na przepustowość", false, null);
        Option option4_3 = new Option("dla umożliwienia korekcji błędów przez odbiorcę", false, null);
        Option option4_4 = new Option("dla zwiększenia bezpieczeństwa transmisji", false, null);
        List<Option> options_q4 = List.of(option4_1,option4_2,option4_3,option4_4);
        Question question4 = new Question(QuestionType.MULTIPLE_CHOICE, "W jakim celu stosuje się kodowanie dwuetapowe?",
                "", Difficulty.MEDIUM, List.of(option3_1, option3_2,option3_3,option3_4), 5.0, new LinkedList<>(), null);
        question3.getNext().addAll(List.of(question4));
        options_q4.forEach((option -> option.setQuestion(question4)));

        List<Question> questions = List.of(startQuestion,question1,question2,question3,question4);
        questionService.saveQuestions(questions);
        optionService.saveAll(List.of(option1_1,option1_2,option1_3,option1_4,option2_1,option2_2,option3_1,option3_2,
            option3_3,option3_4,option4_1,option4_2,option4_3,option4_4));
        return questions;
    }

    private List<Question> addQuestionSet2(Course course, QuestionService questionService, OptionService optionService) {
        Question startQuestion = new Question();
        Option option1_1 = new Option("MTU", false, null);
        Option option1_2 = new Option("mostek", false, null);
        Option option1_3 = new Option("WAN", false, null);
        Option option1_4 = new Option("drukarka sieciowa", false, null);
        Option option1_5 = new Option("router", true, null);
        Option option1_6 = new Option("laptop", true, null);
        List<Option> options_q1 = List.of(option1_1,option1_2,option1_3,option1_4,option1_5,option1_6);
        Question question1 = new Question(QuestionType.MULTIPLE_CHOICE, "Spośród poniższych wybierz pojęcia warstwy sieciowej", "",
                Difficulty.EASY, List.of(option1_1, option1_2, option1_3, option1_4,option1_5,option1_6), 5.0, new LinkedList<>(), null);
        startQuestion.getNext().addAll(List.of(question1));
        options_q1.forEach((option -> option.setQuestion(question1)));

        Option option2_1 = new Option("OSPF nawiązuje relacje sąsiedztwa wykorzystując do tego periodycznie wysyłane pakiety HELLO ", true, null);
        Option option2_2 = new Option("RIP nawiązuje relacje sąsiedztwa wykorzystując do tego periodycznie wysyłane pakiety HELLO", false, null);
        Option option2_3 = new Option("EIGRP nawiązuje relacje sąsiedztwa wykorzystując do tego periodycznie wysyłane pakiety AHOY",false,null);
        Option option2_4 = new Option("BGP jest zewnętrznym protokołem routingu dynamicznego ",true,null);
        List<Option> options_q2 = List.of(option2_1,option2_2,option2_3,option2_4);
        Question question2 = new Question(QuestionType.MULTIPLE_CHOICE, "Zaznacz poprawne stwierdzenia odnoszące się do protokołów routingu",
                "", Difficulty.MEDIUM, List.of(option2_1, option2_2,option2_3,option2_4), 5.0, new LinkedList<>(), null);
        question1.getNext().addAll(List.of(question2));
        options_q2.forEach((option -> option.setQuestion(question2)));

        Option option3_1 = new Option("Dopełnianie (sztuczne wydłużanie) ramek", true, null);
        Option option3_2 = new Option("Używanie specjalnych symboli sterujących w miejsce IFG przy wysyłaniu serii ramek", true, null);
        Option option3_3 = new Option("Kodowanie 4DPAM5", true, null);
        Option option3_4 = new Option("dwukrotne zwiększenie szczeliny czasowej", false, null);
        List<Option> options_q3 = List.of(option3_1,option3_2,option3_3,option3_4);
        Question question3 = new Question(QuestionType.MULTIPLE_CHOICE, "Zaznacz techniki stosowane w sieci Ethernet 1Gb/s na skrętce kategorii 5e:",
                "", Difficulty.EASY, List.of(option3_1, option3_2,option3_3,option3_4), 5.0, new LinkedList<>(), null);
        question2.getNext().addAll(List.of(question3));
        options_q3.forEach((option -> option.setQuestion(question3)));

        Option option4_1 = new Option("dla zapewnienia samosynchronizacji", true, null);
        Option option4_2 = new Option("dla zmniejszenia zapotrzebowania na przepustowość", false, null);
        Option option4_3 = new Option("dla umożliwienia korekcji błędów przez odbiorcę", false, null);
        Option option4_4 = new Option("dla zwiększenia bezpieczeństwa transmisji", false, null);
        List<Option> options_q4 = List.of(option4_1,option4_2,option4_3,option4_4);
        Question question4 = new Question(QuestionType.MULTIPLE_CHOICE, "W jakim celu stosuje się kodowanie dwuetapowe?",
                "", Difficulty.MEDIUM, List.of(option4_1, option4_2,option4_3,option4_4), 2.0, new LinkedList<>(), null);
        question3.getNext().addAll(List.of(question4));
        options_q4.forEach((option -> option.setQuestion(question4)));

        Option option5_1 = new Option("Adresy IP i MAC następnego przeskoku, ale tylko wtedy, gdy nie da się podjąć decyzji na podstawie innych kryteriów", false, null);
        Option option5_2 = new Option("Adres IP routera, który przysłał ostatnią aktualizację", false, null);
        Option option5_3 = new Option("Dystans administracyjny", true, null);
        Option option5_4 = new Option("Metryka, posiadająca interpretację zależną od protokołu routingu dynamicznego ", true, null);
        Option option5_5 = new Option("Aktualne obciążenie bufora na najczęściej wykorzystywanym interfejsie routera", false, null);
        List<Option> options_q5 = List.of(option5_1,option5_2,option5_3,option5_4,option5_5);
        Question question5 = new Question(QuestionType.MULTIPLE_CHOICE, "Które z poniższych wartości są brane pod uwagę w procesie wyboru pomiędzy trasami, z których jedna zostanie zainstalowana w tablicy\n" + //
                        "routingu?",
                "", Difficulty.MEDIUM, List.of(option5_1, option5_2,option5_3,option5_4,option5_5), 3.0, new LinkedList<>(), null);
        question4.getNext().addAll(List.of(question5));
        options_q5.forEach((option -> option.setQuestion(question5)));


        List<Question> questions = List.of(startQuestion,question1,question2,question3,question4,question5
        );
        questionService.saveQuestions(questions);
        
        optionService.saveAll(List.of(option1_1,option1_2,option1_3,option1_4,option1_5,option1_6,
        option2_1,option2_2,option2_3,option2_4,
        option3_1,option3_2,option3_3,option3_4,
        option4_1,option4_2,option4_3,option4_4,option5_1,option5_2,option5_3,option5_4,option5_5
        ));
        return questions;
    }

}
