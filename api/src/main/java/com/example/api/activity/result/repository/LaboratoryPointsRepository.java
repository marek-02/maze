package com.example.api.activity.result.repository;

import com.example.api.activity.result.model.AdditionalPoints;
import com.example.api.activity.result.model.ColloquiumPoints;
import com.example.api.activity.result.model.LaboratoryPoints;
import com.example.api.course.Course;
import com.example.api.course.coursemember.CourseMember;
import com.example.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaboratoryPointsRepository extends JpaRepository<LaboratoryPoints, Long> {
    List<LaboratoryPoints> findAllByMember(CourseMember member);
    List<LaboratoryPoints> findAllByProfessorEmail(String email);

    @Query("SELECT lp FROM LaboratoryPoints lp WHERE lp.member.user = ?1 AND lp.member.course = ?2")
    List<LaboratoryPoints> findAllByUserAndCourse(User user, Course course);
}
