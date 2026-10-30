# MAG-NETic Platform - Spaces Specification

Purpose: define platform requirements for spaces, public space pages, rental/request flows, availability, and space relationships.

Status: platform specification

---

## 1. Scope

This specification covers:

- space identity
- public space content
- space categorisation
- capacities and layouts
- dimensions and floor plans
- media
- equipment
- rules and accessibility
- rental/request flow
- space booking request approval records
- booking and occupancy relationships
- reservation and external booking records
- regular users
- related events and programmes
- data ownership boundaries

---

## 2. Space Identity

Every space must have:

- stable internal space ID
- public slug
- public space name
- publication status
- source or location group
- floor or location note
- space type

The internal space ID is hidden from public users.

The public space name is visible on public pages, event pages, calendars, and reservation flows.

The platform must support spaces in different location groups, including DOM and DOM HUB.

Floor and location are metadata for a space. They must not be the only navigation or sorting model for public space browsing.

Public space browsing must group spaces by use and visitor context rather than by floor alone.

The public presentation groups are:

- `Prireditve in vadba`
- `Skupnost in sodelo`
- `Ustvarjanje in razstave`

Internal or operator-only spaces must remain available to administration where needed, but they must not be included in public space browsing or public rental/request selectors.

---

## 3. Publication Status

Spaces must support publication status.

Publication status must support at least:

- draft
- published
- archived

Public views must show only published spaces.

Archived spaces must remain available to internal users where historical event, booking, or reporting references require them.

---

## 4. Space Type And Category

Spaces must support a controlled type list.

The type list must include at least:

- hall
- gallery
- practice room
- workshop room
- meeting room
- classroom
- office
- studio
- atelier
- coworking
- residence
- exhibition space
- outdoor/public area
- other

Spaces may also support an additional category or label where DOM needs a more specific public grouping.

---

## 5. Public Space Content

Every public space page must help users understand whether the space is suitable for their activity and what the next action is.

Public space content must support:

- short description
- primary use
- other possible uses
- important information
- capacity
- capacity label
- floor or location
- connected spaces
- dimensions
- area
- room-specific floor plan image
- media
- equipment
- rules and instructions
- accessibility note
- reservation or inquiry contact
- rental/request CTA

The default public CTA for rentable spaces is `Najemi prostor`.

At minimum, a space record must have:

- stable internal space ID
- public slug
- public space name
- source or location group
- short description
- primary use
- other possible uses
- space type
- floor or location note
- capacity value or capacity label
- equipment list

The platform must support `TBD` notes or descriptive labels where confirmed numeric values are not available yet. Unconfirmed inventory values must not be forced into exact numbers.

---

## 6. Capacity And Layouts

Spaces must support a general capacity value or capacity label.

Spaces may support multiple layout options.

Layout options may include:

- classroom
- workshop
- round table
- event
- exhibition
- empty room
- custom setup

Each layout may define:

- layout name
- capacity
- capacity label
- description

The platform must support descriptive capacity labels when exact confirmed numeric values are not available.

---

## 7. Dimensions And Floor Plans

Spaces must support:

- width
- length
- height
- area
- dimension note
- floor plan reference

Dimensions and area may be stored as exact numbers where confirmed.

The platform must also support descriptive labels or notes where exact dimensions are not yet confirmed.

Floor plans must be stored as file/media references.

Every public room or space detail page must support displaying a room-specific floor plan image.

Floor plans may also be public downloads where visibility rules allow.

The public website is not required to provide a separate whole-building floor-plan page.

---

## 8. Media

Spaces must support public media references.

Space media may include:

- photographs
- renders
- floor plans
- downloadable PDFs
- images showing different modes of use

Media files must be stored through a separate file, media, or CDN service.

The platform stores file references, metadata, ownership, and visibility rules.

---

## 9. Equipment

Spaces must support a list of equipment available in or for the space.

Equipment may be represented as simple tags or references to an equipment/inventory module.

If equipment is bookable, shared, or limited, operational availability must be handled through booking, inventory, or administration records, not only through public space text.

Shared or limited equipment must be trackable internally so event and reservation planning can avoid double-booking the same equipment.

---

## 10. Rules And Accessibility

Spaces must support rules and instructions.

Rules may include:

- shared building rules
- space-specific rules
- safety limitations
- setup limitations
- equipment-use instructions
- sound or noise limitations
- cleaning or reset requirements

Spaces must support an accessibility note.

Accessibility notes may include:

- entrance information
- elevator access
- wheelchair access
- toilet access
- floor changes
- relevant limitations
- contact instruction for access questions

Public accessibility claims must be based on confirmed source information.

---

## 11. Rental And Request Flow

Rentable or requestable spaces must support:

- rental/request CTA
- reservation contact email
- reservation contact phone
- reservation contact note
- rental conditions
- public price-list or pricing-rule reference

Public space pages or rental/request pages must expose confirmed pricing information where pricing is public.

Pricing information may be represented as:

- a space-specific price list
- a shared price-list reference
- pricing categories
- textual pricing conditions
- a public note that pricing is confirmed through inquiry

The rental/request flow is the approval journey for deciding whether a requested room use can proceed. It is separate from the actual booking or calendar-entry execution.

A public rental/request form is one possible entry point into the room-use workflow. Administrators must also be able to create reservations manually without a public form submission.

### External Renter Without An Account

The rental/request flow may support an external renter who does not have a platform user account or DOM membership.

