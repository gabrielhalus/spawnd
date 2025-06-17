<div align="left">
  <img src="https://cdn.discordapp.com/attachments/1384503521407275052/1384506614517858317/spawnd.svg?ex=6852adc3&is=68515c43&hm=2ece36452269ad34224bc2ea68993a34a727fab66752574d39dec83c650dbfb5&" alt="Spawnd Logo" />
</div>

<p align="left">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun Badge" />
  <img src="https://img.shields.io/badge/Hono-FF7E1B?style=for-the-badge&logo=hono&logoColor=white" alt="Hono Badge" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite Badge" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge" />
</p>

## 📁 Monorepo Structure

This project uses **Turborepo** to manage multiple packages:

```text
.
├── apps/
│ ├── web/ # React + Vite frontend
│ └── api/ # Hono backend with Bun
├── packages/
│ └── shared/ # Shared types and utilities
├── .env
├── bun.lockb
├── turbo.json
└── tsconfig.json
```

## ⚙️ Prerequisites

- [Bun](https://bun.sh/docs/installation)

## 💻 Development

### 1. Clone the repository

```bash
git clone https://github.com/gabrielhalus/spawnd.git --depth=1
cd spawnd
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Create API `.env` File

Before running the database migration, copy the `.env.example` file for the backend:

```bash
cp apps/api/.env.example /apps/api/.env
```

Then **customize any variables** as needed, such as `DATABASE_URL`.

### 4. Generate SQLite Database

```bash
bun run db:migrate
```

> This will create the SQLite database with the required schema.

### 5. Start the Dev Servers

Run all apps concurently:

```bash
bun run dev
```

Or start individually:

```bash
# Backend
cd apps/api
bun run dev

# Frontend
cd apps/web
bun run dev
```

## 🔍 Linting (ESLint)

This monorepo includes ESLint configs for all apps and packages. To check code style and catch errors, run:

```bash
bun run lint
```

This will run linting across all workspaces (backend, frontend, shared packages).

Make sure to fix lint warnings/errors before committing to maintain code quality.
