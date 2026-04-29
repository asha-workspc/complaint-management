package com.complaint.repository;

import com.complaint.model.Complaint;
import com.complaint.model.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintCommentRepository extends JpaRepository<ComplaintComment, Long> {
    List<ComplaintComment> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
    List<ComplaintComment> findByComplaintAndIsInternalFalseOrderByCreatedAtAsc(Complaint complaint);
}
