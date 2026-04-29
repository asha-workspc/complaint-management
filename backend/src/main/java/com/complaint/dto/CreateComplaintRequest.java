package com.complaint.dto;
import com.complaint.model.enums.Category;
import com.complaint.model.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateComplaintRequest {
    @NotBlank public String title;
    @NotBlank public String description;
    @NotNull public Category category;
    public Priority priority;
    public String attachmentUrl;
}
