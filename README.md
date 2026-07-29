# Hybrid Rhythm - Git Branch Workflow Guide

## Why use branches?

- **main** = stable, working, deployable.
- **feature branch** = safe place to build new features.

```text
main
A──B──C──D──E

feature/hybrid-strategy
A──B──C──D──E──F──G──H
```

## Start a Feature

```bash
git checkout main
git pull origin main
git checkout -b feature/hybrid-strategy
git push -u origin feature/hybrid-strategy
```

## Daily Work

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Switch Branches

```bash
git checkout main
git checkout feature/hybrid-strategy
```

## Update Your Feature Branch

```bash
git checkout main
git pull origin main

git checkout feature/hybrid-strategy
git merge main
```

## Finish the Feature

```bash
git checkout main
git pull origin main
git merge feature/hybrid-strategy
git push
```

# Bug Fix on main Branch

## Switch

```bash
git checkout main
```

## Pull if main is not updated

```bash
git pull origin main
```

## Go back: if main needs update

```bash
git checkout feature/hybrid-strategy
```

## Now mearge the main's bug fix with new Branch

```bash
git merge main
```

## Delete the Branch (Optional)

Local:

```bash
git branch -d feature/hybrid-strategy
```

Remote:

```bash
git push origin --delete feature/hybrid-strategy
```

## Cheat Sheet

### Create a new feature

```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

### Work

```bash
git add .
git commit -m "Your commit message"
git push
```

### Merge

```bash
git checkout main
git pull origin main
git merge feature/new-feature
git push
```

## Suggested Branch Naming

```text
main
├── feature/hybrid-strategy
├── feature/settings
├── feature/export-report
├── feature/mobile-ui
└── hotfix/chart-bug
```

## Notes

- Keep **main** stable.
- One feature per branch.
- Commit often with meaningful messages.
- Merge into **main** only when the feature is complete.
- Since you're the only developer, you don't need Pull Requests yet,
  but they're worth learning later.
