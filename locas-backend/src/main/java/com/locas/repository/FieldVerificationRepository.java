package com.locas.repository;

import com.locas.entity.FieldVerification;
import com.locas.entity.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldVerificationRepository extends JpaRepository<FieldVerification, Long> {
    List<FieldVerification> findByApplicationId(Long applicationId);
    List<FieldVerification> findByAssignedToId(Long assignedToId);
    List<FieldVerification> findByStatus(VerificationStatus status);
}
