package org.example.fotofetch.event.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.fotofetch.event.dto.CreateEventRequest;
import org.example.fotofetch.event.dto.EventResponse;
import org.example.fotofetch.event.service.EventService;
import org.example.fotofetch.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal User photographer
    ) {

        return ResponseEntity.ok(
                eventService.createEvent(
                        request,
                        photographer
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getMyEvents(
            @AuthenticationPrincipal User photographer
    ) {

        return ResponseEntity.ok(
                eventService.getMyEvents(photographer)
        );
    }
}