This renter is a contact and billing party on a room-use request or reservation, not a platform user group. The record must not create sign-in access, a password, membership status, or access to `Moj DOM`.

Where this capability is enabled, the request or reservation must distinguish:

- contact person: name, email address, and phone number
- renter or billing party: a natural person or organisation
- organisation name where applicable
- billing information required by the selected external finance or invoicing system
- related room-use request, reservation, and external invoice reference where available

The external finance or invoicing system remains the system of record for issuing invoices and formal billing records.

The rental/request flow must collect at least:

- requested space
- whether the request is one-time or recurring
- requested date and start time for one-time use
- requested weekday and start time for recurring use
- requested duration
- requested recurrence pattern where relevant
- expected number of participants
- type of activity or event
- technical needs
- file attachments where relevant
- contact name
- contact email
- contact phone where needed
- message

Requested duration must be collected in 30-minute increments.

Requested duration must support a minimum of 30 minutes and a maximum of 3 hours for the public request flow unless DOM changes the rental policy.

Public start-time selection must use full-hour options unless DOM changes the rental policy.

Public request attachments must explain accepted file types, file count, and file-size limits.

Space booking request or approval records must store the submitted request fields plus:

- organisation name where relevant
- requested space type where an exact space has not been chosen
- Prima card number where relevant
- assigned owner
- approval status
- internal notes
- next step
- created timestamp
- linked external booking or calendar reference where available

Prima card number is an internal/admin data item on the request and is relevant only after a request is approved for calendar handoff or access coordination. It should not be required as a public user-facing field.

Space booking request approval status must support at least:

- new
- in review
- waiting for requester
- approved for calendar
- rejected
- archived

The approval status describes DOM's decision process for the request. It must not replace the status of actual calendar entries in the booking or calendar system.

The request flow may create an inquiry, room-use request, approval record, or submission record depending on the selected implementation.

Approved room-use requests must be able to hand off the confirmed booking details to the selected external booking or calendar system.

Approval for calendar handoff means that DOM has accepted the requested use in principle. It must not by itself imply that the external calendar entry has been created, synced, confirmed, edited, or cancelled.

The external booking or calendar system may own:

- exact calendar entries
- recurrence expansion
- conflict detection
- calendar edits and cancellations
- operational occupancy status

The platform must be able to store or display references to external booking or calendar records where needed for administration, reporting, access-control coordination, or user follow-up.

Public users must not gain direct administration access through a rental/request form.

---

## 12. Availability And Occupancy

Administration may support an internal availability status for spaces.

Where used, internal availability status must support at least:

- available for inquiry
- limited
- coming soon

Public space pages do not need to display availability status labels.

Detailed occupancy must be represented through linked bookings or reservations, which may be owned by an external booking or calendar system.

The administration interface, selected external system, or integration layer must support space bookings and reservations.

Reservation status must support at least:

- draft
- requested
- temporary
- approved
- rejected
- cancelled
- blocked

Reservation source must support at least:

- manual
- inquiry
- event
- programme
- internal block
- external integration

Reservation or external booking records must support:

- stable internal reservation ID
- space reference
- event reference
- programme reference
- inquiry reference
- requester name
- requester email
- organisation name
- title
- description
- start date and time
- end date and time
- expected participants
- status
- source
- internal note
- created timestamp
- updated timestamp

The public website must not expose occupancy views or internal availability data to public visitors.

Administrators may create reservations directly, from a public inquiry, from an event or programme workflow, or from an external integration.

Occupancy views must not expose internal notes, private bookings, internal user IDs, or non-public operational data.

---

## 13. Connected Spaces

Spaces may reference related or connected spaces.

Connected spaces may include:

- backstage
- storage
- dressing rooms
- technical rooms
- lobby or entrance areas
- adjacent rooms
- shared equipment areas

Connected-space references must support both public explanation and internal operational use.

---

## 14. Regular Users

Spaces may reference regular users or groups that use the space.

Regular users must be represented as references to registriran uporabnik, organisation, community, or member records where those records exist.

Regular-user references identify who commonly uses or may request a space. They must not introduce a separate renter status model.

Public visibility of regular-user relationships must be controlled independently from internal access or booking rights.

Space access and permission rules are defined in `spec-users-access.md`.

The administration interface must be able to show which users, organisations, or groups may request or reserve selected spaces.

---

## 15. Event And Programme Relationships

Spaces may reference related events and programmes.

Event records reference their required primary space.

Additional operational space use must be represented through linked bookings or reservations.

Space pages may show related public events and programmes where those records are published and visible.

Archived, private, draft, or internal records must not appear on public space pages unless explicitly allowed by their visibility rules.

---

## 16. Administration Requirements

The space administration interface must support sections for:

- identity and location
- public description
- capacity and layouts
- dimensions and area
- connected spaces
- equipment
- media and floor plans
- rules and instructions
- accessibility
- rental/request settings
- availability status
- regular users
- related events and programmes

Administration views may show internal IDs, source notes, unconfirmed-field flags, and operational references.

Public views must not expose internal IDs, source notes, or internal operational data.

---

## 17. Data Ownership Boundary

The platform specification defines the required fields and relationships for spaces.

The actual list of spaces, descriptions, capacities, equipment, media references, and unconfirmed values belongs in the platform database or seed data, not as long-term specification content.

Source-derived inventory documents may be kept temporarily as implementation/source notes until the data is moved into the database.
