# Technical Requirements Audit - Analiza potreb

Purpose: compare the draft technical requirements in `sources/Analiza potreb (poročilo) (1).pdf` against the current MAG-NETic platform specifications and implementation notes.

Status: implementation audit

Source location: PDF pages 73-76, under `Osnutek tehničnih zahtev`; page 77 contains timeline/procurement context.

Note: the PDF has no embedded selectable text, so this audit is based on rendered-page visual reading.

---

## 1. Source Summary

The source section describes three implementation approaches:

- full custom development
- existing CMS/ERP system such as Odoo, WordPress, or Drupal
- existing SaaS web solutions such as event, planning, or booking products

The source recommendation prefers:

- custom development as the primary option
- development using an adaptable CMS/CRM as the secondary option, especially a business-oriented CMS/CRM such as Odoo
- caution with closed SaaS tools because they may block specific local integrations

The architecture sketch includes:

- public MAG-NET Hub website
- admin dashboard / CMS / CRM backend
- IAM for identity and access management
- API synchronization of spaces, reservations, and events
- external ticketing provider such as Olaii or Eventbrite
- MOC GitHub / MDX event publishing integration
- physical access-card integration such as Prima
- accounting integration such as Minimax
- standalone webshop such as Shopify, WooCommerce, or PrestaShop

---

## 2. Alignment Summary

The current specs are broadly aligned with the technical draft.

Strong alignment:

- public website and admin/backoffice are separate platform surfaces
- users, roles, permissions, and access rules are specified
- ticketing, ecommerce, accounting, newsletter, media, and other provider boundaries are treated as integrations
- shop is external/provider-owned but may be linked or embedded publicly
- invoice/accounting workflows are external integrations
- platform should avoid fragmented billing providers
- custom or adaptable architecture is favoured over relying on closed SaaS for core workflows

Main gaps or partial areas:

- physical access-card integration is not yet explicit in platform specs
- MOC GitHub/MDX publishing integration is not yet explicit in platform specs
- the platform implementation approach is not yet captured as a settled decision
- IAM is covered functionally, but not named as a platform architecture component
- timeline/procurement dates from the source are not represented in specs, which is acceptable unless planning docs need them

---

## 3. Detailed Comparison

| Source item | Current coverage | Alignment | Suggested treatment |
| --- | --- | --- | --- |
| Full custom development as primary preferred approach | Implementation notes favour integrated platform thinking but do not settle final build approach | Partial | Keep as implementation decision/open procurement question until technology selection is made |
| Adaptable CMS/CRM as secondary preferred approach | Open questions mention CMS choice; admin specs support CMS/CRM-like backoffice | Partial | Keep as implementation/open procurement question |
| Closed SaaS as risky for core workflows | Specs already treat many external tools as integrations, not core owners | Aligned | No platform spec change needed |
| Public MAG-NET Hub website | `spec-web.md` | Aligned | No change |
| Admin dashboard / CMS / CRM backend | `spec-admin.md` | Aligned | No change |
| IAM / identity and access management | `spec-users-access.md`; authentication provider listed in integrations | Mostly aligned | Optionally name IAM explicitly in architecture/implementation notes |
| API sync of spaces, reservations, and events | Relationships and integrations are specified, but API sync is not explicit | Partial | Add integration/API sync requirement if accepted |
| Ticketing provider | `spec-events.md`, `spec-admin.md`, `open-questions-events-ticketing.md` | Aligned | No change |
| MOC GitHub / MDX event publishing | Not explicit; social publishing was marked external/integration only | Gap | Decide whether municipal-site event publishing is a required integration |
| Physical access-card system such as Prima | Space access permissions exist; physical access integration is not explicit | Gap | Decide whether physical access-control integration is final platform scope |
| Accounting system such as Minimax | Finance/invoice boundaries and references exist | Aligned | No change, provider name should remain non-final unless selected |
| Standalone webshop | `spec-web.md`, `spec-admin.md`, implementation notes | Aligned | No change |
| Timeline Q3 2026 - Q4 2027 | Not in platform specs | Acceptable omission | Keep timeline in planning/project management docs, not platform specs |

---

## 4. Arhitekturni Sklopi Detailed Audit

Source location: PDF pages 75-76.

The architecture block diagram and explanation identify a MAG-NET system core, public website, admin dashboard/CMS/CRM backend, IAM, and external integrations.

