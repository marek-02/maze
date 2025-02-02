//package com.example.api.chapter.role;
//
//import com.example.api.chapter.Chapter;
//import com.example.api.chapter.ChapterRepository;
//import com.example.api.course.coursemember.CourseMember;
//import com.example.api.course.coursemember.CourseMemberRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.NoSuchElementException;
//
//@Service
//@RequiredArgsConstructor
//public class ChapterRoleService {
//    private final ChapterRoleRepository chapterRoleRepository;
//    private final ChapterRepository chapterRepository;
//    private final CourseMemberRepository courseMemberRepository;
//
//    public ChapterRole assignRoleToMember(Long chapterId, Long memberId, String role) {
//        Chapter chapter = chapterRepository.findById(chapterId)
//                .orElseThrow(() -> new NoSuchElementException("Chapter not found"));
//        CourseMember courseMember = courseMemberRepository.findById(memberId)
//                .orElseThrow(() -> new NoSuchElementException("CourseMember not found"));
//        ChapterRole chapterRole = new ChapterRole(chapter, courseMember, role);
//        return chapterRoleRepository.save(chapterRole);
//    }
//
//    public List<ChapterRole> getRolesForChapter(Long chapterId) {
//        Chapter chapter = chapterRepository.findById(chapterId)
//                .orElseThrow(() -> new NoSuchElementException("Chapter not found"));
//        return chapterRoleRepository.findByChapter(chapter);
//    }
//
//    public List<ChapterRole> getRolesForMember(Long memberId) {
//        CourseMember courseMember = courseMemberRepository.findById(memberId)
//                .orElseThrow(() -> new NoSuchElementException("CourseMember not found"));
//        return chapterRoleRepository.findByCourseMember(courseMember);
//    }
//}