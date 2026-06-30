# UX Insight – Claude Instructions

UX Insight is a JSON-first UX reporting platform.

Current priority:
Build a clean Angular report viewer for schema-compliant UX audit JSON files.

Rules:
- Do not change the JSON schema unless explicitly asked.
- Treat reports/*.json as source of truth.
- Keep frontend independent from report content.
- Use Angular standalone components, signals, TypeScript and SCSS.
- Keep components small and reusable.
- Prioritize accessibility, maintainability and clear UX.
- Do not add backend, auth or database.
- Do not invent report fields. Use the schema.
- Before coding, explain what files you will change.

Project structure:
- app/ = Angular frontend
- reports/ = report data
- schemas/ = versioned JSON schema
- scripts/ = validation/generation tools
- docs/ = documentation

Design direction:
Modern SaaS dashboard, clean cards, score visualizations, strong typography, light/dark theme later.