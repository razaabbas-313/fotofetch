package org.example.fotofetch.event.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank
    private String name;

    private String description;

    private String location;

    private LocalDateTime eventDate;
}