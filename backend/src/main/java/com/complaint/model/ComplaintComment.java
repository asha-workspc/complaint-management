package com.complaint.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private boolean isInternal = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
