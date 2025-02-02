package com.example.api.course;

import com.example.api.course.coursemember.CourseMember;
import com.example.api.course.coursetype.CourseType;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import com.example.api.file.FileRepository;
import com.example.api.file.image.Image;
import com.example.api.file.image.ImageType;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.badge.BadgeRepository;
import com.example.api.user.badge.types.Badge;
import com.example.api.user.hero.HeroFactory;
import com.example.api.user.hero.HeroRepository;
import com.example.api.user.hero.HeroType;
import com.example.api.user.hero.model.Hero;
import com.example.api.user.model.AccountType;
import com.example.api.user.model.Rank;
import com.example.api.user.model.User;
import com.example.api.user.repository.RankRepository;
import com.example.api.validator.UserValidator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import javax.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseValidator courseValidator;
    private final UserValidator userValidator;
    private final LoggedInUserService authService;
    private final HeroRepository heroRepository;
    private final HeroFactory heroFactory;
    private final BadgeRepository badgeRepository;
    private final FileRepository fileRepository;
    private final RankRepository rankRepository;

    public Long saveCourse(SaveCourseForm form) throws RequestValidationException {

        User professor = authService.getCurrentUser();
        userValidator.validateProfessorAccount(professor);

        log.info("Saving course to database with name {}", form.getName());
        boolean courseWithSameName = courseRepository.existsCourseByName(form.getName());
        courseValidator.validatePotentialCourse(courseWithSameName, form);

        Course course = new Course(null, form.getName(), form.getDescription(), professor);
        courseRepository.save(course);

        List<Hero> heroes = form.getHeroes()
                .stream()
                .map(hero -> heroFactory.getHero(hero.getType(), hero.getValue(), hero.getCoolDownMillis(), course))
                .toList();

        heroRepository.saveAll(heroes);

        addBadgesToNewCourse(course);
        addRanksToNewCourse(course);

        return course.getId();
    }

    private byte[] getByteArrayForFile(String path) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new java.io.File(path));
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", output);
        return output.toByteArray();
    }
    
    private Image createImageForBadge(String source) throws IOException{
        byte[] chapterImageBytes = getByteArrayForFile(source);
        Image chapterImage = new Image("myImageForBadge", chapterImageBytes, ImageType.BADGE);
        fileRepository.save(chapterImage);
        return chapterImage;
    }

    private void addBadgesToNewCourse(Course course){
        try{
            Image badgeImage1 = createImageForBadge("src/main/resources/images/badge/dzierzymorda.png");
            Image badgeImage2 = createImageForBadge("src/main/resources/images/badge/tropiciel.png");
            Image badgeImage3 = createImageForBadge("src/main/resources/images/badge/kronikarz.png");
            Image badgeImage4 = createImageForBadge("src/main/resources/images/badge/arcymotacz.png");
            Image badgeImage5 = createImageForBadge("src/main/resources/images/badge/eugenius.png");
            Image badgeImage6 = createImageForBadge("src/main/resources/images/badge/abnormal.png");
            Image badgeImage7 = createImageForBadge("src/main/resources/images/badge/grimreaper.png");

            Badge badge1 = new Badge(null,"Dzierżymorda","Dzierżymordą zostaje Nieszczęśnik, który najwięcej razy uzyskał maksymalną nagrodę pełniąc rolę Ekonoma",
                badgeImage1,course
            );

            Badge badge2 = new Badge(null,"Tropiciel","Każdy, kto znalazl przynajmniej trzy wilcze doły.",
                badgeImage2,course
            );

            Badge badge3 = new Badge(null,"Kronikarz","Każdy, który będąc skrybą wykonał przynajmniej trzy bardzo dobre (100% nagrody) dokumentacje",
                badgeImage3,course
            );

            Badge badge4 = new Badge(null,"Arcymotacz","Każdy, który będąc kabelmistrzem wykonał przynajmniej trzy bardzo dobre (100% nagrody) topologie",
                badgeImage4,course
            );
            
            Badge badge5 = new Badge(null,"E.U.geniusz","Ten, który najwięcej razy wskutek udzielonej w czasie spaceru pomocy został do tego glejtu nominowany przez nie swoją grupę",
                badgeImage5,course
            );

            Badge badge6 = new Badge(null,"A.B.Normal","Ten, który wygrał najwięcej licytacji o zadania",
                badgeImage6,course
            );

            Badge badge7 = new Badge(null,"Grim Reaper","Każdy, kto co najmniej trzy razy został Zausznikiem Krwiopijcy",
                badgeImage7,course
            );       

            badgeRepository.saveAll(List.of(badge1, badge2, badge3, badge4, badge5, badge6, badge7));
        }catch(IOException ex){

        }
    }

    public Image createImageForRank(String source) throws IOException{
        byte[] chapterImageBytes = getByteArrayForFile(source);
        Image chapterImage = new Image("myImageForRank", chapterImageBytes, ImageType.RANK);
        fileRepository.save(chapterImage);
        return chapterImage;
    }

    private void addRanksToNewCourse(Course course){
        try{
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

            //Ranks for women
            Rank SheUnfortunateRank1 = new Rank(null, HeroType.SHEUNFORTUNATE, "Nornica", 0.0, sheUnfortunateImages.get(0), course);
            Rank SheUnfortunateRank2 = new Rank(null, HeroType.SHEUNFORTUNATE, "Mamuna", 20.0, sheUnfortunateImages.get(1), course);
            Rank SheUnfortunateRank3 = new Rank(null, HeroType.SHEUNFORTUNATE, "Fochna", 50.0, sheUnfortunateImages.get(2), course);
            Rank SheUnfortunateRank4 = new Rank(null, HeroType.SHEUNFORTUNATE, "Ognista Potwora", 80.0, sheUnfortunateImages.get(3), course);
            Rank SheUnfortunateRank5 = new Rank(null, HeroType.SHEUNFORTUNATE, "Busianna", 120.0, sheUnfortunateImages.get(4), course);
            Rank SheUnfortunateRank6 = new Rank(null, HeroType.SHEUNFORTUNATE, "Lubawa", 160.0, sheUnfortunateImages.get(5), course);
            Rank SheUnfortunateRank7 = new Rank(null, HeroType.SHEUNFORTUNATE, "Ciotka Jaga", 200.0, sheUnfortunateImages.get(6), course);

            //Ranks for men
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
        }catch(IOException ex){

        }
        
    }



    public List<CourseDTO> getCoursesForUser() {
        User user = authService.getCurrentUser();

        if (user.getAccountType().equals(AccountType.PROFESSOR)) {
            return user.getCourses()
                    .stream()
                    .map(CourseDTO::new)
                    .toList();
        } else {
            return user.getCourseMemberships()
                    .stream()
                    .map(CourseMember::getCourse)
                    .map(CourseDTO::new)
                    .toList();
        }
    }

    public void deleteCourse(Long courseId) throws RequestValidationException {
        User professor = authService.getCurrentUser();
        Course course = courseRepository.getById(courseId);
        courseValidator.validateCourseOwner(course, professor);
        courseRepository.delete(course);
    }

    public CourseDTO editCourse(CourseDTO dto) throws RequestValidationException {
        User professor = authService.getCurrentUser();
        Course course = courseRepository.getById(dto.getId());
        courseValidator.validateCourseOwner(course, professor);

        if (dto.getName() != null) {
            course.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            course.setDescription(dto.getDescription());
        }
        courseRepository.save(course);

        return new CourseDTO(course);
    }

    public Course getCourse(Long courseId) throws EntityNotFoundException {
        Course course = courseRepository.getById(courseId);
        courseValidator.validateCourseIsNotNull(course, courseId);
        return course;
    }

    public List<Course> getCoursesByCourseType(CourseType courseType) {
        return courseRepository.findByCourseType(courseType);
    }
}
