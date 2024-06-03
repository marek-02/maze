package com.example.api.activity.result.repository;

import com.example.api.activity.result.model.AnnihilatedPoints;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnihilatedPointsRepository extends JpaRepository<AnnihilatedPoints, Long> {
    List<AnnihilatedPoints> findAllByMember(CourseMember member);
    List<AnnihilatedPoints> findAllByProfessorEmail(String email);

    @Query("SELECT cp FROM AnnihilatedPoints cp WHERE cp.member.user = ?1 AND cp.member.course = ?2")
    List<AnnihilatedPoints> findAllByUserAndCourse(User user, Course course);
}
