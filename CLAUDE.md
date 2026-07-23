## Security Rules
- Никогда не хардкодь секреты/ключи в коде — только через process.env на сервере.
- Никогда не логируй ANTHROPIC_API_KEY или его часть в консоль/комментарии.
- Все вызовы Anthropic API — только из server actions/API routes, не из клиентских компонентов.
- Ответ AI (parsed tasks) всегда валидировать перед сохранением — не доверять формату на слово.
- Не выполнять `git push --force`, не менять историю без явного запроса.
- Перед добавлением новой npm-зависимости — сообщить пользователю, зачем она нужна.

## Workflow Rules
- Перед тем как начинать описывать proposal (т.е. до `/opsx:propose` / `openspec new change`
  и до создания любых файлов в `openspec/changes/`), сначала сделать
  `git checkout -b step<N>-<slug>` от `dev`. Спека и вся реализация этого шага
  делаются в этой ветке, не в `dev` и не в `master`.
- Ветку шага чекаутить от `dev` (не от `master`), PR из неё делать в `dev`.
- После тестирования на `dev` создаётся отдельный PR из `dev` в `master`.
- При архивировании change (`openspec/changes/<slug>` → `openspec/changes/archive/`) обновлять версию приложения в `package.json` (semver).
