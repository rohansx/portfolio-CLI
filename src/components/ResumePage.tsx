import React, { useRef } from 'react';
import styles from './ResumePage.module.scss';

interface ResumePageProps {
  onClose: () => void;
}

const ResumePage: React.FC<ResumePageProps> = ({ onClose }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button onClick={handleDownload} className={styles.downloadBtn}>
          <i className="fas fa-download"></i> Download PDF
        </button>
      </div>

      <div className={styles.resumeWrapper}>
        <div className={styles.resume} ref={resumeRef}>
          {/* Header */}
          <header className={styles.header}>
            <h1>ROHAN SHARMA</h1>
            <div className={styles.contact}>
              <span><i className="fas fa-phone"></i> +91 8552866471</span>
              <span><i className="fas fa-envelope"></i> hello@rohan.sh</span>
              <span><i className="fas fa-globe"></i> rohan.sh</span>
              <span><i className="fab fa-linkedin"></i> rohansx</span>
              <span><i className="fab fa-github"></i> rohansx</span>
              <span><i className="fab fa-twitter"></i> rohaxyz</span>
            </div>
          </header>

          {/* Education */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>VIVA Institute of Technology (Mumbai University)</strong>
                  <p><em>Bachelor of Engineering in Computer Science (7.33 CGPA)</em></p>
                </div>
                <div className={styles.entryMeta}>
                  <span>Aug 2019 – Jun 2023</span>
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>Edba.io</strong>
                  <p><em>Associate Software Engineering Intern</em></p>
                </div>
                <div className={styles.entryMeta}>
                  <span>Sep 2023 – Mar 2024</span>
                  <span>Virar, Maharashtra</span>
                </div>
              </div>
              <ul>
                <li>Implemented and integrated Headless CMS (Contentstack), developing content models for dynamic management, and introduced GraphQL to optimize data queries, reducing network load and enhancing overall performance.</li>
                <li>Implemented Next.js to enhance the frontend of a dynamic website, boosting responsiveness and user experience; seamlessly integrated RESTful APIs & microservices, demonstrating expertise in hooks for scalable & efficient solutions.</li>
                <li>Developed an API for dynamic form generation, similar to Google Forms but leveraging Contentstack, enhancing custom data collection and application scalability.</li>
                <li>Utilized Docker for containerization & AWS for cloud deployment; researched LMS options like <strong>OpenEdx & Knorish</strong> to optimize project delivery, demonstrating a comprehensive skill set in cloud and container technologies.</li>
              </ul>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>Edba Academy</strong>
                  <p><em>Trainee</em></p>
                </div>
                <div className={styles.entryMeta}>
                  <span>Feb 2023 – May 2023</span>
                  <span>Virar, Maharashtra</span>
                </div>
              </div>
              <ul>
                <li>In a 6-month Full-Stack Web Development course at EDBA Academy, mastered the MERN Stack, and Data Structures and Algorithms (DSA), leading to the development of a comprehensive project.</li>
                <li>Benefited from dedicated staff guidance, enhancing technical skills for collaborative development projects, showcasing proficiency in teamwork.</li>
              </ul>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>GSSOC'23 - Girlscript Summer of Code (Open Source)</strong>
                  <p><em>Project Admin</em></p>
                </div>
                <div className={styles.entryMeta}>
                  <span>May 2023 – Aug 2023</span>
                  <span>Remote</span>
                </div>
              </div>
              <ul>
                <li>Led <strong>Informatician</strong> project at <strong>OpenXYZ</strong>, focusing on expansion and achieving key goals.</li>
                <li>Managed 100+ contributors, ensuring task alignment & code quality by overseeing issue assignments & PR integrations.</li>
                <li>Streamlined project workflow to enhance team efficiency and collaboration.</li>
              </ul>
            </div>
          </section>

          {/* Projects */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>Doctalyzer</strong> <span className={styles.tech}>| Reactjs, Redux, OpenAI, Google Cloud Console</span>
                </div>
                <div className={styles.entryMeta}>
                  <span>Nov 2023</span>
                </div>
              </div>
              <ul>
                <li>Built an app that simplifies medical reports using Google Vision's OCR and OpenAI GPT-3.5 Turbo, and provides detailed medicine information including usage and side effects.</li>
                <li>Contributed to API integration, ensuring seamless integration between Google Vision, OpenAI, & frontend development.</li>
              </ul>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <strong>Vercel Clone</strong> <span className={styles.tech}>| Nodejs, Expressjs, AWS-SDK, Redis, TypeScript, Reactjs</span>
                </div>
                <div className={styles.entryMeta}>
                  <span>Jan 2024</span>
                </div>
              </div>
              <ul>
                <li>Created a Node.js upload service using TypeScript, Express, and AWS SDK, enabling repository cloning and file uploads to AWS S3 with Redis for efficient session management.</li>
                <li>Built a TypeScript-based deploy service for automated processing of React code into static files and managing uploads to S3, with Redis for status tracking.</li>
                <li>Implemented a Node.js request handler with Express to route requests based on subdomains and serve corresponding content from S3, ensuring accurate content delivery.</li>
              </ul>
            </div>
          </section>

          {/* Technical Skills */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Technical Skills</h2>
            <div className={styles.skills}>
              <p><strong>Languages & Framework:</strong> Go, JavaScript, TypeScript, Reactjs, Expressjs, Nodejs, GoLang</p>
              <p><strong>Database:</strong> MySQL, PostgreSQL, MongoDB</p>
              <p><strong>Tech & Tools:</strong> Git & Github, Gitlab, GraphQL, REST API, Postman, Docker, GCP, AWS, Linux Fundamentals, Figma</p>
            </div>
          </section>

          {/* Achievements */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Extracurricular & Achievements</h2>
            <ul>
              <li>Our startup secured a <strong>top 10 position</strong> in the Disrupt'23 Competition, a highlight of Udgam, IIT GUWAHATI's Annual E-Summit. This achievement stands out, especially with over 900+ teams participating. <em>Issued by: UDGAM (The Annual Entrepreneurship Summit of IIT Guwahati)</em></li>
              <li>Emerged as a <strong>finalist in the Gen AI track</strong> at Mumbai's largest Hackathon (MUMBAI HACKS'23) ranking in the top three out of 100+ participating teams. <em>Issued by: (TEAM)Tech Entrepreneurs Association of Mumbai</em></li>
              <li>Our startup reached the finals at <strong>Startup Quest 2023</strong>, securing a spot within the top 10 out of more than 400+ participating teams, marking a noteworthy accomplishment. <em>Issued by: RAW Engg. Foundation</em></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
