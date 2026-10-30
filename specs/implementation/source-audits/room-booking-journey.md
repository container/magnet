# Room Booking Journey Audit

Purpose: compare the attached full journey board for a long-term puppet-group renter against the current MAG-NETic platform specifications.

Status: implementation audit

Source: attached journey image, visually read in Codex on 2026-08-12.

Source user: `Dolgoročni najemnik - lutkovna skupina`

Source service: `Najem prostora za vaje`

---

## 1. Summary

The current platform specs cover the core room-booking journey well at the domain level:

- public discovery of spaces
- public rental/request entry points
- inquiry and form submissions
- pricing or pricing-rule references
- reservation records and admin calendars
- registered external users with selected-space booking rights
- regular users of a space
- physical access-control integration through Prima
- invoice and finance references through external finance/accounting systems

The journey adds important process detail that is only partly explicit in the specs:

- the distinction between an anonymous public inquiry and a direct reservation flow for approved long-term renters
- one-time and recurring room-use requests before external calendar entry
- request file attachments for contracts and supporting documents
- whether the requester already has a Prima card
- user-facing instructions for room use after access is granted
- staff ownership of the relationship, especially the building/space manager and programme lead

The main spec gaps are not new platform modules. They are request approval, recurrence, external calendar handoff, request attachments, Prima-card data, and visibility details.

---

## 2. Journey Readout

The source board describes this flow:

1. User searches for information and establishes contact.
2. User reviews the rental/request explanation and contacts DOM.
3. User exchanges email or phone contact with DOM where needed.
4. User submits or shares the details needed for DOM to approve room use.
5. User may attach contracts or supporting documents to the request.
6. DOM checks whether the requester already has a Prima card.
7. Approved use is entered or synchronized into the external booking/calendar system.

Visible public/user-facing information needs include:

- what DOM offers
- spaces, equipment, setup and purpose
- schedule or availability
- price list
- contact or inquiry path
- rental/use conditions
- usage instructions

Visible internal/operational needs include:

- contact handling
- request attachment handling
- space reservation system
- Prima-card yes/no information on the request
- room-use instructions
- invoice issuing through finance/accounting

---

## 3. Detailed Comparison

| Journey item | Current coverage | Status | Suggested target |
| --- | --- | --- | --- |
| User learns what DOM offers | `spec-web.md` public website and services; `spec-spaces.md` public space content | Covered | none |
| Public space list and detail pages | `spec-web.md`, `spec-spaces.md` | Covered | none |
| Space equipment, setup, purpose and capacity | `spec-spaces.md` public space content, layouts and equipment | Covered | none |
| Schedule, availability or occupancy visibility | `spec-spaces.md` availability/occupancy; `spec-admin.md` reservations calendar | Covered as internal/admin concern | Public visitors do not need space availability/status labels |
| Public price list or pricing conditions | `spec-spaces.md` rental/request flow | Covered | none |
| Public contact path | `spec-web.md` inquiries; `spec-spaces.md` reservation contact fields | Covered | none |
| Contact form or email creates an inquiry | `spec-web.md` inquiries; `spec-admin.md` forms/submissions | Covered | none |
| Phone as a contact channel | `spec-spaces.md` reservation contact phone; `spec-web.md` public contact content | Covered | none |
| Space visit or tour before approval | Not required by product decision | Not needed | none |
| Sample contract and supporting documents | Request records can support file attachments | Covered after update | Add file attachments to room-use request |
| Contract signing | Product decision is not to model digital signature/status now | Not needed | Use request file attachments where relevant |
| Long-term renter/regular user model | `spec-spaces.md` regular users; `spec-users-access.md` registered external users and space access rules | Covered | none |
| Manual admin reservation creation | `spec-admin.md` and `spec-spaces.md` reservation requirements | Covered | Admin can create reservations without a public form submission |
| Reservation record creation and approval | `spec-admin.md` reservation records/statuses | Covered | none |
| Recurring rehearsal pattern | Repeated terms are explicit for events, but not directly for stand-alone room rentals | Partial | Add recurring reservation support or recurring-series representation to reservations |
| Room-use instructions | `spec-spaces.md` rules and instructions | Covered | none |
| Prima card | Prima integration exists; request needs a card yes/no field | Covered after update | Add `has Prima card` to room-use request |
| Invoice issuing | External finance/invoicing boundary is covered | Covered as integration boundary | none |
| User account area for own reservations | `spec-users-access.md` registered external users | Covered | none |
| Handoff from rehearsal rental to performance organisation | Source board shows this continuation, but product decision says no explicit platform handoff is needed | Not needed | none |
| Performance space reservation | `spec-events.md`, `spec-admin.md` reservations | Covered | none |
| Technical check for performance | `spec-events.md` required services and setup notes | Covered | none |
| Website event publication | `spec-events.md`, `spec-web.md`, `spec-admin.md` | Covered | none |
| Social, flyer and email marketing | Newsletter integration exists; social/flyer publishing workflow is not platform-owned | Partial/external | Treat as communication-support metadata or external workflow |
| Ticket issuing and checking | `spec-events.md`, `spec-admin.md`, `questions-decisions/events-ticketing.md` | External/deferred | Keep ticket inventory, issuing and check-in with ticketing provider |
| Co-creation: workshop and programme collaboration | `spec-web.md` programmes/services; `spec-events.md` workshops/events | Covered at domain level | Add only if this becomes part of room-renter account journey |

