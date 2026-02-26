# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in early initialization — no build system, framework, or application code exists yet. The current files are environment scaffolding only.

## Environment Variables

Environment variables are managed via [varlock](https://varlock.dev) using the `@env-spec` format defined in `.env.schema`. TypeScript types are auto-generated into `env.d.ts` (do not edit directly). The schema supports both `import.meta.env` (Vite) and `process.env` (Node.js).

- `LINEAR_API_KEY` — Linear project management API key (sensitive)

To regenerate `env.d.ts` after modifying `.env.schema`, use the varlock CLI.

## Linear Integration

The project uses the Linear API for project management. The CLI is available as `lin` (from `@linear/cli`). Authentication uses `LINEAR_API_KEY` from `.env`.

## Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Vercel CLI | `vercel` | Deployment and hosting |
| Linear CLI | `lin` | Project management (issues, branches) |
