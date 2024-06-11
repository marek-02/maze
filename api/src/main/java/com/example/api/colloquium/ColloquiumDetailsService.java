package com.example.api.colloquium;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ColloquiumDetailsService {
    private final ColloquiumDetailsRepository colloquiumDetailsRepository;

    public List<ColloquiumDetails> getAllDetails() {
        return colloquiumDetailsRepository.findAll();
    }


    public ColloquiumDetails getDetailsById(Long id) {
        return colloquiumDetailsRepository.findById(id).get();
    }

    public ColloquiumDetails getDetailsByName(String name){
        return colloquiumDetailsRepository.findByName(name);
    }
}