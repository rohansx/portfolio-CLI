import { BlogPost } from "../../typings";

const post: BlogPost = {
  id: "10",
  title:
    "Every AI Agent Tool Creates Git Worktrees. None of Them Make Worktrees Actually Work.",
  date: "2026-03-05",
  slug: "ai-agent-worktrees-none-actually-work",
  summary:
    "Conductor, Claude Squad, Agent Deck — they all spin up git worktrees for parallel AI agents. They all leave you with an empty shell. I built the missing environment layer.",
  content: `
# Every AI Agent Tool Creates Git Worktrees. None of Them Make Worktrees Actually Work.

I've been deep in the parallel AI agent ecosystem for months — Conductor, Claude Squad, Agent Deck, Claude Code's native agent teams. They all converge on the same architecture: spin up git worktrees, run an AI agent in each one, merge the results.

And they all have the same problem: **the worktree is empty.**

\`\`\`
git worktree add ../my-feature feature/auth
cd ../my-feature
# Where's my .env? Gone.
# Where's node_modules? Gone.
# Where's my Docker compose state? Gone.
# Where's my database config? Gone.
# Time to write 50-100 lines of bash. Again.
\`\`\`

## The Bash Scripts Nobody Talks About

Every parallel agent workflow has a dirty secret: a setup script that does the actual work.

Here's what Conductor's docs tell you to write:

\`\`\`bash
#!/bin/bash
cp ../.env .env
pnpm install
\`\`\`

Looks simple. Now here's what real Conductor users *actually* write. A Phoenix developer published [his setup script](https://nicholasjhenry.medium.com/building-isolated-phoenix-workspaces-for-ai-agents-with-conductor-a438d161f191) — it symlinks shared configs, copies build artifacts to avoid recompilation, reads Conductor's environment variables, generates workspace-specific \`.env.local\` files with unique ports and Docker compose project names, and sets up isolated containers per workspace.

Another team [published their scripts](https://www.10play.dev/blog/worktree-10x-development) — they generate unique database names from workspace directories, allocate workspace-specific ports via a port registry, create PostgreSQL databases per workspace, generate \`.env\` files with unique \`DATABASE_URL\` and \`PORT\`, assign iOS simulators per workspace, and do full cleanup on teardown.

Someone even built [train-conductor](https://jsr.io/@wyattjoh/train-conductor) — a standalone Deno tool that exists purely to do symlinks and scripts in worktrees, because no orchestration tool handles it.

**The same pattern repeats everywhere.** Claude Squad creates worktrees but doesn't install deps. Agent Deck creates worktrees but doesn't copy your \`.env\`. Claude Code's native agent teams create worktrees but don't symlink \`node_modules\`. Every tool assumes someone else will solve the environment problem.

Nobody does.

## The Real Problem: Code Isolation ≠ Environment Isolation

Git worktrees give you code isolation. Your files are separate. Your branches don't conflict.

But your **runtime environment** is still shared:

- **Port conflicts**: Two worktrees both run \`npm run dev\` on port 3000. One fails.
- **Database collisions**: Two agents write to the same dev database. Data corruption.
- **Docker chaos**: Two worktrees share \`docker compose\` project namespace. Containers clobber each other.
- **Disk explosion**: 5 worktrees × 2GB \`node_modules\` = 10GB wasted. One Cursor user reported 9.82 GB consumed in 20 minutes.
- **Missing env files**: \`.env\`, \`.envrc\`, \`.npmrc\`, secrets — none of them are tracked by git, so none of them exist in new worktrees.

One developer summed it up perfectly: "Git worktree gives you multiple working directories but they still share the same database, same ports, same Docker daemon — it solves code isolation, not environment isolation."

## I Built the Missing Piece

[workz](https://github.com/rohansx/workz) is a Rust CLI that makes any git worktree a fully functional dev environment. One command. Zero config.

\`\`\`bash
workz start feature/auth
# ✓ Created worktree
# ✓ Detected Node.js project (pnpm-lock.yaml)
# ✓ Symlinked node_modules, .next, .turbo (saved 2.1 GB)
# ✓ Copied .env, .env.local, .envrc, .npmrc
# ✓ Installed dependencies (pnpm install --frozen-lockfile)
# ✓ You're in the worktree. Ready to code.
\`\`\`

### What it does automatically

**Smart project detection** — workz detects your project type (Node/Rust/Python/Go/Java) and only syncs relevant directories. No config file needed.

**Symlinks heavy directories** — \`node_modules\`, \`target/\`, \`.venv\`, \`vendor/\`, \`.next\`, \`.nuxt\`, \`.angular\`, \`.gradle\`, \`build/\`, and 13 more. One copy on disk, symlinked everywhere. A typical Node project saves 1-3 GB per worktree.

**Copies env files** — 17 patterns: \`.env\`, \`.env.*\`, \`.envrc\`, \`.tool-versions\`, \`.node-version\`, \`.python-version\`, \`.npmrc\`, \`.yarnrc.yml\`, \`docker-compose.override.yml\`, secrets files. Everything you need, nothing lost.

**Auto-installs dependencies** — detects your lockfile (\`bun.lockb\`, \`pnpm-lock.yaml\`, \`yarn.lock\`, \`package-lock.json\`, \`uv.lock\`, \`poetry.lock\`, \`Pipfile.lock\`, \`requirements.txt\`) and runs the right install command automatically.

**Docker support** — \`workz start feature/api --docker\` runs \`docker compose up -d\` in the new worktree. \`workz done\` stops the containers.

**AI-agent ready** — \`workz start feature/auth --ai\` launches Claude Code directly in the worktree. Also supports Cursor and VS Code.

### The new thing: \`--isolated\`

This is what nobody else has. Not Conductor, not Claude Squad, not anyone:

\`\`\`bash
workz start feature/auth --isolated
# Everything above, PLUS:
# ✓ Assigned PORT=3001 (unique, no conflict)
# ✓ Set DB_NAME=myapp_feature_auth
# ✓ Set COMPOSE_PROJECT_NAME=myapp-feature-auth
# ✓ Wrote workspace-specific .env.local
# ✓ Docker containers are namespaced
\`\`\`

Now you can run 5 worktrees with 5 dev servers, 5 databases, and 5 Docker stacks — zero conflicts. And when you're done:

\`\`\`bash
workz done feature/auth
# ✓ Stopped Docker containers
# ✓ Released port 3001
# ✓ Removed worktree
# ✓ Optionally deleted branch
\`\`\`

Full cleanup. No orphaned containers. No stale port allocations.

## Works With Everything

workz isn't an orchestration tool. It's the **environment layer** that every orchestration tool is missing.

**With Conductor** — replace your 50-line setup script:

\`\`\`json
{
  "scripts": {
    "worktree": "workz sync --isolated",
    "setup": "workz sync --isolated"
  }
}
\`\`\`

**With Claude Squad** — add to your session setup:

\`\`\`bash
cs new --setup "workz sync --isolated"
\`\`\`

**With Claude Code agent teams** — use as a post-worktree hook.

**Or standalone** — workz works perfectly on its own. No orchestrator required.

## The Numbers

For a typical Node.js project with 5 parallel worktrees:

| | Without workz | With workz |
|--|---------------|------------|
| Disk usage | ~12 GB | ~3.5 GB |
| Setup time | 3-5 min (npm install × 5) | <10 sec (symlink + copy) |
| Port conflicts | Guaranteed | Zero |
| Missing .env | Every time | Never |
| Cleanup effort | Manual rm + prune + docker down | \`workz done\` |

## Install

\`\`\`bash
# Homebrew (macOS/Linux)
brew tap rohansx/tap && brew install workz

# Cargo
cargo install workz
\`\`\`

Single binary. No runtime dependencies. Works on Linux, macOS, and Windows.

Add shell integration for auto-cd (like zoxide):

\`\`\`bash
# ~/.zshrc or ~/.bashrc
eval "$(workz init zsh)"
\`\`\`

## Try It

\`\`\`bash
# Basic: create a worktree with full environment
workz start feature/login

# With isolation: unique ports, Docker, DB naming
workz start feature/auth --isolated

# With AI: launch Claude Code in the worktree
workz start feature/api --ai --isolated --docker

# See all worktrees with status
workz list

# Clean up
workz done feature/login
\`\`\`

Star the repo if this solves a pain point for you: [github.com/rohansx/workz](https://github.com/rohansx/workz)

---

*workz is open source (MIT). Built in Rust. Contributions welcome.*
  `,
  author: "Rohan Sharma",
};

export default post;
