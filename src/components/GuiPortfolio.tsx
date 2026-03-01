import React, { useEffect, useState } from 'react';
import styles from './GuiPortfolio.module.scss';
import { profileData } from '../data/resume';

interface GuiPortfolioProps {
  onSwitchToTerminal: () => void;
  onNavigateResume: () => void;
  onNavigateBlog: () => void;
  userData?: any;
  projectData?: any[];
}

const GuiPortfolio: React.FC<GuiPortfolioProps> = ({ onSwitchToTerminal, onNavigateResume, onNavigateBlog }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { name, title, bio, contact, experience, projects, skills, achievements } = profileData;

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Fixed Nav Bar */}
      <nav className={styles.navBar}>
        <button onClick={onSwitchToTerminal} className={styles.navItem}>
          terminal
        </button>
        <span className={styles.navDot}>/</span>
        <button onClick={onNavigateBlog} className={styles.navItem}>
          blog
        </button>
        <span className={styles.navDot}>/</span>
        <button onClick={onNavigateResume} className={styles.navItem}>
          resume
        </button>
      </nav>

      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1>{name}</h1>
          <p className={styles.subtitle}>{title}</p>
          <p className={styles.bio}>{bio}</p>
        </header>

        {/* Experience Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>◆</span>
            <h2>Experience</h2>
          </div>
          <div className={styles.experienceList}>
            {experience.map((exp) => (
              <div key={exp.company} className={styles.experienceItem}>
                <div className={styles.expHeader}>
                  <a href={exp.url} target="_blank" rel="noopener noreferrer" className={styles.companyLink}>
                    {exp.company}
                  </a>
                  <span className={styles.expPeriod}>{exp.period}</span>
                </div>
                <p className={styles.expRole}>{exp.role}</p>
                <ul className={styles.expHighlights}>
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Endorsements Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>❝</span>
            <h2>Endorsements</h2>
          </div>
          <div className={styles.endorsementList}>
            <a href="/endorsement/1.png" target="_blank" rel="noopener noreferrer" className={styles.endorsementItem}>
              <img src="/endorsement/1.png" alt="PR review endorsement from viggy28" loading="lazy" />
            </a>
            <a href="/endorsement/2.png" target="_blank" rel="noopener noreferrer" className={styles.endorsementItem}>
              <img src="/endorsement/2.png" alt="PR review endorsement - custom domain white label" loading="lazy" />
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>◈</span>
            <h2>Projects</h2>
          </div>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectItem}
              >
                <span className={styles.projectName}>{project.name}</span>
                <span className={styles.projectDesc}>{project.description}</span>
                <span className={styles.projectArrow}>↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>○</span>
            <h2>Skills</h2>
          </div>
          <div className={styles.skillsContent}>
            <p>
              <span className={styles.skillLabel}>Languages</span>
              {skills.languages.join(', ')}
            </p>
            <p>
              <span className={styles.skillLabel}>Frameworks</span>
              {skills.frameworks.join(', ')}
            </p>
            <p>
              <span className={styles.skillLabel}>AI & Voice</span>
              {skills['ai & voice'].join(', ')}
            </p>
            <p>
              <span className={styles.skillLabel}>Databases</span>
              {skills.databases.join(', ')}
            </p>
            <p>
              <span className={styles.skillLabel}>Tools</span>
              {skills.tools.join(', ')}
            </p>
          </div>
        </section>

        {/* Achievements Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>★</span>
            <h2>Achievements</h2>
          </div>
          <div className={styles.achievementList}>
            {achievements.map((a, i) => (
              <div key={i} className={styles.achievementItem}>
                <span className={styles.achievementTitle}>{a.title}</span>
                <span className={styles.achievementEvent}>{a.event}</span>
                <span className={styles.achievementTeams}>{a.teams} teams</span>
              </div>
            ))}
          </div>
        </section>

        {/* Connect Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>◎</span>
            <h2>Connect</h2>
          </div>
          <div className={styles.connectList}>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              <span className={styles.linkMarker}>↗</span> GitHub
            </a>
            <a href={contact.twitter} target="_blank" rel="noopener noreferrer">
              <span className={styles.linkMarker}>↗</span> Twitter
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              <span className={styles.linkMarker}>↗</span> LinkedIn
            </a>
            <a href={`mailto:${contact.email}`}>
              <span className={styles.linkMarker}>↗</span> Email
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} {name}</p>
        </footer>
      </div>
    </div>
  );
};

export default GuiPortfolio;
