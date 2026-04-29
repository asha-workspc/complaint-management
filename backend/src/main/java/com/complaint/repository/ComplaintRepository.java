package com.complaint.repository;

import com.complaint.model.Complaint;
import com.complaint.model.User;
import com.complaint.model.enums.Category;
import com.complaint.model.enums.ComplaintStatus;
import com.complaint.model.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    Page<Complaint> findBySubmittedBy(User user, Pageable pageable);

    Page<Complaint> findByAssignedTo(User user, Pageable pageable);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    Page<Complaint> findByCategory(Category category, Pageable pageable);

    Page<Complaint> findByPriority(Priority priority, Pageable pageable);

    Page<Complaint> findBySubmittedByAndStatus(User user, ComplaintStatus status, Pageable pageable);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:userId IS NULL OR c.submittedBy.id = :userId) AND " +
           "(:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Complaint> findWithFilters(
            @Param("status") ComplaintStatus status,
            @Param("category") Category category,
            @Param("priority") Priority priority,
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(ComplaintStatus status);

    long countBySubmittedBy(User user);

    long countBySubmittedByAndStatus(User user, ComplaintStatus status);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.createdAt >= :from AND c.createdAt <= :to")
    long countByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
    List<Object[]> countByPriorityGrouped();
}
