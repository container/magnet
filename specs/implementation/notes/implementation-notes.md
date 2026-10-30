# MAG-NETic Platform — Implementation Notes

Purpose: shared technical notes for agents working on the prototype.

Status: living document

---

## 1. Current State

The project now contains a rough clickable React/Vite prototype for the public website, backend admin and an internal prototype dashboard.

Existing source documents:

- `specs/prototype/website-prototype-spec.md`
- `specs/prototype/website-ia.md`
- `specs/prototype/backend-prototype-ia.md`
- `specs/prototype/prototype-data.md`
- `questions-decisions/open-questions.md`
- `specs/platform/spec-admin.md`
- `specs/platform/spec-events.md`
- `specs/platform/spec-spaces.md`
- `specs/platform/spec-users-access.md`
- `specs/platform/spec-web.md`

Temporary seed data:

- `data/seed/spaces.json`

### Prototype Versus Platform Specs - 2026-08-12

The current React/Vite prototype is aligned with the finished platform specs as a Phase III concept and IA validation tool, not as a production implementation.

It currently demonstrates the main public website routes, space and event browsing, the rental inquiry concept, fake member access, admin navigation, combined reservation/calendar views, signage preview and basic integration-status thinking.

The finalized platform specs now define a broader target than the prototype covers. Production-scope requirements such as real authentication, user-group and module-based permissions, audit trails, public/internal file visibility, reporting, equipment administration, membership administration, registration/ticketing records, service records, organisation and people profiles, media/DAM ownership, external integrations and publishing/sync workflows remain specification-level requirements.

Treat the prototype as evidence for information architecture, content relationships and staff/user workflows. Do not treat it as complete coverage of `specs/platform/`.

---

## 2. How To Use This Document

Update this file when implementation work adds technical knowledge that future agents should know, such as:

- selected frontend stack
- setup and run commands
- folder structure
- route conventions
- component conventions
- local data-file structure
- styling approach
- testing or verification commands
- known constraints or temporary shortcuts

Keep notes concise and practical. Include only decisions that future implementation work needs to understand.

---

## 3. Pending Implementation Choices

These are not decided yet:

- deployment or preview approach

Settled choices:

- stack: React + Vite + TypeScript
- package manager: npm
- routing: React Router
- app shape: one shared prototype app with three surfaces
- public website routes live under `/`
- backend/admin routes live under `/admin`
- prototype-only dashboard routes live under `/prototype`
- data: local fake data in TypeScript files
- styling: low-fidelity wireframe UI with plain, simple layouts for both public website and backend admin

Current commands:

- install dependencies: `npm install`
- run local dev server: `npm run dev -- --host 0.0.0.0 --port 5174`
- build check: `npm run build`

Port note:

- `5173` was already occupied during implementation, so the current prototype was started on `5174`.

Current source structure:

```txt
src/
  App.tsx
  data.ts
  main.tsx
  styles.css
  types.ts
```

This is intentionally compact for V1. Split into folders only when the prototype becomes hard to change.

Admin detail layout convention:

- Admin record detail pages should use the event-detail template pattern.
- Use a plain `admin-list-head` header, without a surrounding panel frame.
- Use one main left column and one smaller right sidebar.
- Put the main content sections in the left column.
- Put status, slug, key metadata, publication controls, CTAs, and edit/save actions in the right sidebar.
- Detail pages should open in read mode by default.
- Editing should be entered through an explicit `Uredi` action and should switch the detail page into an edit form using the same two-column detail structure.
- Prototype edit controls may remain local and non-persistent unless product scope changes.

Relevant planning notes:

- `specs/prototype/website-ia.md`
- `specs/prototype/backend-prototype-ia.md`
- `questions-decisions/open-questions.md`
- `specs/platform/spec-spaces.md`
- `data/seed/spaces.json`

Static content admin pattern:

