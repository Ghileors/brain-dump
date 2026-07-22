# Project: AI Day Planner (MVP)

## Purpose
Мобільний AI-планер дня у стилі Todoist. Користувач вивалює все, що в голові, голосом
або текстом — AI перетворює хаос на структуровані задачі (пріоритет, час, дедлайн)
і формує план на сьогодні.

## Core Scenario
Brain dump → AI парсить текст → створює задачі → Inbox → Today.
Це єдиний обов'язковий наскрізний сценарій. Усе інше — розширення поверх нього.

## Tech Stack

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui

**AI Layer**
- Anthropic API
- `claude-haiku-4-5` — парсинг задач (швидко, дешево)
- `claude-sonnet` (опційно) — складніший reasoning: перепланування, пріоритизація

**Data**
- MVP: localStorage / in-memory state (React state)
- Розширення (за потреби): Supabase (Postgres, free tier) або Vercel KV

**Voice Input**
- Web Speech API (нативний, безкоштовний)

**Infra / Deploy**
- GitHub — репозиторій
- Vercel — деплой, автопуш на кожен commit
- ANTHROPIC_API_KEY — тільки в env на Vercel, ніколи в коді/git

**Dev Tools**
- Claude Code (режим Plan → Accept edits → Auto)
- Claude Cowork — планування, ревʼю, документи

## Conventions
- Спочатку "працює", потім "красиво".
- Один сценарій наскрізь до інших фіч.
- Секрети — лише в env на сервері.
- Не довіряти відповіді AI на слово — валідувати й чистити формат.
- Deploy — перший крок, не останній.

## Roadmap (high level)
1. Інфраструктура і спека (repo + deploy + domain model)
2. Core-сценарій наскрізь (Capture → AI parse → Inbox → Today)
3. Голосовий ввід (Web Speech API → той самий пайплайн)
4. UX/UI, mobile-first
5. Фінальна перевірка і полірування (демо, Loom)

Кожен крок з роадмапу оформлюється як окремий change у `openspec/changes/`.
