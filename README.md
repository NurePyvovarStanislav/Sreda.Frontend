# Sreda.Frontend

Демонстраційна веб-панель для системи **Sreda**: текстові та голосові команди, керування пристроями, перегляд подій і CRUD-адмінка для користувачів, команд та фраз.

Інтерфейс — **українською мовою**.

## Можливості

- **Dashboard** — текстові та голосові команди, результат виконання, TTS, огляд пристроїв/подій/історії
- **Пристрої** — перегляд, створення, редагування, видалення, оновлення стану
- **Події** — журнал системних подій з фільтрами
- **Історія команд** — розпізнані команди з фільтрами
- **Користувачі** — CRUD
- **Каталог команд** — CRUD для available commands
- **Фрази команд** — зіставлення фраз з командами (CRUD)

## Стек

| Технологія | Призначення |
|------------|-------------|
| React 19 + TypeScript | UI |
| Vite | збірка та dev-сервер |
| Mantine UI | компоненти, темна тема |
| TanStack Query | запити та мутації |
| Axios | HTTP-клієнт |
| React Router | маршрутизація |
| Tabler Icons | іконки |

## Вимоги

- Node.js 20+
- npm
- Запущений backend **Sreda.Backend** (за замовчуванням `https://localhost:7186`)

## Швидкий старт

```bash
# 1. Встановити залежності
npm install

# 2. Налаштувати змінні середовища
cp .env.example .env

# 3. Запустити dev-сервер
npm run dev
```

За замовчуванням Vite відкриває `http://localhost:5173`.

## Змінні середовища

| Змінна | Опис | За замовчуванням |
|--------|------|------------------|
| `VITE_API_BASE_URL` | Base URL backend API | `https://localhost:7186` |

Приклад — файл `.env.example`:

```env
VITE_API_BASE_URL=https://localhost:7186
```

## Скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Dev-сервер з HMR |
| `npm run build` | TypeScript + production build |
| `npm run preview` | Перегляд production-збірки |
| `npm run lint` | ESLint |

## Маршрути

| Шлях | Сторінка |
|------|----------|
| `/` | Головна панель (Dashboard) |
| `/devices` | Пристрої |
| `/events` | Події |
| `/commands` | Історія команд |
| `/users` | Користувачі |
| `/available-commands` | Каталог команд |
| `/command-phrases` | Фрази команд |

## Структура проєкту

```
src/
  api/              # HTTP-клієнти (axios)
  components/
    common/         # PageHeader, LoadingState, ErrorState, FormSwitch, …
    dashboard/      # Dashboard-компоненти
    layout/         # AppShell, Navbar
    users/          # Форми користувачів
    devices/        # Форми пристроїв
    availableCommands/
    commandPhrases/
  pages/            # Сторінки маршрутів
  types/            # TypeScript-типи DTO
  utils/            # display, form, audio, mantine helpers
  App.tsx
  main.tsx
```

## API

Базовий клієнт: `src/api/client.ts`  
Помилки HTTP обробляються глобальним interceptor і показуються через Mantine Notifications.

Основні модулі:

| Модуль | Endpoint-и |
|--------|------------|
| `voiceApi` | `/api/voice/process-text`, `/api/voice/process-with-speech`, `/api/voice/speak`, … |
| `devicesApi` | `/api/devices`, `/api/devices/{id}/state` |
| `eventsApi` | `/api/events` |
| `commandsApi` | `/api/commands` |
| `usersApi` | `/api/users` |
| `availableCommandsApi` | `/api/available-commands` |
| `commandPhrasesApi` | `/api/command-phrases` |

### Голосові команди

- **Повний цикл (STT → команда → TTS):** `POST /api/voice/process-with-speech` — повертає `audioBase64`
- **Окрема озвучка тексту:** `POST /api/voice/speak` — повертає `audio/wav` (Blob)

## Архітектура UI

```
Текст / голос
      ↓
  voiceApi → Sreda.Backend
      ↓
  Dashboard (результат + notifications)
      ↓
  invalidation queries: devices, events, commands
```

CRUD-сторінки використовують `useQuery` / `useMutation` з invalidation відповідних query keys після успішних мутацій.

## Пов’язані репозиторії

- **Sreda.Backend** — ASP.NET Core API, MediatR, voice pipeline, CRUD endpoints

## Примітки для розробки

- React 19: значення з `event.currentTarget` потрібно читати **синхронно** в обробнику, до callback `setState` (див. `FormSwitch`, `src/utils/form.ts`)
- `Select` у модалках використовує `comboboxProps={{ withinPortal: false }}` (`src/utils/mantine.ts`)
- Backend має бути доступний до запуску frontend, інакше сторінки покажуть повідомлення про недоступність API
