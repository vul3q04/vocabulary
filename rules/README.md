# Project Rules — vocabulary (Next.js + TypeScript)

Project-specific conventions. See `AGENTS.md` and `.hermes/rules/` for details.

- OpenSpec: `changes/` (Chinese), `specs/` (English)
- TDD with vitest (to be implemented)
- All AI-generated code requires `npm run lint` + `npm run build` verification
- **OpenSpec Change Rule**: Changes in `openspec/changes/` should not be committed; they are temporary work-in-progress. Only the generated `openspec/specs/` should be committed to the repository.

# Git
- `openspec/changes/` - Work in progress changes (ignored)
- `openspec/specs/` - Generated specs (committed)
- `node_modules/`
- `.next/`
- `coverage/`
- `build/`
- `*.tsbuildinfo`
- `next-env.d.ts`
- `.DS_Store`
- `*.pem`
- `.vercel`