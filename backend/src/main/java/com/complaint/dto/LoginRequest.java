package com.complaint.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
    @Email @NotBlank public String email;
    @NotBlank public String password;
}