- The `Statična vsebina` prototype module uses a website-tree layout rather than a flat card grid.
- The left column is a public website tree with pages, nested pages and global content blocks.
- The right column changes by selected tree item.
- Static pages and reusable blocks show a local mock editor.
- Mixed pages show editable static intro/content blocks plus links to specialised modules.
- Module-owned public pages show an ownership/redirect panel with a shortcut to the correct admin module.
- Do not duplicate spaces, events, programmes or news records inside static content just because their public pages appear in the tree.

Programme-application event linking prototype pattern:

- The admin programme-application detail can link an existing event, remove that relationship, or create a new event with the programme application preselected.
- Creating a new event captures a title, date, time and primary space; the space/time selection is the initial reservation context for the event, while additional operational reservations remain on the event record.
- These prototype-only additions are stored in browser `localStorage` under `magnetic.prototype.programmeApplications` and `magnetic.prototype.events`, so they remain visible after navigation and refresh in the same browser.

Programme creation prototype pattern:

- The Programmes list has a `Dodaj nov program` CTA leading to `/admin/programi/nov`.
- The form creates a local browser-stored programme record under `magnetic.prototype.programmes` and opens its admin detail.
- A programme links to events and reservations; it does not hold a direct space relationship. Space selection belongs to the reservation or event workflow.

---

## 4. Platform Prototype Scope

This work prototypes how the whole MAG-NETic platform could work and look, not only the public website.

This is not a production platform. It is a thinking tool for defining:

- what DOM staff need to manage directly
- which parts should later use off-the-shelf tools
- what integration requirements those tools must satisfy
- how external systems can feel like one coherent admin workflow
- what open product, operational, data and permission questions remain

The prototype should expose the most important open questions needed to define a strong real-platform specification. That final specification should include requirements for any off-the-shelf tools used to build the platform, and requirements for integrating those tools into an admin experience that DOM staff can use easily.

The prototype should make the future platform spec better. It should expose the important decisions, not hide them behind polished UI.

Use `specs/prototype/backend-prototype-ia.md` for the current backend/admin module map.

Track unresolved questions in `questions-decisions/open-questions.md`, not inside specification or IA documents.

The first implementation should be one clickable React/Vite/TypeScript app that contains:

- public website prototype at `/`
- backend admin prototype at `/admin`
- internal prototype dashboard at `/prototype`

All surfaces should share local fake data so relationships between public content and admin modules are visible.

Keep the visual design intentionally wireframe-like for both surfaces. Use plain layouts, obvious boxes, simple typography, grayscale styling and minimal interaction polish unless the scope changes later.

Prototype typography hierarchy:

- Page title / main H1: `--type-page-title`, 32-48px.
- Admin page title: `--type-admin-title`, 26-36px.
- Section title / major panel title: `--type-section-title`, 24-32px.
- Card title / compact panel title: `--type-card-title`, 19-24px.
- Large supporting copy: `--type-body-large`, 17-20px.
- Body copy: inherited base text size.

Do not introduce one-off hero-scale headings above this hierarchy in the prototype. If a page needs stronger hierarchy, use layout, ordering, grouping, spacing, or content priority instead of increasing title size. Keep prototype UI and public-facing prototype pages grayscale unless a confirmed visual-design phase explicitly changes that constraint. Functional category colors are allowed where they clarify UX, currently for space categories and event categories. Photographs and renders may keep their natural colour because they are content, not decorative UI chrome. Do not use color as decorative branding on general content blocks.

The public website surface should present itself as the actual public website, even while it is implemented as a wireframe prototype. Do not expose labels such as `prototype`, `mock`, `example/primeri`, `TBD`, phase controls, admin-only reservations or implementation notes in public website UI. If content is generated from planning documents, phrase it as realistic public copy and keep uncertain facts general.

The public website header is constrained to the same max width as main content. The `Prostori` listing uses a bottom CTA block for `Najemi prostor`; it is not a tab or top-of-list control.

The `/skupnost` page has a subnavigation with dedicated public routes: `/skupnost/predstavitev`, `/skupnost/ljudje`, and `/skupnost/clanstvo`. The base `/skupnost` route opens the presentation page. Programmes are a separate main-navigation section at `/programi`, with detail pages at `/programi/:slug`. The shop entry point is in the footer at `/trgovina`.

