# MAG-NETic Platform Data

This folder contains temporary structured data used while the real platform database does not exist yet.

Data files are not specifications. Platform requirements live in `../specs/platform/`.

Current files:

- `seed/spaces.json`: source-derived seed records for DOM and DOM HUB spaces

Rules:

- keep source documents in `../sources/` read-only
- keep platform requirements in `../specs/platform/`
- keep actual records in `data/seed/` until the database exists
- preserve `TBD` values where source data is not confirmed
- move seed data into the real database or import pipeline when available
