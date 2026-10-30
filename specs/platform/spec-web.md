# MAG-NETic Platform - Web And Public Content Specification

Purpose: define platform requirements for the public website, editorial content, services, programmes, community profiles, news, media, tags, pages, and inquiries.

Status: platform specification

---

## 1. Scope

This specification covers:

- public website navigation
- public editorial pages
- services and support content
- programmes
- organisations and public community profiles
- people profiles
- news and stories
- tags and taxonomy
- media references
- contact and inquiry forms
- public content relationships
- publication and visibility requirements

Events are defined in `spec-events.md`.

Spaces are defined in `spec-spaces.md`.

Programme records, public programme pages, and programme participation flows are defined in `spec-programmes.md`.

Users, accounts, roles, and permissions are defined in `spec-users-access.md`.

---

## 2. Public Navigation

The public-facing website brand and header label must be `DOM`.

`MAG-NETic`, `CUD Celje`, `Mestna občina Celje`, partner, funder, and operator names may appear where they are contextually required, but they must not replace `DOM` as the primary public header identity.

The public website must support primary navigation for:

- Predstavitev
- Prostori
- Dogodki
- Programi
- Skupnost
- Novice

The public header must support a member/account entry point labelled `Prijava za člane` where the member flow is enabled and the user is not signed in.

When a user is signed in, the public header account entry point must be labelled `Moj DOM` and must link to the user's account area.

The public website must also provide a prominent rental/request CTA labelled `Najemi prostor` from relevant public entry points such as the home page and the `Prostori` section.

The `Najemi prostor` CTA must lead to an explanatory rental/request page before the user reaches an inquiry or request form.

`Novice` is a primary public navigation item and may also be linked from page sections, cards, footer links, or related-content areas.

`Kontakt` belongs under `Predstavitev`, not as a primary navigation item.

`Programi` is a separate primary navigation section at `/programi`, with programme detail pages at `/programi/:slug`.

`Trgovina` is accessible from the footer and is not part of the primary navigation or the `Skupnost` secondary navigation.

The public website sitemap must support at least:

- home page
- `Predstavitev`
- `Predstavitev / Kontakt`
- `Predstavitev / Prenova`
- `Predstavitev / Kavarna`
- `Predstavitev / Partnerji`
- `Predstavitev / Media`
- `Predstavitev / Dostop`
- `Prostori`
- space detail pages
- rental/request explanation page under `Prostori`
- `Dogodki`
- event archive
- event detail pages
- `Programi`
- programme detail pages under `Programi`
- `Skupnost`
- organisation entries under `Skupnost`
- person/creator entries under `Skupnost`
- `Novice`
- news detail pages
- member/account entry point where membership functionality is enabled
- `Moj DOM` account area for signed-in users
- terms of use
- privacy information
- accessibility information

The public website must be specified as a final-platform IA, without separate phase-based public navigation variants.

The public `Prostori` overview must present spaces through curated use/context groups rather than floor-based navigation or a generic filter-first listing.

The public `Prostori` overview must support these presentation groups:

- `Prireditve in vadba`, for halls, event spaces and practice spaces
- `Skupnost in sodelo`, for HUB, coworking and shared-work spaces
- `Ustvarjanje in razstave`, for atelier, residence, gallery, exhibition and public presentation spaces

Internal/operator-only spaces, such as the director's office, must not appear in the public `Prostori` overview or public rental/request selectors.

---

## 3. Shared Content Requirements

Public content records must support:

- stable internal ID
- public slug where the record has a public detail page
- publication status
- title or name
- summary or excerpt
- main body/content
- created and updated timestamps where supported
- language or translation metadata where needed
- SEO title
- SEO description

Publication status must support at least:

- draft
- published
- archived

Public views must show only published content unless a record type explicitly supports public archive access.

Internal IDs, source notes, unconfirmed-field flags, internal notes, and operational metadata must not be exposed on public pages.

---

## 4. Language

The platform is Slovenian-first.

Slovenian content is the canonical authored source.

Public content may support explicit English fields or translations where needed.

Reusable interface labels may be translated separately from authored page content.

The platform must support a language choice mechanism for the public website.

---

## 5. Predstavitev

The `Predstavitev` section must support public content about:

- what DOM is
- house/building presentation
- history and renovation
- location and access
- team
- programme contact
- general contact
- media and press
- partners
- European programmes or funding context
- cafe content where relevant

The `Predstavitev` section must support child pages or equivalent public content sections for:

- contact
- renovation and development
- cafe
- partners
- media / press
- access

Contact information must be managed as public content, not hardcoded into unrelated page text.

Public claims about address, opening hours, accessibility, team, partners, and funders must be based on confirmed source information.

---

## 6. Services

