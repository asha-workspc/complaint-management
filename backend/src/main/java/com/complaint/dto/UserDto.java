package com.complaint.dto;
import com.complaint.model.enums.Role;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String department;
    private String avatarUrl;
    private boolean active;
    private LocalDateTime createdAt;
}
