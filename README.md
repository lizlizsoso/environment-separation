# Sierra Edit User Modal

Visual prototype of the Sierra admin **Edit user** modal, matched to the provided screenshot.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default: http://localhost:5173).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

## Behavior

- Modal opens on load; click the backdrop or **×** to close
- **Full name** is editable; **Email** is read-only
- **Roles** and **Environment** support add/remove via tag multi-select
- **Save** updates local state only (no API)
