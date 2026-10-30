# MAG-NETic Platform - Admin And Operations Specification

Purpose: define platform requirements for the administration interface, operational modules, reservations, signage, reporting, integrations, and internal workflows.

Status: platform specification

---

## 1. Scope

This specification covers:

- administration interface structure
- dashboard requirements
- editorial administration
- forms and submissions
- space administration
- space calendars, booking requests, and reservations
- memberships
- signage management
- reporting
- registrations and ticketing boundaries
- shop/ecommerce integration boundaries
- media administration
- newsletter integration
- external integrations
- settings
- audit expectations

Public website content requirements are defined in `spec-web.md`.

Event requirements are defined in `spec-events.md`.

Space requirements are defined in `spec-spaces.md`.

Programme requirements are defined in `spec-programmes.md`.

User-group, module-access, and permission requirements are defined in `spec-users-access.md`.

Domain-specific field lists, status values, visibility rules, and relationships must remain in the relevant domain specification.

This specification defines administration structure, operational views, cross-module workflows, and integration surfaces. It should reference `spec-events.md`, `spec-spaces.md`, and `spec-programmes.md` rather than duplicating domain requirements.

---

## 2. Administration Access

The administration interface must require authenticated sodelavec or administrator access.

Administration access must be user-group based and module-aware.

Users must see only the modules, records, and files allowed by their user group, module access, or explicit access grants.

The administration interface must remain separate from the public website and user account area.

Public website or registriran uporabnik account access must not expose administration modules.

---

## 3. Administration Modules

The administration interface must support modules for:

- dashboard
- news
- events
- forms and submissions
- spaces
- memberships
- programmes
- static/editorial content
- media integration
- newsletter integration
- signage
- integrations
- users and permissions
- settings

The platform may hide modules from users who do not have relevant access.

---

## 4. Dashboard

The dashboard must provide daily operational orientation.

The dashboard must be able to show:

- recent changes
- upcoming events
- upcoming bookings
- unresolved inquiries
- draft content waiting for review
- integration status
- items requiring user action

Dashboard widgets must respect permissions and must not expose restricted records.

---

## 5. Editorial Administration

The administration interface must allow authorised users to create, edit, preview, publish, archive, and manage public editorial content.

Editorial administration covers:

- news
- static pages
- programmes
- services
- public organisation profiles
- public people profiles
- public media metadata
- public related-content links

Specialised entities such as events and spaces must be managed in their own modules rather than only as generic CMS pages.

Static/editorial content administration must make the public website structure visible to authorised editors.

The administration interface must show whether each public page, section, or reusable block is owned by static/editorial content administration or by another specialised module.

Where a public page is assembled from specialised records, such as spaces, events, programmes, or news, static/editorial content administration may show a shortcut or ownership reference, but must not duplicate those records as static pages.

Public organisation and people profile records must be manageable as editorial/community content records. They may be implemented inside static/editorial content administration or a dedicated community editorial view, but they must remain separate from user accounts, member records, and authentication profiles.

### 5.1 News Administration

The `Novice` administration module must manage one editorial list for:

- `projektna novica`
- `zgodba`
- `obvestilo`
- `poziv`
- `pr-obvestilo`

The news administration list may expose these as tabs or filters, but they remain one content model.

News records must support:

- title
- slug
- content type/category
- publication date
- author name
- publication status
- excerpt
- body
- tags
- photo labels or media references
- added public links
- call deadline where the record is a `poziv`
- attached form flow where the record is a `poziv` and public submissions are accepted through the platform
- public preview

News publication status must support:

- `draft`
- `published`
- `archived`

`Poziv` is a news category with optional call-specific fields, not a separate public module. If a `poziv` has an attached form flow, administrators select the flow in the news editor; the public website renders the selected form rather than exposing the internal form-flow ID.

Create and edit forms for news records must expose the same core fields so staff can create a complete editorial record without needing a separate follow-up edit step.

---