Services describe support, infrastructure, or opportunities available through DOM and the platform.

Services must support:

- stable internal service ID
- public slug where public-facing
- publication status
- title
- short description
- description
- category
- target users
- what is included
- conditions
- process steps
- CTA label
- CTA URL or linked inquiry flow
- related spaces
- related events

Service categories must support at least:

- space use
- event support
- technical support
- mentoring
- production support
- communication support
- networking
- community development
- other

Target-user groups must support at least:

- public
- creators
- organisations
- cultural societies
- youth
- partners
- internal team

Service-like content must not require a standalone public services navigation section.

Public service-like content should primarily be surfaced under `Skupnost`.

Service-like content may also be surfaced inside `Prostori`, events, or editorial pages where the service is inseparable from the relevant space, event, or public explanation.

---

## 7. Programmes

Programme domain requirements are defined in `spec-programmes.md`.

The `Programi` public section contains the programme overview, programme detail pages, and programme application entry points.

The separate `Skupnost` public section presents the community, organisations, person/creator editorial profiles, and membership information. Programmes and the shop are not subsections of `Skupnost`.

Programme pages must support public participation or application entry points where the programme accepts applications, expressions of interest, or participant onboarding.

The public programme CTA must act as an entry point into the related programme participation or application workflow.

Public programme participation and application workflows must remain connected to the related programme and must be administered through the Programmes module, not as generic public contact forms.

---

## 8. Organisations

Organisations represent groups, associations, institutions, cultural societies, project partners, creator collectives, companies, informal groups, or community actors.

Public organisation records are editorial community content. They are not user accounts or member profiles.

Organisation records may be rendered on `Skupnost` pages, cards, lists, or related-content sections.

Organisation records must support:

- stable internal organisation ID
- publication status
- name
- short description
- description
- organisation type
- fields of work
- website
- public email
- public phone
- image or logo reference
- location
- related people
- related events
- related services
- related programmes

Organisation type must support at least:

- cultural society
- NGO
- public institution
- informal group
- company
- project partner
- creator collective
- other

Public organisation visibility must respect publication status and editorial approval.

---

## 9. People Profiles

People profiles may represent creators, contacts, mentors, team members, organisers, speakers, or other public persons.

Public person/creator records are editorial community content. They are not user accounts or member profiles.

Person/creator records may be rendered on `Skupnost` pages, cards, lists, or related-content sections.

People records must support:

- stable internal person ID
- publication status
- name
- short bio
- full bio
- roles
- fields of work
- public email where allowed
- website
- image reference
- related organisations
- related events

Person role must support at least:

- creator
- mentor
- organiser
- team member
- contact person
- speaker
- other

Public person profiles must respect consent and visibility rules.

---

## 10. News And Stories

News items represent project news, stories, announcements, calls, press notices, and project communication.

News records must support:

- stable internal news ID
- public slug
- publication status
- title
- excerpt
- body
- date
- category
- author name
- image reference
- photo labels or media references where used
- added public links
- call deadline where the category is `poziv`
- attached public form flow where the category is `poziv` and the call accepts submissions through the platform
- tags

News category must support at least:

- `projektna novica`
- `zgodba`
- `obvestilo`
- `poziv`
- `pr-obvestilo`

`Poziv` is a news category, not a separate public content module. A call may have a deadline and may be linked to a public form flow. The form flow is selected in administration, but the public page must show the actual form, not an internal form-flow ID.

News detail pages must show only public content.

News detail pages may show automatic `Morda vas zanima tudi` suggestions based on category, tags, date, or other public relationships. Related suggestions should not require editors to manually curate related-content links for each news item.

---

## 11. Tags And Taxonomy

The platform must support tags for filtering and grouping public content.

Public event pages must expose event filters when event volume or browsing context requires them.

Event filters should support at least date, event type, audience, tags, programme or series, and space where relevant.

Tags must support:

- stable internal tag ID
- public label
- tag group

Tag groups must support at least:

- topic
- audience
- format
- space
- service
- community
- other

Tags may be used across events, spaces, services, programmes, organisations, people, and news.

Controlled taxonomies should be introduced only when filtering, reporting, or editorial consistency requires them.

---

## 12. Media

Public content must use media references rather than owning binary files directly.

Media references must support:

- stable internal media ID
- source URL or file-service reference
- alternative text
- caption
- credit
- media type
- visibility

Media type must support at least:

- image
- video
- document

Images, PDFs, and other files must be stored and delivered through a separate file, media, or CDN service.

Public pages must include meaningful alternative text for images where images convey content.

---

## 13. CMS Pages

The platform must support editorial pages for public website content.

CMS/editorial pages must support:

- stable internal page ID
- public slug
- publication status
- title
- excerpt
- body/content blocks
- parent page reference
- SEO title
- SEO description
- created and updated timestamps

