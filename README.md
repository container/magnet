# 2026 MAG-NET

Local workspace for the 2026 MAG-NET platform project.

## Current Structure

| Path | Purpose |
| --- | --- |
| `prototype/` | Current React/Vite clickable prototype app. |
| `project-management/` | Working project-management docs, Phase III planning, UX workstreams, draft report structure, and task readouts. |
| `questions-decisions/` | Open questions, decision logs, and topic-specific unresolved decisions. |
| `specs/` | Grouped platform specs, prototype specs, and implementation notes. |
| `data/` | Temporary structured seed data until a real database exists. |
| `sources/` | Flat source-document folder for normal project navigation. |
| `research/` | Research inputs and future synthesized research outputs. |

Removed/retired folders from earlier workspace drafts:

- `code/prototype/mag-netic-platform-app/`
- `mag-netic-platform-proto/`
- `source-documents/`
- `strategy/`
- `ux-specs/`
- `working-files/`

If those topics return, create them intentionally from the current project structure rather than following stale paths.

## Prototype

The current prototype lives in `prototype/`.

Useful entry points:

- app source: `prototype/src/`
- app render assets: `prototype/src/renders/`
- package manifest: `prototype/package.json`
- prototype notes: `prototype/README.md`

## Specs

The project specs live in `specs/`.

Spec folders have distinct purposes:

- `specs/platform/`: final platform requirements; no prototype notes, open questions, or implementation history
- `specs/prototype/`: clickable prototype scope, IA, sample data, and prototype-only behaviour
- `specs/implementation/`: implementation notes and source audits

- `specs/platform/spec-users-access.md`
- `specs/platform/spec-admin.md`
- `specs/platform/spec-events.md`
- `specs/platform/spec-spaces.md`
- `specs/platform/spec-web.md`
- `specs/prototype/website-prototype-spec.md`
- `specs/prototype/website-prototype-ia.md`
- `specs/prototype/backend-prototype-ia.md`
- `specs/prototype/prototype-data.md`
- `specs/implementation/notes/implementation-notes.md`
- `questions-decisions/open-questions.md`
- `specs/implementation/source-audits/analiza-potreb-functionality.md`
- `specs/implementation/source-audits/analiza-potreb-technical-requirements.md`

## Data

Temporary seed data lives in `data/seed/`.

- `data/seed/spaces.json`

## Sources

Use `sources/` for source-file lookup during normal work. It is intentionally flat.

Files in `sources/` are source inputs, not drafts. Keep edits and derived decisions in `specs/` or research notes.

## Research Inputs

Raw local interview materials live in `research/interviews/raw/`.

Current raw interview folders:

- `research/interviews/raw/dusan-knezevic/`
- `research/interviews/raw/monika-tominsek/`

## Working Rules

1. Use `sources/` when referencing or opening project files during normal work.
2. Keep final platform requirements in `specs/platform/`.
3. Keep prototype scope, IA, and sample-data guidance in `specs/prototype/`.
4. Keep implementation notes and source-to-spec audits in `specs/implementation/`.
5. Keep project-management docs in `project-management/`.
6. Keep open questions and decision logs in `questions-decisions/`.
7. Keep actual records in `data/seed/` until the database exists.
8. Put research synthesis in `research/`.
