package com.example.api.activity;

import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import com.example.api.error.exception.WrongUserTypeException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/activity")
@SecurityRequirement(name = "JWT_AUTH")
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping("/edit/info")
    ResponseEntity<EditActivityForm> getActivityEditInfo(@RequestParam Long activityID) throws WrongUserTypeException, EntityNotFoundException {
        return ResponseEntity.ok().body(activityService.getActivityEditInfo(activityID));
    }

    @PostMapping("/edit")
    public ResponseEntity<?> getActivityEditInfo(@RequestBody EditActivityForm form) {
        try {
            activityService.editActivity(form); // Call the service to edit the activity
            return ResponseEntity.ok().body("Activity edited successfully");
        } catch (RequestValidationException e) {
            // Handle validation errors
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (ParseException e) {
            // Handle parsing errors
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Error parsing data: " + e.getMessage());
        } catch (Exception e) {
            // Catch-all for unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error parsing data: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    ResponseEntity<?> deleteActivity(@RequestParam Long activityID) throws WrongUserTypeException, EntityNotFoundException {
        activityService.deleteActivity(activityID);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
