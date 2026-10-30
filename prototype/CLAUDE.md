# CLAUDE.md

This repository uses shared project notes so agents can keep product, UX, IA, and implementation decisions aligned over time.

Use git as a lightweight safety net only. Work directly in the current branch unless the user asks otherwise, and make commits only at meaningful checkpoints.

Before implementing changes, read:

- `../specs/prototype/website-prototype-spec.md`
- `../specs/prototype/prototype-data.md`
- `../specs/platform/`
- `../specs/implementation/notes/implementation-notes.md`
- Any feature-specific document relevant to the task

Before making product, architecture, data-model, content-structure, or UX behavior changes, clarify the intended v1 prototype scope with the user when it is not already explicit.

Keep the prototype intentionally low fidelity unless the user explicitly asks for visual polish:

- use Slovenian public-facing labels by default
- prefer simple wireframe layouts and plain UI
- make content types and relationships visible
- keep the implementation easy to change
- avoid real authentication, booking, payments, CMS, or form submission unless the scope changes

While implementing, update the docs when a change creates shared knowledge future agents should preserve:

- update `../specs/implementation/notes/implementation-notes.md` for technical structure, commands, local data files, route patterns, component conventions, and setup notes
- add a feature-specific doc in `../specs/` when a flow becomes complex enough that future agents need more than a short note

Do not leave important product or UX behavior changes undocumented. Keep `AGENTS.md` and `CLAUDE.md` aligned.