The public footer includes utility blocks for contact/location, opening hours, newsletter signup, social links, logo/funding placeholders, a shop link, terms of use and privacy. Keep official external social URLs and logo assets as replaceable content once confirmed; do not invent final partner logo artwork in code. Newsletter signup is a provider-neutral prototype form until Brevo, Mailchimp or another provider is selected.

---

## 5. Git Workflow

Use git lightly as a checkpoint system for the rough prototype.

- work directly in the current branch unless the user asks otherwise
- avoid PR-style ceremony for early exploration
- commit only at meaningful checkpoints
- keep documentation updates practical and minimal

## 6. Prototype Stage Switching

The prototype should support two or three development levels, but the switch belongs only in the internal prototype dashboard at `/prototype`.

Known levels:

- V1: January 2027
- V2: 2028, after the MAG-NET hub spaces are built

Working assumptions:

- V1 should show the state where only spaces in the DOM building are available.
- V2 should be able to reveal future MAG-NET hub spaces and later-stage flows.

Keep this distinction explicit in content data, route behaviour, and page sections so the prototype dashboard can show different maturity states without duplicating the entire website.

Do not show the phase switch in the public website or DOM admin. Those surfaces should render the chosen baseline behaviour and feel like the real user-facing/admin products.

---

## 7. Prostori Implementation Notes

Use `specs/platform/spec-spaces.md` for space platform requirements. `data/seed/spaces.json` is the temporary source-derived inventory for current space data.

The `Prostori` section uses two main source/location groups:

- `DOM`
- `DOM HUB`

These groups can support the prototype stage switch:

- V1 / January 2027: 9 DOM spaces from `data/seed/spaces.json`
- V2 / 2028: 10 DOM HUB spaces from `data/seed/spaces.json`

Public space browsing should not default to a generic listing-and-filter pattern. There are few spaces, and each has a specific use and character, so the public website uses curated use/context groups:

- `Prireditve in vadba`
- `Skupnost in sodelo`
- `Ustvarjanje in razstave`

The prototype still supports a `?version=before-hub` display flag on `/prostori` for internal comparison and staged-prototype review. This flag is prototype-only and must not be treated as a separate final-platform IA variant in `spec-web.md`.

The DOM record previously labelled `Učilnica` is the director's office. It remains an internal/operator space and must not appear in the public `Prostori` overview, public rental/request selector, or member-facing allowed-space examples.

Admin space work now starts at `/admin/prostori-rezervacije` with the calendar/reservation view. The second visible sublink is `/admin/prostori-rezervacije/zahteve`, labelled `Povpraševanja za prostore`. The spaces catalogue lives at `/admin/prostori-rezervacije/sobe` for now, despite the legacy `sobe` path segment in the prototype route. It is a full-width, row-based admin table for scanning space, location, type, publication, access and related-record counts; selecting a row opens the separate space detail page. Space records in the TypeScript prototype data include `status` (`draft`, `published`, `archived`) so the admin module can show publication state; public space visibility uses `published` plus non-operator access. The space editor controls are still fake local UI and do not persist changes. The space inquiry workflow is intentionally shown under the spaces module rather than as a separate forms submenu item.

The Spaces module also includes the prototype-only equipment list at `/admin/prostori-rezervacije/oprema` and individual equipment detail pages at `/admin/prostori-rezervacije/oprema/:equipmentId`. Local `EquipmentItem` test records show item name, operational status, last-change date and assigned space, with basic text, status and space filters. The detail links back to the associated space. These views do not yet support editing, stock movements or equipment booking.

Admin users/access prototyping splits large registered-user management from internal admin access. `/admin/uporabniki` is labeled `Uporabniki in člani` and shows registered website users with quick table search, user/member tabs, one shared status (`aktiven`, `neaktiven`, or `član`), membership detail data, paid membership-fee records with invoice references, and manual membership editing on an existing registered user. `/admin/uporabniki/novi-clani` is a filtered member list sorted by latest membership application date and shows fee payment state as a compact chip next to the invoice reference. `/admin/sodelavci` is the menu label for internal collaborators and administrators, with detail/mock-add screens and binary module access toggles. Current collaborator/admin sample records in `prototype/src/data.ts` are intentionally limited to Tadej Perčič, Samo Seničar, one named technical lead and one named assistant lead. Do not add cafe employees or other role-diagram placeholder staff unless the user confirms them. `Spletna trgovina` is a TODO/future admin module, not an active access toggle in the current prototype.

