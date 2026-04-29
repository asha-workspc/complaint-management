package com.complaint.controller;

import com.complaint.dto.*;
import com.complaint.model.enums.Category;
import com.complaint.model.enums.ComplaintStatus;
import com.complaint.model.enums.Priority;
import com.complaint.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintDto> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.createComplaint(request, auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDto> getComplaint(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(complaintService.getComplaint(id, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ComplaintDto>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String keyword,
            Authentication auth) {
        return ResponseEntity.ok(complaintService.getAllComplaints(
                page, size, sortBy, sortDir, status, category, priority, keyword, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplaintDto> updateComplaint(
            @PathVariable Long id,
            @RequestBody UpdateComplaintRequest request,
            Authentication auth) {
        return ResponseEntity.ok(complaintService.updateComplaint(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id, Authentication auth) {
        complaintService.deleteComplaint(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.addComment(id, request, auth.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(complaintService.getDashboardStats());
    }
}
