# /adjust-code

Adjusts, refactors, or extends existing feature code while keeping it aligned with the canonical pattern.

---

## [I] Intent

Modify one or more files inside an existing feature without breaking the pattern contracts defined in
`$PWD/.claude/patterns/spec-pattern.md`. This covers: adding a field, changing validation, renaming a column,
adding a new service method, fixing a bug, or updating i18n keys.

---

## [A] Analysis — gather before acting

1. **Read the spec**: `$PWD/.claude/patterns/spec-pattern.md` (full file) — mandatory before any edit.
2. **Read every file the user mentions** (or that is affected by the change).
3. **Identify the change surface**:
   - Does it touch the model/DTO? → also update `mapDto`, `mapModel`, and any form getters.
   - Does it touch the service? → check that list and form components still compile.
   - Does it touch routing? → check `app.routes.ts` and both resolvers.
   - Does it touch the list? → verify `getTableConfig()` titles and buttons.
   - Does it touch the form? → verify `createForm`, validations, `ngOnInit`, and `onSaveAction`.
   - Does it touch i18n keys? → update `$PWD/src/assets/i18n/pt-BR.json`.
4. **Collect from the user** (ask if not already clear):
   - Exact description of what must change and why.
   - Which feature / which files are in scope.

---

## [P] Plan — present before acting

After completing the analysis and **before writing any code**, present a plan to the user containing:

- List of files that will be created or modified, with a one-line description of each change.
- Any ambiguities or decisions that require the user's input.

**Wait for explicit approval before proceeding.** Do not start editing files until the user confirms.

---

## [S] Spec — what to respect during edits

Read `$PWD/.claude/patterns/spec-pattern.md` for the full contract. Key invariants that must hold after any edit:

| Layer | Invariant |
|---|---|
| Model | `id: number \| null` always present; `active: boolean` if the entity has lifecycle |
| DTO | All field names in snake_case Portuguese, matching the API |
| Service | `mapDto` and `mapModel` are always the single source of truth for field mapping |
| List | `loadTableConfig()` called in constructor; i18n keys in all user-facing strings |
| Form | Route data read in `ngOnInit`; `submit()` wraps save logic; cancel navigates to list |
| i18n | No hardcoded user-facing strings anywhere in templates or TS files |

---

## [D] Delivery — execution order

1. Read all files that will be touched (never edit blind).
2. Apply changes in dependency order: interfaces → service → routes → list → form.
3. Update i18n keys in `pt-BR.json` if any label changed (merge, never overwrite the file).
4. **Run `$PWD/.claude/patterns/spec-verification.md`** — execute every applicable check and fix all errors before continuing.
5. Report the full list of modified files, a summary of each change, and the verification result.

---

## [D] Decisions — hard rules

- **Never** rewrite a whole file when a targeted edit suffices — use Edit, not Write, for existing files.
- **Never** add `standalone: true` to any `@Component`.
- **Never** use hardcoded user-facing strings — always i18n keys.
- **Always** keep `mapDto` / `mapModel` in sync when a field is added or renamed.
- **Never** use `category` or `coin` as a reference — they are outdated. Reference `person` only.
- If the adjustment reveals that an existing file is outdated (e.g. hardcoded strings, `standalone: true`),
  flag it to the user and ask before touching it — do not silently refactor out of scope.
- **Never** report the task as done without completing step 4 (spec-verification). No exceptions.
