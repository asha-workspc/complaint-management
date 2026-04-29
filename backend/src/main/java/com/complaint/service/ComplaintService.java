package com.complaint.service;

import com.complaint.dto.*;
import com.complaint.model.Complaint;
import com.complaint.model.ComplaintComment;
import com.complaint.model.User;
import com.complaint.model.enums.*;
import com.complaint.repository.ComplaintCommentRepository;
import com.complaint.repository.ComplaintRepository;
import com.complaint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ComplaintDto createComplaint(CreateComplaintRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = Complaint.builder()
                .complaintNumber(generateComplaintNumber())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(ComplaintStatus.OPEN)
                .submittedBy(user)
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        complaint = complaintRepository.save(complaint);
        return mapToDto(complaint, true);
    }

    public ComplaintDto getComplaint(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (user.getRole() == Role.USER && !complaint.getSubmittedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return mapToDto(complaint, true);
    }

    public PagedResponse<ComplaintDto> getAllComplaints(
            int page, int size, String sortBy, String sortDir,
            ComplaintStatus status, Category category, Priority priority,
            String keyword, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Long userId = user.getRole() == Role.USER ? user.getId() : null;

        Page<Complaint> complaintsPage = complaintRepository.findWithFilters(
                status, category, priority, userId, keyword, pageable);

        List<ComplaintDto> complaints = complaintsPage.getContent()
                .stream().map(c -> mapToDto(c, false)).collect(Collectors.toList());

        return PagedResponse.<ComplaintDto>builder()
                .content(complaints)
                .page(page)
                .size(size)
                .totalElements(complaintsPage.getTotalElements())
                .totalPages(complaintsPage.getTotalPages())
                .last(complaintsPage.isLast())
                .build();
    }

    public ComplaintDto updateComplaint(Long id, UpdateComplaintRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (user.getRole() == Role.USER && !complaint.getSubmittedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        if (request.getTitle() != null) complaint.setTitle(request.getTitle());
        if (request.getDescription() != null) complaint.setDescription(request.getDescription());
        if (request.getCategory() != null) complaint.setCategory(request.getCategory());
        if (request.getPriority() != null) complaint.setPriority(request.getPriority());

        if (request.getStatus() != null && (user.getRole() == Role.ADMIN || user.getRole() == Role.AGENT)) {
            complaint.setStatus(request.getStatus());
            if (request.getStatus() == ComplaintStatus.RESOLVED || request.getStatus() == ComplaintStatus.CLOSED) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        if (request.getAssignedToId() != null && user.getRole() == Role.ADMIN) {
            User agent = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            complaint.setAssignedTo(agent);
        }

        if (request.getResolution() != null) complaint.setResolution(request.getResolution());

        complaint = complaintRepository.save(complaint);
        return mapToDto(complaint, true);
    }

    public void deleteComplaint(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (user.getRole() != Role.ADMIN && !complaint.getSubmittedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        complaintRepository.delete(complaint);
    }

    public CommentDto addComment(Long complaintId, AddCommentRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        ComplaintComment comment = ComplaintComment.builder()
                .complaint(complaint)
                .user(user)
                .content(request.getContent())
                .isInternal(request.isInternal() && user.getRole() != Role.USER)
                .build();

        comment = commentRepository.save(comment);
        return mapToCommentDto(comment);
    }

    public DashboardStats getDashboardStats() {
        Map<String, Long> categoryStats = new HashMap<>();
        for (Object[] row : complaintRepository.countByCategory()) {
            categoryStats.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> statusStats = new HashMap<>();
        for (Object[] row : complaintRepository.countByStatusGrouped()) {
            statusStats.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> priorityStats = new HashMap<>();
        for (Object[] row : complaintRepository.countByPriorityGrouped()) {
            priorityStats.put(row[0].toString(), (Long) row[1]);
        }

        LocalDateTime now = LocalDateTime.now();
        return DashboardStats.builder()
                .totalComplaints(complaintRepository.count())
                .openComplaints(complaintRepository.countByStatus(ComplaintStatus.OPEN))
                .inProgressComplaints(complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS))
                .resolvedComplaints(complaintRepository.countByStatus(ComplaintStatus.RESOLVED))
                .closedComplaints(complaintRepository.countByStatus(ComplaintStatus.CLOSED))
                .rejectedComplaints(complaintRepository.countByStatus(ComplaintStatus.REJECTED))
                .categoryStats(categoryStats)
                .statusStats(statusStats)
                .priorityStats(priorityStats)
                .todayComplaints(complaintRepository.countByCreatedAtBetween(now.toLocalDate().atStartOfDay(), now))
                .weekComplaints(complaintRepository.countByCreatedAtBetween(now.minusDays(7), now))
                .monthComplaints(complaintRepository.countByCreatedAtBetween(now.minusDays(30), now))
                .build();
    }

    private String generateComplaintNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", new Random().nextInt(9999));
        return "CMP-" + date + "-" + random;
    }

    private ComplaintDto mapToDto(Complaint complaint, boolean includeComments) {
        List<CommentDto> comments = null;
        if (includeComments) {
            comments = commentRepository
                    .findByComplaintOrderByCreatedAtAsc(complaint)
                    .stream().map(this::mapToCommentDto).collect(Collectors.toList());
        }

        return ComplaintDto.builder()
                .id(complaint.getId())
                .complaintNumber(complaint.getComplaintNumber())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .priority(complaint.getPriority())
                .category(complaint.getCategory())
                .submittedBy(authService.mapToUserDto(complaint.getSubmittedBy()))
                .assignedTo(complaint.getAssignedTo() != null ?
                        authService.mapToUserDto(complaint.getAssignedTo()) : null)
                .resolution(complaint.getResolution())
                .attachmentUrl(complaint.getAttachmentUrl())
                .comments(comments)
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }

    private CommentDto mapToCommentDto(ComplaintComment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(authService.mapToUserDto(comment.getUser()))
                .internal(comment.isInternal())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
