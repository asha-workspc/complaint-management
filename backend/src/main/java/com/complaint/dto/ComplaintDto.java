package com.complaint.dto;
import com.complaint.model.enums.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplaintDto {
    private Long id;
    private String complaintNumber;
    private String title;
    private String description;
    private ComplaintStatus status;
    private Priority priority;
    private Category category;
    private UserDto submittedBy;
    private UserDto assignedTo;
    private String resolution;
    private String attachmentUrl;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