## 6. Forms And Submissions

The platform must support editable public form flows and an internal submissions inbox.

Form flows must support:

- public title
- public intro
- steps
- fields
- required and optional fields
- topic routing
- recipient or owner assignment
- confirmation message
- status labels
- internal notes

The forms administration module must provide an overview of existing form flows and a clear action for creating a new form flow.

Individual form flows may have dedicated administration pages where staff manage settings, routing, submissions, and workflow-specific operational records.

The new-form editor must be separate from workflow-specific inboxes and operational review desks.

Submission records must support:

- submitted flow
- submitted topic
- requester/contact details
- related space, event, or service where relevant
- assigned owner
- status
- internal notes
- next step
- created timestamp

Submission status must support at least:

- new
- in progress
- waiting for reply
- completed
- archived

Public submissions must not expose administration access to public users.

Public space booking request forms may use the shared form-rendering or submission infrastructure, but space booking requests must be managed in the Spaces module, not as a visible Forms module workflow.

Public programme application or participation forms may use shared form-rendering infrastructure, but programme applications must be managed in the Programmes module, not as a visible Forms module workflow.

---

## 7. Spaces

The administration interface must support a separate Spaces module.

The Spaces module must support:

- calendar
- space booking requests
- space list and space record editing

The Spaces module must be the primary administration area for space content, space booking request approval, and booking/calendar coordination work.

Space administration, booking, request, availability, occupancy, handoff, and visibility requirements are defined in `spec-spaces.md`.

Actual booking and calendar execution may be owned by an external booking or calendar system.

### 7.1 Calendar

The Spaces module calendar must support:

- week view
- month view
- list view
- space filter
- multi-space selection
- reservation list
- manual reservation creation
- internal block creation
- event-linked reservation rows
- inquiry-linked reservation rows
- programme-linked reservation rows
- conflict indicators
- external booking or calendar reference visibility where available
- internal notes

The calendar view is the first operational view inside the Spaces module.

The calendar view must surface reservation and booking records as defined in `spec-spaces.md`.

### 7.2 Space Booking Requests

Space booking requests must be the second visible view inside the Spaces module.

Space booking requests may originate from a public space request form, internal entry, imported submission, or external integration.

Space booking request fields, timing rules, attachment rules, approval statuses, Prima-card handling, and calendar handoff requirements are defined in `spec-spaces.md`.

The Spaces module must support an approval desk where staff can:

- see new and active space booking requests by approval status
- review the requester, organisation, requested space, timing, duration, activity, expected participants, technical needs, attachments, and internal Prima-card number where relevant
- assign or change the internal owner
- record internal review notes
- mark that additional information is needed from the requester
- approve the request for calendar handoff
- reject or archive the request
- see whether an approved request is ready for calendar entry, sent to the external calendar, or already represented by an external calendar reference

Space booking request status should be visible as a status label in the request header and editable through an explicit status field with a save action.

Space booking request internal notes must be independent from saving request fields. Staff must be able to add an internal note at any time. Notes must show author and date/time, and the newest note should appear first.

### 7.3 Spaces List And Editing

The Spaces module must include a Spaces view where spaces are listed and can be opened for viewing and editing.

The spaces list must support:

- space name
- publication status
- location group
- floor or location note
- space type
- access category
- capacity label
- availability status
- related event count
- related reservation count
- related space booking request count
- filtering by location group, publication status, access category, and text search

Space records must be openable from the list.

Space editing must expose the relevant space identity, content, media, equipment, rules, accessibility, relationship, availability, and public visibility fields defined in `spec-spaces.md`.

Public-facing space visibility must respect publication status, access rules, and public rental/request visibility.

---

## 8. Event Administration

Event administration requirements are defined in `spec-events.md`.

The Event module must support:

- event list and filtering
- event record editing
- public preview, publishing, and export status
- production coordination
- linked reservation or booking visibility
- public and internal file references
- signage references
- reporting references
- task and finance references

