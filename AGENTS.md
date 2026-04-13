# AGENTS.md

## Project Context

- This repository is `repo-save-editor`, a web-based save editor for the game `R.E.P.O.`.
- The app loads encrypted `.es3` save files, decrypts them locally, lets the user edit save values, and exports encrypted `.es3` files again.
- Main editable areas in the current app are run stats, purchased items, player upgrades, player health/status, and player removal.
- The stack is `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, and `next-intl`.

## Save File Context

- `.es3` is the game save format handled by this repo.
- Encryption and decryption use the project key and AES-based logic implemented in the repo codebase.
- Use `pnpm run encrypt-save` and `pnpm run decrypt-save` for save conversion tasks.
- Reference saves used for inspection or experiments live under `refs/`.
- Purchased item reference: `https://repo-2025horror.fandom.com/wiki/Purchased_Items`
- Upgrade reference: `https://repo-2025horror.fandom.com/wiki/Upgrades`

## Working Rules

- Always run `pnpm lint` after making changes.
- Prefer `pnpm` for project commands.
- Prefer minimal code changes and avoid unnecessary refactors.
- When changing UI labels or item names, match in-game or wiki terminology exactly where possible.

## Repo Command Rules

- Repo command rules are defined in `.agents/rules/default.rules`.
