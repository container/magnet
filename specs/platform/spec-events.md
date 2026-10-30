# MAG-NETic Platform - Events Specification

Purpose: define platform requirements for event content, event scheduling, event operations, event visibility, and event relationships.

Status: platform specification

---

## 1. Scope

This specification covers:

- public event content
- event status and visibility
- programme relationships where relevant
- primary event space
- programme mentor relationship where relevant
- linked bookings and reservations
- organiser information
- DOM ownership and event team
- event files
- required services
- signage references
- reporting references
- task and finance integration boundaries

---

## 2. Event Identity

Every event must have:

- stable internal event ID
- public slug
- title
- single event status
- related programme reference where relevant
- originating programme application or participant reference where relevant
- assigned programme mentor reference where relevant
- created and updated timestamps where supported by the platform

The internal event ID is hidden from public users.

The public slug is used for public event detail URLs.

When an event originates from a selected programme application or participant flow, the event must be able to reference the related programme and originating programme application or participant record.

When a programme-supported event has an assigned mentor, the event must be able to reference that mentor for internal coordination.

Programme application and participation requirements are defined in `spec-programmes.md`.

---

## 3. Event Status

The platform must use one event status field.

The event status must cover the event's working and public lifecycle, including:

- draft
- in coordination
- offer
- confirmed
- published
- cancelled
- completed
- archived

The platform must not maintain a second separate publication status unless an integrated CMS or event-management service requires it.

Public event listings must show only events whose status allows public visibility.

Archived events may remain publicly accessible through archive views when their content is still intended for public reference.

---

## 4. Public Event Content

Every event must support public content fields for:

- title
- subtitle
- summary
- Slovenian description
- optional English description
- event type
- audience
- tags
- organiser name
- primary space
- date
- start time
- end time
- registration or entry information

The Slovenian description is the canonical authored event description.

English event description may be authored explicitly where needed.

Tags are used for discipline, topic, programme, or other flexible event categorisation.

The public `Dogodki` page must be list-first.

The public `Dogodki` page must also support a monthly calendar view where events appear on their event dates.

Public event discovery must support filters by the public space/context groups used on the `Prostori` overview:

- `Prireditve in vadba`
- `Skupnost in sodelo`
- `Ustvarjanje in razstave`

These event filters are based on the event's primary space where that relationship exists.

Public event listings and calendars may support additional filtering if event volume or browsing context requires it.

Event filters should support at least:

- date or date range
- event type
- audience
- tags
- programme or series
- space, where relevant

The public event archive must remain available at a dedicated archive route.

For now, the public event archive should list archived events as simple rows.

Public event detail pages must provide a registration or ticket entry point where the event has registration or ticketing needs.

The registration or ticket entry point may be a placeholder button until the ticketing module or external ticketing integration is selected.

At minimum, an event record must have:

- stable internal event ID
- public slug
- title
- summary
- Slovenian description
- date
- primary space ID
- event type
- audience
- organiser name
- tags
- registration or entry type

---

## 5. Event Type And Classification

The platform must support a controlled event type list.

The event type list must include at least:

- workshop
- talk
- lecture
- discussion
- concert
- performance
- conference
- exhibition
- meeting
- rehearsal
- open day
- community event
- training
- mentoring
- other

The platform must also support a production type field for top-level operational classification.

Production type must support at least:

- DOM production
- external public event
- external private event
- co-production
- community event
- other

---

## 6. Dates, Times, And Bookings

Every event must have public display date information.

The event record stores the date, start time, and end time needed for public display.

Multi-day use, repeated terms, setup time, rehearsal time, cleanup time, and supporting-room occupation must be represented through linked booking or reservation rows.

Booking and reservation rows must support:

- event reference
- space reference
- date
- start time
- end time
- booking status
- expected participants
- operational notes

Expected participants belong to booking or reservation rows because the number affects room setup and operational preparation.

---

## 7. Space Relationship

Every event must have one required primary space.

The event stores the hidden primary space ID.

Public views resolve and display the public space name from the linked space record.

Additional spaces, supporting spaces, backstage areas, storage spaces, preparation rooms, and room-specific time blocks must be represented through linked bookings, reservations, or operational records.

---

## 8. Organiser And Contacts

The organiser name is stored on the event as free text.

