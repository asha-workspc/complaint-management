package com.complaint.dto;
import lombok.*;
import java.util.List;
import java.util.Map;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStats {
    private long totalComplaints;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long rejectedComplaints;
    private Map<String, Long> categoryStats;
    private Map<String, Long> statusStats;
    private Map<String, Long> priorityStats;
    private long todayComplaints;
    private long weekComplaints;
    private long monthComplaints;
}