Kavarna is handled separately under the cafe part of the site, not in `Prostori`. The cafe section can include:

- kavarna
- balkon
- gostinski vrt

Space renders are imported from `prototype/src/renders/` when a clear mapping exists. Current mappings include Velika dvorana, Mala dvorana, Vadbena dvorana - ples, Vadbena dvorana - orkester and Mala vadbena dvorana. Leave neutral placeholders for spaces without a confirmed render match.

Equipment is primarily an internal/admin management concern. Public space pages may show equipment available per room, but should not expose live equipment availability. Equipment cannot be booked or rented separately outside the building through the public platform. Internally, shared or limited equipment availability should be tracked so two events or reservations do not depend on the same equipment at the same time.

Public space-detail equipment is derived from the prototype equipment records assigned to that space, rather than the older free-text space field. The public view omits operational availability and other internal equipment data; selected items may carry only the public `po dogovoru` rental note. The technical-support link opens the room-use request form with the current space preselected and a technical-support context.

## 8. Website Page Behaviour

`Dogodki` uses list-first public event discovery with a calendar option. The public page shows published events for the selected month as image-backed event cards in `Seznam` mode, and as a monthly calendar grid in `Koledar` mode. Month changes use a dropdown in the event-list header. Public filters use the three public space/context groups from `Prostori`: `Prireditve in vadba`, `Skupnost in sodelo`, and `Ustvarjanje in razstave`. A featured event may be marked in prototype data with `featured: true`; the public listing shows it as a larger card. Selecting an event opens the event detail page directly.

Public event detail pages use a visual public-page structure: hero image with title and headline, date/time and clickable space, optional public notice, public tags, long public description, public resources, organiser/contact block and a ticket CTA. They must not show the admin-style `Ključni podatki` table or internal status. Prototype event data may include `headline`, `publicDescription`, `organiserContact`, `coOrganisers`, `partners`, `tags`, `publicNotice`, `publicFiles`, `livestreamUrl`, `ticketUrl` and `ticketCtaLabel` for this public display. Partner and co-organiser names belong in the organiser section. Public files and livestream links belong below the long description.

The public `Novice` page treats news as a mixed editorial stream aligned with `spec-web.md`: project news, stories, important announcements, open calls and press notices. Public listing and detail views show only `published` records; admin lists may also show `draft` and `archived` records. Prototype `NewsItem` categories are `projektna novica`, `zgodba`, `obvestilo`, `poziv` and `pr-obvestilo`. Open calls use the `poziv` category, may include `callDeadline`, and may attach a form flow that renders as a mock public form. Public detail pages may show automatic `Morda vas zanima tudi` suggestions from category/tag overlap rather than manually curated related-content fields.

Calendar prototype surfaces now cover three fake-data views:

- public website event listing at `/dogodki`, showing only published public events for the selected month
- admin calendar inside `/admin/prostori-rezervacije`, with `Teden`, `Mesec` and `Seznam` views. The route should show only the calendar surface: no selected-space detail panel, duplicate reservation list, booking-request approval desk, or create-reservation form below it. The admin space selector is vertical on the left and supports multi-choice filtering; changing checked spaces filters entries but must not change the active week/month. `Seznam` preserves the spreadsheet-like dates-by-spaces layout inspired by current event-manager Excel practice. It combines public events, reservations and internal blocks.
- member login at `/clani/prijava`; this is a fake member flow with no real authentication. Successful demo login writes `magnetic.prototype.signedIn` to local storage so the public header switches from `Prijava za člane` to `Moj DOM`.
- `Moj DOM` account routes live at `/moj-dom`, `/moj-dom/rezervacije`, `/moj-dom/programi`, `/moj-dom/programi/:applicationId`, `/moj-dom/karte`, `/moj-dom/karte/:ticketId`, `/moj-dom/komunikacija`, `/moj-dom/komunikacija/:requestId`, `/moj-dom/clanstvo`, and `/moj-dom/profil`.
- the member calendar now appears under `/moj-dom/rezervacije`; legacy `/clani/koledar` still renders the same reservations view. It demonstrates that members reserve only assigned spaces. The member calendar is space-first, lists allowed rooms vertically on the left, and supports `Teden` and `Mesec` views for the selected space. Period changes use left/right arrow controls instead of dropdowns.
- clicking a day in member/admin calendar views, or a room/date cell in the admin list view, opens a prototype modal form. These forms do not save data.

