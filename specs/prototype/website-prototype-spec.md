# MAG-NETic Platform — Website Prototype Spec

Version: 0.1  
Purpose: working specification for a lo-fi website prototype in Codex  
Status: draft

---

## 1. Goal

Build a clickable website prototype for the MAG-NETic / DOM platform.

The prototype is not a production website. It is a thinking tool for testing:

- information architecture
- navigation
- page structure
- content types
- user flows
- future CMS structure
- MVP scope

The prototype should be easy to change. It should avoid polished branding and instead use a very simple wireframe style.

---

## 2. Product context

MAG-NETic is a platform connected to DOM, Center urbanega dogajanja, creative communities, cultural organisations, spaces, events and services in Celje.

The website should help different users understand:

- what DOM / MAG-NETic is
- what is happening
- which spaces exist
- which services and opportunities are available
- how creators, organisations and communities can participate
- how the public can visit, attend events or contact the team

The platform should eventually support structured editorial content and possibly bookings, applications, event registrations and community profiles.

---

## 3. Prototype principles

### 3.1 Lo-fi first

The prototype must be very low fidelity.

Use:

- wireframe boxes
- simple typography
- grayscale UI
- placeholder images
- simple cards
- simple layouts
- clear page titles
- visible content hierarchy
- obvious navigation

Avoid:

- polished visual identity
- final branding decisions
- elaborate animations
- decorative gradients
- heavy imagery
- generic startup/SaaS look
- complex visual styling
- final color palette

The goal is to discuss structure, not aesthetics.

### 3.2 Content-first

The prototype should make content types and user journeys visible.

Every page should answer:

- what is this page for?
- who is it for?
- what can the user do here?
- what content objects does this page need?
- what could later become CMS-managed?

### 3.3 Realistic but fake data

Use realistic dummy content, but clearly fake.

Use Slovenian labels and example content where helpful, especially for public-facing UI.

Examples:

- Predstavitev
- Dogodki
- Prostori
- Skupnost
- Novice
- Kontakt
- Prijava
- Najemi prostor
- Več informacij

Public website pages should read like the actual public website, not like prototype annotations. Avoid visible public labels such as `prototype`, `mock`, `primeri/example`, `TBD`, phase names, admin-only reservations or implementation notes. If content is generated from planning documents, keep it plausible and public-facing, and leave uncertain facts general instead of pretending they are confirmed.

---

## 4. Target users

### 4.1 Gost

People who want to:

- find an event
- understand what DOM is
- see what is happening in Celje
- visit a space
- contact the team
- subscribe to updates

### 4.2 Creators and cultural organisations

People or groups who want to:

- use a space
- organise an event
- join a programme
- get support
- become visible on the platform
- connect with other organisations

### 4.3 Project team and editors

People who need to:

- publish events
- update spaces
- publish news
- manage service descriptions
- maintain directory profiles
- collect inquiries or applications

### 4.4 Partners and institutions

People who need to:

- understand the project
- see programme activity
- see who is involved
- evaluate the platform as public cultural infrastructure

---

## 5. Prototype scope

Build a static, clickable frontend prototype.

Required pages:

- Home
- Events listing
- Event detail
- Spaces listing
- Space detail
- Space rental / how rental works
- Community overview
- Programmes listing
- Programme detail
- News listing
- News detail
- Presentation / about
- Contact section under Presentation

Optional pages for second iteration:

- Apply / participate
- Space inquiry form
- Event registration form
- Service content under `Skupnost`, only where needed for a specific public flow
- Editorial dashboard mockup
- CMS content preview page

---

## 6. Website IA Source

Current public website IA lives in `specs/prototype/website-ia.md`.

Do not maintain a second, competing navigation or sitemap definition in this file. Keep this document focused on prototype principles, page behaviour and implementation constraints.

Language:

- public header includes a Slovenian/English language switcher
- language choice is carried with the URL query flag: `?lang=sl` or `?lang=en`
- Slovenian is the canonical source content
- reusable UI labels use a dictionary; content fields are localized only when explicitly required

Footer utility content:

- contact and location links
- opening hours note
- newsletter signup
- social links
- logo / funding area
- shop link to `/trgovina`
- terms of use and privacy links

