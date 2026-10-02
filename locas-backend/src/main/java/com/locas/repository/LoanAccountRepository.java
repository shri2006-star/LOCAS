package com.locas.repository;

import com.locas.entity.LoanAccount;
import com.locas.entity.enums.NpaCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {
    Optional<LoanAccount> findByApplicationId(Long applicationId);
    Optional<LoanAccount> findByAccountNumber(String accountNumber);
    Boolean existsByApplicationId(Long applicationId);
    List<LoanAccount> findByNpaCategory(NpaCategory npaCategory);
    Page<LoanAccount> findByNpaCategory(NpaCategory npaCategory, Pageable pageable);

    @Query("SELECT SUM(l.disbursedAmount) FROM LoanAccount l")
    BigDecimal sumTotalDisbursedAmount();

    @Query("SELECT SUM(l.outstandingPrincipal) FROM LoanAccount l")
    BigDecimal sumTotalOutstandingPrincipal();

    long countByNpaCategoryNot(NpaCategory category);
}
