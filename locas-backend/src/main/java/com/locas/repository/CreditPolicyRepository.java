package com.locas.repository;

import com.locas.entity.CreditPolicy;
import com.locas.entity.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditPolicyRepository extends JpaRepository<CreditPolicy, Long> {
    Optional<CreditPolicy> findByProductType(ProductType productType);
}
