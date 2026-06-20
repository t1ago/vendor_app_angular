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

1. Fetch the API spec from the backend (requires `SWAGGER_ENABLED=true` on vendor_service):
```bash
curl -s http://localhost:3000/api-spec | jq '.components.schemas.{EntityName}'
```

2. Compare each field in the schema against the Angular model/DTO:

| Campo API | Tipo API | Nullable | Campo Model Angular | Campo DTO | Mapeamento |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ✅ / ❌ |

3. Report:
   - ✅ if every field maps correctly with no divergence.
   - If any mismatch exists, show the table with the problem row highlighted and fix before proceeding.

> If vendor_service is not running, fall back to reading the schema file directly:
> `vendor_service/src/modulos/tiago/{module}/{module}_schema.ts`
