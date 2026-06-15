package com.flowguide.repository;

import com.flowguide.entity.VideoTutorial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoTutorialRepository extends JpaRepository<VideoTutorial, UUID> {
    List<VideoTutorial> findByCourse(String course);
}
