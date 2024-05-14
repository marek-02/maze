package com.example.api.activity.result.controller;

import com.example.api.activity.result.dto.request.AddLaboratoryPointsForm;
import com.example.api.activity.result.service.LaboratoryPointsService;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lab/points")
@SecurityRequirement(name = "JWT_AUTH")
public class LaboratoryPointsController {
    private final LaboratoryPointsService laboratoryPointsService;

    @PostMapping("/add")
    public ResponseEntity<?> addColloquiumPoints(@RequestBody AddLaboratoryPointsForm form)
            throws RequestValidationException {
        laboratoryPointsService.saveLaboratoryPoints(form);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping
    public ResponseEntity<?> getAdditionalPoints(@RequestParam Long courseId) throws EntityNotFoundException {
        return ResponseEntity.ok().body(laboratoryPointsService.getLaboratoryPoints(courseId));
    }
}
