# Functionality Audit - Analiza potreb

Purpose: compare the functionality list in `sources/Analiza potreb (poročilo) (1).pdf` against the current platform specifications.

Status: implementation audit

Source location: PDF pages 71-72, under `Podrobnejši seznam funkcionalnosti platforme`.

Note: the PDF has no embedded selectable text, so this audit is based on rendered-page visual reading.

---

## 1. Summary

The current platform specs cover the core public website, events, spaces, reservations, forms, admin modules, users/access, signage, reporting, and external ticketing boundaries.

The main gaps or partial areas from the source list are:

- social-media publishing workflow
- public event filtering
- registered-user event history
- public price list for spaces/equipment
- project/application tracking as a distinct module
- equipment reservation and equipment availability as a distinct workflow
- full ticket sales/payment/PDF ticket/check-in flow
- memberships, membership renewal, rent payment, rent invoices
- merchandise/product sales and inventory
- whether a user profile is required for event signup or ticket purchase

---

## 2. Detailed Comparison

This table records the initial comparison made before the decision pass. The decision pass below records accepted scope decisions and resulting specification updates.

| Source category | Functionality | Current coverage | Status | Suggested target |
| --- | --- | --- | --- | --- |
| Informiranje / o dogodkih | Admin event entry | `spec-events.md`, `spec-admin.md` | Covered | none |
| Informiranje / o dogodkih | Social-media event publishing | `spec-events.md` supports external/social links; no publishing workflow | Partial | `spec-admin.md` or integration note |
| Informiranje / o dogodkih | Public event calendar | `spec-events.md`, `spec-web.md` | Covered | none |
| Informiranje / o dogodkih | Public event filtering | Prototype currently defers filters; platform specs mention tags but not event filters explicitly | Partial | `spec-events.md` / `spec-web.md` |
| Informiranje / o dogodkih | Registered user: visited events | User account/event history not specified as a durable requirement | Gap | `spec-users-access.md` and `spec-events.md` |
| Informiranje / o prostorih | Admin content entry for spaces | `spec-spaces.md`, `spec-admin.md` | Covered | none |
| Informiranje / o prostorih | Public list of spaces | `spec-spaces.md`, `spec-web.md` | Covered | none |
| Informiranje / o prostorih | Public list of available equipment | Equipment exists in `spec-spaces.md`; public equipment list is not explicit | Partial | `spec-spaces.md` / `spec-admin.md` |
| Informiranje / o prostorih | Public price list | Rental conditions exist; price list is not explicit | Gap | `spec-spaces.md` / `spec-admin.md` |
| Informiranje / o projektih | Admin content entry for projects/programmes | `spec-web.md`, `spec-admin.md` programmes/editorial admin | Covered | none |
| Informiranje / o projektih | Admin form creation | `spec-admin.md` forms and submissions | Covered | none |
| Informiranje / o projektih | Admin tracking of project applications | Submissions exist; project applications are not a distinct module | Partial | `spec-admin.md` or separate applications spec later |
| Informiranje / o projektih | Public project/programme pages | `spec-web.md` programmes | Covered | none |
| Informiranje / o projektih | Public project applications | Inquiries/forms exist; application workflow not explicit | Partial | `spec-web.md` / `spec-admin.md` |
| Informiranje / o projektih | Registered user: my applications | Registered user can view own submissions generally, but project applications are not explicit | Partial | `spec-users-access.md` / `spec-admin.md` |
| Informiranje / kontaktiranje | Admin receives messages | `spec-admin.md` submissions inbox | Covered | none |
| Informiranje / kontaktiranje | Public contact list | `spec-web.md` contact information | Covered | none |
| Informiranje / kontaktiranje | Public contact form | `spec-web.md` inquiries | Covered | none |
| Rezervacije / prostorov | Admin space entry | `spec-spaces.md`, `spec-admin.md` | Covered | none |
| Rezervacije / prostorov | Admin all reservations | `spec-admin.md` reservations | Covered | none |
| Rezervacije / prostorov | Admin reservation entry | `spec-admin.md` reservations | Covered | none |
| Rezervacije / prostorov | Public space overview | `spec-spaces.md`, `spec-web.md` | Covered | none |
| Rezervacije / prostorov | Public space filtering | Space type/tags exist; filtering is not explicit | Partial | `spec-spaces.md` / `spec-web.md` |
| Rezervacije / prostorov | Public inquiry form for spaces | `spec-spaces.md`, `spec-web.md` | Covered | none |
| Rezervacije / prostorov | Registered user: view my reservations | `spec-users-access.md`, `spec-admin.md` | Covered | none |
| Rezervacije / prostorov | Registered user: reserve selected spaces | `spec-users-access.md`, `spec-admin.md` | Covered | none |
| Rezervacije / opreme | Admin equipment entry | Equipment exists as space/inventory concept; separate equipment module not explicit | Partial | `spec-admin.md` |
| Rezervacije / opreme | Admin equipment availability | Bookable/shared equipment availability is mentioned but not fully specified | Partial | `spec-admin.md` |
| Rezervacije / opreme | Admin equipment reservation | Not specified as its own workflow | Gap | `spec-admin.md` |
| Rezervacije / opreme | Public/registered equipment reservation | Source marks this as not available; current specs do not expose it publicly | Covered | none |
| Nakupi in plačila / vstopnice | Admin ticket sales | External ticketing boundary exists; full admin sales workflow not specified | Partial | `spec-admin.md`, `open-questions-events-ticketing.md` |
| Nakupi in plačila / vstopnice | Multiple payment methods | External provider question exists; not platform-owned | Partial | `open-questions-events-ticketing.md` |
| Nakupi in plačila / vstopnice | Sending tickets to buyers | External provider boundary; not specified locally | Partial | `open-questions-events-ticketing.md` |
| Nakupi in plačila / vstopnice | Ticket check at event | Open ticketing question covers check-in | Partial | `open-questions-events-ticketing.md` |
| Nakupi in plačila / vstopnice | Public ticket purchase | Event ticket link/registration link covered; full checkout external | Partial | `spec-events.md`, `spec-admin.md` |
| Nakupi in plačila / vstopnice | Public PDF ticket receipt | Not specified except as provider responsibility | Gap/External | `open-questions-events-ticketing.md` |
| Nakupi in plačila / vstopnice | Registered user: my events/tickets | User account event/ticket area not specified clearly | Gap | `spec-users-access.md`, `spec-events.md` |
| Nakupi in plačila / članstva/najemine | Admin membership overview | Not specified | Gap | new membership/admin requirement if needed |
| Nakupi in plačila / članstva/najemine | Public membership payment/enrolment | Not specified | Gap | new membership/payment requirement if needed |
| Nakupi in plačila / članstva/najemine | Registered membership renewal | Not specified | Gap | new membership/payment requirement if needed |
| Nakupi in plačila / članstva/najemine | Membership expiry reminder | Not specified | Gap | new membership/payment requirement if needed |
| Nakupi in plačila / članstva/najemine | Rent payment | Not specified as user-facing payment workflow | Gap | `spec-admin.md` or finance spec if needed |
| Nakupi in plačila / članstva/najemine | Rent invoice overview | Finance references exist, but renter invoice portal is not specified | Gap | `spec-admin.md` or finance spec if needed |
| Nakupi in plačila / izdelki/merch | Admin product/pricing entry | Not specified | Gap | commerce/merch module if needed |
| Nakupi in plačila / izdelki/merch | Admin stock overview | Not specified | Gap | commerce/merch module if needed |
| Nakupi in plačila / izdelki/merch | Admin sales management | Not specified | Gap | commerce/merch module if needed |
| Nakupi in plačila / izdelki/merch | Public/registered purchase option | Not specified | Gap | commerce/merch module if needed |
| Uporabniški račun / rezervacije prostorov | Admin occupancy calendar | `spec-admin.md` reservations | Covered | none |
| Uporabniški račun / rezervacije prostorov | Admin reservations for all spaces | `spec-admin.md` reservations | Covered | none |
| Uporabniški račun / rezervacije prostorov | Admin reservation approval | `spec-admin.md` reservation statuses; `spec-users-access.md` permissions | Covered | none |
| Uporabniški račun / rezervacije prostorov | Registered occupancy calendar | Authenticated occupancy views are allowed where visibility rules allow | Covered | none |
| Uporabniški račun / rezervacije prostorov | Registered selected-space reservation | `spec-users-access.md`, `spec-admin.md` | Covered | none |
| Uporabniški račun / rezervacije prostorov | Registered my reservations | `spec-users-access.md`, `spec-admin.md` | Covered | none |
| Uporabniški račun / prijave na dogodke | Admin content entry | `spec-events.md`, `spec-admin.md` | Covered | none |
| Uporabniški račun / prijave na dogodke | Public event registration; profile required? | Working decision: create/sync a MAG-NETic profile during ticket purchase only if the provider supports it easily out of the box; otherwise keep ticketing-provider accounts/data separate | Conditional decision | `open-questions-events-ticketing.md` |
| Uporabniški račun / prijave na dogodke | Registered upcoming events | Not explicit | Gap | `spec-users-access.md`, `spec-events.md` |
| Uporabniški račun / prijave na dogodke | Registered attended events | Not explicit | Gap | `spec-users-access.md`, `spec-events.md` |