The administration interface must support the event administration sections defined in `spec-events.md`.

The event module must protect internal production fields from public display.

---

## 9. Programmes

The administration interface must support a separate Programmes module.

The Programmes module must support:

- `Seznam` view for programme list and filtering
- programme record editing
- programme detail view
- public preview, publishing, and archive status
- `Prijave na programe` view for programme application or participation records
- programme application detail view for the related participant or applicant
- participant or applicant tracking
- related event visibility
- related space visibility
- related service visibility
- related inquiry or reservation visibility where relevant
- internal notes and next-step tracking

The Programmes module must be the primary administration area for programme content, public visibility, and programme application or participation workflow tracking.

Programme application or participation requests may originate from a public programme CTA, internal entry, imported submission, or external integration.

Programme application or participation request views must allow staff to see new and active requests by related programme, status, owner, and submission date.

Shared form-rendering infrastructure may be used to collect programme application or participation data, but operational review and follow-up must happen inside the Programmes module.

The Forms module must not be the primary working area for complex programme application or participation workflows.

---

## 10. Required Services And Production Support

The administration interface must support event and reservation service requirements.

Required service values may include:

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

The platform may keep required services as tag-like values until service-level statuses, owners, approvals, or fulfilment workflows are needed.

---

## 11. Equipment Administration

The administration interface must support internal equipment records where equipment needs to be tracked across spaces, events, or reservations.

Equipment records should support at least:

- stable internal equipment ID
- public/internal label
- equipment type or category
- quantity where relevant
- default space or storage location
- availability status
- internal notes

Administrators must be able to link equipment requirements to events, reservations, or production records.

Administrators must be able to reserve or block shared equipment for an event, reservation, or internal operational use.

The platform must track availability for shared or limited equipment so staff can detect conflicts when multiple events or reservations need the same equipment at the same time.

Public users must not be able to book or rent equipment separately outside the building through the public platform.

---

## 12. Users and Members Administration

The administration interface must include a module named `Uporabniki in člani`.

The module must show a single operational list of registered website users and their membership state. Membership applications must not be presented as a separate admin list when they are one-to-one with a registered user.

The module must support top-level views or tabs for:

- users
- members
- inactive users

The module must include a `Novi člani` view for recently joined members. This view must show only users whose shared status is `član` and sort them by latest membership application or signup date first.

The user/member list must support:

- user name
- email
- organisation
- registration date
- status

User/member status must use one shared status field in this administration view:

- `aktiven`: registered user with confirmed email and no active membership
- `neaktiven`: user is not confirmed or was manually deactivated
- `član`: registered user with active membership

The user detail view must show membership data on the registered user record, including:

- membership type
- membership application or signup date where available
- membership start date where applicable
- membership end date where applicable
- internal membership note where applicable
- paid membership-fee records where available

Administrators may manually change membership data only for an existing registered user.

Paid membership-fee records shown in the user/member detail must include:

- membership period
- payment date
- amount
- invoice number or external invoice reference
- invoice/payment status

Membership fee payment state may be shown in member lists as a compact status label or chip, together with the invoice number or external invoice reference.

The public website content that explains membership must be managed through the static content module, not through the `Uporabniki in člani` module.

Invoice issuing, formal invoice records, rent payment state, and accounting workflows must be handled by an external accounting or finance integration if needed. The administration interface may display invoice references and payment status but must not become the accounting system of record.

---

## 13. Info ekrani

Info ekrani must be managed as a separate module or integration.

Info-screen items must support:

- stable internal signage item ID
- title
- display surface
- status
- display text
- media reference
- URL
- start timestamp
- end timestamp
- related event
- related space
- priority
- internal note

Info-screen surfaces must support at least:

- lobby screen
- entrance screen
- room-door screen
- event announcement screen
- other

Info-screen status must support at least:

- draft
- scheduled
- active
- expired
- archived

Info-screen content may be assembled from MAG-NETic events, spaces, news, or manual content.