Contact belongs under `Predstavitev`, not in the top navigation.

`Storitve` is not a public navigation section for v1. Service-like content lives under `Skupnost` and may also appear inside relevant `Prostori`, event, or editorial flows where needed.

---

## 7. Page specifications

## 7.1 Home page

Route:

```txt
/
```

Purpose:

The home page should quickly explain what DOM / MAG-NETic is and guide users to the most important actions.

Recommended sections:

1. Hero
2. Short explanation
3. Featured events
4. Spaces preview
5. Services / opportunities
6. Community preview
7. Latest news
8. Final CTA

### Hero

Content:

- title
- short intro
- primary CTA
- secondary CTA

Example copy:

```txt
DOM je prostor za ustvarjalne skupnosti, dogodke, programe in sodelovanja v Celju.
```

CTA examples:

- Poglej dogodke
- Sodeluj z nami

### Featured events

Show 3 upcoming events.

Each card:

- title
- date
- time
- location
- type
- short description
- link to detail

### Spaces preview

Show 3 to 4 spaces.

Each card:

- name
- short description
- capacity
- suitable use
- link to detail

### Services / opportunities

Show key services or support areas.

Example categories:

- uporaba prostorov
- mentorska podpora
- produkcijska podpora
- tehnična podpora
- komunikacijska podpora
- povezovanje skupnosti

### Community preview

Show example organisations / creators.

Purpose:

- demonstrate future directory
- show that the platform connects people and organisations

### Latest news

Show 3 latest updates.

### Final CTA

Prompt users to participate, ask a question or contact the team.

---

## 7.2 Events listing

Route:

```txt
/dogodki
```

Purpose:

Help users browse upcoming events.

Layout:

- page title
- intro text
- list-first event discovery
- month selector
- list/calendar view toggle
- category filters by public space/context group
- monthly calendar view with marked events
- archive link
- empty state when no events are published

Event summary fields:

- title
- date
- time
- location
- type
- audience
- registration status
- short description

For v1:

- published events appear in the selected month
- list mode uses visual event cards
- calendar mode shows events on their dates
- the three category filters match the public `Prostori` presentation groups
- selecting an event opens the event detail route

Public event archive:

- `/dogodki/arhiv` provides a public event archive
- the archive lists events with `status: "archived"` in reverse chronological order
- archived event detail pages reuse the normal event detail route at `/dogodki/:slug`
- archived events should not appear in current event sections on space or programme detail pages

---

## 7.3 Event detail

Route:

```txt
/dogodki/:slug
```

Purpose:

Show all information needed to attend or understand an event.

Sections:

1. Event header
2. Key facts
3. Description
4. Organiser
5. Location / space
6. Related events
7. CTA

Key facts:

- date
- start time
- end time
- location
- organiser
- audience
- language
- price
- registration status

CTA examples:

- Prijava
- Več informacij
- Dodaj v koledar
- Kontaktiraj organizatorja

For prototype:

- buttons do not need to submit real forms
- clicking registration can lead to a mock form page or show a placeholder panel

---

## 7.4 Spaces listing

Route:

```txt
/prostori
```

Purpose:

Present available spaces and their intended use.

Layout:

- page title
- intro
- space cards
- bottom CTA block for `Najemi prostor`

Space card fields:

- name
- short description
- capacity
- equipment summary
- suitable for
- CTA

---

## 7.5 Space detail

Route:

```txt
/prostori/:slug
```

Purpose:

Help users understand whether a space is suitable for their activity.

Sections:

1. Space header
2. Key facts
3. Description
4. Equipment
5. Suitable uses
6. Availability / booking note
7. Events in this space
8. Inquiry CTA

Key facts:

- capacity
- size if known
- floor / location
- accessibility note
- equipment
- use conditions

CTA:

- Pošlji povpraševanje
- Rezervacija prostora
- Kontakt

For prototype:

- booking is not real
- show a placeholder inquiry form or CTA panel

---

## 7.6 Space rental / how rental works

Route:

```txt
/prostori/najem
```

Purpose:

Explain how renting or requesting use of a space works before asking the user for details.

Sections:

- who can rent or request a space
- what kinds of activities fit DOM spaces
- basic process steps
- conditions and technical support notes
- what information the team needs from the requester
- CTA to an inquiry form or inquiry panel

