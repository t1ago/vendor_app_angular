# spec-verification.md

Checklist to run after any code change. Execute every applicable step before reporting a task as done.

---

## Build

```bash
npm run build:dev
```

- Must pass with **zero errors**.
- If it fails, fix all errors before proceeding.

---

## i18n

When `src/assets/i18n/pt-BR.json` was touched:
- Confirm the JSON is valid (no trailing commas, balanced braces).

---

## Imports

When new files were created or imports changed:
- Confirm path aliases are correct: `@shared/*` → `src/app/shared/*`, `@features/*` → `src/app/main/features/*`.
- Confirm no broken relative imports.

---

## API contract mapping

When a model, DTO, or service was touched (or for any new feature):

Fetch the live API contract first — the backend must be running:

```bash
curl -s http://localhost:3000/api-spec
```

> This is the single source of truth. Never read backend source files directly.

For each Angular service method, execute the following steps:

**Step A — Locate the path in the spec**
Find the matching `verb + path` under `paths` in the spec JSON.

**Step B — Resolve the response schema**
From `responses.200.content.application/json.schema.$ref`, resolve the `$ref` chain through `components.schemas` until you reach the concrete field list (e.g. `EnderecoResponse → allOf → ResultadoAPI + { data: Endereco }` → `Endereco` fields).

**Step C — Read the Angular implementation**
Read the method body: what does it extract from the response? Trace through `value.data`, `pipe/map`, `mapModel`, `mapDto`, nested field access — whatever the method actually reads.

**Step D — Compare field by field**
Every field the Angular code reads must exist in the resolved schema. Flag any field that is read but absent from the schema, or any required schema field that is never read.

**Step E — Output the result table**

| service.method | endpoint | status | description |
|---|---|---|---|
| `ServiceName.methodName` | `VERB /path` | ✅ | |
| `ServiceName.methodName` | `VERB /path` | ❌ | field `x` read by Angular but absent from spec schema `Y` |

Report one row per method. If all fields match, leave description empty. If any mismatch, describe exactly which field and which schema diverges.
