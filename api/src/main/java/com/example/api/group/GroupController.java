package com.example.api.group;

import com.example.api.user.dto.response.BasicUser;
import com.example.api.user.dto.response.BasicStudent;
import com.example.api.error.exception.EntityNotFoundException;
import com.example.api.error.exception.RequestValidationException;
import com.example.api.error.exception.WrongUserTypeException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/group")
@SecurityRequirement(name = "JWT_AUTH")
public class GroupController {
    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<Long> createGroup(@RequestBody SaveGroupForm form) throws RequestValidationException {
        return ResponseEntity.ok().body(groupService.createGroup(form));
    }

    @GetMapping("/invitation-code/list")
    ResponseEntity<List<GroupCode>> getInvitationCodeList(@RequestParam Long courseId) throws WrongUserTypeException, EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getInvitationCodeList(courseId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<BasicUser>> getGroupUserList(@RequestParam Long groupId)
            throws EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getGroupUserList(groupId));
    }

    @GetMapping("/students")
    public ResponseEntity<List<BasicUser>> getGroupStudentsList(@RequestParam Long groupId)
            throws EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getGroupStudentList(groupId));
    }
    @GetMapping("/students-extended")
    public ResponseEntity<List<BasicStudent>> getGroupStudentsExtendedList(@RequestParam Long groupId)
            throws EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getGroupStudentExtendedList(groupId));
    }
    @GetMapping("/students-extended/subgroup")
    public ResponseEntity<List<BasicStudent>> getSubgroupStudentsExtendedList(@RequestParam Long groupId, @RequestParam Long subgroupId)
            throws EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getSubgroupStudentExtendedList(groupId, subgroupId));
    }

    @GetMapping("/professors")
    public ResponseEntity<List<BasicUser>> getGroupProfessorList(@RequestParam Long groupId)
            throws EntityNotFoundException {
        return ResponseEntity.ok().body(groupService.getGroupProfessorList(groupId));
    }
}