The organiser contact is stored separately from the organiser name and may also be free text.

External organiser contact information must remain separate from DOM ownership and DOM team assignment.

Public visibility of organiser contact information must be controlled independently from internal DOM contact visibility.

---

## 9. DOM Ownership And Team

Every event must have one required DOM owner.

The DOM owner must be a reference to a sodelavec or administrator account.

Every event may have additional DOM team members.

Additional DOM team members must be stored as multiple references to sodelavec or administrator accounts.

Administrative views may show DOM owner and team member names and email addresses from the users database.

Public views must show DOM owner or DOM team contact information only when the event visibility rules allow it.

User-group, module-access, and permission rules are defined in `spec-users-access.md`.

---

## 10. External Links And Livestreams

Events must support multiple external public URLs.

External URLs may include:

- event website
- ticketing link
- registration link
- social media event link
- partner page
- other relevant public links

Events must support a dedicated livestream URL when a livestream exists.

---

## 11. Registration, Entry, And Pricing

Events must support registration or entry type.

Registration or entry type must support at least:

- no registration
- registration required
- registration recommended
- external link
- tickets
- invitation only
- closed/internal

Events must support:

- registration URL
- ticketing URL or external entry URL
- price note

Full ticketing, payment, and attendee-management workflows may be handled by an external registration or ticketing service.

---

## 12. Event Files

Event files must be stored as references to a separate file, media, or CDN service.

The platform stores file references, metadata, ownership, and visibility rules. The platform does not own binary file delivery directly.

Event files must be separated into public files and internal files.

Public event files may include:

- programme PDFs
- public photos
- public media assets
- public downloadable documents

Internal event files may include:

- visual-material working links
- calculations
- offers
- contracts
- technical files
- execution instructions
- invoices
- internal supporting documents

Internal file references may support workflow status, including:

- needed
- received
- approved
- sent
- archived

Public files may be referenced from public rich text or listed as public downloads.

Internal files must be visible only to users with suitable internal permissions.

---

## 13. Required Services

Events must support required services as tag-like values.

Required service tags may include:

- space use
- equipment rental
- technical support
- sound
- projector
- front-of-house support
- security
- ticket sales
- catering
- photo and video
- communication support
- other

General setup requirements must be stored as event setup instructions.

Timing-specific setup, rehearsal, performance, and cleanup details must be stored in booking or reservation notes.

---

## 14. Signage Relationship

Signage display content must be managed in a separate signage module.

Signage items may reference events and spaces.

Event-related signage may include:

- display text
- announcement media
- event image
- event title
- time
- space
- status or visibility schedule

Signage content must not be stored directly as ordinary public event content.

---

## 15. Reporting Relationship

Event reporting must be managed in a separate reporting module.

Event reports must reference the related event.

Event reports may include:

- actual participant count
- short narrative report
- KPI values
- resource-use notes
- public photo references
- internal file references

Reporting data must not be mixed into the public event content editor.

---

## 16. Task And Finance Boundaries

Event tasks must be managed in a separate task module or task-management integration.

Invoices and invoice issuing must be managed in a finance or invoicing module or external finance integration.

Events may reference related task, finance, or invoicing records when useful for administration.

Task and finance records must not be public event fields.

---

## 17. Administration Requirements

The event administration interface must support sections for:

- basic event data
- dates and spaces
- publication and communication
- entry, registration, and ticket links
- required services and production notes
- DOM owner and DOM team
- public files
- internal files
- signage references
- reporting references
- task and finance references

The administration interface must protect internal production fields from public display.

When an event is created or updated in MAG-NETic admin, the platform must be able to publish the corresponding public event data to the MOC GitHub repository as an MDX event file.

The GitHub/MDX export must include only public event fields and must not expose internal production fields, internal user IDs, internal files, booking rows, invoices, contracts, or internal notes.

---

## 18. Public Website Requirements

The public event page must show only public event information.

The public event page may show:

- title
- date and time
- primary space name
- organiser
- summary
- description
- event type
- tags
- image or visual
- registration, ticket, or entry link
- livestream link
- public files

The public event page must not expose:

- internal event ID
- internal DOM user IDs
- internal notes
- internal files
- internal booking rows
- setup notes
- invoices
- contracts
- internal reports
- task records
