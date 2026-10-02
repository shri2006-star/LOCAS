package com.locas.repository;

import com.locas.entity.EmiPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmiPaymentRepository extends JpaRepository<EmiPayment, Long> {
    List<EmiPayment> findByLoanAccountIdOrderByDueDateAsc(Long loanAccountId);
}
