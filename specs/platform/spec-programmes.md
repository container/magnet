# MAG-NETic Platform - Programmes Specification

Purpose: define platform requirements for programmes, public programme pages, programme participation flows, programme applications, and programme administration.

Status: platform specification

---

## 1. Scope

This specification covers:

- programme records
- public programme pages
- programme relationships to events, reservations, services, organisations, and media
- programme participation and application entry points
- programme application and participation workflows
- programme administration
- participant or applicant tracking
- programme-specific operational follow-up

Public website navigation and general public content requirements are defined in `spec-web.md`.

Administration structure and cross-module administration requirements are defined in `spec-admin.md`.

Event requirements are defined in `spec-events.md`.

Space requirements are defined in `spec-spaces.md`.

User-group, module-access, and permission requirements are defined in `spec-users-access.md`.

---

## 2. Programme Records

Programmes group events, services, activities, and participation opportunities under a shared concept.

Programme records must support:

- stable internal programme ID
- public slug
- publication status
- title
- short description
- description
- start date
- end date
- image or media reference
- related events
- related services
- related organisations
- related reservations
- tags
- application or participation CTA where relevant
- linked application or participation flow where relevant

Programme examples include:

- residency programme
- youth programme
- community programme
- education programme
- opening programme
- seasonal programme
- event incubator programme

---

## 3. Public Programme Pages

Programmes must have a separate `Programi` section in the main public navigation. The programme overview is at `/programi`, and individual programme pages are at `/programi/:slug`. The `Skupnost` section remains separate.

Public programme pages must support:

- programme title
- short description
- long description
- publication status-driven visibility
- related events where published and visible
- related services where published and visible
- participation or application CTA where relevant

Programme pages must not expose internal status, internal notes, applicant review data, or administration terminology.

---

## 4. Programme Application And Participation Flows

Programme or project pages must support public application or participation flows where the programme accepts applications, expressions of interest, or participant onboarding.

Programme application or participation flows may use shared form-rendering infrastructure, but they must remain identifiable as programme workflows and must be administered in the Programmes module.

Programme participation flows must be able to represent multi-step processes that continue after the initial public form submission.

Programme participation flows must support:

- public entry point or CTA
- related programme reference
- applicant or participant contact details
- applicant or participant organisation where relevant
- submitted application or interest data
- status
- assigned owner
- assigned mentor where relevant
- related event references where relevant
- internal notes
- next step
- created timestamp
- updated timestamp

Programme application and participation status must use a generic status model that can work across different programmes.

Programme application and participation status must support at least:

- submitted
- in review
- waiting for applicant
- selected
- not selected
- active
- completed
- withdrawn
- archived

Programmes may define programme-specific workflow steps or display labels, but the underlying status model must remain generic enough to compare applications across programmes.

When an application is selected and the programme participation results in an event, the programme application or participant record must be able to reference the related event.

The related event remains the owner of event-specific operational details such as primary space, linked reservations, required equipment or services, assigned programme mentor where relevant, production notes, and event team.

Programme participation workflows may include online and offline touchpoints.

The platform must be able to show staff where a participant or applicant is in the programme workflow.

---

## 5. Programme Administration

The Programmes module must be the primary administration area for programme content, public visibility, and programme application or participation workflow tracking.

The Programmes module must support:

- programme list and filtering
- programme record editing
- programme detail view
- public preview, publishing, and archive status
- programme application list
- programme application detail view
- participant or applicant tracking
- related event visibility
- related reservation visibility
- related service visibility
- related inquiry or reservation visibility where relevant
- internal notes and next-step tracking

The Programmes module must include two primary working views:

- `Seznam`
- `Prijave na programe`

The `Seznam` view must list programme records and allow staff to open a programme detail.

The programme detail view must be the working area for programme identity, public content, publication status, related events, related spaces, related services, and programme-specific configuration.

The `Prijave na programe` view must list programme application or participation records.

The programme application detail view must represent an applicant or participant who is connected to a programme, not only a submitted form response.

Programme application or participation request views must allow staff to see new and active requests by related programme, status, owner, and submission date.

The Forms module must not be the primary working area for complex programme application or participation workflows.

---

## 6. Inkubator Dogodkov Flow

`Inkubator dogodkov` is a programme flow for a programme participant who wants to organise and deliver an event.

The platform must be able to support an `Inkubator dogodkov` flow with the following phases:

- information discovery
- initial contact with programme management
- application review
- selection or acceptance notification
- event organisation
- event delivery
- post-event follow-up

The `Inkubator dogodkov` flow includes public and operational touchpoints such as:

- public programme display on the DOM platform
- introductory contact or meeting through `DOMača kava`
- programme application form
- email notification about selection
- submitted or received preparation materials
- event execution plan
- workshop or first coordination session
- topic-specific mentoring or counselling
- equipment-use briefing
- location preparation
- event or activity delivery
- location reset or cleanup
- post-event evaluation with a mentor

The platform must be able to connect an `Inkubator dogodkov` participant flow to related events, spaces, equipment or technical needs, programme owner, mentor, and internal follow-up notes where relevant.

The exact status labels for the `Inkubator dogodkov` workflow may be configured as programme-specific workflow settings.
