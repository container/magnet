# MAG-NETic Platform — Backend Prototype IA

Purpose: working IA and module notes for the prototype admin/backoffice app.

Status: draft

---

The backend/admin prototype lives inside the same React + Vite + TypeScript app as the public website, under `/admin`.

Keep the backend UI wireframe-like: simple layout, plain controls, visible content relationships, grayscale styling and minimal visual polish.

---

## 1. Proposed Backend Navigation

Use a simple admin navigation split into main work modules and auxiliary system modules.

Main menu:

- `Pregled`
- `Novice`
- `Dogodki`
- `Obrazci`
- `Prostori in rezervacije`
- `Programi`
- `Statična vsebina`
- `Mediji (integracija)`
- `Newsletter (integracija)`
- `Info ekrani (integracija)`

Aux menu:

- `Integracije`
- `Uporabniki in člani`
- `Sodelavci`
- `Nastavitve`

### Pregled

Admin dashboard for daily orientation.

Show:

- recent changes
- upcoming events
- upcoming bookings
- unresolved inquiries
- draft content waiting for review
- integration status placeholders

### Novice

News module for editorial updates, announcements, calls and press notices.

Includes:

- one editorial list with tabs or filters for `Novice`, `Pozivi`, `Obvestila` and `PR obvestila`
- create/edit news item with the same core fields used by the detail editor
- categories: `projektna novica`, `zgodba`, `obvestilo`, `poziv`, `pr-obvestilo`
- draft/published/archived states
- tags
- author
- photo labels or media references
- added public links
- call deadline for `poziv`
- attached form flow for `poziv` where public submissions are accepted
- preview

`Poziv` remains a news category with optional call-specific fields, not a separate admin module.

### Dogodki

Mock events module for public event content and event-production coordination.

The public website needs a simple event content model, but `DOM - Dogodek variable.xlsx` shows that DOM operations also need linked booking/reservation rows, setup instructions, required services, internal users, file references, signage, reporting, task integration and finance integration.

The real implementation may use an external event or production-management solution, but the prototype should show the expected admin experience and integration boundaries.

Use `specs/platform/spec-events.md` for the event platform requirements.

Includes:

- event list/calendar
- create/edit public event content
- date, time, location/space
- multiple dates/terms through linked booking/reservation rows where needed
- one required primary space per event
- additional/supporting spaces through linked booking/reservation rows where needed
- organiser/contact
- DOM responsible contact
- audience, type and tags
- event status
- registration/ticket/livestream links
- related programme or space
- publish/unpublish

Suggested event editor sections:

- `Osnovno`: name, type, field/topic, organiser, contacts, short/public descriptions
- `Termini in prostori`: public date/time, primary space, linked booking/reservation rows and booking notes
- `Objava in komunikacija`: public URLs, visual-material file refs, and linked signage items
- `Vstop`: free entry, ticket link, registration mode
- `Storitve in produkcija`: space use, equipment, technical support, front-of-house, security, catering, photo/video, communication support
- `Izvedbeni tim`: external organiser contact, required DOM owner user, additional DOM team users
- `Dokumenti`: public file refs and internal file refs
- `Poročanje`: actual attendance, short report, photos, KPI, resource use
- `Naloge`: task-manager integration placeholder

### Obrazci

Editable flow/form module.

This should cover:

- flow editor
- received inquiries/submissions inbox
- `Oddaj povpraševanje za prostor`
- contact form
- topic-specific contact flows
- event-related inquiries if needed
- programme participation inquiries if needed

Each flow should be editable enough to test:

- public title and intro
- steps
- fields
- required/optional fields
- topic routing
- recipient/contact owner
- confirmation message
- status labels
- internal notes

The submissions inbox should show:

- submitted flow
- submitted topic
- requester/contact details
- related space, event or programme if relevant
- assigned owner
- status: `novo`, `v obdelavi`, `čaka odgovor`, `zaključeno`, `arhivirano`
- internal notes
- next step

