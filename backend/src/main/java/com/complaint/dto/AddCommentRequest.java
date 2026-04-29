package com.complaint.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AddCommentRequest {
    @NotBlank public String content;
    public boolean internal;
}
