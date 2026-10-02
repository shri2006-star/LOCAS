package com.locas.repository;

import com.locas.entity.LoanOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanOfferRepository extends JpaRepository<LoanOffer, Long> {
    Optional<LoanOffer> findByApplicationId(Long applicationId);
}
