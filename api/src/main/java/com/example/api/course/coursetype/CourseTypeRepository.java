package com.example.api.course.coursetype;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseTypeRepository extends JpaRepository<CourseType, Long> {

}
