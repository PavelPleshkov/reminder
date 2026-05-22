# Feature Specification: Journal & App Shell (Feature 001)

**Feature Branch**: `001-journal-app-shell`

**Created**: 2026-05-22

**Status**: Draft

**Input**: Build Reminder Feature 001: web app shell plus full Journal section for car maintenance logging. English UI. Single vehicle. Reminders list UI and Trash UI deferred to Feature 002.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and save journal entry (Priority: P1)

As a car owner, I save a maintenance journal entry with a work date, odometer reading, and at least one work item with category labels and a next-service criterion so my service history is recorded and future reminders can be prepared.

**Why this priority**: Journal is the primary value of the application; without creating entries, no other feature delivers value.

**Independent Test**: Open Journal, create an entry with one labeled work and Mileage next criterion, save, and confirm it appears in the entry list and contributes to the Reminders badge when applicable.

**Acceptance Scenarios**:

1. **Given** the user is in Journal with the create form open, **When** they save a valid entry with one Engine-labeled work, **Then** the entry appears in the list with correct date, odometer, work details, and total cost.
2. **Given** the create form has unsaved changes, **When** the user clicks Cancel, **Then** no entry is persisted and the list is unchanged.
3. **Given** a work uses Mileage as next criterion with a valid target value, **When** the entry is saved, **Then** pending reminder data exists for that work and the Reminders menu badge count increases accordingly.

---

### User Story 2 - Filter and sort journal entries (Priority: P1)

As a car owner, I filter entries by maintenance category and change sort order so I can find relevant service history quickly.

**Why this priority**: With growing history, browse and filter are essential daily interactions alongside create.

**Independent Test**: Load Journal with multiple entries (including demonstration data), apply Brakes filter and date/odometer sort toggles, and verify list order and visible header emphasis.

**Acceptance Scenarios**:

1. **Given** demonstration or user entries where at least one entry includes a Brakes-labeled work, **When** the user selects the Brakes category filter, **Then** only entries containing at least one Brakes-labeled work are shown.
2. **Given** multiple entries with varied dates and odometer readings, **When** the user toggles sort to date (recent first), **Then** entries reorder with date emphasized first in each entry header; **When** the user toggles reverse order, **Then** the list inverts accordingly.
3. **Given** the default sort (odometer descending), **When** Journal loads, **Then** odometer is emphasized first in each entry header and higher odometer entries appear above lower ones.

---

### User Story 3 - Validation on save (Priority: P1)

As a car owner, I receive clear feedback when my entry is incomplete or invalid so I do not save incorrect maintenance records.

**Why this priority**: Data quality underpins reminders and long-term journal value.

**Independent Test**: Attempt saves with missing works, overlong descriptions, missing criterion values, and invalid numeric fields; confirm English error messages and no persistence.

**Acceptance Scenarios**:

1. **Given** a work with no category label selected, **When** the user saves the entry, **Then** the work is stored with the General label applied automatically.
2. **Given** a work description of 101 characters, **When** the user attempts save, **Then** an error is shown and the entry is not saved.
3. **Given** an entry with zero works, **When** the user attempts save, **Then** an error is shown and the entry is not saved.
4. **Given** a work with Mileage or Date next criterion but no target value, **When** the user attempts save, **Then** an error is shown and the entry is not saved.

---

### User Story 4 - Delete entry with confirmation (Priority: P1)

As a car owner, I remove a journal entry only after confirming, knowing it is retained for future restore via Trash (Feature 002).

**Why this priority**: Destructive actions require explicit consent per product constitution.

**Independent Test**: Delete an entry with confirm and cancel paths; verify list updates and trash retention without Trash UI.

**Acceptance Scenarios**:

1. **Given** an existing journal entry, **When** the user confirms delete, **Then** the entry no longer appears in Journal and is stored for future Trash restore (Trash UI not shown in this feature).
2. **Given** an existing journal entry, **When** the user cancels the delete confirmation, **Then** the entry remains unchanged in Journal.

---

### User Story 5 - App shell and section placeholders (Priority: P1)

As a car owner, I navigate the application from a consistent home and menu, use the fully functional Journal, and see placeholders for sections not yet implemented.

**Why this priority**: Shell establishes navigation and sets expectations for the product roadmap.

**Independent Test**: From home, open Journal (two columns), open Settings/FAQ/Trash/Categories/About (placeholders), open Reminders (placeholder with badge), and verify badge count matches pending reminder works.

**Acceptance Scenarios**:

1. **Given** the home screen, **When** the user selects Journal, **Then** the two-column Journal layout opens (category filters left, entries right).
2. **Given** the home screen or menu, **When** the user opens Settings, FAQ, Trash, Categories & Aggregates, or About, **Then** a placeholder page is shown (FAQ shows no content).
3. **Given** pending reminder works exist from saved or demonstration data, **When** the user views the menu, **Then** the Reminders item shows a badge equal to the count of pending reminder works; **When** the user opens Reminders, **Then** a placeholder message indicates full functionality in a future release.

---

### User Story 6 - Next work criterion and pending reminders (Priority: P1)

As a car owner, I specify when each work should be repeated so the system can track upcoming service without building the full Reminders UI yet.

**Why this priority**: Links Journal to the Reminders product pillar and badge behavior in Feature 001.

**Independent Test**: Save works with Date, Mileage, and On breakdown criteria; verify pending reminder data and badge updates only for Mileage and Date.

**Acceptance Scenarios**:

1. **Given** a work with Date next criterion and a valid target date, **When** the entry is saved, **Then** pending reminder data includes that date target.
2. **Given** a work with On breakdown next criterion, **When** the entry is saved, **Then** no pending reminder is created for that work.
3. **Given** a work with Mileage next criterion and a valid target odometer, **When** the entry is saved, **Then** pending reminder data includes that mileage target.

---

### User Story 7 - Demonstration data on first load (Priority: P1)

As a reviewer or new user, I open Journal and immediately see realistic sample maintenance history without manual data entry.

**Why this priority**: Manager demos, acceptance testing, and constitution empty-state requirements for the primary section.

**Independent Test**: Start from empty persistence, open Journal, verify exactly five entries with 1–4 works each, exercise filter/sort/badge, delete one entry, and add a new entry.

**Acceptance Scenarios**:

1. **Given** empty persistence or first visit, **When** the user opens Journal, **Then** exactly five journal entries are visible, each with between one and four works inclusive.
2. **Given** demonstration data is displayed, **When** the user applies category filters and sort toggles, **Then** results reflect the varied labels, dates, and odometer values in the sample set (Journal is not empty).
3. **Given** a demonstration entry, **When** the user confirms delete, **Then** that entry disappears and the user can create new entries normally; remaining demonstration and user entries coexist after the user adds data.

---

### Edge Cases

- Whitespace-only work description on save → validation error; entry not saved.
- Non-numeric odometer or mileage target → validation error.
- Negative cost value → rejected.
- Double activation of Save on a new entry → only one entry is created.
- Page refresh after save → journal data persists (mechanism defined in plan).
- User deletes all demonstration entries → empty state message "Create your first entry" is shown.
- Future-dated work date on entry → allowed.
- Work marked done vs not done → affects pending reminder eligibility per product rules (incomplete works drive badge).
- Mock and user-created entries may coexist in the same list after the user adds data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Application MUST provide a fixed header (minimal height, gradient from transparent at bottom to black at top, light text), application title, and menu control; home MUST show tiles for Journal, Reminders, Categories & Aggregates, About, FAQ, Trash, and Settings, each with a representative image.
- **FR-002**: Side menu MUST be narrow on desktop and push main content; on mobile MUST overlay the full viewport and close when the user selects a section or toggles the menu closed.
- **FR-003**: Journal MUST use a two-column layout: left column category filter tiles (default All selected); right column entry list and create flow.
- **FR-004**: Category filters MUST use the fixed list: All, General, Scheduled maintenance, Engine, Transmission, Brakes, Steering, Intake, Exhaust, Fuel system, Suspension, Body, Electrical, Fluids, Filters. Custom categories are not supported. All shows every entry; any other category shows entries with at least one work bearing that label.
- **FR-005**: Entry list MUST sort by odometer descending by default; user MUST toggle sort by work date (recent first) and reverse sort direction; entry header MUST emphasize date-first or odometer-first according to active sort mode.
- **FR-006**: Create control MUST expand into a form with Cancel (discards draft) and Save (validates then persists); Cancel MUST not persist partial data.
- **FR-007**: Each journal entry MUST include editable work date (date picker with today highlighted), numeric odometer in kilometers, at least one work, automatic total cost equal to sum of work costs (empty cost counts as zero), delete with confirmation, toggle all works done/undone, and Save validation.
- **FR-008**: Each work MUST include required description (maximum 100 characters), category labels chosen from a label cloud (default General if none selected), done/undone state, optional numeric cost without currency symbol, and required next-service criterion: Mileage, Date, or On breakdown, with target value required for Mileage and Date only.
- **FR-009**: New works MUST be inserted at the top of the entry work list; label removal MUST be supported per attached label.
- **FR-010**: Saving a work with Mileage or Date criterion MUST create pending reminder data; On breakdown MUST NOT create pending reminder data.
- **FR-011**: Reminders section in menu MUST display a badge count equal to pending reminder works; Reminders section body MUST show a placeholder (e.g., indicating availability in the next release), not a full reminders list.
- **FR-012**: Deleting an entry MUST require confirmation; deleted entries MUST be retained in trash storage without exposing Trash UI in this feature.
- **FR-013**: When no journal entries exist, Journal MUST show empty state message "Create your first entry".
- **FR-014**: Categories & Aggregates, About, FAQ, Trash, and Settings MUST show placeholder pages; FAQ placeholder MUST show no FAQ content.
- **FR-015**: All user-visible text MUST be in English.
- **FR-016**: On first load when persistence is empty, the application MUST seed exactly five journal entries, each with one to four works, meeting demonstration data rules below; users MUST be able to delete seeded entries like any other entry and add new entries afterward.

