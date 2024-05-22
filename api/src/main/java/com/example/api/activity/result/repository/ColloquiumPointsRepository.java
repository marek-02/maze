package com.example.api.activity.result.repository;

import com.example.api.activity.result.model.ColloquiumPoints;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColloquiumPointsRepository extends JpaRepository<ColloquiumPoints, Long> {
    List<ColloquiumPoints> findAllByMember(CourseMember member);
    List<ColloquiumPoints> findAllByProfessorEmail(String email);

    @Query("SELECT cp FROM ColloquiumPoints cp WHERE cp.member.user = ?1 AND cp.member.course = ?2")
    List<ColloquiumPoints> findAllByUserAndCourse(User user, Course course);
}
