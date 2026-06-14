package com.flowguide.repository;

import com.flowguide.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {

    List<UserProgress> findByUser_Id(UUID userId);

    List<UserProgress> findByUser_IdAndStatus(UUID userId, String status);

    Optional<UserProgress> findByUser_IdAndStep_Id(UUID userId, UUID stepId);

    @Query("SELECT COUNT(p) FROM UserProgress p WHERE p.user.id = :userId AND p.status = 'completed'")
    long countCompletedByUserId(@Param("userId") UUID userId);

    List<UserProgress> findByStatus(String status);
}