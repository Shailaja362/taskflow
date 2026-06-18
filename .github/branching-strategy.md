# Git Branching Strategy (Trunk-Based + short-lived feature branches)

- `main` — always deployable. Protected. CI must pass to merge.
- `feature/<ticket>-<short-desc>` — branched off `main`, short-lived (< 2 days).
- `fix/<ticket>-<short-desc>` — bug fixes.

## Workflow
1. `git checkout -b feature/TF-12-task-filters`
2. Commit using Conventional Commits: `feat: add task status filter`
3. Push and open a Pull Request into `main`.
4. CI (Jenkins) runs lint + tests + security scan as required checks.
5. At least one code review approval required.
6. Squash-merge into `main`. Merging triggers the deploy stage.

## Commit message convention
- `feat:` new feature
- `fix:` bug fix
- `chore:` tooling/infra
- `docs:` documentation
- `test:` tests only
