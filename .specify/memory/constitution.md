<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: placeholder template → five concrete principles
- Added sections: Additional Constraints, Development Workflow and Quality Gates
- Removed sections: none (placeholders replaced)
- Templates: plan-template.md ✅ (Constitution Check aligns); spec-template.md ✅; tasks-template.md ✅
- Follow-up TODOs: none
-->

# Reminder Constitution

## Core Principles

### I. Code Quality (Bare Minimum Web App)

- Ship the smallest change that satisfies the current spec; defer frameworks, abstractions, and extra dependencies until plan/tasks explicitly require them.
- Follow the existing project/template structure: clear separation of UI, application logic, and data/persistence layers; one responsibility per module/file.
- Prefer readable, boring code over clever patterns; consistent naming, formatting, and file layout across the codebase.
- No dead code, commented-out blocks, or speculative "future" features in mainline work.
- Validate inputs at boundaries (forms/API handlers); never trust client-side checks alone.
- Secrets and credentials MUST NOT be committed; use environment variables or local config excluded via `.gitignore`.
- Accessibility baseline: semantic HTML, keyboard-focusable controls, visible labels, sufficient contrast for core flows.

**Rationale**: A template-based MVP stays maintainable only when every layer stays simple, explicit, and safe by default.

### II. Testing Standards (Bare Minimum)

- Every feature from `spec.md` MUST have at least one automated test proving its primary user scenario (happy path).
- Add tests for critical edge cases called out in the spec (empty input, invalid dates, not-found, etc.).
- Prefer fast unit tests for pure logic; use a small number of integration or end-to-end tests for critical user journeys (was created reminder → see it in list).
- Tests MUST be deterministic, independent, and runnable in CI without manual steps.
- Do not merge implementation that breaks existing tests; fix or update tests only when the spec intentionally changes.
- Test names and structure MUST mirror user-facing behavior, not internal implementation details.

**Rationale**: Bare-minimum quality still requires proof that users can complete the flows we specify.

### III. User Experience Consistency

- One visual language across all screens: shared typography, spacing scale, button styles, form fields, and error/success messaging patterns from the template.
- Predictable navigation and layout; primary actions in consistent locations; destructive actions require clear confirmation.
- All user-visible errors are human-readable (what went wrong + what to do next); no raw stack traces or technical codes in the UI.
- Loading, empty, and error states are required for every list or async action—no blank screens.
- Date/time and timezone behavior MUST be explicit and consistent everywhere reminders are shown or edited.
- Mobile-friendly responsive layout for core flows (create, list, complete/delete reminder) without horizontal scroll on common phone widths.

**Rationale**: Reminder is a personal productivity web app; inconsistency and silent failures erode trust faster than missing features.

### IV. Performance Requirements (Bare Minimum Web App)

- Initial page load and first interactive paint MUST feel snappy on a typical laptop and mid-range mobile (avoid large unused bundles; lazy-load non-critical assets if needed).
- List and filter operations MUST remain smooth for at least hundreds of reminders on the client; paginate or virtualize only when spec/plan requires larger scale.
- No unnecessary network round-trips; batch or cache only when justified in `plan.md`.
- Database or storage operations on the hot path MUST use indexed/simple queries—no N+1 patterns in list views.
- Defer optimization until measured; document any performance trade-off in plan or PR notes.

**Rationale**: Performance targets are modest but non-negotiable for a client-heavy reminder list used daily.

### V. MVP Scope and Simplicity

- Reminder is a minimal web application for personal reminders, built on the standard Spec Kit / web-app template workflow.
- MVP first: no scope beyond what each feature spec defines.
- Complexity beyond bare minimum MUST be justified in `plan.md` against these principles.

**Rationale**: Scope discipline prevents over-engineering before user value is validated.

## Additional Constraints

- Browser-first SPA or MPA as chosen in `plan.md`; support latest two versions of Chrome, Firefox, Safari, and Edge unless spec narrows further.
- Persistence strategy (e.g. local SQLite, IndexedDB, or simple API) is decided in `/speckit-plan`—not in this constitution; this document only requires data integrity and recoverability for user reminders.
- Security baseline: sanitize user-generated text on display; CSRF/session rules per stack chosen in plan; HTTPS in production.

## Development Workflow and Quality Gates

- Spec-driven order is mandatory: constitution → spec (what/why) → plan (how/stack) → tasks → implement; do not skip artifacts.
- Implementation MUST trace to task IDs (T001, T002, …) and acceptance criteria in `spec.md`.
- Commits: small, focused messages; feature work on numbered branches (`001-feature-name`); prefer `Complete task: T00N …` during implementation.
- `/speckit-plan` and `/speckit-implement` MUST explicitly check compliance with code quality, testing, UX, and performance sections above.

## Governance

- This constitution supersedes ad-hoc coding preferences for all agents and contributors on this project.
- If `spec.md`, `plan.md`, or `tasks.md` conflict with the constitution, stop and resolve the conflict (update spec/plan or amend constitution with documented reason)—do not silently violate principles.
- Amendments require updating `constitution.md`, bumping the version line, and noting the change in the commit message; material changes SHOULD be reviewed with the project manager.
- Runtime guidance for agents: also follow `.cursor/rules/specify-rules.mdc` and read `plan.md` when implementing.

**Version**: 1.0.0 | **Ratified**: 2026-05-20 | **Last Amended**: 2026-05-20
