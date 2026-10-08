package org.example.fotofetch.event.repository;

import org.example.fotofetch.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByPhotographerId(UUID photographerId);
}