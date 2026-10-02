package com.locas.repository;

import com.locas.entity.CreditDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditDecisionRepository extends JpaRepository<CreditDecision, Long> {
    List<CreditDecision> findByApplicationIdOrderByDecisionDateDesc(Long applicationId);
}
