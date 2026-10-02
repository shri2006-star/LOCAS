package com.locas.repository;

import com.locas.entity.LoanApplication;
import com.locas.entity.enums.ApplicationStatus;
import com.locas.entity.enums.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    Optional<LoanApplication> findByApplicationRef(String applicationRef);
    List<LoanApplication> findByApplicantId(Long applicantId);
    List<LoanApplication> findByApplicantIdOrderByIdDesc(Long applicantId);
    Page<LoanApplication> findByApplicantId(Long applicantId, Pageable pageable);
    
    @Query("SELECT a FROM LoanApplication a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:productType IS NULL OR a.productType = :productType) AND " +
           "(:officerId IS NULL OR a.assignedOfficer.id = :officerId) AND " +
           "(:search IS NULL OR LOWER(a.applicationRef) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.applicant.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LoanApplication> searchApplications(
            @Param("status") ApplicationStatus status,
            @Param("productType") ProductType productType,
            @Param("officerId") Long officerId,
            @Param("search") String search,
            Pageable pageable
    );

    long countByStatus(ApplicationStatus status);
}
