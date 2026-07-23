# Brain Dump

AI-планер дня: вивалюєш усе, що в голові, голосом або текстом — AI перетворює це на структуровані задачі (пріоритет, час, дедлайн) і формує план на сьогодні.

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Anthropic API (Claude) для парсингу задач
- localStorage для збереження стану (MVP)

## Development

```bash
cp .env.example .env.local  # fill in ANTHROPIC_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`ANTHROPIC_API_KEY` must also be set as a Vercel project env var (Production + Preview) —
`/api/parse` reads it server-side only, via `process.env`.

## Project Docs

See `openspec/project.md` for the full spec, roadmap, and conventions.