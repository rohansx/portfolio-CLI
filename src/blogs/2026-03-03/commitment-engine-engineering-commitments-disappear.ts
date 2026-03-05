import { BlogPost } from "../../typings";

const post: BlogPost = {
  id: "9",
  title: "Engineering Commitments Silently Die in Slack. I Built the Fix.",
  date: "2026-03-03",
  slug: "commitment-engine-engineering-commitments-disappear",
  summary:
    "A VP says 'we'll ship by March 15' in Slack. Three weeks later the deadline passes and nobody noticed until the downstream team asks why they're blocked. This isn't rare — it's the default. Here's why, and what I built to fix it.",
  content: `
# Engineering Commitments Silently Die in Slack. I Built the Fix.

Hey, I'm Rohan.

Picture this: your VP says in a Slack thread, "We'll ship the payments API by March 15." No ticket is created. No reminder is set. Three weeks later, the mobile team asks why they're blocked. The VP swears they said March 15. The backend lead says they said March 22. The actual Slack message is buried under 3,000 other messages in #backend-general.

This is the default way engineering teams operate. And it's costing a ridiculous amount of money.

A 5-person engineering leadership pod working at $150/hour spends roughly **10+ hours per week** chasing status — asking "where are we on X?", manually reconstructing what people said they'd do, rerunning standups that exist only to rebuild context everyone already had. That's **$390,000 per year** in coordination overhead that produces zero product value.

I've watched this happen at every company I've worked with. The tools that exist don't fix it. And the reason they don't is architectural — it's not fixable with better UI or another Slack integration.

---

## The Gap Every Tool Leaves Open

When a VP makes a verbal commitment in Slack, here's what the existing toolchain does about it:

**Slack** keeps the message. If you search for it three weeks later, you might find it. If you don't know what to search for, you won't.

**Jira** knows nothing about it — because someone has to manually create the ticket, and in the moment of the Slack conversation, nobody does.

**Fireflies / Otter** transcribed the meeting where it was also discussed. The transcript is filed somewhere. Nobody parses it for commitments.

**Linear / Notion** track what humans decide to put in them. The gap between "said in conversation" and "entered into a system" is exactly where promises go to die.

What nobody does: *connect the dots*. Nobody takes the Slack message, the Jira silence, the missing commits, and the transcript together — weighs them, decides whether the commitment is on track or at risk, and surfaces that to the right person at the right time.

That judgment layer is what's missing. And it's missing from every tool, not because nobody thought of it, but because it's genuinely hard to build. It requires understanding language, correlating evidence across sources, scoring risk, timing interventions intelligently, and doing all of this without becoming a surveillance system that destroys team trust.

I built [commitment-engine](https://github.com/rohansx/commitment-engine) to fill this gap.

---

## What commitment-engine Actually Does

It's not a dashboard. Not another status-meeting replacement. Not a project management tool. It's a **Go library** — an embeddable judgment engine you add to whatever system you're building.

You feed it signals: Slack messages, Jira comments, meeting transcript segments, Git commits. It figures out which ones contain real commitments, links them to evidence from other signals, scores their risk, decides when to surface a problem, and drafts a message — all with citations pointing back to the actual sources.

The output isn't "here are all your messages" — it's "here are 3 commitments at risk, here's why, here's the evidence, here's a draft message you can send."

But the interesting part isn't the output. It's how it gets there.

---

## The Problem Nobody Talks About: Language Is Ambiguous

The hardest part of this isn't building a dashboard or connecting to Slack. It's the classification problem.

"I'll ship the payments API by March 15" — obvious commitment.

"I'll try to get to it if I have time" — NOT a commitment. That's a hedge.

"Sure, I'll just rewrite the entire codebase by tomorrow 🙄" — NOT a commitment. That's sarcasm.

"Can we get this done by Friday?" — NOT a commitment. That's a question.

"We should probably look at the caching layer sometime" — NOT a commitment. Aspirational, no owner, no timeline.

The entire field of linguistics has a name for this: **Speech Act Theory**. When someone says "I'll ship by March 15," they're not describing the world — they're *performing an action* that creates an obligation. John Searle called these "commissives." The classification problem is: can you reliably detect commissives in engineering team communication, at scale, without generating a firehose of false positives?

The answer is: barely, with a hybrid approach.

commitment-engine uses rule-based detection first — regex for temporal patterns ("by March 15", "ETA end of sprint", "tomorrow"), keyword triggers ("I'll ship", "we'll have", "my ETA is"), and negation/sarcasm markers. Rules handle the obvious cases in microseconds without any LLM cost. For the ambiguous middle — the hedges, the conditionals, the multi-sentence commitments where the promise spans a thread — it calls an LLM with a carefully engineered prompt and structured output enforcement.

The result is classified as one of four types:

- **Hard commitment** — "I'll ship the payments API by March 15." Clear owner, clear deadline. High confidence.
- **Soft commitment** — "We're aiming to have the TRD done by end of sprint." Aspirational language, softer confidence.
- **Dependency signal** — "We're blocked on the auth team's API changes." Not a commitment, but critical for risk scoring.
- **Deadline change** — "Actually, we pushed the launch to March 22." Modifies an existing commitment, creates a new version, marks the old one as superseded.

And if it doesn't meet the bar — sarcasm detected, no timeline, no owner, conditional, past tense — it gets rejected with a reason. The classifier explains every decision.

---

## The Citation Principle

Here's the thing that distinguishes this from every AI-powered "intelligence" tool I've seen: **if there's no evidence, no claim gets made.**

Most AI dashboards will tell you a commitment is "at risk" based on vibes — some pattern the model learned, some weight in some layer that you can't inspect or question. commitment-engine works the opposite way. Every risk assessment, every nudge draft, every brief item has a citation chain pointing to the exact source signals that back it up.

"Deadline is in 3 days, no Jira activity in 8 days, the auth dependency is marked unresolved."

Each of those statements has a clickable source: the Jira ticket URL showing no updates, the Slack permalink where the dependency was raised, the commit history showing no recent activity.

If the citation compiler can't find evidence for a claim, that claim gets dropped. It doesn't get hedged with "probably" or "might be." It gets removed. The output is smaller but trustworthy.

This matters because the moment a system makes one unsupported accusation — "Alex is behind on the payments work" with no backing evidence — the entire team loses trust in it. That's not a product problem you can fix with a UI change. It's a credibility problem that kills adoption permanently.

---

## Risk Scoring Without the Buzzwords

Most project risk tools either use traffic lights (red/yellow/green, meaningless) or pretend to do Earned Value Management (which requires quantified hour estimates that verbal Slack commitments don't have).

commitment-engine uses six dimensions that actually apply to how engineering commitments work:

**Temporal** — how close is the deadline relative to the last observed activity?

**Staleness** — how many days since any signal (commit, Jira update, Slack mention) related to this commitment?

**Dependency** — are there unresolved blockers from other teams?

**Conflict** — is someone saying "on track" while the Jira board shows nothing moved in two weeks?

**Cascade** — how many other commitments does this one block? A single delayed API affects everything downstream.

**Pattern** — for v0.3+, once there's enough historical data: does this owner/codebase/type of commitment tend to slip?

The output is a score (0-100) and a plain-language explanation: "At risk: deadline in 3 days, no activity in 8 days, 1 unresolved dependency (auth migration)." Not a neural network score. Not "risk level: amber." Actual reasoning you can read and dispute.

---

## The Nudging Problem

Detecting risk is the easy part. The hard part is doing something about it without destroying your team's morale.

The failure mode of every alert system I've seen: it surfaces everything, at all hours, to everyone, constantly. Within a week, everyone has tuned it out. The tool becomes noise that people dismiss without reading, which is worse than having no tool at all.

commitment-engine's timing engine is built around one principle: **too early destroys trust, too late destroys value.**

It implements cooldown periods between nudges for the same commitment. Rate limits per person per week. Quiet hours. An escalation ladder that starts gentle ("hey, any blockers I can help clear?") and only escalates if the previous nudge went unanswered. The first nudge is always framed as an offer of help. If Alex is deep in a big PR and just hasn't updated Jira, the nudge shouldn't sound like a performance review.

And critically: the engine never auto-sends anything. Every nudge is a draft that requires human approval before it goes anywhere. "Citations, not surveillance" isn't just a tagline — it's an architectural constraint. The engine suggests; humans decide.

---

## Why a Library, Not a SaaS

There are existing tools in this space — Bond AI, Wudpecker, various "meeting intelligence" products. They're all SaaS dashboards with their own connectors, their own storage, their own opinions about your workflow.

commitment-engine is a Go library. You call \`engine.Process(signals)\` and get back structured JSON with commitments, risk assessments, nudge drafts, and citations. What you do with that output — whether you pipe it to Slack, store it in Postgres, build a web UI on top, or integrate it into your existing project management tool — is entirely up to you.

\`\`\`go
e := engine.New(engine.Config{
    LLMProvider: "anthropic",
    LLMKey:      os.Getenv("ANTHROPIC_API_KEY"),
})

out, _ := e.Process(engine.Batch{
    Signals: []engine.Signal{
        {
            Source:  "slack",
            Author:  "alex",
            Content: "I'll ship the payments API by March 15",
            URL:     "https://slack.com/archives/C0123/p1234567890",
        },
    },
})

// out.NewCommitments, out.RiskAlerts, out.SuggestedNudges
// All cited, all structured, all human-approvable
\`\`\`

Five lines to integrate. Your API key. Your data never leaves your infrastructure. No vendor lock-in.

It's open source under MIT. The judgment engine — the classifier, the scorer, the timing logic, the citation compiler — is all public and auditable. The commercial product (CoS Assistant) is built on top of this foundation with Slack/Jira connectors, a web UI, and team management. But the core is something any developer can run, inspect, extend, or embed in their own tools.

---

## What I'm Still Figuring Out

I want to be honest about where this is. The classifier is the hardest part and the part that will need the most real-world tuning — the difference between a firm commitment and hedged language is sometimes subtle enough that even humans disagree. The initial target is 85%+ F1 on the classifier; whether that holds outside of test data is an open question.

The risk scoring rules are reasonable starting points, but the right thresholds will vary by team. A startup where everything ships in days has different staleness norms than an enterprise team on 6-week planning cycles. Making these configurable without making the tool unusable is a UX problem I haven't fully solved.

And silence-based nudging — detecting that a commitment owner hasn't generated any activity signals in N days — is useful but sensitive. The last thing I want is for this to become a tool that makes engineers feel watched rather than supported.

The library is open source at [github.com/rohansx/commitment-engine](https://github.com/rohansx/commitment-engine). If you're building engineering intelligence tooling, integrating with Slack/Jira for your org, or just interested in commitment extraction as a problem — I'd genuinely love feedback on the classifier design and the risk scoring approach.

Engineering commitments shouldn't die in Slack threads. They deserve a better fate than a search query three weeks later.
`,
  author: "Rohan Sharma",
};

export default post;
