package com.example.api.colloquium;
import com.example.api.map.ActivityMapResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/colloquium")
@SecurityRequirement(name = "JWT_AUTH")
public class ColloquiumDetailsController {
    private final ColloquiumDetailsService service;


    @GetMapping("/details")
    public ResponseEntity<List<ColloquiumDetails>> getAllDetails() {
        return ResponseEntity.ok().body(service.getAllDetails());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ColloquiumDetails> getDetailsById(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.getDetailsById(id));
    }

    @GetMapping("/details/{name}")
    public ResponseEntity<ColloquiumDetails> getDetailsByName(@PathVariable String name) {
        return ResponseEntity.ok().body(service.getDetailsByName(name));
    }

}