---

## 4. Findings

### 4.1 Public discovery is mostly covered

The source journey validates the current `Prostori` and `Najemi prostor` model. The specs already require public space pages, rental CTAs, equipment, availability status, pricing references, rules, accessibility notes and inquiry contact information.

No major domain change is needed for discovery.

### 4.2 Renter state should stay on bookings and related operational records

The board distinguishes a user who is still exploring from a person or group requesting actual room use. Product review decided not to create a separate renter-user status model.

The state that matters should live on the relevant record:

- inquiry or form submission
- reservation or booking
- membership, if applicable
- contract or file workflow, if applicable
- Prima-card information, if applicable

A person, member, organisation, or regular user may have permission to request or reserve selected spaces, but that permission should not introduce a separate renter status.

### 4.3 Recurring rehearsal requests should be made explicit

The approval journey needs to support one-time and recurring room-use requests. The actual booking/calendar entries are expected to be owned by an external booking or calendar solution.

MAG-NETic should support collecting and approving:

- whether the request is one-time or recurring
- the requested recurrence pattern
- exceptions or constraints known during approval
- the handoff state to the external booking/calendar system

The selected external booking/calendar system should own exact entries, recurrence expansion, conflict detection, edits, cancellations and operational occupancy status.

### 4.4 Request attachments replace contract-specific workflow for now

The journey mentions sample contracts and signed usage contracts. Product review decided not to add separate contract status, signed date, or digital-signature fields to the room-booking journey at this stage.

Instead, room-use request records should support generic file attachments. Attachments can hold sample contracts, signed documents, programme descriptions, technical riders, or other supporting files without over-specifying the contract workflow.

### 4.5 Prima stays external; request captures card possession

`spec-users-access.md` correctly assigns physical access execution to Prima. Product review decided not to add access-card milestones to the room-use approval journey.

The request should only capture whether the requester already has a Prima card:

- has Prima card
- does not have Prima card

### 4.6 No explicit event/performance handoff

The second half of the board shows the renter becoming an event organiser, but product review decided this does not need an explicit platform handoff from rehearsal rental to event/performance organisation.

---

## 5. Recommended Spec Updates

Recommended changes for `spec-spaces.md`:

- Add explicit support for recurring rehearsal/regular-use requests before external calendar handoff.
- Keep public availability/status labels out of public space pages unless a later content decision requires them.

Recommended changes for `spec-users-access.md`:

- Clarify that regular users may have selected-space request or reservation permissions without a separate renter status model.
- Keep Prima as the physical access owner and capture only whether the requester already has a Prima card.

Recommended changes for `spec-admin.md`:

- Add room-use request approval fields for request attachments, Prima-card yes/no, next step and external calendar handoff.
- Add external booking/calendar references for approved requests.

Recommended changes for `questions-decisions/open-questions.md`:

- Remove the broad public/authenticated availability question; external booking/calendar integration details remain open.

---

## 6. Decision Questions

1. Which external booking/calendar system will own exact entries, recurrence, conflicts, edits and cancellations?
