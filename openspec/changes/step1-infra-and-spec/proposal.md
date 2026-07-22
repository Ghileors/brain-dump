# Proposal: Step 1 — Infra & Spec

## Why
Перш ніж писати core-сценарій, потрібен working skeleton: репозиторій, деплой,
зафіксована доменна модель. Це знижує ризик "переписувати на середині" і дає
публічний URL для перевірки кожного наступного кроку вже з першого дня.

## What Changes
- Ініціалізація Next.js (App Router) + Tailwind + shadcn/ui.
- Публічний репозиторій на GitHub, автодеплой на Vercel при кожному push.
- ENV: `ANTHROPIC_API_KEY` виключно у Vercel env, .env у .gitignore.
- Зафіксована доменна модель (`Task`, `Inbox`, `Today`) у вигляді spec + `types.ts`.
- Порожній, але робочий UI (без падінь на публічному URL).

## Out of Scope
- AI-парсинг тексту (Step 2).
- Голосовий ввід (Step 3).
- Фінальний UX/полірування (Step 4–5).

## Acceptance Criteria
- [ ] Репозиторій створено, публічний, з описом проекту.
- [ ] Vercel-деплой працює, публічний URL відкривається без помилок.
- [ ] `openspec/specs/task-domain/spec.md` описує модель `Task`, `Inbox`, `Today`.
- [ ] `types.ts` у коді відповідає spec.
- [ ] `ANTHROPIC_API_KEY` присутній лише в Vercel env, не закомічений у git.
