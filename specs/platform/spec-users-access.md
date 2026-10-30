# MAG-NETic Platform - Users, Access And Permissions Specification

Purpose: define platform user groups, account relationships, permission rules, ownership rules, and visibility boundaries across the MAG-NETic platform.

Status: platform specification

---

## 1. Scope

This specification covers:

- gost
- registriran uporabnik
- sodelavec
- administrator
- memberships and member status
- collaborator module access
- public website access
- administration access
- event ownership and DOM team assignment
- organiser contact handling
- space access
- file visibility
- signage access
- reporting access
- audit and traceability requirements

---

## 2. User Groups

The platform user model must use four core user groups:

- gost
- registriran uporabnik
- sodelavec
- administrator

System and integration actors may exist for audit and synchronisation purposes, but they are not a human user group.

### 2.1 Gost

Gost is any person using the public website without signing in.

Gost can:

- browse public website content
- view published public events
- view public space pages
- submit public contact or inquiry forms
- start membership enrolment where membership is offered
- start public reservation or participation requests where such forms are enabled

Gost cannot:

- access the administration interface
- access internal content-management or administration capabilities
- view internal files, internal notes, draft events, private bookings, reports, or operational data

### 2.2 Registriran Uporabnik

A registriran uporabnik is a non-DOM user with an account.

Registriran uporabnik can:

- access their own account area
- view their own reservations, applications, and submitted forms
- view their membership tier and active-member state where applicable
- view rent payment status where applicable
- submit and track requests where enabled
- use assigned or permitted space-booking flows

Registriran uporabnik cannot:

- access general DOM administration
- view other users' private submissions or reservations
- publish website content
- manage DOM users, permissions, reports, signage, or internal files

### 2.3 Sodelavec

A sodelavec is a DOM staff member or authorised collaborator represented in the platform users database.

Sodelavec can be assigned access to specific modules or records, including:

- event ownership
- event teams
- space management responsibilities
- content editing responsibilities
- reservation management responsibilities
- reporting responsibilities
- signage content responsibilities

Sodelavec access depends on assigned module access or explicit access grants. A sodelavec does not automatically have access to every administration module.

### 2.4 Administrator

An administrator is an internal user with broad platform administration rights.

Administrators can:

- manage users and permissions
- configure administration modules and settings
- manage or override records where operationally required
- access audit and reporting views where permitted by privacy rules

Administrator access must still respect privacy, audit, and integration boundaries.

### 2.5 System And Integration Actors

A system or integration actor represents an external service or automated process that creates, updates, imports, exports, or synchronises platform data.

System and integration actors must be identifiable in audit records and must not be shown as human DOM owners or team members.

---

## 3. Account Model

Identity and Access Management (IAM) is the platform model for account identity, authentication, user-group assignment, module access, and authorization.

IAM may be implemented as a separate system or a dedicated architecture component, but it must provide authorization checks across public account flows, administration, and integrations.

Every signed-in human account must have:

- stable internal user ID
- display name
- email address
- user group
- active or inactive state
- module access assignments where applicable

User IDs are internal identifiers and must not be used as public-facing labels.

Email address is the primary contact field for account communication and internal DOM user lookup.

Inactive users must not be able to sign in or perform actions, but their historical ownership, audit records, and references must remain visible where needed.

---

## 4. Collaborator Access

The platform must keep the user-group model simple and assign administration capability through module access.

Sodelavec accounts may receive access to one or more modules, including:

- editorial content
- events
- spaces
- reservations
- forms and submissions
- memberships
- signage
- reporting
- media and files
- integrations

Module access is binary at this stage: a user either has access to a module or does not have access to it.

Administrator accounts have broad administration access and can manage user permissions.

The platform may support additional explicit access grants for specific spaces, events, or records.

---

## 5. Website And Admin Surfaces

The platform must distinguish website access from administration access.

Website access covers:

- public website content
- public event and space browsing
- public forms and inquiry flows
- account area for registriran uporabnik accounts
- user-facing membership, request, reservation, application, or registration views where enabled

Published public website content must render the same for gost and registriran uporabnik. A registriran uporabnik may have a separate account area, but signing in must not change the public website browsing experience.

The signed-in account area must be called `Moj DOM`.

`Moj DOM` is the user's private profile and account area, not a public community profile.

When the user is signed in, the public website header must show `Moj DOM` instead of `Prijava za člane`.

`Moj DOM` must support these user-facing sections:

- `Pregled`
- `Rezervacije prostorov`
- `Prijave na programe`
- `Karte za dogodke`
- `Komunikacija`
- `Članstvo`
- `Profil`

`Pregled` must summarise the user's account status, membership state where applicable, open requests, upcoming reservations, programme applications, and recent communication.

`Rezervacije prostorov` must show the user's permitted spaces, space availability where enabled, the user's reservations, and reservation requests.

`Prijave na programe` must show the user's programme applications or participation records and their current statuses.

`Karte za dogodke` must show the user's tickets for upcoming events by default, with a user-facing archive view for past events.

Ticket detail views in `Moj DOM` must show the related event, event time, location, holder, ticket code or reference, and a QR-code representation where ticket scanning is supported.

Ticket status display must be user-facing and may combine payment and ticket state. For paid tickets, `čaka plačilo` must show as `čaka plačilo`; `plačano` must show the ticket state such as `veljavna`, `uporabljena`, or `preklicana`; and `povrnjeno` must show as `povrnjeno`. Free tickets must show only the ticket state and must not show a separate payment status.

`Komunikacija` must show the user's inquiries and submitted requests across supported topics, including space use, general contact, partnership, technical support, and other inquiry types.

