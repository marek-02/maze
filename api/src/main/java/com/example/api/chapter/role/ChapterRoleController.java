//package com.example.api.chapter.role;
//
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/chapter/roles")
//@RequiredArgsConstructor
//@SecurityRequirement(name = "JWT_AUTH")
//public class ChapterRoleController {
//    private final ChapterRoleService chapterRoleService;
//
//    @PostMapping("/{chapterId}/members/{memberId}/role")
//    public ChapterRole assignRoleToMember(
//            @PathVariable Long chapterId,
//            @PathVariable Long memberId,
//            @RequestParam String role) {
//        return chapterRoleService.assignRoleToMember(chapterId, memberId, role);
//    }
//
//    @GetMapping("/{chapterId}/roles")
//    public List<ChapterRole> getRolesForChapter(@PathVariable Long chapterId) {
//        return chapterRoleService.getRolesForChapter(chapterId);
//    }
//
//    @GetMapping("/members/{memberId}/roles")
//    public List<ChapterRole> getRolesForMember(@PathVariable Long memberId) {
//        return chapterRoleService.getRolesForMember(memberId);
//    }
//}