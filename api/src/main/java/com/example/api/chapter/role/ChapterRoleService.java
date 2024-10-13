package com.example.api.chapter.role;

import com.example.api.group.Group;
import com.example.api.group.GroupService;
import com.example.api.user.hero.model.UserHero;
import com.example.api.user.model.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import com.example.api.chapter.Chapter;
import com.example.api.chapter.ChapterService;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.course.coursemember.CourseMemberService;
import com.example.api.error.exception.EntityNotFoundException;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ChapterRoleService {
    @Autowired
    ChapterService chapterService;

    @Autowired
    CourseMemberService courseMemberService;

    @Autowired
    ChapterRoleRepository repository;

    public void createOrUpdateRole(Long courseId, Long chapterId, Long courseMemberId, String role) throws EntityNotFoundException {
        CourseMember courseMember = courseMemberService.getCourseMember(courseId, courseMemberId);
        log.info("Changing role for memberId {} to {}", courseMember.getUser(), role);

        Chapter chapter = chapterService.getChapter(chapterId);

        ChapterRole chapterRole = repository.findByChapterAndCourseMember(chapter, courseMember)
            .orElse(new ChapterRole(chapter, courseMember, role));
        chapterRole.setRole(role);
        repository.save(chapterRole);
    }
}