`Članstvo` must show membership tier, membership status, validity, membership-fee or rent-payment state where applicable, and relevant external payment or accounting references where available.

`Profil` must show and allow management of the user's basic account details such as display name, email address, phone number, organisation, password or sign-in settings, and communication preferences where enabled.

Administration access covers:

- internal administration interface
- content and operations modules
- staff-facing reservation, event, space, membership, reporting, signage, media, integration, user, and settings workflows
- internal files, notes, audit information, and operational records

Access to the website does not imply access to admin.

Access to admin requires sodelavec or administrator access.

---

## 6. Permission Model

For the current platform specification, permissions are binary:

- has access
- does not have access

Access must be evaluated by user group and module.

For sodelavec accounts, access may also be limited to specific spaces, events, or records.

The platform does not currently require a separate permission matrix for view, create, edit, approve, publish, export, or settings actions.

When a user has access to a module, the module's own workflow, status rules, and visibility rules define what can be done inside that module.

Modules must not infer administrative access from public account access. A registriran uporabnik account does not grant administration access unless the user is explicitly assigned sodelavec or administrator access.

---

## 7. Memberships

The platform must support memberships for registriran uporabnik accounts where membership is part of DOM operations.

Membership requires an existing registered user account. Administrators may manually add or change membership data only on an existing registered user.

In the users and members administration view, user/member status must be represented as one shared status:

- `aktiven`: registered user with confirmed email and no active membership
- `neaktiven`: user is not confirmed or was manually deactivated
- `član`: registered user with active membership

Membership records must support at least:

- stable internal membership ID
- related user account
- membership tier
- start date
- end date or renewal date where applicable
- rent payment status where applicable
- external accounting or invoice reference where applicable
- internal notes
- paid membership-fee records where applicable

Membership tiers must be configurable.

The public membership form may be implemented using the general forms capability, but its result must be associated with the registered user and surfaced in the users and members administration view rather than as a separate membership-application work queue.

Public website content about membership must be managed as static website content.

Rent payment status must support at least:

- not applicable
- pending
- paid
- overdue
- externally managed

Invoice issuing and formal invoice records must be handled by an external accounting or finance integration.

---

## 8. Event Ownership And Team

Every event must have one required internal DOM owner.

The DOM owner must be a reference to a sodelavec or administrator account, not free text.

An event may have additional DOM team members. Additional team members must be stored as multiple references to sodelavec or administrator accounts.

The event owner is responsible for the event inside DOM workflows. The owner and team are separate from the external organiser.

Administrative views may show DOM owner and team member names and email addresses from the users database.

Public views must only show DOM contact details when the event visibility rules explicitly allow them.

---

## 9. Organiser Contact

The organiser is separate from DOM ownership.

The organiser name and organiser contact may be stored as free text.

Organiser contact visibility must be controlled independently from internal DOM ownership and team visibility.

---

## 10. Space Access

Spaces may have access rules that define which users or groups have access to specific non-public spaces or space groups.

Registriran uporabnik accounts may be granted access to specific spaces or space groups.

Space access rules must support regular users of a specific space without giving those users general administration access.

Regular users or long-term renters may be granted permission to request or reserve specific spaces or space groups. The operational status of their actual use must be tracked on the relevant inquiry, reservation, booking, membership, contract, or access-control record rather than through a separate renter-user status.

Physical access control must be handled through the Prima integration.

The platform must be able to send time-limited physical access grants, updates, and revocations to Prima when memberships, rentals, reservations, or operational access rules require them.

The platform owns the booking, membership, reservation, and permission context. Prima owns physical door/card access execution.

---

## 11. File Visibility

Event files must be separated into public files and internal files.

Public event files can include:

- public PDFs
- public photos
- public media assets
- other public downloadable or embeddable files

Internal event files can include:

- offers
- invoices
- contracts
- technical files
- production files
- internal correspondence or supporting documents

Public files may be referenced from public website content where the event visibility allows it.

Internal files must only be visible to users with explicit internal access for the relevant event, module, or administrative area.

Files are stored and delivered through a separate file or CDN service. The platform stores file references, metadata, ownership, and visibility rules.

---

## 12. Signage Access

Signage displays are managed as a separate module.

The signage module must be able to reference events, spaces, and published content.

Users with signage module access can use the signage-management workflow defined for that module.

Sodelavec accounts with event module access do not automatically receive signage module access unless their module access or explicit grants include it.

---

## 13. Reporting Access

Reporting is managed as a separate module.

Reports may reference events, spaces, bookings, attendance numbers, KPIs, and narrative reports.

Reporting data must not be editable from the public event page or basic event content editor unless the user has reporting module access.

Users with reporting module access can use the reporting workflow defined for that module.

---

## 14. Administration Access

The administration interface must require an authenticated sodelavec or administrator account with suitable access.

Administration access must be module-aware.

The administration interface must not expose modules, records, or files to users without the required access.

Users with limited administration access must see only the modules and records relevant to their module access.

---

## 15. Audit And Traceability

The platform must keep audit records for important administrative and operational actions.

Audit records must identify:

- actor user ID or integration ID
- action
- affected record type
- affected record ID
- timestamp
- relevant before and after state for material changes

Audit records must cover at least:

- user-group and access changes
- event creation and publication changes
- ownership and team changes
- booking and reservation changes
- file visibility changes
- signage publication changes
- reporting changes

Audit records must be retained independently from current user account state.

---

## 16. Privacy And Data Boundaries

The platform must avoid exposing internal identifiers, internal contact details, internal notes, internal files, and operational records on public surfaces.

Public-facing pages must use public labels, public names, and approved public contact details.

Internal account data must be visible only where required for DOM administration, ownership, permissions, reporting, or traceability.
