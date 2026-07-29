# Hybrid Rhythm - Git Branch Workflow Guide

## Why use branches?

- **main** = stable, working, deployable.
- **feature branch** = safe place to build new features.

```bash
main Branch
A──B──C──D

feature/hybrid-strategy Branch

               main
                │
                ▼
       A──B──C──D
                \
                 \
                  \
                   F──G──H
                     hybrid-strategy
```

> main stays stable.
>
> hybrid-strategy is where you experiment.
>
> You can break everything on the new branch and main is completely unaffected.

## Step 1 — Check your current branch

Open VS Code Terminal.

```bash
git branch
```

Example output:

```bash
* main
```

The <code>\*</code> means you're currently on <code>main</code>.

## Step 2 — Make sure everything is committed

Check:

```bash
git status
```

If you see this then it is perfect, If not, commit first.

```bash
nothing to commit, working tree clean
```

## Step 3 — Create a new branch

Create it:

```bash
git checkout -b feature/hybrid-strategy
```

## Step 4 — Push the branch to GitHub

The first time:

```bash
git push -u origin feature/hybrid-strategy
```

GitHub now has two branches.

```bash
- main

- feature/hybrid-strategy
```

# What happens now?

## Suppose tomorrow you make 50 commits.

```bash
feature/hybrid-strategy

Commit 1

Commit 2

Commit 3

...

Commit 50
```

> Main still looks like yesterday. Nothing changes there.

## Switching branches

Want to go back?

```bash
git checkout main
```

> Suddenly the project becomes exactly how it was before you started the feature.

## Go back:

```bash
git checkout feature/hybrid-strategy
```

> All your new work is back. It feels like magic the first time.

# Pulling updates

Suppose later you make a bug fix on main.

## Switch:

```bash
git checkout main
```

## Pull:

```bash
git pull origin main
```

Now <code>main</code> is updated.

## Go back:

```bash
git checkout feature/hybrid-strategy
```

> Your feature branch still has the old version of main.

## If you want those bug fixes too:

```bash
git merge main
```

## Now your feature branch contains:

> - All feature work
> - Latest bug fixes

# When the feature is finished

## Go back:

```bash
git checkout main
```

## Merge:

```bash
git merge feature/hybrid-strategy
```

> Now: main contains everything
>
> Your feature branch can stay there or be deleted.

# Deleting a feature branch

## Locally:

```bash
git branch -d feature/hybrid-strategy
```

## GitHub:

```bash
git push origin --delete feature/hybrid-strategy
```

# The workflow you'll use 95% of the time

## Start a feature

```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## During development

```bash
git add .
git commit -m "Implement Hybrid Strategy card"
git push
```

Notice that after the initial <code>-u</code> push, you can simply run <code>git push</code> and Git remembers which remote branch to use.

# Finish the feature

```bash
git checkout main
git pull origin main
git merge feature/new-feature
git push
```
