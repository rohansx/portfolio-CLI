import { BlogPost } from "../../typings";

const post: BlogPost = {
  id: "6",
  title: "The Git Worktree Nightmare That Made Me Build workz",
  date: "2026-02-28",
  slug: "git-worktree-nightmare-made-me-build-workz",
  summary:
    "How running multiple AI agents exposed git worktree pain — and why I built workz to fix it.",
  content: `
# The Git Worktree Nightmare That Made Me Build workz

Hey, I'm Rohan.

For the last few months I've been going a bit crazy with AI coding agents — Claude, Cursor, all of them. I love running 3–4 agents at the same time so one can build a feature while another fixes bugs and the third reviews my PR. Sounds amazing, right?

But every single time I tried to use git worktrees (the official way to have multiple branches open in separate folders), I hit the same wall:

I create a new worktree → boom, all my \`.env\` files are missing.

I copy them manually.

Then I wait 8–12 minutes while \`npm install\` or \`cargo build\` or \`uv sync\` downloads the same 2 GB of \`node_modules\` / \`target\` / \`.venv\` again.

**I was wasting 15–20 minutes every time I switched branches. And I was doing this 5–6 times a day.**

I started googling "git worktree node_modules symlink" and found… a bunch of random bash scripts, VS Code extensions, and half-baked tools. None of them felt simple. None of them just worked out of the box.

So I did what any frustrated dev would do.

**I built workz.**

## What is workz? (in plain English)

workz is basically **Zoxide but for git worktrees**.

You know how you type \`z\` and magically jump to your most-used folders?

Now you type \`w\` and magically jump between your worktrees.

But the real magic is what happens when you **create** a new worktree.

workz automatically:

- Creates the worktree in a safe sibling folder (like \`my-project--new-feature\`)
- Symlinks all the heavy stuff (\`node_modules\`, \`target\`, \`.venv\`, caches, \`dist\`, etc.) so you don't waste space or time
- Copies your \`.env*\` files, \`.npmrc\`, secrets, docker overrides — everything you actually need
- Detects what kind of project you have (Node, Rust, Python, Go…) and only does the smart thing

**Zero config for 95% of projects.** If you have something weird, you can add a tiny \`.workz.toml\` file — but most people never need it.

## How it feels in real life (30-second workflow)

\`\`\`bash
# Create a new worktree for a feature
ws feature/login --ai

# workz does everything in the background and then prints:
cd /Users/rohan/projects/my-app--feature-login

# Now just press Enter (or I added a one-line alias)
w
\`\`\`

That's it. You're inside the new worktree, your \`.env\` is there, your \`node_modules\` is shared, and if you used \`--ai\` it even opens Claude/Cursor for you.

When you're done:

\`\`\`bash
workz done
\`\`\`

It cleans everything up nicely.

## Why I think this actually matters in 2026

Everyone is running multiple AI agents now.

The old way (one big repo folder) doesn't work anymore — the agents start fighting over the same files.

Git worktrees are the perfect solution… but only if the setup doesn't suck.

I looked at all the existing tools (Worktrunk, gwq, branchlet, etc.). They're all good at one or two things, but none solved the whole nightmare in one clean, fast, beautiful package.

So I made workz the tool I wished existed.

## Super quick install (takes 10 seconds)

\`\`\`bash
# Option 1 – Homebrew (recommended)
brew tap rohansx/tap && brew install workz

# Option 2 – Cargo
cargo install workz
\`\`\`

Then add this one line to your \`~/.zshrc\` (or bashrc):

\`\`\`bash
w() { output=$(workz switch "$@"); [[ $output == cd* ]] && eval "$output"; }
\`\`\`

Reload your shell and you're good to go.

Repo + full demo GIF:

[https://github.com/rohansx/workz](https://github.com/rohansx/workz)

## What's next?

I'm already planning:

- Full Windows support (junctions are already working, just polishing)
- Docker/podman auto-start
- Even smarter AI hooks
- And whatever you guys ask for!

If you're tired of the same \`.env\` + \`node_modules\` dance every day, please give workz a try.

Star it if you like it, open an issue if something feels off, or send a PR — I read every single one.

Would love to hear your own worktree horror stories in the comments. What's the most annoying part for you right now?

**Let's make git worktrees actually fun again.**
  `,
  author: "Rohan Sharma",
};

export default post;