Prototype submissions do not need to send email or write to a real database, but the admin UI should show what would happen.

### Prostori in Rezervacije

Combined module for space content and room booking work.

Space content includes:

- list of spaces
- create/edit space content
- fields from `data/seed/spaces.json`
- renders/media for spaces
- rental notes, rules and accessibility notes
- V1 / V2 visibility
- preview of public space page

For spaces, use `data/seed/spaces.json` as the temporary source of truth for current seed records, and `specs/platform/spec-spaces.md` as the source of truth for platform requirements.

Booking backoffice includes:

- admin calendar inside `Prostori in rezervacije` with `Teden`, `Mesec` and `Seznam` views
- multi-choice room selector shown vertically on the left side of the admin calendar
- spreadsheet-like `Seznam` view, with dates as rows and selected spaces as columns
- combined visibility of public events, room reservations and internal blocks
- room-first booking calendar for inspecting one selected space
- day/week/month calendar view
- room filter
- booking list view
- create booking manually
- click on a day or room/date cell opens a prototype modal form for adding an event, reservation or internal block
- detect and display time conflicts
- statuses: `povpraševanje`, `začasno`, `potrjeno`, `zavrnjeno`, `preklicano`, `blokirano`
- booking source: manual, inquiry, event, internal block
- link booking to space, event, programme or inquiry where relevant
- internal notes

Do not implement payments, contracts, live availability sync or real calendar integrations in the prototype.

### Programi

Programme module for the separate public `Programi` section at `/programi`.

Primary admin views:

- `Seznam`
- `Prijave na programe`

Includes:

- DOM Šola
- DOM Zbornica
- DOM Inkubator dogodkov
- DOM Srečališče skupnosti
- DOM Rezidenca
- DOM Galerija
- programme detail content
- programme application and participant records
- generic programme application status
- selected programme application linked to a related event where relevant
- related events, spaces and inquiries

For v1, this is not an account/member directory and it does not manage public organisation or person detail pages. Public organisation/person editorial cards and lists are part of the `Skupnost` website flow, but their final admin ownership belongs to editorial/community content administration rather than user accounts.

### Statična Vsebina

CMS-like module for static website content that is not managed by a more specific module.

The prototype should present this module as a website structure map, not as a flat bucket of pages. Use a left-column tree of public website pages and global content blocks. Selecting a tree item opens the relevant context in the right column.

The right column may show:

- an editable static-content form, when the selected page or block is owned by `Statična vsebina`
- a mixed-page form plus module links, when the page combines static introductory copy with dynamic content from other modules
- a module redirect/shortcut panel, when the selected public page is owned by a specialised module

The tree should make ownership visible for editors. It should help staff understand where each public website page lives without moving specialised records into the static-content module.

Includes:

- presentation pages for DOM
- `Predstavitev` sections
- `Predstavitev / Prenova`
- `Predstavitev / Kavarna`
- `Predstavitev / Partnerji`
- `Predstavitev / Media`
- `Predstavitev / Dostop`
- `Predstavitev / Kontakt`
- public page copy
- cafe content under `Predstavitev`
- reusable content blocks
- footer/contact/editorial snippets

Do not put spaces here. Spaces belong in `Prostori in rezervacije`.

Do not put events, programmes or news records here. Their public listing and detail pages may appear in the website tree as module-owned pages, but the records themselves belong in `Dogodki`, `Programi` and `Novice`.

### Mediji (Integracija)

Media integration module for prototype assets and future external media handling.

Includes:

- renders
- placeholder images
- documents or floor plans later
- alt text
- captions/credits
- relation to spaces, news, events and programmes

Integration topics to clarify:

- where media files live in the real implementation
- whether the CMS owns media or an external DAM/file store is used
- required metadata
- reuse of the same media across public pages and modules

### Newsletter (Integracija)

Newsletter will likely use a third-party provider.

Prototype topics to clarify:

- provider selection requirements
- embedded signup form vs API integration
- double opt-in
- GDPR consent copy and storage
- topics/lists/segments
- unsubscribe and preference centre
- where subscriber data lives
- whether news/events/programmes can trigger campaigns
- whether the admin app needs campaign status readback
- webhook or sync requirements

In the prototype, show newsletter integration as a connected external service, not as a full email marketing product.

### Info ekrani (Integracija)

Info ekrani are an external or dedicated CMS for content shown on two large monitors fixed above the main hall entrance.

The prototype should show what DOM staff need to control or preview, not implement a full signage platform.

Screen content should include:

- what is happening right now in the main hall
- programme rolling list
- latest news pager

Integration topics to clarify:

- whether info-screen content is edited directly in the external display CMS or assembled from MAG-NETic content
- how main hall events/bookings feed the `happening now` view
- which events appear in the rolling programme list
- which news items appear in the latest news pager
- update frequency and fallback state when nothing is happening
- manual override for urgent messages or special events
- screen layout constraints for the two fixed monitors
- preview inside the admin prototype

In the prototype, show Info ekrani as a connected external service with a simple preview and content-source mapping.

### Uporabniki in člani

Prototype-only user and access-control module.

The admin prototype uses one `Uporabniki in člani` module for registered website users and membership state. It does not include a separate membership applications queue.

The module should show:

- one list of registered users and members
- top tabs for users, members, and inactive records
- a `Novi člani` subpage with only members, sorted by latest membership application date first
- one status in the list: `aktiven`, `neaktiven`, or `član`
- payment state in member lists as a compact status chip with invoice reference where available
- user detail with membership type, signup date, start date, end date, and internal membership note
- paid membership-fee records with invoice reference in user detail
- one edit form where membership can be manually changed for an existing registered user

Current public user rights are split into four simplified user groups:

- `Gost`: reads public content, sees the public event calendar and can use public contact, inquiry, newsletter, or event registration flows where available
- `Registriran uporabnik`: signs in through an account-facing website flow and can view or manage their own requests, memberships, applications, and permitted reservations
- `Sodelavec`: has access only to assigned administration modules or records, such as events, spaces, reservations, submissions, signage, reporting, or memberships
- `Administrator`: manages users, permissions, settings, and broad administration workflows

For v1 prototype, assume gost users:

- can view published public content
- can submit mock contact/inquiry forms
- can subscribe to newsletter through the third-party flow
- do not have accounts
- cannot edit content
- cannot book spaces directly
- cannot access the backend

Keep permissions simple and visible. The prototype should test which spaces registriran uporabnik accounts can book and which actions sodelavec or administrator accounts need, not implement production-grade access control.

### Integracije

Auxiliary module for mapping external systems and integration requirements.

Track external or future systems such as:

- media storage or DAM
- newsletter provider
- info ekrani
- event management provider
- booking/calendar provider
- forms provider
- authentication provider
- analytics
- email sending

For each integration, show:

- status
- owner
- data flowing in
- data flowing out
- required fields
- manual fallback
- open questions

### Nastavitve

Prototype settings.

Includes:

- site name/header label
- primary CTA label
- contact details
- feature flags for external modules
- basic route/content visibility

Prototype phase switching is not part of DOM admin. It lives only in the internal prototype dashboard at `/prototype`.

## 2. Backend Route Sketch

Suggested route structure:

```txt
/admin
/admin/novice
/admin/dogodki
/admin/obrazci
/admin/obrazci/tokovi
/admin/obrazci/oddaje
/admin/prostori-rezervacije
/admin/prostori-rezervacije/koledar
/admin/prostori-rezervacije/rezervacije
/admin/programi
/admin/staticna-vsebina
/admin/mediji
/admin/newsletter
/admin/signage
/admin/integracije
/admin/uporabniki
/admin/nastavitve
```

Keep routes simple. The point is to test module boundaries and admin workflows.