Current prototype user groups are `Gost`, `Registriran uporabnik`, `Sodelavec` and `Administrator`. Do not add production auth, booking approvals or persistent saves unless the scope changes.

The member/regular-user flow should not introduce a separate renter status model. Fake member access can show which spaces a member or organisation may request or reserve, while `Booking` records carry the status of specific room uses.

Room booking is split into two prototype concepts:

- `RoomUseRequest` records show MAG-NETic's possible approval journey before a room use is allowed.
- `Booking` records show calendar-side entries and statuses, standing in for the selected external booking/calendar solution.

Keep recurring rehearsal logic on the request and external-calendar handoff path. Do not build a native recurrence/calendar engine in the prototype unless the product scope changes.

Room-use requests should use generic file attachments for contracts or supporting material rather than separate contract-status or digital-signature fields. They should also capture whether the requester already has a Prima card. Do not add a site-visit step or an explicit rehearsal-rental-to-event handoff unless product scope changes.

`Predstavitev` content is generated from the current docs and local data: what DOM is, who it serves, house/spaces/programmes, cafe, partners, media/press, access, team and contact. Do not invent exact addresses, capacities, opening hours or accessibility claims until the source documents provide them.

## 9. Language Handling

The platform is Slovenian-first. Slovenian content remains the canonical source of truth.

Language choice is carried through the URL as a query flag, currently `?lang=sl` or `?lang=en`. Links should preserve this flag instead of changing route structure or duplicating pages.

Use the small typed dictionary in `src/i18n.tsx` for reusable interface chrome such as navigation labels, buttons, card links and empty states. Do not duplicate whole components, pages or data files for English.

Content fields stay plain Slovenian strings by default. Localize content fields only when a specific field truly needs an explicit authored translation; otherwise assume translation happens at render time by the future machine-translation layer.

For now, the visible language switcher belongs only in the public website header. The provider still wraps the whole app so other surfaces can preserve the URL flag and use dictionary strings later.

## 10. Source Reference: Analiza potreb

`sources/Analiza potreb (poročilo) (1).pdf` contains a source list of possible platform functionalities by category/user role under the heading `Podrobnejši seznam funkcionalnosti platforme`.

Location: PDF pages 71-72.

Treat this page as source/reference material for platform specification work. Do not copy every item into the final platform specs automatically; review the functionality categories one by one and translate accepted items into the relevant platform spec modules.

The current comparison against platform specs lives in `specs/implementation/source-audits/analiza-potreb-functionality.md`.

The same PDF contains a draft technical requirements section under `Osnutek tehničnih zahtev`.

Location: PDF pages 73-76, with timeline/procurement context on page 77.

The current comparison against platform specs lives in `specs/implementation/source-audits/analiza-potreb-technical-requirements.md`.

## 11. Specification Structure Decisions

Domain data requirements should live inside each domain platform spec, not in a separate platform-wide data requirements document.

Examples:

- event fields and event relationships belong in `spec-events.md`
- space fields and space relationships belong in `spec-spaces.md`
- user, account, user-group, module-access, and permission fields belong in `spec-users-access.md`
- public website content fields belong in `spec-web.md`

A central data-model document may be used later only as a lightweight glossary or relationship index if needed.

## 12. Event Archive Prototype Notes

Prototype event data supports the final platform event lifecycle status values: `draft`, `in coordination`, `offer`, `confirmed`, `published`, `cancelled`, `completed`, and `archived`.

