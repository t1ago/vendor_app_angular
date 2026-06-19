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
