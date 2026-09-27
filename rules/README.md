# Project Rules — vocabulary (Next.js + TypeScript)

Project-specific conventions. See `AGENTS.md` and `.hermes/rules/` for details.

- OpenSpec: `changes/` (Chinese), `specs/` (English)
- TDD with vitest (to be implemented)
- All AI-generated code requires `npm run lint` + `npm run build` verification
- **OpenSpec Change Rule**: Changes in `openspec/changes/` must be accompanied by corresponding updates to `openspec/specs/` before the change can be archived or committed. The specs directory should reflect the implemented functionality.

# Git
- `openspec/changes/` - Work in progress changes
- `openspec/specs/` - Generated specs (should be updated with changes)
- `node_modules/`
- `.next/`
- `coverage/`
- `build/`
- `*.tsbuildinfo`
- `next-env.d.ts`
- `.DS_Store`
- `*.pem`
- `.vercel`