For prototype:

- no real booking
- no real form submission
- this page is the target of the main `Najemi prostor` CTA

---

## 7.7 Service Content Under Skupnost

V1 note:

`Storitve` is not a public navigation section for v1. Service-like content may appear inside `Skupnost`, `Prostori`, event, or editorial flows where it supports a specific public journey.

Service card fields:

- title
- category
- target users
- short description
- CTA

Example services:

- Uporaba prostorov
- Podpora pri organizaciji dogodkov
- Tehnična podpora
- Komunikacijska podpora
- Mentorski programi
- Povezovanje z ustvarjalci
- Produkcijska pomoč

Do not implement standalone public service listing or service detail routes in the current navigation prototype.

---

## 7.8 Community Overview

Route:

```txt
/skupnost
```

Purpose:

Present the DOM community, connected organisations, public person/creator editorial profiles, and membership information.

Layout:

- page title and community introduction
- secondary navigation: Predstavitev, Ljudje, Članstvo
- mentor/person cards
- connected organisation cards
- membership entry point

Organisation/person entries are public editorial content only. They are not user accounts or member profiles.

Programmes have a separate main-navigation section. The shop is reached through the footer at `/trgovina`, not the community secondary navigation.

## 7.9 Programmes

### Programmes overview

Route: `/programi`

Purpose: present DOM programmes and link to their detail and participation pages.

Layout:

- page title and introduction
- programme cards with title, short description, audience, status where useful, and detail link
- no community secondary navigation

Programme examples:

- DOM Šola
- DOM Zbornica
- DOM Inkubator dogodkov
- DOM Srečališče skupnosti
- DOM Rezidenca
- DOM Galerija

---

### Programme detail

Route:

```txt
/programi/:slug
```

Purpose:

Explain one community programme and show how it connects to spaces, events and participation.

Fields:

- title
- description
- who it is for
- what happens in the programme
- related events
- related spaces
- contact or next step

Programme detail pages belong to the `Programi` section and link back to `/programi`.

---

## 7.10 News listing

Route:

```txt
/novice
```

Purpose:

Show a mixed editorial stream for project news, stories, announcements, open calls and press notices.

Layout:

- page title / intro
- latest news or stories section
- important announcements section
- current calls section
- newsletter band

Fields:

- title
- date
- category
- excerpt
- tags

For prototype:

- `Novice` uses one public listing route for all editorial news types
- latest news excludes `obvestilo` and `poziv`
- important announcements use category `obvestilo`
- current calls use category `poziv`
- call cards show deadline when available
- public listing shows only `published` records

---

## 7.11 News detail

Route:

```txt
/novice/:slug
```

Purpose:

Read a full update or article.

Fields:

- title
- date
- category
- author if relevant
- deadline when the record is a call
- body
- tags
- photo labels
- added public links
- attached public form when the record is a call with a selected form flow
- automatic `Morda vas zanima tudi` suggestions

For prototype:

- public detail pages show only `published` records
- `attachedFormFlowId` remains an admin/data reference; the public page renders the selected mock form
- suggested content is selected automatically from published news items by shared category or tags, not manually curated on each record

---

## 7.12 Presentation / about

Route:

```txt
/predstavitev
```

Purpose:

Explain the project.

Sections:

- what DOM is
- who is it for
- renovation and development
- what users can find in DOM
- programmes, spaces, events and cafe entry points
- partners and media entry points
- team cards
- access summary
- contact CTA

A shared secondary navigation is shown on the overview and each child page: Predstavitev, Zgodovina DOMA, Kontakt, Dostop, Prenova, Kavarna, Partnerji, Mediji. It marks the current page and preserves the selected language.

Child routes:

- `/predstavitev/zgodovina-doma`
- `/predstavitev/prenova`
- `/predstavitev/kavarna`
- `/predstavitev/partnerji`
- `/predstavitev/mediji`
- `/predstavitev/dostop`
- `/predstavitev/kontakt`

Child page purposes:

- `Prenova`: explain staged development of DOM, HUB and residence content.
- `Kavarna`: present cafe offer, visitor information, menu/media placeholders and programme links.
- `Partnerji`: present institutional, programme and community partner content and a partnership contact entry point.
- `Media`: present press description, visual-material placeholders, media contact and PR notices.
- `Dostop`: present location, arrival, accessibility and map placeholders using only confirmed or clearly provisional public information.
- `Kontakt`: collect public inquiries through the contact form.

Content rules:

- use public-facing placeholder copy only where facts are not confirmed
- do not expose admin/prototype notes on public pages
- team cards may use prototype people until final team content is confirmed
- confirmed operational facts such as address, opening hours, accessibility and funding/logos should remain editable public content

Use placeholder content where source details are not confirmed.

---

## 7.13 Contact under Presentation

Route:

```txt
/predstavitev/kontakt
```

Purpose:

Let users contact the project team.

Contact belongs under `Predstavitev`, not in the top navigation. It can be implemented as a child route or a section on the `Predstavitev` page.

Sections:

- contact details
- location
- simple inquiry form
- topic selector
- confirmation state

Inquiry topics:

- general question
- event
- space use
- service/support
- organisation/profile
- media/press
- partnership
- other

Inquiry fields:

- topic
- name
- email
- phone
- organisation
- message

The form does not need to send anything in prototype.

---

## 8. Prototype interactions

Required:

- navigation between all pages
- clickable cards
- detail pages
- simple filters on listing pages
- CTA buttons
- mock forms
- responsive behaviour

Not required:

- authentication
- real CMS
- real database
- real booking
- real payments
- real form sending
- real email
- calendar integration
- analytics

---

## 9. Technical implementation

Use the shared prototype stack:

- React
- Vite
- TypeScript
- React Router
- local TypeScript data files
- plain CSS or CSS modules

The public website, backend admin and internal prototype dashboard should live in the same prototype app:

- public website at `/`
- backend admin at `/admin`
- prototype dashboard at `/prototype`

The `/prototype` route is the only place for prototype-only controls such as phase switching. Do not expose phase controls in the public website or DOM admin.

Keep implementation simple and low fidelity. The visual design should resemble wireframes: plain typography, grayscale styling, obvious boxes, simple navigation and minimal visual polish.

Suggested structure:

```txt
src/
  app/
  components/
  data/
  pages/
  routes/
  types/
  utils/
```

Suggested routes:

```txt
/
/dogodki
/dogodki/:slug
/prostori
/prostori/najem
/prostori/:slug
/skupnost
/programi
/programi/:slug
/novice
/novice/:slug
/predstavitev
/predstavitev/prenova
/predstavitev/kavarna
/predstavitev/partnerji
/predstavitev/mediji
/predstavitev/dostop
/predstavitev/kontakt
```

---

## 10. Component list

Create reusable components:

- Layout
- Header
- Footer
- MainNav
- MobileNav
- PageHeader
- Section
- Card
- EventCard
- SpaceCard
- ProgrammeCard
- NewsCard
- FilterBar
- Tag
- CTABox
- PlaceholderImage
- KeyFactsList
- DetailHeader
- RelatedContent
- MockForm

---

## 11. Dummy data

Use local TypeScript or JSON files.

Suggested files:

```txt
src/data/events.ts
src/data/spaces.ts
src/data/programmes.ts
src/data/news.ts
src/data/tags.ts
```

Use at least:

- 8 events
- 5 spaces
- 6 community programmes
- 5 news items

The data should be realistic enough to test layout and filtering.

---

## 12. Language

The spec is written in English for development clarity.

The prototype UI should use Slovenian public labels by default.

Example labels:

```txt
Predstavitev
Dogodki
Prostori
Programi
Novice
Kontakt
Prijava
Najemi prostor
Več informacij
```

---

## 13. Accessibility baseline

Even for lo-fi prototype:

- use semantic HTML
- use buttons for actions
- use links for navigation
- maintain keyboard navigation
- include visible focus styles
- use labels for form fields
- use reasonable heading hierarchy

No full accessibility audit needed in the first prototype.

---

## 14. Success criteria

The first prototype is successful when:

- users can understand what the platform is
- main navigation makes sense
- all core content types are visible
- listing/detail patterns are testable
- filters can be discussed
- space/event/service/community relationships are visible
- it is clear what could later become CMS-managed
- the prototype is easy to modify
