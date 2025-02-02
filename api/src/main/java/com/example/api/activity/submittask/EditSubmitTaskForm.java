package com.example.api.activity.submittask;

import com.example.api.activity.EditActivityForm;
import com.example.api.activity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EditSubmitTaskForm extends EditActivityForm {
    public EditSubmitTaskForm(SubmitTask submitTask) {
        super(submitTask.getId(), ActivityType.SUBMIT, new CreateSubmitTaskForm(submitTask));
    }
}
