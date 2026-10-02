package com.locas.repository;

import com.locas.entity.BureauReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BureauReportRepository extends JpaRepository<BureauReport, Long> {
    List<BureauReport> findByApplicationId(Long applicationId);
    List<BureauReport> findByApplicationIdOrderByFetchDateDesc(Long applicationId);
}
