package com.complaint.dto;
import com.complaint.model.enums.*;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateComplaintRequest {
    public String title;
    public String description;
    public ComplaintStatus status;
    public Priority priority;
    public Category category;
    public Long assignedToId;
    public String resolution;
}