The public event listing and calendar at `/dogodki` read only `published` events.

The public archive at `/dogodki/arhiv` reads only `archived` events.

Space and programme detail sections should show current published related events, not archived events.

## 13. Events Ticketing Solution

Settled event requirements live in `specs/platform/spec-events.md`.

Open questions for the external ticketing or event-registration provider live in `questions-decisions/events-ticketing.md`.

Working decision: creating a MAG-NETic platform profile during ticket purchase is desirable only if the selected ticketing provider enables it easily, out of the box. If custom integration is required to bring ticket buyers into the MAG-NETic user database, the first implementation should keep provider ticketing accounts/data separate from platform accounts.

Membership is final platform scope: the platform should track becoming a member, member tiers, shared user/member status, renewal/expiry state, and rent payment status where applicable. Invoice issuing and formal invoice history remain external accounting/finance integration concerns.

Merchandise/shop is final platform scope as a public capability, but the shop itself should use an external ecommerce solution independent of native MAG-NETic admin. The external shop may be integrated as a module or linked/embedded public flow. Provider selection should consider billing consolidation across shop, tickets, membership, rent payment, invoicing, and accounting so DOM does not end up with many separate billing systems.

Physical access control is final integration scope through Prima. MAG-NETic should provide the booking, membership, reservation, and permission context and send time-limited access grants or revocations to Prima; Prima owns the door/card access execution.

MOC GitHub/MDX event publishing is final integration scope. When an event is created or updated in MAG-NETic admin, the platform should push the corresponding public event data to the MOC GitHub repository as an MDX event file. Treat this as a headless publishing integration, not social-media publishing.

Structured API synchronization is final platform scope for core domains and integrations. Spaces, reservations/bookings, events, users/memberships, equipment, finance references, ticketing, ecommerce, physical access, signage, newsletter, and publishing integrations should exchange data through stable IDs and clear ownership rules rather than manual duplicate entry.

Architecture preference: the MAG-NETic core should be implemented as either custom development or an adaptable CMS/CRM-style core. Specialized workflows can use external providers. Avoid making a closed SaaS product the owner of core platform data or workflows if that would block required local integrations.

IAM means Identity and Access Management: the platform model for identity, authentication, user-group assignment, module access, and authorization. It may be implemented as a separate system or dedicated architecture component. Minimax remains an example accounting provider from source material, not a selected requirement unless later confirmed.

Coworking and residences are covered by the generic spaces, memberships, access rules, pricing, bookings/reservations, occupancy, and Prima access-control model. Do not create separate coworking or residence modules unless real operational rules no longer fit the generic model.

## 14. Prototype Data And Code Structure

Prototype data can live in local TypeScript files while the prototype remains a lightweight thinking tool.

Current compact source structure:

```txt
prototype/src/types.ts
prototype/src/data.ts
prototype/src/data/spaces.ts
```

If the prototype data grows enough to become difficult to maintain, split it into files such as:

```txt
prototype/src/types/content.ts
prototype/src/data/events.ts
prototype/src/data/spaces.ts
prototype/src/data/services.ts
prototype/src/data/organisations.ts
prototype/src/data/news.ts
prototype/src/data/tags.ts
prototype/src/utils/relationships.ts
```

Keep relationship helpers simple and local.

Useful helper examples:

```ts
getSpaceById(id: string)
getEventsBySpaceId(spaceId: string)
getOrganisationById(id: string)
getOrganisationsByIds(ids: string[])
getRelatedEvents(eventIds: string[])
getServicesByIds(serviceIds: string[])
```

Use `specs/prototype/prototype-data.md` for prototype sample-data targets and examples.


## 15. Prototype alignment approved on 2026-09-22

Authority: [final M3 specification](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0), read on 2026-09-22, and the user's explicit response to audit A04, B06, B07, B14 and C01. These decisions supersede older prototype stage/group notes. The audit remains a historical snapshot, not an instruction to implement its remaining recommendations.

