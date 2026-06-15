package com.flowguide.repository;

import com.flowguide.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, UUID> {
    List<StudyMaterial> findByCourse(String course);
}
