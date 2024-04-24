package com.example.api.user.controller;

import com.example.api.user.dto.response.dashboard.DashboardResponse;
import com.example.api.course.coursemember.CourseMemberRepository;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.MissingAttributeException;
import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.user.service.DashboardService;
import com.example.api.user.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.api.course.coursemember.CourseMemberService;
import com.example.api.course.coursemember.CourseMember;
import java.util.List;
import java.lang.String;
import java.lang.Integer;
import org.json.JSONArray;
import org.json.JSONObject;
import java.lang.System;
import com.example.api.user.dto.response.courseMember.CourseMemberResponse;
import java.util.ArrayList;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "JWT_AUTH")
public class CourseMemberController {
    private final CourseMemberService courseMemberService;

    @GetMapping("/coursemembers")
    public ResponseEntity<List<CourseMemberResponse>> getAllMembers(@RequestParam Long courseId) throws EntityNotFoundException, MissingAttributeException {
        List<CourseMember> membersList = courseMemberService.getAll(courseId);
        List<CourseMemberResponse> response = new ArrayList<>();
       
        for(CourseMember member : membersList){
            response.add( new CourseMemberResponse(member.getUser().getUserId(),member.getUser().getFirstName(),member.getUser().getLastName()) );
         }
        
        //System.out.println(json);
        

        return ResponseEntity.ok().body(response);
    }
}
