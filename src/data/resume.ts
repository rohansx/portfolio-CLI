// Resume content as markdown string
export const resumeMarkdown = `# ROHAN SHARMA

[+91 8552866471](tel:+918552866471) | [hello@rohan.sh](mailto:hello@rohan.sh) | [rohan.sh](https://rohan.sh) | [LinkedIn](https://linkedin.com/in/rohansx) | [GitHub](https://github.com/rohansx) | [Twitter](https://x.com/rohansxd)

---

## Education

**University of Mumbai** | Aug 2019 - Jun 2023
*Bachelor of Engineering in Computer Science* | Mumbai, India

---

## Experience

**[Utkrusht.ai](https://utkrusht.ai)** | Apr 2026 - Present
*AI Builder - II* | Remote

- Building an agentic task builder, a conversational interface where anyone describes a use case in plain language and gets an executable, multi-step agent task
- Integrated tool and MCP calling so agents act on external systems, with guardrails and human-in-the-loop confirmation on side-effectful steps
- Built run observability (traces, retries, failure-mode surfacing) so non-technical users can see why a task did what it did
- Driving the migration of the platform codebase toward agentic patterns, replacing hardcoded workflows with LLM-driven planning and tool use

**[MyClone](https://myclone.is)** | Aug 2024 - Mar 2026
*Founding Full Stack Engineer* | San Francisco, CA (Remote)

- Built real-time voice agents using LiveKit, ElevenLabs, and Cartesia for low-latency, human-like AI clone interactions
- Developed RAG pipelines with LangChain and LlamaIndex to ground AI clones in expert knowledge bases, documents, and coaching content
- Engineered the core platform using Go, Python, TypeScript, AWS, Postgres, and React for high-fidelity voice and chat experiences
- Created memory and adaptive conversation systems enabling persistent, context-aware multi-turn dialogues
- Designed scalable APIs for real-time AI reasoning, voice synthesis, and integration with external tools

**[Surfboard Ventures](https://surfboardventures.com)** | Sep 2023 - Jul 2024
*Associate Software Engineer* | Mumbai, India (Hybrid)

- Developed dynamic website frontend using Next.js with Tailwind CSS for responsive design
- Implemented Headless CMS (Contentstack) for dynamic content management and distribution
- Assisted in API development for dynamic form generation using Contentstack
- Utilized Docker for containerization and AWS for cloud services

**[GSSOC'23 - Girlscript Summer of Code](https://gssoc.girlscript.tech/)** | May 2023 - Jul 2023
*Project Administrator* | Remote

- Led [Informatician](https://github.com/open-xyz/informatician) project, managing tasks, code quality, and 100+ contributors

---

## Projects

**[ClipXD](https://clipxd.com)** | *Local-first, Agents, Open-core*

- "Record once, agents read it": screen recorder that emits a human video and a machine-readable index in one pass, indexing transcript, on-screen text, clicks, and network calls so agents can query a recording straight from a shared link

**[CloakPipe](https://github.com/rohansx/cloakpipe)** | *Rust, Security, AI* | Mar 2026

- Open-source Rust privacy proxy for LLM APIs, giving consistent pseudonymization across RAG pipelines with an AES-256-GCM encrypted vault at <5ms overhead

**[workz](https://github.com/rohansx/workz)** | *Rust, CLI* | Feb 2026

- Zoxide-like CLI for git worktrees that auto-symlinks node_modules/target/.venv, copies .env files, and smart-detects project type for zero-config multi-branch workflows

**[Moltnet](https://moltnet.ai)** | *Go, TypeScript, AI* | Jan 2026

- Trust layer for the agent economy: identity and verification infrastructure so autonomous agents can discover each other, establish trust, and transact safely

---

## Technical Skills

**Languages & Frameworks:** Go, Python, JavaScript, TypeScript, React, Next.js, Node.js, Express
**AI & Agents:** Agentic Systems, Tool Use, MCP, RAG, LangChain, LlamaIndex, OpenAI, Voice Agents
**Database:** PostgreSQL, MongoDB, MySQL
**Tools:** Docker, AWS, GCP, Git, GraphQL, REST API, Linux, Figma

---

## Achievements

- **Top 10** in SaaS-Professional Track at Mumbai Hacks 2024 (Guinness World Records largest GenAI hackathon, 1500+ participants)
- **Top 10** at Disrupt'23, IIT Guwahati's E-Summit (900+ teams)
- **Top 10** at Startup Quest 2023 (400+ teams)
`;

