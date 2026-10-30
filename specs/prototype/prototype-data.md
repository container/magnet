# MAG-NETic Platform - Prototype Data Notes

Purpose: define sample-data expectations for the clickable prototype.

Status: prototype specification

---

## 1. Purpose

The prototype needs enough realistic sample data to test navigation, public pages, admin views, calendars, relationships, and empty states.

Prototype data is not production data and is not the final database schema.

Real source-derived records belong in `data/seed/` until a real database exists.

Platform requirements live in `specs/platform/`.

---

## 2. Sample Data Requirements

Create enough sample data to test the UI.

### Events

Minimum: 8.

Include different:

- dates
- event types
- audiences
- spaces
- registration statuses

### Spaces

Use `data/seed/spaces.json` for current source-derived space records.

The prototype may use a smaller subset where needed for UI testing, but it should preserve the DOM / DOM HUB split.

Include different:

- capacities
- equipment
- suitable uses
- availability states

### Member And Regular-User Access

Include enough fake data to distinguish:

- a member or regular user account identity
- permitted spaces
- individual reservation statuses
- room-use request approval statuses
- external booking/calendar handoff status
- request file attachments
- Prima card number as admin/internal request data where relevant

The prototype should not create a separate status model for renters. If a specific person or group requests a room, the relevant inquiry, reservation, or booking status is the status that matters.

The public room-use request form should show conditional timing fields:

- one-time rental: requested date, start time, duration
- recurring rental: requested weekday, start time, duration

Duration should be selectable in 30-minute increments from 30 minutes to 3 hours.

Start-time selection should use full-hour options.

Attachment help text should state accepted file types and limits.

Room-use request sample data should show the approval journey before calendar execution:

- new request
- in review
- waiting for requester
- approved for calendar
- rejected
- archived

Room-use request sample data should include internal notes with author, timestamp, and text so the admin desk can show newest notes first.

The prototype may show fake external booking/calendar references, but it should not implement a real calendar engine.

For journey testing, the clickable prototype may store submitted public room-use requests in browser `localStorage` and show them in the admin room-use approval desk as `new` requests. This is prototype-only behavior and does not replace the production backend, submission workflow, notification, or audit requirements.

### Services

Services are optional for the first navigation prototype.

Services are not a public navigation section in the current public website IA. Add service sample data only if needed to test backend/supporting content, `Prostori`, or `Skupnost` flows.

### Organisations

Organisations are part of the expanded `Skupnost` prototype scope.

Organisation sample data should support connected organisation cards under `Skupnost`.

TODO: Move connected organisation and person/creator mock data into typed/shared prototype data instead of keeping it only as inline page content.

### News Items

Minimum: 5.

Include different categories:

- `projektna novica`
- `zgodba`
- `obvestilo`
- `poziv`
- `pr-obvestilo`

News status supports:

- `draft`
- `published`
- `archived`

Calls use category `poziv` and may include `callDeadline` and `attachedFormFlowId`. The public prototype should render the attached form flow as a mock form instead of exposing the internal form-flow ID.

---

## 3. Example Dummy Data

These examples are illustrative only. Use the current prototype source files as the active implementation source.

### Example Event

```ts
export const exampleEvent = {
  id: "open-workshop-01",
  slug: "odprta-delavnica-za-ustvarjalce",
  status: "published",
  title: "Odprta delavnica za ustvarjalce",
  summary: "Spoznavno srečanje za ustvarjalce, društva in skupine, ki jih zanima sodelovanje v DOM.",
  descriptionSl: "Delavnica je namenjena zbiranju idej, potreb in pričakovanj skupnosti. Udeleženci bodo lahko predstavili svoje delo in spoznali možnosti uporabe prostorov.",
  descriptionEn: "The workshop is intended for gathering community ideas, needs and expectations.",
  date: "2026-09-15",
  startTime: "17:00",
  endTime: "19:00",
  spaceId: "main-hall",
  type: "workshop",
  audience: ["creators", "organisations"],
  organiser: "DOM ekipa",
  ownerUserId: "dom-user-01",
  tags: ["delavnica", "ustvarjalci", "skupnost"],
  registrationType: "recommended",
  priceNote: "Brezplačno"
};
```

### Example Space

```ts
export const exampleSpace = {
  id: "main-hall",
  slug: "velika-dvorana",
  status: "published",
  name: "Velika dvorana",
  roomNumber: "TBD",
  floor: "klet",
  sourceGroup: "DOM",
  type: "hall",
  category: "dvorana",
  shortDescription: "Večnamenski prostor za dogodke, predstavitve, srečanja in skupnostne programe.",
  primaryUse: "večji dogodki in programi",
  otherUses: ["predstave", "koncerti", "predavanja", "predstavitve", "skupnostna srečanja", "delavnice"],
  capacityLabel: "TBD; delovna opomba: parter 100 m2, oder 20 m2",
  areaLabel: "TBD; delovna opomba: parter + oder 120 m2, brez podpornih prostorov",
  equipment: ["projektor", "ozvočenje", "stoli", "mize"],
  connectedSpacesNote: "oder, zaodrje, tehnična soba, garderoba nastopajočih, shramba za rekvizite",
  availabilityStatus: "available-for-inquiry",
  availabilityNote: "Uporaba prostora je možna po dogovoru.",
  rentalCTA: "Najemi prostor",
  rulesNote: "TBD; vključiti pravila za dogodke, uporabo odra, tehnike, garderob in opreme",
  accessibilityNote: "TBD; pripraviti kratko pojasnilo o dostopu, dvigalu in dostopnosti za gibalno ovirane",
  stage: {
    availableFrom: "v1-2027",
    visibleIn: ["v1-2027", "v2-2028"]
  },
  sourceNotes: ["Vrednosti povzete iz data/seed/spaces.json; TBD vrednosti ostanejo namerno označene."]
};
```

### Example Service

```ts
export const exampleService = {
  id: "space-use",
  slug: "uporaba-prostorov",
  status: "published",
  title: "Uporaba prostorov",
  shortDescription: "Možnost uporabe prostorov za dogodke, delavnice, srečanja in ustvarjalne aktivnosti.",
  description: "Storitev je namenjena ustvarjalcem, društvom in organizacijam, ki potrebujejo prostor za izvedbo programa ali dejavnosti.",
  category: "space-use",
  targetUsers: ["creators", "organisations", "cultural-societies"],
  whatIsIncluded: ["osnovna tehnična oprema", "dogovor o terminu", "podpora ekipe"],
  conditions: ["uporaba po predhodnem dogovoru", "vsebina mora biti skladna z namenom prostora"],
  ctaLabel: "Pošlji povpraševanje",
  relatedSpaceIds: ["main-hall"]
};
```
