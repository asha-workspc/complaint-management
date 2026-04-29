package com.complaint.dto;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private UserDto user;
    private boolean internal;
    private LocalDateTime createdAt;
}
