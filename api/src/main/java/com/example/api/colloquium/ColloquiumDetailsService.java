package com.example.api.colloquium;

import com.example.api.error.exception.WrongUserTypeException;
import com.example.api.security.LoggedInUserService;
import com.example.api.user.model.User;
import com.example.api.validator.UserValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ColloquiumDetailsService {
    private final ColloquiumDetailsRepository colloquiumDetailsRepository;
    private final LoggedInUserService authService;
    private final UserValidator userValidator;

    public List<ColloquiumDetails> getAllDetails() {
        return colloquiumDetailsRepository.findAll();
    }


    public ColloquiumDetails getDetailsById(Long id) {
        return colloquiumDetailsRepository.findById(id).get();
    }

    public ColloquiumDetails getDetailsByName(String name){
        return colloquiumDetailsRepository.findByName(name);
    }

    public void editDetails(String name, EditColloquiumDetailsForm form) throws WrongUserTypeException {
        User professor = authService.getCurrentUser();
        userValidator.validateProfessorAccount(professor);

        ColloquiumDetails details = colloquiumDetailsRepository.findByName(name);
        details.setMaxPoints(form.getMaxPoints());
        details.setAnnihilationLimit(form.getAnnihilationLimit());
        details.setQuestionPoints(form.getQuestionPoints());

        colloquiumDetailsRepository.save(details);
    }
}