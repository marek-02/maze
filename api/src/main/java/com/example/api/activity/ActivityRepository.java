package com.example.api.activity;

import com.example.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
   List<Activity> findAllByProfessor(User from);

   @Query("SELECT a FROM Activity a WHERE a.course.id = :courseId")
   List<Activity> getActivitiesByCourseId(long courseId);
}