---

## 3. Decision Pass

Decision keys:

- `A`: final platform scope; add/update platform spec
- `B`: out of scope
- `C`: external/integration only
- `D`: already covered; no platform spec change
- `E`: defer / keep as open question

| Line | Functionality | Decision | Notes |
| --- | --- | --- | --- |
| 1 | Admin event entry | D | Already covered in `spec-events.md` and `spec-admin.md`; no platform spec change needed. |
| 2 | Social-media event publishing | C | External/integration only. Platform may store social/post links or metadata, but should not own social-media publishing workflows. |
| 3 | Public event calendar | D | Already covered in `spec-events.md` and `spec-web.md`; no platform spec change needed. |
| 4 | Public event filtering | A | Final platform scope. Added explicit event filtering requirements to `spec-events.md` and `spec-web.md`; prototype may still omit filters while event volume is low. |
| 5 | Registered user: visited events | E | Deferred. This likely requires integration with event booking/ticketing software and is probably beyond first platform scope. |
| 6 | Admin content entry for spaces | D | Already covered in `spec-spaces.md` and `spec-admin.md`; no platform spec change needed. |
| 7 | Public list of spaces | D | Already covered in `spec-spaces.md` and `spec-web.md`; no platform spec change needed. |
| 8 | Public list of available equipment | E | Deferred as a standalone public feature. Public pages may show equipment available per room, but not live equipment availability; equipment management remains internal/admin and equipment cannot be booked or rented separately outside the building. |
| 9 | Public price list | A | Final platform scope. Added public pricing/price-list requirements to `spec-spaces.md`. |
| 10 | Admin content entry for projects/programmes | D | Already covered in `spec-web.md` and `spec-admin.md`; no platform spec change needed. |
| 11 | Admin form creation | D | Already covered in `spec-admin.md` forms/submissions; no platform spec change needed. |
| 12 | Admin tracking of project applications | A | Final platform scope. Added application tracking requirements to `spec-admin.md` and linked application flows to `spec-web.md`. |
| 13 | Public project/programme pages | D | Already covered in `spec-web.md`; no platform spec change needed. |
| 14 | Public project applications | D | Covered by programme/project application flows in `spec-web.md`; no additional platform spec change needed. |
| 15 | Registered user: my applications | D | Already covered in `spec-users-access.md` for users viewing their own applications and submitted forms; no platform spec change needed. |
| 16 | Admin receives messages | D | Already covered by forms/submissions inbox in `spec-admin.md`; no platform spec change needed. |
| 17 | Public contact list | D | Already covered in `spec-web.md`; no platform spec change needed. |
| 18 | Public contact form | D | Already covered in `spec-web.md` and `spec-admin.md`; no platform spec change needed. |
| 19 | Admin space entry | D | Already covered in `spec-spaces.md` and `spec-admin.md`; no platform spec change needed. |
| 20 | Admin all reservations | D | Already covered in `spec-admin.md` reservations; no platform spec change needed. |
| 21 | Admin reservation entry | D | Already covered in `spec-admin.md` reservations; no platform spec change needed. |
| 22 | Public space overview | D | Already covered in `spec-spaces.md` and `spec-web.md`; no platform spec change needed. |
| 23 | Public space filtering | E | Deferred. There is a limited number of spaces, and each has a specific use; the public website should solve space presentation through careful IA/page structure rather than generic listing and filters. Decide final organisation during the web prototype update. |
| 24 | Public inquiry form for spaces | D | Already covered by the rental/request flow in `spec-spaces.md`; no platform spec change needed. |
| 25 | Registered user: view my reservations | D | Already covered in `spec-users-access.md` and `spec-admin.md`; no platform spec change needed. |
| 26 | Registered user: reserve selected spaces | D | Already covered for authenticated/member reservation flows; no platform spec change needed. |
| 27 | Admin equipment entry | A | Final platform scope. Added internal equipment administration requirements to `spec-admin.md`; public pages may still show only room-level equipment information. |
| 28 | Admin equipment availability | A | Final platform scope. Added internal equipment availability tracking so staff can detect conflicts when two events or reservations need the same limited equipment. |
| 29 | Admin equipment reservation | A | Final platform scope. Added explicit admin ability to reserve or block shared equipment against events, reservations, or internal operational use. |
| 30 | Public/registered equipment reservation | B | Out of scope. Equipment cannot be booked or rented separately outside the building through the public platform. |
| 31 | Admin ticket sales | C | External/integration only. Admin may store ticketing links/configuration, but full ticket-sales workflow belongs to the selected ticketing provider. |
| 32 | Multiple payment methods | C | External/integration only. Payment-method support belongs to the selected ticketing/payment provider. |
| 33 | Sending tickets to buyers | C | External/integration only. Ticket delivery belongs to the selected ticketing provider. |
| 34 | Ticket check at event | C | External/integration only. Check-in should belong to the selected ticketing/check-in provider, with possible reporting import later. |
| 35 | Public ticket purchase | C | External/integration only. Public event pages may link to or embed provider checkout, but the platform does not own checkout. |
| 36 | Public PDF ticket receipt | C | External/integration only. PDF ticket issuing and delivery belong to the selected ticketing provider. |
| 37 | Registered user: my events/tickets | E | Deferred. This depends on ticketing provider integration and account/profile sync. |
| 38 | Admin membership overview | A | Final platform scope. Added membership overview and management requirements to `spec-admin.md`. |
| 39 | Public membership payment/enrolment | A | Final platform scope for enrolment and member state. Payment/accounting execution may be external, but the platform must support the becoming-a-member flow and membership tier/status data. |
| 40 | Registered membership renewal | A | Final platform scope. Membership records must support renewal/end dates and membership status. |
| 41 | Membership expiry reminder | A | Final platform scope where notification capability is available; added to membership administration as a supported reminder/trigger. |
| 42 | Rent payment | A | Final platform scope as member/renter payment status. Actual payment processing and accounting remain external. |
| 43 | Rent invoice overview | C | External/integration only. Rent invoices and all other formal invoices belong to an external accounting solution, with platform references where needed. |
| 44 | Admin product/pricing entry | C | External/integration only. Merchandise/shop is in scope, but catalogue and pricing should be owned by the selected external ecommerce solution rather than native admin. |
| 45 | Admin stock overview | C | External/integration only. Stock should be owned by the selected ecommerce provider, with optional integration/module visibility later. |
| 46 | Admin sales management | C | External/integration only. Sales, orders, fulfilment, refunds, and receipts should be owned by the selected ecommerce provider. |
| 47 | Public/registered purchase option | C | External/integration only. Public website may link to or embed an external shop; the platform should not own checkout. |
| 48 | Admin occupancy calendar | D | Already covered in `spec-admin.md` reservations/calendar; no platform spec change needed. |
| 49 | Admin reservations for all spaces | D | Already covered in `spec-admin.md` reservations; no platform spec change needed. |
| 50 | Admin reservation approval | D | Already covered through reservation statuses and permissions; no platform spec change needed. |
| 51 | Registered occupancy calendar | D | Already covered where authenticated visibility rules allow it; no platform spec change needed. |
| 52 | Registered selected-space reservation | D | Already covered by member/assigned-space booking flows; no platform spec change needed. |
| 53 | Registered my reservations | D | Already covered in user account and reservation specs; no platform spec change needed. |
| 54 | Admin content entry for event signup | D | Already covered by event/admin content entry requirements; no platform spec change needed. |
| 55 | Public event registration; profile required? | C | Conditional external-provider decision. Create/sync a MAG-NETic profile during ticket purchase or event registration only if the selected provider supports it easily out of the box. |
| 56 | Registered upcoming/attended events | E | Deferred. Account-level event history depends on ticketing/registration integration and account/profile sync. |

---

## 4. Recommended Resolution Order

1. Decide whether payment/commerce providers can be consolidated across ticketing, shop, membership, rent payment, invoicing, and accounting.
2. Confirm whether the selected ticketing provider supports out-of-the-box MAG-NETic profile creation or account sync during purchase.
