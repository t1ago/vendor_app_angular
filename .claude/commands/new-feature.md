# /new-feature

Creates a complete Angular feature (interfaces, service, routes, list, form) following the canonical pattern.

---

## [I] Intent

Generate all files for a new feature from a user-supplied entity description or MER (entity-relationship model).
Every file must conform to `$PWD/.claude/patterns/spec-pattern.md` — read it before writing a single line of code.

---

## [A] Analysis — gather before acting

1. **Read the spec**: `$PWD/.claude/patterns/spec-pattern.md` (full file).
2. **Read app routing**: `$PWD/src/app/app.routes.ts` to find the correct insertion point and check for existing paths.
3. **Read i18n file**: `$PWD/src/assets/i18n/pt-BR.json` to identify existing keys and choose the right namespace.
4. **Collect from the user** (ask if not already provided):
   - Feature name (English, singular, e.g. `product-unit`)
   - Parent group folder, if any (e.g. `products`) — or top-level under `features/`
   - API `basePath` (e.g. `/tiago/unidade`)
   - Entity fields: name, type, nullable?, maps to which DTO field name?
   - Which fields are required / have validations?

---

## [P] Plan — present before acting

After completing the analysis and **before writing any code**, present a plan to the user containing:

- List of files that will be created or modified, with a one-line description of each.
- The chosen entity name, route path, and API base path.
- Any ambiguities or missing information that require the user's input.

**Wait for explicit approval before proceeding.** Do not create any file until the user confirms.

---

## [S] Spec — what to generate

Read `$PWD/.claude/patterns/spec-pattern.md` for the complete contract.
The checklist below maps spec sections to concrete files:

| Spec section | File to create |
|---|---|
| §1 Interfaces | `interfaces/{featureName}-model.ts` |
| §1 Interfaces | `interfaces/{featureName}-dto.ts` |
| §2 Service | `services/{featureName}-service.ts` |
| §2 Service | `services/{featureName}-service.spec.ts` |
| §3 Routes | `routes/{featureName}.routes.ts` |
| §3 Routes | `routes/{featureName}-data-all-resolver.ts` |
| §3 Routes | `routes/{featureName}-data-id-resolver.ts` |
| §4 List | `list/{featureName}-list.ts` |
| §4 List | `list/{featureName}-list.html` |
| §4 List | `list/{featureName}-list.scss` (empty) |
| §4 List | `list/{featureName}-list.spec.ts` |
| §5 Form | `form/{featureName}-form.ts` |
| §5 Form | `form/{featureName}-form.html` |
| §5 Form | `form/{featureName}-form.scss` (empty) |
| §5 Form | `form/{featureName}-form.spec.ts` |
| §7 i18n | keys in `$PWD/src/assets/i18n/pt-BR.json` |
| §8 Routing | entry in `$PWD/src/app/app.routes.ts` |

All files go under:
`$PWD/src/app/main/features/{group?}/{featureName}/`

---

## [D] Delivery — execution order

Execute in this order to avoid import errors:

1. Create `interfaces/` files (no deps).
2. Create `services/` files (depends on interfaces).
3. Create `routes/` files (depends on service).
4. Create `list/` files (depends on interfaces, service, routes).
5. Create `form/` files (depends on interfaces, service, routes).
6. Add i18n keys to `pt-BR.json` (merge into existing JSON, do not overwrite the file).
7. Register the route in `app.routes.ts`.

7. **Run `$PWD/.claude/patterns/spec-verification.md`** — execute every applicable check and fix all errors before continuing.
8. Report the full list of created files and the verification result to the user.

---

## [D] Decisions — hard rules

- **Never** add `standalone: true` to `@Component` — Angular 21 default, it's redundant.
- **Never** use hardcoded user-facing strings — always use i18n keys + `TranslatePipe` / `TranslateService.instant()`.
- **Always** use `ngOnInit` (not constructor) to read resolver data in the form component.
- **Always** use `loadTableConfig()` in the list constructor (not `loadData()` alone).
- **Never** use `category` or `coin` as a reference — they are outdated. Reference `person` only.
- File paths in imports must use path aliases (`@shared/*`) for shared code and relative paths for feature-internal code.
- **Never** report the task as done without completing step 7 (spec-verification). No exceptions.
