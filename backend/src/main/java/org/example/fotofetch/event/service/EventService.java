package org.example.fotofetch.event.service;

import lombok.RequiredArgsConstructor;
import org.example.fotofetch.event.dto.CreateEventRequest;
import org.example.fotofetch.event.dto.EventResponse;
import org.example.fotofetch.event.entity.Event;
import org.example.fotofetch.event.repository.EventRepository;
import org.example.fotofetch.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventResponse createEvent(
            CreateEventRequest request,
            User photographer
    ) {

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .photographer(photographer)
                .active(true)
                .build();

        eventRepository.save(event);

        return mapToResponse(event);
    }

    public List<EventResponse> getMyEvents(User photographer) {

        return eventRepository
                .findByPhotographerId(photographer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Event getEventForPhotographer(
            UUID eventId,
            User photographer
    ) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found")
                );

        if (!event.getPhotographer()
                .getId()
                .equals(photographer.getId())) {

            throw new RuntimeException(
                    "You do not have access to this event"
            );
        }

        return event;
    }

    private EventResponse mapToResponse(Event event) {

        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .location(event.getLocation())
                .eventDate(event.getEventDate())
                .active(event.getActive())
                .createdAt(event.getCreatedAt())
                .build();
    }
}