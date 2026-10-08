package org.example.fotofetch.event.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EventResponse {

    private UUID id;

    private String name;

    private String description;

    private String location;

    private LocalDateTime eventDate;

    private Boolean active;

    private LocalDateTime createdAt;
}