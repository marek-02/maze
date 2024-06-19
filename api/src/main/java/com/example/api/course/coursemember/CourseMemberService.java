package com.example.api.course.coursemember;

import com.example.api.group.Group;
import com.example.api.group.GroupService;
import com.example.api.user.hero.model.UserHero;
import com.example.api.user.model.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class CourseMemberService {
    GroupService groupService;
    CourseMemberRepository repository;

    public void updateGroup(CourseMember member, Group group) {
        log.info("Changing group for user {} from {} to {}", member.getUser(), member.getGroup().getId(), group.getId());
        groupService.removeUser(member, member.getGroup());
        groupService.addUser(member, group);
        member.setGroup(group);
        repository.save(member);
    }

    public CourseMember create(User user, Group group, UserHero userHero) {
        CourseMember cm = new CourseMember(user, group, userHero);
        repository.save(cm);
        return cm;
    }

    public List<CourseMember> getAll(Long courseId) {
        return repository.findAllByCourse_Id(courseId);
    }

    // public CourseMember getCourseMember(Long courseId,Long courseMemberId){
    //     List<CourseMember> courseMembers = this.getAll(courseId);
    //     CourseMember courseMember = courseMembers.stream().
    //         filter(member -> member.getUser().getId() == courseMemberId).findFirst()
    //         .orElseThrow(() -> new EntityNotFoundException("CourseMember not found with id="+courseMemberId ));
    //         return courseMember;
    // }

    public void updateSubgroup(CourseMember member, Long subgroup) {
        log.info("Changing subgroup for user {} from {} to {}", member.getUser(), member.getGroup(), subgroup);
        
        groupService.removeUser(member, member.getGroup());
        //groupService.addUser(member, group);
        //member.setGroup(group);
        member.setSubgroup(subgroup);
        repository.save(member);
    }

    public void updateRole(CourseMember member, String role){
        log.info("Changing role for user {} from {} to {}", member.getUser(), member.getRole(), role);

        groupService.removeUser(member, member.getGroup());
        member.setRole(role);
        repository.save(member);
    }

}
