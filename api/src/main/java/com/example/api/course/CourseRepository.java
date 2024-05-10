package com.example.api.course;

import com.example.api.course.coursetype.CourseType;
import com.example.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsCourseByName(String name);
    List<Course> findByCourseType(CourseType courseType);
}
