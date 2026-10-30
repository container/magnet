# MAG-NETic Platform - Project Task List From PN Invitation

Purpose: carve delivery tasks from `sources/PN platforma MAG-NET - Povabilo_20260320.pdf`.

Status: working project task list

Placement note: this belongs in `specs/implementation/` because it is delivery planning, milestone tracking, and procurement-derived work. Final platform requirements should stay in `specs/platform/`; source documents should stay in `sources/`.

Source note: the user-provided Downloads PDF was checked against the existing source copy and has the same SHA-256 hash. The canonical source file is `sources/PN platforma MAG-NET - Povabilo_20260320.pdf`.

---

## 1. Delivery Outcome

The project must produce a final project brief/specification package for planning the Digital MAG-NETic Platform. It must be detailed enough to serve as a direct basis for later UX/UI design and software development procurement.

The final package must cover:

- initial analysis methodology, interviews, workshops, findings, needs and risks
- agreed platform scope, including included and excluded scope
- sitemap, content areas, page types and minimal data structures
- prioritized list of content, services, functions and operational processes
- user model, roles and permission matrix
- administrative interface requirements by module
- reservation-system recommendations, including integration with access control and possible test integration into the website
- technical foundations, integrations, information security, personal-data protection and accessibility
- CGP/visual-identity hierarchy and usage rules across DOM, MAG-NET, MOC and the future operator institution
- open decisions and multiple scenarios related to the not-yet-confirmed DOM operator
- final service scope and attachments for commissioning platform development

---

## 2. Milestone Tasks

### M1 - Work Plan And Research Plan

Deadline from source: 15 days after contract signature.

Tasks:

- Confirm project governance, decision makers, approval path and written milestone acceptance process.
- Run kickoff with the client, Mestna obcina Celje and key MAG-NET partners.
- Confirm how MOC and project partners will participate throughout the process.
- Build the stakeholder map and future-user recruitment list.
- Define research methodology for interviews, workshops, desk research, questionnaire and observation.
- Prepare the list of at least 10 interviews.
- Prepare the plan for at least 5 co-creation workshops.
- Collect and index existing source documents and relevant comparable platform examples.
- Identify early risks from the unknown DOM operator model, legal duties, data ownership and integrations.
- Deliver a closed PDF work plan and research plan.
- Present M1 to the client and collect written approval.

Outputs:

- methodology
- interview list
- detailed workshop plan
- work schedule
- initial source inventory
- initial risk and decision log

### M2 - Needs Analysis

Deadline from source: 60 days after M1 approval.

Tasks:

- Conduct at least 10 stakeholder/user interviews.
- Conduct at least 5 co-creation workshops with stakeholders and future users.
- Run supporting user research where useful: questionnaire, observation and process walkthroughs.
- Perform desk research across existing project documents and relevant digital solutions.
- Identify stakeholder groups, user groups, needs, expectations and main use scenarios.
- Map operational processes the platform must support.
- Analyze the platform role across public presentation, operations, MAG-NET HUB services and online sales.
- Capture risks, conflicting expectations, dependencies and unresolved decisions.
- Define recommended next content steps for drafting platform scope and structure.
- Deliver a needs-analysis document.
- Present M2 to the client and collect written approval.

Outputs:

- interview summaries
- workshop summaries
- key findings
- needs and risk synthesis
- recommended next steps for M3

### M3 - Draft Platform Scope And Structure

Deadline from source: 30 days after M2 approval.

Tasks:

- Define the platform scope based on user needs, MAG-NET goals and the MOC digital/organizational ecosystem.
- Explicitly mark included and excluded scope.
- Draft sitemap and information architecture.
- Define content areas and page types.
- Define minimal data structures for spaces, events, programmes, users and other confirmed content types.
- Include required content areas: manifest, spaces, rules, terms, privacy, team, history, contacts, event calendar, news/announcements, community, programmes, newsletter, reservations and online sales.
- Write core user scenarios across public users, members/community users, operators, administrators and partners.
- Propose any additional functionality that materially supports the client goals and M1/M2 findings.
- Align the scope and structure with the client before packaging.
- Deliver the M3 draft scope and structure document.
- Present M3 to the client and collect written approval.

Outputs:

- draft scope
- sitemap
- content structure
- user scenarios
- draft data model notes
- prioritized candidate functionality

### M4 - Draft Functional And Technical Requirements

Deadline from source: 30 days after M3 approval.

Tasks:

