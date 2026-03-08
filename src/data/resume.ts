// Resume content as markdown string
export const resumeMarkdown = `# ROHAN SHARMA

[+91 8552866471](tel:+918552866471) | [hello@rohan.sh](mailto:hello@rohan.sh) | [rohan.sh](https://rohan.sh) | [LinkedIn](https://linkedin.com/in/rohansx) | [GitHub](https://github.com/rohansx) | [Twitter](https://x.com/rohansxd)

---

## Education

**University of Mumbai** | Aug 2019 - Jun 2023
*Bachelor of Engineering in Computer Science* | Mumbai, India

---

## Experience

**[MyClone](https://myclone.is)** | Aug 2024 - Present
*Founding Full Stack Engineer* | San Francisco, CA (Remote)

- Built real-time voice agents using LiveKit, ElevenLabs, and Cartesia for low-latency, human-like AI clone interactions
- Developed RAG pipelines with LangChain and LlamaIndex to ground AI clones in expert knowledge bases, documents, and coaching content
- Engineered the core platform using Go, Python, TypeScript, AWS, Postgres, and React for high-fidelity voice and chat experiences
- Created memory and adaptive conversation systems enabling persistent, context-aware multi-turn dialogues
- Designed scalable APIs for real-time AI reasoning, voice synthesis, and integration with external tools

**[Surfboard Ventures](https://surfboardventures.com)** | Sep 2023 - Jun 2024
*Associate Software Engineer* | Mumbai, India (Hybrid)

- Developed dynamic website frontend using Next.js with Tailwind CSS for responsive design
- Implemented Headless CMS (Contentstack) for dynamic content management and distribution
- Assisted in API development for dynamic form generation using Contentstack
- Utilized Docker for containerization and AWS for cloud services

**[OpenXYZ](https://github.com/open-xyz)** | Apr 2023 - Mar 2024
*Community Manager* | Remote

- Built and grew a vibrant community focused on open-source contributions
- Mentored junior developers in understanding open-source and guiding early contributions
- Organized workshops and seminars to encourage active participation

**[GSSOC'23 - Girlscript Summer of Code](https://gssoc.girlscript.tech/)** | May 2023 - Jul 2023
*Project Administrator* | Remote

- Led [Informatician](https://github.com/open-xyz/informatician) project, managing tasks, code quality, and 100+ contributors

---

## Projects

**[Convox](https://convox.ai)** | *Python, React, Voice AI* | Mar 2026

- Open-source voice AI orchestration platform for India — build production voice agents in 22+ Indian languages with provider-agnostic pipelines, cost tracking, and DPDP compliance

**[CloakPipe](https://github.com/rohansx/cloakpipe)** | *Rust, Security, AI* | Mar 2026

- Open-source Rust privacy proxy for LLM APIs — consistent pseudonymization across RAG pipelines with AES-256-GCM encrypted vault, <5ms overhead

**[workz](https://github.com/rohansx/workz)** | *Rust, CLI* | Feb 2026

- Zoxide-like CLI for git worktrees — auto-symlinks node_modules/target/.venv, copies .env files, and smart-detects project type for zero-config multi-branch workflows

**[VibeGuard](https://vibeguard.io)** | *Python, Go, AI* | Feb 2026

- AI code compliance scanner — a pre-commit security tool with LLM integration to detect vulnerabilities before they enter your codebase

**[Moltnet](https://moltnet.ai)** | *HTML, TypeScript, AI* | Jan 2026

- GitHub for AI Agents — collaborative platform where AI agents create projects, propose changes, and build software together

**[Reflection](https://reflection.buildrappo.com)** | *Next.js, TypeScript, AI* | Dec 2024

- A tool that turns your LinkedIn profile into a personalized, shareable year-end story

**[Rappo](https://buildrappo.com)** | *React, TypeScript, Node.js* | 2024

- Networking platform connecting engineering champions with early-stage founders for mentorship and advisory

---

## Technical Skills

**Languages & Frameworks:** Go, Rust, Python, JavaScript, TypeScript, React, Next.js, Node.js, Express
**AI & Voice:** RAG, LangChain, LlamaIndex, OpenAI, Voice Agents
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
  title: 'Founding Full Stack Engineer @ MyClone',
  bio: 'Building the future, one line of code at a time. I specialize in voice AI, RAG systems, and scalable full-stack apps with Go & TypeScript.',
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
      company: 'MyClone',
      url: 'https://myclone.is',
      role: 'Founding Full Stack Engineer',
      period: 'Aug 2024 - Present',
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
      period: 'Sep 2023 - Jun 2024',
      location: 'Mumbai, India',
      highlights: [
        'Dynamic frontend using Next.js with Tailwind CSS',
        'Headless CMS (Contentstack) for content management',
        'Docker containerization and AWS cloud services',
      ],
    },
    {
      company: 'OpenXYZ',
      url: 'https://github.com/open-xyz',
      role: 'Community Manager',
      period: 'Apr 2023 - Mar 2024',
      location: 'Remote',
      highlights: [
        'Built and grew open-source community',
        'Mentored junior developers on contributions',
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
    {
      name: 'Convox',
      url: 'https://convox.ai',
      description: 'Open-source voice AI orchestration for India — production voice agents in 22+ languages with provider-agnostic pipelines and DPDP compliance',
      tech: ['Python', 'React', 'Voice AI'],
    },
    {
      name: 'CloakPipe',
      url: 'https://github.com/rohansx/cloakpipe',
      description: 'Rust privacy proxy for LLM APIs — consistent pseudonymization across RAG pipelines, <5ms overhead',
      tech: ['Rust', 'Security', 'AI'],
    },
    {
      name: 'workz',
      url: 'https://github.com/rohansx/workz',
      description: 'Zoxide-like CLI for git worktrees — auto-symlinks deps, copies .env files, zero-config multi-branch workflows',
      tech: ['Rust', 'CLI'],
    },
    {
      name: 'VibeGuard',
      url: 'https://vibeguard.io',
      description: 'AI code compliance scanner — pre-commit security with LLM integration',
      tech: ['Python', 'Go', 'AI'],
    },
    {
      name: 'Moltnet',
      url: 'https://moltnet.ai',
      description: 'GitHub for AI Agents — collaborative platform where agents build together',
      tech: ['TypeScript', 'AI'],
    },
    {
      name: 'Reflection',
      url: 'https://reflection.buildrappo.com',
      description: 'Turns your LinkedIn profile into a personalized, shareable year-end story',
      tech: ['Next.js', 'TypeScript', 'AI'],
    },
    {
      name: 'Rappo',
      url: 'https://buildrappo.com',
      description: 'Networking platform connecting engineering champions with early-stage founders',
      tech: ['React', 'TypeScript', 'Node.js'],
    },
  ],
  skills: {
    languages: ['Go', 'Rust', 'Python', 'JavaScript', 'TypeScript'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express'],
    'ai & voice': ['RAG', 'LangChain', 'LlamaIndex', 'OpenAI', 'Voice Agents'],
    databases: ['PostgreSQL', 'MongoDB', 'MySQL'],
    tools: ['Docker', 'AWS', 'GCP', 'GraphQL', 'Git', 'Linux'],
  },
  achievements: [
    { title: 'Top 10', event: 'Mumbai Hacks 2024 SaaS Track (Guinness World Records largest GenAI hackathon)', teams: '1500+' },
    { title: 'Top 10', event: 'Disrupt\'23, IIT Guwahati E-Summit', teams: '900+' },
    { title: 'Top 10', event: 'Startup Quest 2023', teams: '400+' },
  ],
};