The info-screen module must control what appears on displays, where it appears, and when it appears.

Sodelavec accounts with event module access do not automatically receive info-screen module access.

---

## 14. Reporting

Reporting must be managed as a separate module.

Event reports must reference the related event.

Reports may also reference spaces, bookings, programmes, services, and campaigns where useful.

Event reports must support:

- stable internal report ID
- event reference
- actual participant count
- short narrative report
- KPI values
- resource-use note
- public photo references
- internal file references
- created timestamp
- updated timestamp

KPI values must support flexible label/value/note structures until the final KPI taxonomy is confirmed.

Reporting data must not be mixed into the public event content editor.

Reporting access is defined in `spec-users-access.md`.

---

## 15. Registrations And Ticketing

The platform must support event entry and registration metadata on events.

Registration and ticketing workflows may be handled by an external provider.

If the platform stores registration records, they must support:

- stable internal registration ID
- event reference
- name
- email
- phone
- organisation name
- number of participants
- note
- status
- created timestamp

Registration status must support at least:

- submitted
- confirmed
- waiting list
- cancelled

Payment processing, ticket inventory, ticket issuing, refunds, and attendee check-in may be owned by an external ticketing provider.

The administration interface must support external registration/ticket links on event records.

---

## 16. Media Integration

The administration interface must support media metadata and media relationships.

Media files must be stored through a separate file, media, DAM, or CDN service.

Media administration must support:

- image, video, and document references
- alt text
- captions
- credits
- public/internal visibility
- relationships to events, spaces, news, programmes, services, and organisations

The administration interface must not assume that the platform directly owns binary file storage.

---

## 17. Newsletter Integration

Newsletter may be handled by a third-party provider.

The administration interface must support newsletter integration metadata where needed:

- provider status
- signup form configuration
- list or segment references
- consent text
- double opt-in state where available
- unsubscribe or preference-centre link
- related news, events, or campaigns

Subscriber data ownership must be clear between the platform and newsletter provider.

---

## 18. Task And Finance Integrations

Task management must be handled by a separate module or integration.

Finance and invoice issuing must be handled by a finance module or external finance integration.

The administration interface may show task, invoice, or finance references linked to events, reservations, or reports.

Task and finance records must not be public content fields.

---

## 19. Integrations

The administration interface must support integration status and configuration views.

Integration records must support:

- integration name
- status
- owner
- data flowing in
- data flowing out
- required fields
- manual fallback
- operational notes

The platform must support structured API synchronization between core platform domains and connected integrations.

API synchronization must support at least:

- spaces
- reservations and bookings
- events
- users and memberships where required
- equipment where required
- payments, invoices, and finance references where required
- ticketing, ecommerce, physical access, signage, newsletter, and publishing integrations where required

API synchronization must use stable internal IDs and explicit ownership rules so related systems can exchange data without manually duplicating records.

Relevant integrations may include:

- media storage or DAM
- newsletter provider
- info-screen CMS
- event management provider
- ticketing or registration provider
- booking/calendar provider
- forms provider
- IAM or authentication provider
- physical access-control provider such as Prima
- MOC GitHub/MDX event publishing
- shop or ecommerce provider
- payment or billing provider
- analytics
- email sending
- finance or invoicing system
- Minimax accounting and invoicing system
- task-management system

---

## 20. Settings

The administration interface must support settings for:

- site name or public header label
- primary CTA label
- public contact details
- public social links
- route/content visibility
- integration feature flags
- basic module configuration

Settings access must be restricted to users with suitable administrative permissions.

---

## 21. Audit And Traceability

Audit requirements are defined in `spec-users-access.md`.

The administration interface must expose audit information where internal users need to understand who changed operational or public records and when.

Audit records must cover at least:

- content publication changes
- event changes
- reservation changes
- file visibility changes
- signage publication changes
- report changes
- registration or ticket-link changes
- user-group and access changes
- integration configuration changes
