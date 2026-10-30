# ChatGPT project context

This directory is a local mirror of the ChatGPT project “2026 MAG-NETic platform”.

- Treat every file under `sources/` as read-only reference material.
- Do not edit, rename, move, or delete synced project files.
- These files may be replaced the next time a task is created from this ChatGPT project.

## Codex working protocol

- Work reservedly when preparing specifications.
- Do not add unchecked ideas, inferred features, or speculative requirements to specification documents.
- Suggestions are allowed in chat, but they must be confirmed by the user before entering any spec.
- Before editing any spec, project document, or prototype code, ask for explicit approval unless the user has directly instructed the change.
- Keep platform specs realistic and limited to user-checked requirements.
- Prototype changes also require approval before implementation.


## Project instructions

## Specification structure

Use grouped specification folders:

- `specs/platform/` for final platform specifications
- `specs/prototype/` for prototype-only specifications
- `specs/implementation/` for implementation notes and source-to-spec audits

Use project support folders outside `specs/`:

- `project-management/` for Phase III working documents, UX workstreams, draft reports, milestone planning, and task readouts
- `questions-decisions/` for open questions, decision logs, and topic-specific unresolved decisions

Platform specification files must use the `spec-` filename prefix, for example:

- `spec-platform.md`
- `spec-web.md`
- `spec-admin.md`
- `spec-events.md`
- `spec-spaces.md`
- `spec-users-access.md`

Platform specs are final platform requirements. They must not include:

- prototype notes
- procedural notes
- decision history
- open questions
- implementation commands
- Codex/agent workflow notes
- fake-data or wireframe-only constraints

Keep larger platform chunks separate when useful, especially events, spaces, web, admin, and users/access.

Use `spec-users-access.md` for user types, account model, roles, permissions, access rules, event ownership, space access, file visibility, signage access, reporting access, and audit/traceability requirements.

## Data structure

Actual platform records must not live in `specs/`.

Use `data/seed/` for temporary structured seed data until a real database or import pipeline exists. For example, current source-derived space records live in `data/seed/spaces.json`.

Use platform specs to define required fields and relationships. Use seed/database files to store actual records.