- No DOM/HUB space division or launch-stage switch. `Space.sourceGroup` is removed from prototype data and UI. Existing record IDs remain stable for event and booking relationships.
- Public space lists, details, rental choices and member booking choices require `status === "published"`; member choices additionally retain their assigned-space restriction. Access category is not a substitute for publication status. Admin calendar and reservation creation include every space, regardless of publication or access category. Space editing remains the existing non-persistent prototype visualization.
- Admin main navigation follows the document's recommended menu exactly: Nadzorna plošča, Novice, Dogodki, Obrazci, Prostori in rezervacije, Programi, Statična vsebina, Mediji, Info ekrani. Auxiliary menu: Integracije, Uporabniki in člani, Sodelavci, Nastavitve. Newsletter is covered by Integracije, not a top-level item. The document describes Naloge separately but omits it from this menu; its implementation remains an allowed prototype gap, not a new placeholder module.
- `/admin/dogodki` opens the event list. `/admin/prostori` opens the reservation calendar; `/admin/prostori/rezervacije` the booking list; `/admin/prostori/sobe` the space catalogue. Events can still link to bookings.
- Assignable collaborator modules follow the document's access list. Oprema is part of spaces; Trgovina, Newsletter and Integracije are not standalone assignable content modules. Old stored module selections are filtered for display. No real authentication or authorization was added.
- Moj DOM order: Pregled, Rezervacije prostorov, Prijave na programe, Komunikacija, Članstvo, Profil, Karte za dogodke. Existing communication and ticket behavior is preserved.
- Canonical public routes now include `/predstavitev/mediji`, `/skupnost/programi/:slug`, `/skupnost/pridruzi-se`, `/skupnost/clanstvo` and `/moj-dom/prijava`. Old addresses redirect with query and fragment preserved. The old admin event-list and reservation-list addresses redirect as well. The URL tree determines the canonical sign-in route; the conflicting `/clani/prijava` prose remains supported through a redirect.
- User explicitly retained the other audited discrepancies, including shop, ticketing, rental-duration simulation and event visibility. Missing registration/search/other specification features are not added by this navigation correction. Membership requires a registered account; online membership creates one when needed (user clarification, no membership-flow rewrite in this change).

Validation: TypeScript check, focused React render checks for navigation/routes/publication, and browser inspection of the admin reservation form and legacy redirects. Production build passed. Published successfully to the existing Sites address on 2026-09-22 (version 7, source commit `83740af76d3beb7596fb94ce1d412cce49475abb`).


## 16. Public navigation update — 2026-10-12

User-confirmed navigation: Predstavitev, Prostori, Dogodki, Programi, Skupnost, Novice. Trgovina is linked from the footer, outside Skupnost.

Programme overview/detail routes are `/programi` and `/programi/:slug`. Programme cards, news links, application links, public previews and the static-content website tree use these routes. The earlier `/skupnost/programi`, `/skupnost/programi/:slug`, `/skupnost/:slug` programme aliases and `/skupnost/trgovina` redirect to their new destinations with query strings and fragments preserved. This supersedes the programme routes recorded in section 15.

The Google report is a separate editorial update: this task prepares proposed wording without editing the Google document.

Validation: `npm run build:local` passed (TypeScript and Vite). Browser checks passed for the primary menu, programme listing/detail, community submenu, footer shop link, and all four legacy redirects, including preserved language query and fragment.


### Presentation secondary navigation — 2026-10-12

User-approved: Predstavitev now has shared secondary navigation on its overview and all child pages: Predstavitev, Zgodovina DOMA, Kontakt, Dostop, Prenova, Kavarna, Partnerji, Mediji. A route layout with `Outlet` renders the submenu once and uses the existing language-preserving `NavLink`. Both presentation and community submenus share `.section-subnav` styling.

Zgodovina DOMA moved from Skupnost to `/predstavitev/zgodovina-doma`; the old `/skupnost/zgodovina-doma` redirects with query and fragment preserved. It also appears under Predstavitev in the admin website tree.

The user clarified that programme and shop teaser content is allowed on the Skupnost landing page; this does not put Programi or Trgovina back into its secondary navigation.
