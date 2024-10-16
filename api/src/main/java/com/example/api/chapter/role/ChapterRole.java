//package com.example.api.chapter.role;
//
//import com.example.api.chapter.Chapter;
//import com.example.api.course.coursemember.CourseMember;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import javax.persistence.*;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//public class ChapterRole {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @OneToOne
//    @JoinColumn(name = "chapterId", referencedColumnName = "id")
//    private Chapter chapter;
//
//    @ManyToOne
//    @JoinColumn(name = "memberId", referencedColumnName = "id")
//    private CourseMember courseMember;
//
//    private String role; //"E", "K", "S", "O", ""
//
//    public ChapterRole(Chapter chapter, CourseMember courseMember, String role) {
//        this.chapter = chapter;
//        this.courseMember = courseMember;
//        this.role = role;
//    }
//
//    @PrePersist
//    public void prePersist() {
//        if (this.role == null) {
//            this.role = "";
//        }
//    }
//}