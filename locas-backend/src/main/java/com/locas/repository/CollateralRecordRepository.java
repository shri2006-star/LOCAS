package com.locas.repository;

import com.locas.entity.CollateralRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollateralRecordRepository extends JpaRepository<CollateralRecord, Long> {
    List<CollateralRecord> findByApplicationId(Long applicationId);
}