// Structured data for GUI
export const profileData = {
  name: 'Rohan Sharma',
  title: 'AI Builder - II @ Utkrusht.ai',
  bio: 'Building the future, one line of code at a time. I specialize in agentic systems, voice AI, and RAG, plus scalable full-stack apps with Go & TypeScript.',
  contact: {
    phone: '+91 8552866471',
    email: 'hello@rohan.sh',
    website: 'https://rohan.sh',
    linkedin: 'https://linkedin.com/in/rohansx',
    github: 'https://github.com/rohansx',
    twitter: 'https://x.com/rohansxd',
  },
  experience: [
    {
      company: 'Utkrusht.ai',
      url: 'https://utkrusht.ai',
      role: 'AI Builder - II',
      period: 'Apr 2026 - Present',
      location: 'Remote',
      highlights: [
        'Building an agentic task builder: chat a use case in plain language, get an executable multi-step agent task',
        'Tool and MCP calling with guardrails and human-in-the-loop confirmation on side-effectful steps',
        'Run observability (traces, retries, failure-mode surfacing) so non-technical users can debug their tasks',
        'Driving the platform codebase toward agentic patterns, replacing hardcoded workflows with LLM-driven planning',
      ],
    },
    {
      company: 'MyClone',
      url: 'https://myclone.is',
      role: 'Founding Full Stack Engineer',
      period: 'Aug 2024 - Mar 2026',
      location: 'San Francisco, CA (Remote)',
      highlights: [
        'Built real-time voice agents using LiveKit, ElevenLabs, and Cartesia for low-latency AI clone interactions',
        'Developed RAG pipelines with LangChain and LlamaIndex to ground clones in expert knowledge',
        'Engineered core platform using Go, Python, TypeScript, AWS, Postgres, and React',
        'Created memory and adaptive conversation systems for persistent multi-turn dialogues',
        'Designed scalable APIs for real-time AI reasoning and voice synthesis',
      ],
    },
    {
      company: 'Surfboard Ventures',
      url: 'https://surfboardventures.com',
      role: 'Associate Software Engineer',
      period: 'Sep 2023 - Jul 2024',
      location: 'Mumbai, India',
      highlights: [
        'Dynamic frontend using Next.js with Tailwind CSS',
        'Headless CMS (Contentstack) for content management',
        'Docker containerization and AWS cloud services',
      ],
    },
    {
      company: 'GSSoC\'23',
      url: 'https://gssoc.girlscript.tech/',
      role: 'Project Administrator',
      period: 'May 2023 - Jul 2023',
      location: 'Remote',
      highlights: ['Led Informatician project, managing 100+ contributors'],
    },
  ],
  projects: [
    // {
    //   name: 'Convox',
    //   url: 'https://convox.ai',
    //   description: 'Open-source voice AI orchestration for India, production voice agents in 22+ languages with provider-agnostic pipelines and DPDP compliance',
    //   tech: ['Python', 'React', 'Voice AI'],
    // },
    {
      name: 'ClipXD',
      url: 'https://clipxd.com',
      description: 'Record once, agents read it: screen recorder emitting a human video and a queryable machine index in one pass',
      tech: ['Local-first', 'Agents', 'Open-core'],
    },
    {
      name: 'CloakPipe',
      url: 'https://github.com/rohansx/cloakpipe',
      description: 'Rust privacy proxy for LLM APIs, consistent pseudonymization across RAG pipelines at <5ms overhead',
      tech: ['Rust', 'Security', 'AI'],
    },
    {
      name: 'workz',
      url: 'https://github.com/rohansx/workz',
      description: 'Zoxide-like CLI for git worktrees that auto-symlinks deps, copies .env files, zero-config multi-branch workflows',
      tech: ['Rust', 'CLI'],
    },
    {
      name: 'Moltnet',
      url: 'https://moltnet.ai',
      description: 'Trust layer for the agent economy: identity and verification infrastructure for autonomous agents',
      tech: ['Go', 'TypeScript', 'AI'],
    },
  ],
  skills: {
    languages: ['Go', 'Python', 'JavaScript', 'TypeScript'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express'],
    'ai & agents': ['Agentic Systems', 'Tool Use', 'MCP', 'RAG', 'LangChain', 'LlamaIndex', 'OpenAI', 'Voice Agents'],
    databases: ['PostgreSQL', 'MongoDB', 'MySQL'],
    tools: ['Docker', 'AWS', 'GCP', 'GraphQL', 'Git', 'Linux'],
  },
  achievements: [
    { title: 'Top 10', event: 'Mumbai Hacks 2024 SaaS Track (Guinness World Records largest GenAI hackathon)', teams: '1500+' },
    { title: 'Top 10', event: 'Disrupt\'23, IIT Guwahati E-Summit', teams: '900+' },
    { title: 'Top 10', event: 'Startup Quest 2023', teams: '400+' },
  ],
};
