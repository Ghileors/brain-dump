# Design: Step 1 — Infra & Spec

## Repo & Deploy
- GitHub repo → підключення до Vercel через Git-інтеграцію (автодеплой на push у `main`).
- Preview-деплої на кожен PR/бранч — зручно перевіряти наступні кроки ізольовано.

## Project Structure (Next.js App Router)
```
app/
  layout.tsx
  page.tsx           # Capture + Today (MVP — один екран)
lib/
  types.ts           # Task, Inbox, Today — з domain-model spec
  storage.ts         # обгортка над localStorage / React state
.env.local           # локально, у .gitignore
```

## State Management (MVP)
- Без бекенду: React state + localStorage sync (persist між сесіями браузера).
- Абстракція `storage.ts` заздалегідь ізолює логіку зберігання, щоб пізніше
  замінити на Supabase/Vercel KV без переписування UI-компонентів.

## Env & Secrets
- `ANTHROPIC_API_KEY` додається лише через Vercel dashboard (Project → Settings → Environment Variables).
- Локально — `.env.local`, у `.gitignore` з першого коміту.
- Виклики Anthropic API — тільки із server actions / API routes, ніколи з клієнта.

## Domain Model → Code
`types.ts` дзеркалить `openspec/specs/task-domain/spec.md` один в один — будь-яка
зміна моделі спочатку йде в spec, потім у код.

## Risks
- Ризик: почати з "красивого UI" замість working skeleton → порушує конвенцію
  "спочатку працює, потім красиво". Мітигація: Step 1 приймається тільки за
  критерієм "публічний URL без помилок", дизайн — мінімальний.