| Architecture block or flow | Source meaning | Current coverage | Alignment | Suggested treatment |
| --- | --- | --- | --- | --- |
| User to public website | Users browse, reserve, and submit inquiries through the public website | `spec-web.md`, `spec-spaces.md`, `spec-events.md` | Aligned | No change |
| Public website: news and information | Public website hosts public information and news | `spec-web.md` | Aligned | No change |
| Public website: inquiries and rental | Public users submit inquiries/rental requests | `spec-web.md`, `spec-spaces.md`, `spec-admin.md` | Aligned | No change |
| Public website: coworking | Public or authenticated users can interact with coworking offer/booking | Space access and member reservation flows exist, but coworking-specific settings are not named | Partial | Decide whether coworking should be a named reservation/membership configuration area |
| Public website: residence booking | Users can book/request residences | Spaces include residence type; reservation flow is generic | Mostly aligned | Decide whether residences need explicit booking rules or can remain generic space/reservation records |
| Public website to IAM | Website checks login and permissions | `spec-users-access.md` covers authentication/authorization functionally | Mostly aligned | Optionally name IAM as architecture component |
| Admin to IAM | Admin checks login and permissions | `spec-users-access.md`, `spec-admin.md` | Mostly aligned | Optionally name IAM as architecture component |
| Website/backend API sync | Website and backend synchronize spaces, reservations, and events by API | Added structured API synchronization requirement to `spec-admin.md` | Aligned | No change |
| Admin dashboard / CMS / CRM backend | Central operational system for locations, prices, rentals, coworking/residences | `spec-admin.md`, `spec-spaces.md`, membership updates | Mostly aligned | Consider naming coworking/residence settings if these are first-class operations |
| Admin: configure locations and prices | Admin manages locations/spaces and price information | `spec-spaces.md`, `spec-admin.md` | Aligned | No change |
| Admin: short-term and long-term rental management | Admin manages rental and reservation workflows | `spec-spaces.md`, `spec-admin.md`, `spec-users-access.md` | Aligned | No change |
| Admin: coworking/residence settings | Admin manages coworking and residence configuration | Covered indirectly through spaces, reservations, memberships, and access rules | Partial | Decide whether to add explicit coworking/residence configuration requirements |
| Ticketing provider | Public ticket purchase redirects or embeds ticketing provider | `spec-events.md`, `spec-admin.md`, ticketing open questions | Aligned | No change |
| MOC GitHub / MDX publishing | Admin event changes generate/push MDX files to MOC GitHub | Added to `spec-events.md`, `spec-admin.md`, implementation notes | Aligned | No change |
| Prima access-card system | Admin confirmation/reservation sends physical access commands to Prima | Added to `spec-users-access.md`, `spec-admin.md`, implementation notes | Aligned | No change |
| Minimax accounting | Transaction/customer/service data is sent to accounting for invoices | Finance/invoice integration covered generically; Minimax not selected as final provider | Mostly aligned | Keep provider generic unless Minimax is confirmed |
| Webshop | MAG-NET website routes users to standalone shop | `spec-web.md`, `spec-admin.md`, implementation notes | Aligned | No change |

Potential remaining decisions from this section:

1. Should IAM be named explicitly as the platform identity/access architecture component?
2. Should coworking configuration be explicit in the platform specs?
3. Should residence booking/configuration be explicit in the platform specs?
4. Should Minimax be named as the required accounting provider, or remain an example until selected?

---

## 5. Decision Pass

Decision keys:

- `A`: final platform scope; add/update platform spec
- `B`: out of scope
- `C`: external/integration only
- `D`: already covered; no platform spec change
- `E`: defer / keep as open question

| Gap | Decision | Notes |
| --- | --- | --- |
| Physical access-card integration | C | Final integration scope through Prima. MAG-NETic owns booking, membership, reservation, and permission context; Prima owns physical door/card access execution. Added to `spec-users-access.md`, `spec-admin.md`, and implementation notes. |
| MOC GitHub / MDX event publishing | C | Final integration scope as headless publishing, not social media. When an event is created or updated in MAG-NETic admin, public event data must be pushed to the MOC GitHub repository as an MDX event file. Added to `spec-events.md`, `spec-admin.md`, and implementation notes. |
| API synchronization between spaces, reservations, and events | A | Final platform scope. Added structured API synchronization requirements to `spec-admin.md` covering core domains and connected integrations, with stable IDs and explicit ownership rules. |
| Architecture preference | A | Implementation guidance. MAG-NETic core should be custom development or an adaptable CMS/CRM-style core, with external providers for specialized workflows. Avoid closed SaaS ownership of core platform data/workflows where it would block required local integrations. Added to implementation notes. |
| IAM as platform identity/access model | A | Final platform architecture scope. IAM means Identity and Access Management: the platform model for identity, authentication, role assignment, and authorization. It may be implemented as a separate system or dedicated component. Added to `spec-users-access.md`, `spec-admin.md`, and implementation notes. |
| Minimax as required provider | E | Deferred/provider selection. Keep Minimax as an example accounting provider from the source material, not a selected platform requirement unless later confirmed. |
| Coworking configuration | D | Already covered by generic spaces, memberships, access rules, pricing, bookings/reservations, occupancy, and Prima access-control model. Do not create a separate coworking module unless real operational rules no longer fit the generic model. |
| Residence booking/configuration | D | Already covered by generic spaces, memberships, access rules, pricing, bookings/reservations, occupancy, and Prima access-control model. Do not create a separate residence module unless real operational rules no longer fit the generic model. |

---

## 6. Recommended Next Decisions

All technical-requirements gaps from this audit have been reviewed. Remaining technology choices belong in implementation planning and provider selection.
