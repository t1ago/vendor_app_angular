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

## Database mapping

When a model, DTO, or service was touched (or for any new feature):

1. Query the table structure via MCP:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tb_{entity}'
ORDER BY ordinal_position;
```

2. Compare each column against the DTO and model:

| Coluna DB | Tipo DB | Nullable DB | Campo DTO | Campo Model | Mapeamento |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ✅ / ❌ |

3. Report:
   - ✅ if every column maps correctly with no divergence.
   - If any mismatch exists, show the table with the problem row highlighted and fix before proceeding.
