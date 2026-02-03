import React, { useEffect, useState } from 'react';
import styles from './GuiPortfolio.module.scss';

interface GuiPortfolioProps {
  onSwitchToTerminal: () => void;
  onNavigateResume: () => void;
  userData?: any;
  projectData?: any[];
}

const GuiPortfolio: React.FC<GuiPortfolioProps> = ({ onSwitchToTerminal, onNavigateResume, userData, projectData }) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Fetch visitor count
    fetch('/api/portfolio/visitors')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count || 0))
      .catch(() => {});
    
    // Increment visitor count
    fetch('/api/portfolio/visitors', { method: 'POST' }).catch(() => {});
  }, []);

  const skills = [
    { name: 'TypeScript', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'Go', icon: '🔷' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
  ];

  const socials = [
    { name: 'GitHub', url: 'https://github.com/rohansx', icon: 'fab fa-github' },
    { name: 'Twitter', url: 'https://twitter.com/rsxwtf', icon: 'fab fa-twitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/rohansx', icon: 'fab fa-linkedin' },
    { name: 'Email', url: 'mailto:hey@rohansh.me', icon: 'fas fa-envelope' },
  ];

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Top buttons */}
      <div className={styles.topButtons}>
        <button className={styles.resumeBtn} onClick={onNavigateResume} title="View Resume">
          <i className="fas fa-file-alt"></i> Resume
        </button>
        <button className={styles.terminalToggle} onClick={onSwitchToTerminal} title="Switch to Terminal">
          <i className="fas fa-terminal"></i>
        </button>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.avatar}>
            <img 
              src={userData?.avatar_url || 'https://avatars.githubusercontent.com/u/33249782'} 
              alt="Rohan Sharma"
            />
            <div className={styles.statusDot}></div>
          </div>
          <h1 className={styles.name}>Rohan Sharma</h1>
          <p className={styles.tagline}>Full Stack Developer & GenAI Enthusiast</p>
          <p className={styles.bio}>
            Building things that matter. Passionate about clean code, 
            scalable systems, and pushing the boundaries of what's possible with AI.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{userData?.public_repos || '20'}+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{userData?.followers || '100'}+</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{visitorCount.toLocaleString()}</span>
              <span className={styles.statLabel}>Visitors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skillsGrid}>
          {skills.map((skill, i) => (
            <div key={skill.name} className={styles.skillCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.skillIcon}>{skill.icon}</span>
              <span className={styles.skillName}>{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Projects</h2>
        <div className={styles.projectsGrid}>
          {(projectData || []).slice(0, 4).map((project: any, i: number) => (
            <a 
              key={project.id || i} 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.projectCard}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={styles.projectHeader}>
                <i className="fas fa-folder"></i>
                <div className={styles.projectLinks}>
                  <i className="fas fa-external-link-alt"></i>
                </div>
              </div>
              <h3 className={styles.projectTitle}>{project.name}</h3>
              <p className={styles.projectDesc}>{project.description || 'No description'}</p>
              <div className={styles.projectFooter}>
                {project.language && (
                  <span className={styles.projectLang}>
                    <span className={styles.langDot}></span>
                    {project.language}
                  </span>
                )}
                <span className={styles.projectStars}>
                  <i className="fas fa-star"></i> {project.stargazers_count || 0}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Let's Connect</h2>
        <div className={styles.socials}>
          {socials.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title={social.name}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Rohan Sharma. Built with ☕ and curiosity.</p>
      </footer>
    </div>
  );
};

export default GuiPortfolio;
