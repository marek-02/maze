package com.example.api.colloquium;
import com.example.api.error.exception.WrongUserTypeException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/colloquium/details")
@SecurityRequirement(name = "JWT_AUTH")
public class ColloquiumDetailsController {
    private final ColloquiumDetailsService colloquiumDetailsService;


    @GetMapping
    public ResponseEntity<List<ColloquiumDetails>> getAllDetails() {
        return ResponseEntity.ok().body(colloquiumDetailsService.getAllDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColloquiumDetails> getDetailsById(@PathVariable Long id) {
        return ResponseEntity.ok().body(colloquiumDetailsService.getDetailsById(id));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ColloquiumDetails> getDetailsByName(@PathVariable String name) {
        return ResponseEntity.ok().body(colloquiumDetailsService.getDetailsByName(name));
    }

    @PutMapping("/{name}")
    public ResponseEntity<?> editDetails(@PathVariable String name, @RequestBody EditColloquiumDetailsForm form) throws WrongUserTypeException {
        colloquiumDetailsService.editDetails(form);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}