- Convert the M3 scope into platform modules and prioritized functional requirements.
- Define minimal viable scope and later-phase scope.
- Specify public website functions: content, spaces, rules, contacts, programmes, calendar, news, newsletter, reservations, sales and other confirmed areas.
- Specify operational functions: calendar, schedules, reservations, users, administration, payments and sales elements.
- Specify MAG-NET HUB digital-service support: event incubator, DOM school, DOM gallery, chamber, urban-renewal office, temporary-use space and other confirmed WP7/WP6 services.
- Specify internal display/signage requirements.
- Define the user account model, login needs, roles, access levels and permission matrix.
- Define administrative interface modules and permissions.
- Analyze reservation-system options, selection criteria and recommendation.
- Clarify relationship to existing reservation and access-control systems.
- Define data flows for reservations, spaces, users, access control, events, sales and reporting.
- Specify minimal online sales processes: product types, gift vouchers, orders, payments, delivery/pickup, notifications and editorial rights.
- Define integration requirements with the MOC headless website architecture.
- Define technical architecture options and minimum development requirements.
- Define information-security requirements, including OWASP Top 10 alignment and relevant sector/legal standards.
- Define privacy and personal-data-processing requirements, including financial flows and GDPR/legal compliance.
- Define accessibility requirements for public institutions and vulnerable groups.
- Analyze visual-identity relationships between DOM, MAG-NET, MOC and the future operator institution.
- Propose CGP hierarchy and usage rules, including how MAG-NET HUB services may be differentiated inside DOM.
- Evaluate proposed solutions for modules, integrations, reservations, online sales, cafe operations and administration.
- Deliver the M4 functional and technical requirements draft.
- Present M4 to the client and collect written approval.

Outputs:

- functional requirements
- technical requirements
- module map
- priority/phasing model
- integration plan
- reservation/access-control recommendation
- online-sales process specification
- admin requirements
- security, privacy and accessibility requirements
- CGP hierarchy recommendation

### M5 - Final Project Brief With Attachments

Deadline from source: 15 days after M4 approval.

Tasks:

- Consolidate approved M1-M4 material into a final project brief/specification package.
- Resolve wording, terminology and scope inconsistencies.
- Preserve unresolved decisions in a clear decision log with possible scenarios and platform-design impacts.
- Ensure the unknown DOM operator scenario is explicitly covered.
- Ensure the final brief can be used as a basis for commissioning UX/UI design and platform development.
- Compile all required attachments.
- Deliver final versions of the project brief and all supporting documentation.
- Present M5 to the client and collect written approval.

Outputs:

- final project brief
- final attachments
- open-decision/scenario log
- development-procurement-ready scope package

---

## 3. Cross-Cutting Workstreams

### Stakeholders And Governance

- Maintain the stakeholder map.
- Track MOC decisions and approvals.
- Track MAG-NET partner inputs and unresolved conflicts.
- Track DOM operator scenarios and their impact on platform ownership, legal obligations, workflows and permissions.

### Research And Evidence

- Keep interview and workshop evidence linked to findings.
- Separate confirmed needs from assumptions.
- Track risks and dependencies uncovered during research.

### Platform Scope And Information Architecture

- Keep public website, operations, MAG-NET HUB service layer and online sales distinct but connected.
- Maintain clear boundaries between final requirements, prototype notes and implementation planning.
- Keep platform records out of `specs/`; store temporary structured records under `data/seed/` until a database/import pipeline exists.

### Users, Roles And Access

- Maintain account types, roles, access rules and permission matrix.
- Define administrative access by module.
- Include auditability and access-governance requirements.

### Reservations, Calendar And Access Control

- Define reservation, schedule and calendar workflows.
- Evaluate whether to build, adapt, or integrate reservation tooling.
- Specify access-control integration requirements and data ownership.
- Identify test-integration needs for the website.

### Sales, Payments And Commerce

- Define product and voucher types.
- Define order, payment, delivery/pickup and notification flows.
- Define editorial and operational rights.
- Decide which commerce functions belong inside the platform and which belong to an external provider.

### Technical Architecture And Integrations

- Align with the MOC headless web architecture.
- Specify API/data synchronization needs.
- Define integration boundaries and source-of-truth ownership.
- Define security, privacy, accessibility and maintainability requirements.

### Visual Identity And Content Governance

- Define hierarchy across DOM, MAG-NET, MOC and the future operator.
- Define usage rules for identities and service differentiation.
- Ensure content governance aligns with roles and approval workflows.

---

## 4. Immediate Next Tasks For This Repository

- Compare the existing platform specs against the PN invitation and mark missing final requirements.
- Add any confirmed final requirements to the relevant `specs/platform/spec-*.md` files.
- Keep unresolved decisions in `questions-decisions/open-questions.md`.
- Keep milestone/delivery planning in this file.
- Use this file as the task backbone when planning future implementation or specification passes.
