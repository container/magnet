# IA diagram in M3 poročilo

- Editable source: `website-main.mmd`.
- Rendered outputs: `website-main.png` and `website-main.svg`.
- Source content: the main website Mermaid diagram from this conversation, based on `specs/prototype/website-ia.md`. This insertion is not a reconciliation with later edits to the Google Doc's URL table.
- Layout: left to right for legibility within the document width; the page hierarchy is unchanged from the conversation diagram.
- Destination: https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit
- Tab: `t.0` / Koncept platforme.
- Section: Ključni vsebinski sklopi; immediately after the paragraph beginning “Naslovna stran povezuje”.
- Inserted inline image ID: `kix.yxjgq6hsw8ka`. This replaced the user-selected test drawing `kix.yctkw6l17ske`.
- Inserted width: 468 pt; aspect ratio preserved.

For later updates, edit the Mermaid source and render a new PNG. `render-mermaid.cjs` uses local Playwright and Chrome in an isolated browser profile. It expects Mermaid 10.9.3 at `/private/tmp/magnet-mermaid-10.9.3.min.js`; if absent, download it from `https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js` before rendering.

Before changing the Google Doc, read its current structure and resolve the image by its ID and surrounding paragraph. Do not reuse historical text indexes. Replace the PNG through the Google Docs connector, preserving the current location and aspect ratio, and verify the result.

Insertion was verified through connector readback and a live browser screenshot. The Mermaid source is saved locally, not embedded in the Google Doc. A PDF export succeeded, but the exported PDF was not rasterized or reviewed.