#### Demonstration data rules (product requirement)

When persistence is empty on first load, seeded content MUST satisfy:

| Rule | Requirement |
|------|-------------|
| Volume | Exactly 5 journal entries |
| Works per entry | Between 1 and 4 inclusive; distribution should vary (e.g., 1, 2, 3, 4, 2) |
| Dates & odometer | Varied ascending spread so default and toggled sort orders are visibly verifiable |
| Category labels | Varied labels from the fixed list (e.g., Engine, Brakes, Fluids, Filters, General) so filtering is demonstrable |
| Next criteria | At least two works with Mileage, two with Date, one with On breakdown |
| Done state | Mix of done and not done works so pending reminder badge count is greater than zero |
| Costs | Some works with numeric costs, some with empty cost |
| Language & realism | English, realistic car-maintenance descriptions (oil change, brake pads, filter replacement, etc.), each description ≤ 100 characters |

Seeded data MUST be identifiable as sample content (e.g., subtle "Sample data" hint in Journal or About placeholder) or documented in Assumptions. Seeding MUST NOT prevent normal use after users delete or add entries. How seeding is implemented is out of scope for this specification.

### Key Entities

- **Journal entry**: A dated maintenance record for the single vehicle: work date, odometer (km), list of works, derived total cost, and lifecycle state (active in Journal or deleted to trash).
- **Work**: A single maintenance action within an entry: description, one or more category labels, done flag, optional cost, next-service criterion type and target value (when applicable).
- **Pending reminder work**: Derived from an incomplete work with Mileage or Date criterion; holds targets for badge count and future Reminders UI (Feature 002); not created for On breakdown.
- **Category label**: Fixed maintenance taxonomy label attached to works; used for filtering and display; General is the default when none selected on save.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create and save a valid journal entry with at least one work in under 3 minutes without assistance.
- **SC-002**: 100% of Priority P1 acceptance scenarios in this specification pass in acceptance testing.
- **SC-003**: Category filter correctly includes or excludes entries on demonstration data and on a test set of at least 20 entries.
- **SC-004**: Odometer-default and date sort modes, including reverse toggle, produce correct order on demonstration data.
- **SC-005**: Reminders menu badge count matches the number of pending reminder works derived from current journal data (including demonstration set).
- **SC-006**: Validation failures display clear English messages stating what is wrong; users can correct input without losing unrelated fields where possible.
- **SC-007**: Journal remains usable (scrollable, responsive) with 100 or more entries without unusable layout breakage.
- **SC-008**: On first open with empty persistence, Journal shows exactly five seeded entries with one to four works each, without manual setup, satisfying demonstration data rules.

## Assumptions

- Single user and single vehicle; no authentication or multi-user sharing in this feature.
- Data persists locally for the browser session/device (storage approach decided in plan).
- Odometer and mileage targets are always expressed in kilometers; miles toggle is out of scope.
- Costs are numeric only with no currency symbol.
- Future-dated entry work dates are allowed.
- Reminders list UI, Trash restore UI, Settings, Categories browse, and About/FAQ real content are deferred to later features as documented in product scope.
- Demonstration seed data is for demo and acceptance; product owner accepts pre-filled Journal on first load; users may remove it entry by entry.
- "Reset demo data" control is optional for plan and not required in Feature 001.
- Whichever comes first (mileage vs date) for due reminders is relevant to Feature 002; Feature 001 only stores pending reminder targets per work.
