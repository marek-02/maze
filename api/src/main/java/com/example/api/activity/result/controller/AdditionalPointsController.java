package com.example.api.activity.result.controller;

import com.example.api.activity.result.dto.request.AddAdditionalPointsForm;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import com.example.api.activity.result.service.AdditionalPointsService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/additional/points")
@SecurityRequirement(name = "JWT_AUTH")
public class AdditionalPointsController {
    private final AdditionalPointsService additionalPointsService;

    @PostMapping("/add")
    public ResponseEntity<?> addAdditionalPoints(@RequestBody AddAdditionalPointsForm form)
            throws RequestValidationException {
        additionalPointsService.saveAdditionalPoints(form);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping
    public ResponseEntity<?> getAdditionalPoints(@RequestParam Long courseId) throws EntityNotFoundException {
        return ResponseEntity.ok().body(additionalPointsService.getAdditionalPoints(courseId));
    }
}
