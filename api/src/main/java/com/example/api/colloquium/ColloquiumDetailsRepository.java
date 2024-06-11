package com.example.api.colloquium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColloquiumDetailsRepository extends JpaRepository<ColloquiumDetails, Long> {
    ColloquiumDetails findByName(String name);
}