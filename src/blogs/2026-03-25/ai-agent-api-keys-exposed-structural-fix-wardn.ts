import { BlogPost } from "../../typings";

const post: BlogPost = {
  id: "13",
  title:
    "Your AI Agent's API Keys Are Exposed. Here's the Structural Fix.",
  date: "2026-03-25",
  slug: "ai-agent-api-keys-exposed-structural-fix-wardn",
  summary:
    "Every agent framework stores credentials in plaintext. Wardn makes that architecturally impossible with placeholder tokens, network-layer injection, and per-agent isolation.",
  content: `
# Your AI Agent's API Keys Are Exposed. Here's the Structural Fix.

**Every agent framework stores credentials in plaintext. Wardn makes that architecturally impossible.**

---

AI agents are shipping fast. CrewAI, AutoGen, LangChain, Claude Code \u2014 they all need API keys to function. And they all store them the same way: environment variables, \`.env\` files, or config YAML sitting on disk in plaintext.

That's not a configuration problem. It's a **structural vulnerability**.

A compromised agent, a malicious skill, a commodity stealer, or even a prompt injection \u2014 any of these gets full, unrestricted access to your real API keys. And once a key leaks, there's no rate limit, no blast radius control, no way to know which agent was responsible.

We built [**wardn**](https://github.com/rohansx/wardn) to fix this at the architecture level.

---

## The Problem, Visualized

\`\`\`
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                    TYPICAL AGENT SETUP                       \u2502
\u2502                                                             \u2502
\u2502  ~/.env                                                     \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 OPENAI_KEY=sk-proj-real-key-abc123      \u2502  \u2190 plaintext   \u2502
\u2502  \u2502 ANTHROPIC_KEY=sk-ant-real-key-xyz789    \u2502  \u2190 readable    \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2190 by anyone   \u2502
\u2502                                                             \u2502
\u2502  Agent Process Memory                                       \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 env::var("OPENAI_KEY")                  \u2502                \u2502
\u2502  \u2502 \u2192 "sk-proj-real-key-abc123"             \u2502  \u2190 in memory   \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  LLM Context Window                                         \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 "Use Authorization: Bearer sk-proj-..." \u2502  \u2190 in context  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  Agent Logs                                                 \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 POST api.openai.com                     \u2502                \u2502
\u2502  \u2502 Authorization: Bearer sk-proj-real-...  \u2502  \u2190 in logs     \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

Attack surface: env files, process memory, context window, logs
Any single compromise = full credential access
\`\`\`

Four places where your real API key sits exposed. Four vectors for theft. And this is the **default** in every major agent framework today.

---

## The Fix: Placeholder Tokens + Network-Layer Injection

Wardn introduces a simple but powerful architectural change: **agents never hold real credentials**. Instead, they get cryptographically random placeholder tokens that are worthless outside the local proxy.

\`\`\`
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                     WARDN ARCHITECTURE                       \u2502
\u2502                                                             \u2502
\u2502  Agent Environment                                          \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 OPENAI_KEY=wdn_placeholder_a1b2c3d4e5f6 \u2502  \u2190 useless    \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  Agent Logs                                                 \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 Authorization: Bearer wdn_placeholder_\u2026 \u2502  \u2190 useless    \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  LLM Context Window                                         \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502 "wdn_placeholder_a1b2c3d4e5f6"         \u2502  \u2190 useless    \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510                \u2502
\u2502  \u2502           WARDN ENCRYPTED VAULT         \u2502                \u2502
\u2502  \u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510    \u2502                \u2502
\u2502  \u2502  \u2502 AES-256-GCM + Argon2id KDF     \u2502    \u2502                \u2502
\u2502  \u2502  \u2502 OPENAI_KEY = sk-proj-real-...   \u2502    \u2502  \u2190 encrypted  \u2502
\u2502  \u2502  \u2502 ANTHROPIC_KEY = sk-ant-real-... \u2502    \u2502  \u2190 on disk     \u2502
\u2502  \u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518    \u2502                \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518                \u2502
\u2502                                                             \u2502
\u2502  Attack surface: encrypted vault (passphrase-protected)     \u2502
\u2502  Agent compromise = attacker gets useless placeholder       \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

The real credential exists in exactly **two places**: encrypted on disk, and briefly in the proxy's memory during request forwarding. The agent, its logs, its context window \u2014 all hold worthless placeholders.

---

## How the Proxy Works

Wardn runs a local HTTP proxy (default \`localhost:7777\`) that intercepts agent requests and performs a six-stage pipeline:

\`\`\`
        Agent sends request
        Authorization: Bearer wdn_placeholder_a1b2c3d4...
                    \u2502
                    \u25bc
    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
    \u2502        WARDN PROXY            \u2502
    \u2502      localhost:7777           \u2502
    \u2502                               \u2502
    \u2502  \u250c\u2500\u2500\u2500 REQUEST PIPELINE \u2500\u2500\u2500\u2500\u2510  \u2502
    \u2502  \u2502                         \u2502  \u2502
    \u2502  \u2502  \u2460 Identify Agent       \u2502  \u2502  x-warden-agent header
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2461 Resolve Placeholder  \u2502  \u2502  wdn_placeholder \u2192 credential name
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2462 Check Authorization  \u2502  \u2502  agent + domain allowed?
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2463 Check Rate Limit     \u2502  \u2502  token bucket per agent \u00d7 cred
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2464 Inject Real Key      \u2502  \u2502  decrypt from vault, swap in
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2465 Forward Request      \u2502  \u2502  send to external API
    \u2502  \u2502                         \u2502  \u2502
    \u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
    \u2502                               \u2502
    \u2502  \u250c\u2500\u2500 RESPONSE PIPELINE \u2500\u2500\u2500\u2500\u2510  \u2502
    \u2502  \u2502                         \u2502  \u2502
    \u2502  \u2502  \u2466 Strip Real Key       \u2502  \u2502  remove credential from body
    \u2502  \u2502         \u2502               \u2502  \u2502
    \u2502  \u2502  \u2467 Return to Agent      \u2502  \u2502  clean response, placeholder only
    \u2502  \u2502                         \u2502  \u2502
    \u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                    \u2502
                    \u25bc
           External API
    (only place real key exists in transit)
\`\`\`

Notice the **response pipeline** \u2014 step 7 strips real credentials from API responses before they reach the agent. Some APIs echo back your key in response headers or error messages. Wardn catches that.

---

## Per-Agent Isolation

This is where it gets interesting. Each agent gets its own **unique placeholder** for the same credential:

\`\`\`
                     \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                     \u2502   WARDN VAULT    \u2502
                     \u2502                  \u2502
                     \u2502  OPENAI_KEY =    \u2502
                     \u2502  sk-proj-real... \u2502
                     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                              \u2502
              \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
              \u2502               \u2502               \u2502
              \u25bc               \u25bc               \u25bc
     \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
     \u2502 researcher \u2502  \u2502   writer   \u2502  \u2502  analyzer  \u2502
     \u2502            \u2502  \u2502            \u2502  \u2502            \u2502
     \u2502 wdn_plc_   \u2502  \u2502 wdn_plc_   \u2502  \u2502 wdn_plc_   \u2502
     \u2502 a1b2c3d4   \u2502  \u2502 e5f6g7h8   \u2502  \u2502 i9j0k1l2   \u2502
     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
      Different          Different       Different
      placeholder        placeholder     placeholder
      Same real key      Same real key   Same real key
\`\`\`

If one agent is compromised, its placeholder is revoked without affecting others. You know exactly which agent leaked. And the leaked token is useless \u2014 it only works through the local proxy with the correct agent identity.

---

## Zero-Downtime Key Rotation

When you need to rotate a compromised key, agents don't even notice:

\`\`\`
BEFORE ROTATION                    AFTER ROTATION

Vault:                             Vault:
  OPENAI_KEY = sk-proj-OLD         OPENAI_KEY = sk-proj-NEW  \u2190 changed

researcher \u2192 wdn_plc_a1b2c3d4     researcher \u2192 wdn_plc_a1b2c3d4  \u2190 same
writer     \u2192 wdn_plc_e5f6g7h8     writer     \u2192 wdn_plc_e5f6g7h8  \u2190 same

\$ wardn vault rotate OPENAI_KEY
# Enter new value \u2192 done.
# Zero agent restarts. Zero config changes. Zero downtime.
\`\`\`

Placeholders are bound to credential **names**, not values. Rotate the underlying key and every agent's placeholder keeps working \u2014 now resolving to the new key.

---

## The Encryption Stack

Wardn's vault isn't a glorified JSON file with a password. It's built on serious cryptography:

\`\`\`
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                VAULT FILE FORMAT                    \u2502
\u2502                                                    \u2502
\u2502  Bytes 0-3    "WDNV"           Magic identifier    \u2502
\u2502  Bytes 4-5    Version          u16 little-endian    \u2502
\u2502  Bytes 6-21   Salt             16 random bytes      \u2502
\u2502  Bytes 22+    Encrypted Payload                     \u2502
\u2502               \u251c\u2500\u2500 12-byte nonce (random per write)  \u2502
\u2502               \u251c\u2500\u2500 ciphertext (variable length)      \u2502
\u2502               \u2514\u2500\u2500 16-byte authentication tag        \u2502
\u2502                                                    \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502              KEY DERIVATION                         \u2502
\u2502                                                    \u2502
\u2502  Algorithm:  Argon2id                              \u2502
\u2502  Memory:     19,456 KiB (19 MiB)                   \u2502
\u2502  Iterations: 2                                     \u2502
\u2502  Parallelism: 1                                    \u2502
\u2502  Output:     256-bit key                           \u2502
\u2502                                                    \u2502
\u2502  (OWASP 2024 minimum parameters)                   \u2502
\u2502                                                    \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502              ENCRYPTION                            \u2502
\u2502                                                    \u2502
\u2502  Algorithm:  AES-256-GCM                           \u2502
\u2502  Nonce:      12 bytes (random per encryption)      \u2502
\u2502  Tag:        16 bytes (authenticated encryption)   \u2502
\u2502                                                    \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502              MEMORY SAFETY                         \u2502
\u2502                                                    \u2502
\u2502  SensitiveString  \u2192  Zeroized on drop              \u2502
\u2502  SensitiveBytes   \u2192  Zeroized on drop              \u2502
\u2502  Debug output     \u2192  "[REDACTED]"                  \u2502
\u2502                                                    \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502              PERSISTENCE                           \u2502
\u2502                                                    \u2502
\u2502  Atomic writes:  write to .tmp \u2192 rename            \u2502
\u2502  No partial state, no corruption window            \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

- **Argon2id** for key derivation \u2014 resistant to GPU and side-channel attacks
- **AES-256-GCM** for authenticated encryption \u2014 tamper-evident
- **Zeroize on drop** \u2014 sensitive data scrubbed from memory when no longer needed
- **Atomic writes** \u2014 vault file is never in a half-written state

---

## Built-In Credential Scanner

Already have keys scattered across your projects? Wardn finds them:

\`\`\`
\$ wardn migrate --source claude-code --dry-run

\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                   CREDENTIAL SCAN RESULTS                   \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                                                              \u2551
\u2551  Source: ~/.claude                                            \u2551
\u2551  Files scanned: 47                                           \u2551
\u2551                                                              \u2551
\u2551  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510     \u2551
\u2551  \u2502 Severity \u2502 Pattern          \u2502 Count    \u2502 Score      \u2502     \u2551
\u2551  \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524     \u2551
\u2551  \u2502 CRITICAL \u2502 OpenAI (sk-proj) \u2502    2     \u2502  80 pts    \u2502     \u2551
\u2551  \u2502 CRITICAL \u2502 Anthropic (sk-a) \u2502    1     \u2502  40 pts    \u2502     \u2551
\u2551  \u2502 HIGH     \u2502 GitHub (ghp_)    \u2502    3     \u2502  60 pts    \u2502     \u2551
\u2551  \u2502 MEDIUM   \u2502 Slack (xoxb-)    \u2502    1     \u2502  10 pts    \u2502     \u2551
\u2551  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518     \u2551
\u2551                                                              \u2551
\u2551  Risk Score: 190 / 400  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591  HIGH           \u2551
\u2551                                                              \u2551
\u2551  Run without --dry-run to migrate to encrypted vault         \u2551
\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
\`\`\`

20+ credential patterns detected across severity levels. Supports scanning Claude Code configs, OpenClaw, or any directory. Risk scoring weights critical credentials (OpenAI, Anthropic, Stripe live keys) higher than generic tokens.

---

## MCP Integration: Agent-Native Credential Access

Wardn ships with a built-in [MCP server](https://modelcontextprotocol.io/) for direct integration with Claude Code, Cursor, and other MCP-capable tools:

\`\`\`
\$ wardn serve --mcp --agent my-agent

\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502              WARDN MCP SERVER                       \u2502
\u2502              Transport: stdio                       \u2502
\u2502                                                    \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2502
\u2502  \u2502  Tool: get_credential_ref                     \u2502  \u2502
\u2502  \u2502  \u2192 Returns placeholder token for a credential \u2502  \u2502
\u2502  \u2502  \u2192 Per-agent isolation enforced               \u2502  \u2502
\u2502  \u2502  \u2192 Real value NEVER returned                  \u2502  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
\u2502                                                    \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2502
\u2502  \u2502  Tool: list_credentials                       \u2502  \u2502
\u2502  \u2502  \u2192 Lists authorized credentials + metadata    \u2502  \u2502
\u2502  \u2502  \u2192 Filtered by agent's access list            \u2502  \u2502
\u2502  \u2502  \u2192 Shows: name, domains, rate_limit (bool)    \u2502  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
\u2502                                                    \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2502
\u2502  \u2502  Tool: check_rate_limit                       \u2502  \u2502
\u2502  \u2502  \u2192 Query remaining quota                      \u2502  \u2502
\u2502  \u2502  \u2192 Returns: remaining, limit, retry_after     \u2502  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
\u2502                                                    \u2502
\u2502  All tools are READ-ONLY                           \u2502
\u2502  No credential values ever returned                \u2502
\u2502  Session bound to agent_id at connection time      \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

Three read-only tools. An agent can check what credentials it has access to, get its placeholder token, and query its rate limit \u2014 but it can **never** retrieve the actual credential value.

---

## Rate Limiting: Blast Radius Control

A looping agent or a compromised tool can rack up thousands of API calls in minutes. Wardn enforces per-credential, per-agent token bucket rate limiting:

\`\`\`
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502             RATE LIMIT: Token Bucket                \u2502
\u2502                                                    \u2502
\u2502  Credential: OPENAI_KEY                            \u2502
\u2502  Config:     200 calls / hour                      \u2502
\u2502                                                    \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2502
\u2502  \u2502                                              \u2502  \u2502
\u2502  \u2502  researcher  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591  180   \u2502  \u2502
\u2502  \u2502  writer      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591  140   \u2502  \u2502
\u2502  \u2502  analyzer    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  200   \u2502  \u2502
\u2502  \u2502                                              \u2502  \u2502
\u2502  \u2502  \u2190 tokens remaining (refill: 0.055/sec) \u2192   \u2502  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
\u2502                                                    \u2502
\u2502  Credential: ANTHROPIC_KEY                         \u2502
\u2502  Config:     100 calls / hour                      \u2502
\u2502                                                    \u2502
\u2502  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2502
\u2502  \u2502                                              \u2502  \u2502
\u2502  \u2502  researcher  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591   92   \u2502  \u2502
\u2502  \u2502                                              \u2502  \u2502
\u2502  \u2502  writer: NOT AUTHORIZED                      \u2502  \u2502
\u2502  \u2502  analyzer: NOT AUTHORIZED                    \u2502  \u2502
\u2502  \u2502                                              \u2502  \u2502
\u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2502
\u2502                                                    \u2502
\u2502  Each agent has independent token buckets          \u2502
\u2502  One agent hitting limit doesn't affect others     \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

Configuration in \`wardn.toml\`:

\`\`\`toml
[warden.credentials.OPENAI_KEY]
rate_limit = { max_calls = 200, per = "hour" }
allowed_agents = ["researcher", "writer", "analyzer"]
allowed_domains = ["api.openai.com"]

[warden.credentials.ANTHROPIC_KEY]
rate_limit = { max_calls = 100, per = "hour" }
allowed_agents = ["researcher"]
allowed_domains = ["api.anthropic.com"]
\`\`\`

---

## What This Defeats

| Attack Vector | Without Wardn | With Wardn |
|---|---|---|
| \`.env\` file theft | Real keys exposed | No \`.env\` files exist |
| Malicious skill reads \`\$OPENAI_KEY\` | Gets \`sk-proj-real-...\` | Gets \`wdn_placeholder_...\` (useless) |
| Stealer targets agent config | Finds real credentials | Finds only placeholders |
| Prompt injection exfiltrates key | Key is in context window | Key was never in context |
| Agent logs scraped | \`Authorization: Bearer sk-proj-...\` | \`Authorization: Bearer wdn_placeholder_...\` |
| Full agent compromise | Attacker has real key | Attacker has useless token |
| Looping agent burns budget | Unlimited API calls | Rate limit per agent per credential |
| API response echoes key | Key reaches agent memory | Stripped by response pipeline |

This isn't defense in depth. It's **defense by architecture**. The real key physically cannot reach the agent process.

---

## Quick Start

\`\`\`bash
# Install
cargo install wardn

# Create an encrypted vault
wardn vault create

# Store your credentials (interactive, no echo)
wardn vault set OPENAI_KEY
wardn vault set ANTHROPIC_KEY

# Get placeholder tokens for your agents
wardn vault get OPENAI_KEY --agent researcher
# \u2192 wdn_placeholder_a1b2c3d4e5f6g7h8

# Start the proxy
wardn serve

# Or start proxy + MCP server for Claude Code / Cursor
wardn serve --mcp --agent my-agent
\`\`\`

Point your agent's HTTP client at \`localhost:7777\`. Set the placeholder as the API key. Done.

---

## The Bigger Picture

Wardn is a security middleware layer for AI agents. Today, it solves credential isolation. The same proxy architecture extends to:

- **Request auditing** \u2014 full visibility into what agents are actually calling
- **Domain allowlisting** \u2014 agents can only reach approved APIs
- **Cost attribution** \u2014 know exactly which agent is spending what
- **Policy enforcement** \u2014 agent-specific rules beyond just rate limits

The AI agent ecosystem is growing fast. The security primitives haven't kept up. We think credential isolation is the foundation everything else builds on.

---

## Try It

\`\`\`bash
cargo install wardn
\`\`\`

**GitHub:** [github.com/rohansx/wardn](https://github.com/rohansx/wardn)
**Crates.io:** [crates.io/crates/wardn](https://crates.io/crates/wardn)
**License:** MIT

---

*Wardn is written in Rust. ~4,500 lines. Zero unsafe. AES-256-GCM + Argon2id. One binary, no external services.*
`,
  author: "Rohan Sharma",
};

export default post;
