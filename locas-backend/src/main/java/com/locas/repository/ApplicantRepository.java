package com.locas.repository;

import com.locas.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    Optional<Applicant> findByUserId(Long userId);
    Optional<Applicant> findByPanNumber(String panNumber);
    Boolean existsByPanNumber(String panNumber);
}
