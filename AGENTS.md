<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 檔案操作安全
- 刪除任何檔案前必須先獲得使用者同意。

## Git 操作限制
- 您只能執行 `git commit` 操作，禁止直接 `git push` 到遠端。
- 遠端設定（如 `git remote add`、`git remote set-url` 等）必須由使用者親自執行。

Project rules reference: see `./rules/README.md`. OpenSpec workflow applies: `changes/` (中文) vs `specs/` (英文). AI-assisted code requires TDD (vitest) and must pass `npm run lint` + `npm run build`.

## 檔案操作安全
- 刪除任何檔案前必須先獲得使用者同意。