CMS pages may be used for public pages that are not better represented by a specialised entity such as event, space, programme, news item, or organisation.

---

## 14. Footer And Utility Navigation

The public website footer must support utility links and information for:

- contact
- location and access
- opening-hours note
- newsletter signup or newsletter provider entry point where enabled
- social links
- shop entry point labelled `Trgovina`
- funder, partner, or institutional logo area
- renovation, funding, or project-context link where required
- accessibility information
- terms of use
- privacy and cookie information

Footer content must be managed as public website content or settings, not hardcoded into unrelated page copy.

Footer links must not duplicate every primary navigation item unless needed for usability or accessibility.

---

## 15. Inquiries

The public website must support contact and inquiry forms.

Inquiry records must support:

- stable internal inquiry ID
- topic
- name
- email
- phone
- organisation name
- message
- related event
- related space
- related service
- created timestamp

Inquiry topics must support at least:

- general
- event
- space use
- service
- organisation profile
- partnership
- press
- other

Inquiry submissions must not expose internal administration access to public users.

Inquiry records must be visible only to users with suitable internal permissions.

---

## 16. Membership Enrolment

The public website must support a path for users to become members where membership is offered.

Membership enrolment may use a public form, authenticated form, or external payment/accounting provider flow depending on the selected implementation.

Public membership enrolment must support:

- membership tier selection where multiple tiers are offered
- collection of required contact and eligibility information
- acceptance of terms of service and privacy conditions
- confirmation message or next-step instructions

The platform must not own invoice issuing or accounting records directly.

---

## 17. Shop And Merchandise

The public website may expose shop or merchandise purchase paths where DOM offers products. The navigation entry point labelled `Trgovina` must be placed in the footer, outside `Skupnost`.

The shop itself should be handled by an external ecommerce solution.

Public shop entry points may be represented as:

- external shop links
- embedded ecommerce widgets where suitable
- product or merchandise teaser sections that link to the external shop

Product catalogue, pricing, stock, cart, checkout, payments, order management, fulfilment, refunds, and customer receipts should be owned by the selected ecommerce provider unless a later implementation explicitly brings those workflows into platform scope.

Where possible, ecommerce/payment provider choices should be coordinated with ticketing, membership, rent payment, invoicing, and accounting choices to avoid unnecessary separate billing systems.

---

## 18. Content Type Inventory And Ownership

The web IA and public content model must recognise these content and data object types:

- CMS/editorial page
- event
- space
- programme
- service
- organisation
- person profile
- news or story
- inquiry or form submission
- media reference
- tag or taxonomy term
- membership enrolment entry point
- shop or merchandise entry point
- footer or reusable public-content block

Specialised entities must be managed by their owning module rather than only as generic CMS pages:

- events are owned by event administration
- spaces are owned by spaces and reservations administration
- programmes are owned by programme administration
- news and stories are owned by editorial/news administration
- services are owned by editorial/programme or service-support administration, depending on the implementation
- organisations and people are owned by editorial/community administration
- inquiries and submissions are owned by forms/submissions administration
- media references are owned by media administration or a media integration
- tags and taxonomy terms are owned by editorial or system settings, depending on implementation
- membership enrolment is owned by membership/account administration and any selected external payment or accounting integration
- shop and merchandise entry points are owned by public content administration, while catalogue, checkout, fulfilment, and sales records belong to the selected ecommerce provider
- footer and reusable public-content blocks are owned by static/editorial content administration or settings

CMS/editorial pages should be used for public pages that do not need a specialised workflow, structured operational state, booking relationship, registration relationship, or integration ownership.

Public website components must be able to render related content across these object types while respecting publication status, permissions, and visibility rules.

---

## 19. Public Content Relationships

Public content relationships must support:

- events related to spaces, services, programmes, organisations, and news
- spaces related to events, programmes, and connected spaces
- services related to spaces, events, programmes, and inquiries
- programmes related to events, services, organisations, and spaces
- organisations related to people, events, services, programmes, and news
- people related to organisations and events
- news related to events, spaces, services, organisations, and programmes

Public related-content sections must show only records that are published and visible.

Internal, draft, private, archived, or permission-restricted related records must not leak through public relationship widgets.

---

## 20. Public Website Content Requirements

The public website must help users understand:

- what DOM is
- what is happening
- which spaces exist
- how spaces can be requested or rented
- which programmes, services, and opportunities are available
- how creators, organisations, and communities can participate
- how the public can visit, attend events, follow news, or contact the team

Public pages must avoid exposing implementation details, internal notes, unconfirmed operational data, and administrative terminology.

The public website must provide clear paths to:

- browse events
- inspect spaces
- request space use
- read news
- understand programmes
- contact DOM
