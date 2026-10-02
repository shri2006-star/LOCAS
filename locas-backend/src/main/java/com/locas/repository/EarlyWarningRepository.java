package com.locas.repository;

import com.locas.entity.EarlyWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EarlyWarningRepository extends JpaRepository<EarlyWarning, Long> {
    List<EarlyWarning> findByLoanAccountId(Long loanAccountId);
    List<EarlyWarning> findByStatus(String status);
}
