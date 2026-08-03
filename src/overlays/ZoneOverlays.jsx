import { useState } from 'react';
import { profile, interests, projects, skills, timeline, vision } from '../data/portfolio.js';

function getZoneVisibility(scrollProgress, zoneStart, zoneEnd) {
  const fadeIn = zoneStart;
  const fadeOut = zoneEnd;
  const margin = 0.03;

  if (scrollProgress < fadeIn - margin || scrollProgress > fadeOut + margin) return 0;
  if (scrollProgress >= fadeIn && scrollProgress <= fadeOut) return 1;
  if (scrollProgress < fadeIn) return (scrollProgress - (fadeIn - margin)) / margin;
  return 1 - (scrollProgress - fadeOut) / margin;
}

export default function ZoneOverlays({ scrollProgress }) {
  const [projectCategory, setProjectCategory] = useState('all');

  const identityOpacity = getZoneVisibility(scrollProgress, 0.0, 0.12);
  const interestsOpacity = getZoneVisibility(scrollProgress, 0.15, 0.26);
  const projectsOpacity = getZoneVisibility(scrollProgress, 0.30, 0.46);
  const skillsOpacity = getZoneVisibility(scrollProgress, 0.50, 0.60);
  const journeyOpacity = getZoneVisibility(scrollProgress, 0.63, 0.76);
  const visionOpacity = getZoneVisibility(scrollProgress, 0.79, 0.88);
  const contactOpacity = getZoneVisibility(scrollProgress, 0.91, 1.0);

  const filteredProjects = projectCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === projectCategory);

  return (
    <>
      {/* === IDENTITY === */}
      {identityOpacity > 0 && (
        <div className="zone-overlay-wrapper" style={{ opacity: identityOpacity, transform: `translateY(${(1 - identityOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="badge">OPERATOR PROFILE</div>
            <h2 className="zone-title">{profile.name}</h2>
            <p className="zone-desc" style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              {profile.title} · {profile.subtitle}
            </p>
            <p className="zone-desc">{profile.tagline}</p>
            <p className="zone-desc" style={{ fontSize: '0.9rem', opacity: 0.7 }}>{profile.summary}</p>
          </div>
        </div>
      )}

      {/* === INTERESTS === */}
      {interestsOpacity > 0 && (
        <div className="zone-overlay-wrapper right-align" style={{ opacity: interestsOpacity, transform: `translateY(${(1 - interestsOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="badge">MISSION SECTORS</div>
            <h2 className="zone-title">Interests</h2>
            <p className="zone-desc">The domains I explore, build in, and push the boundaries of.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {interests.map((interest) => (
                <div key={interest.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: interest.color, boxShadow: `0 0 8px ${interest.color}` }}></div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fff' }}>{interest.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === PROJECTS === */}
      {projectsOpacity > 0 && (
        <div className="zone-overlay-wrapper" style={{ opacity: projectsOpacity, transform: `translateY(${(1 - projectsOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none', maxWidth: '580px', maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="badge">ACTIVE MISSIONS</div>
            <h2 className="zone-title">Projects ({projects.length})</h2>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {[
                { id: 'all', label: 'ALL' },
                { id: 'ai', label: 'AI & ML' },
                { id: 'mobile', label: 'MOBILE' },
                { id: 'aviation', label: 'AVIATION' },
                { id: 'systems', label: 'SYSTEMS' },
                { id: 'games', label: 'GAMES' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProjectCategory(tab.id)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: projectCategory === tab.id ? 'var(--accent)' : 'rgba(0, 168, 255, 0.2)',
                    background: projectCategory === tab.id ? 'rgba(0, 168, 255, 0.25)' : 'transparent',
                    color: projectCategory === tab.id ? '#fff' : 'var(--muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Projects list */}
            <div className="projects-container">
              {filteredProjects.map((project) => (
                <div key={project.name} className="project-card-html">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="project-title">{project.name}</div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-cyan)', fontSize: '1rem', textDecoration: 'none' }}
                      title="View GitHub Repository"
                    >
                      <i className="fa-brands fa-github"></i>
                    </a>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>{project.tagline}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>{project.description}</p>
                  <div className="project-tags">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === SKILLS === */}
      {skillsOpacity > 0 && (
        <div className="zone-overlay-wrapper right-align" style={{ opacity: skillsOpacity, transform: `translateY(${(1 - skillsOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="badge">TECH NETWORK</div>
            <h2 className="zone-title">Skills</h2>
            <p className="zone-desc">An interconnected network of languages, frameworks, tools, and AI capabilities.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {skills.nodes.map((node) => (
                <span key={node.id} className="tag" style={{
                  border: `1px solid ${skills.categories.find(c => c.id === node.category)?.color || '#333'}`,
                  color: skills.categories.find(c => c.id === node.category)?.color || '#fff'
                }}>
                  {node.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === JOURNEY === */}
      {journeyOpacity > 0 && (
        <div className="zone-overlay-wrapper" style={{ opacity: journeyOpacity, transform: `translateY(${(1 - journeyOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none', maxWidth: '550px', maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="badge">MISSION LOG</div>
            <h2 className="zone-title">Journey</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {timeline.map((entry) => (
                <div key={entry.year} style={{ background: 'rgba(5, 12, 28, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0, 168, 255, 0.1)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '6px' }}>
                    {entry.year} — {entry.title}
                  </div>
                  <ul style={{ paddingLeft: '16px', listStyle: 'none' }}>
                    {entry.events.map((event, idx) => (
                      <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.85, marginBottom: '4px', position: 'relative', paddingLeft: '12px' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--accent-cyan)' }}>›</span>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === VISION === */}
      {visionOpacity > 0 && (
        <div className="zone-overlay-wrapper center-align" style={{ opacity: visionOpacity, transform: `translateY(${(1 - visionOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none', textAlign: 'center', maxWidth: '600px' }}>
            <div className="badge">FUTURE TRAJECTORY</div>
            <h2 className="zone-title">Vision</h2>
            <p className="zone-desc">Where I'm heading — the missions that define my future.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {vision.map((v, idx) => (
                <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#fff', padding: '10px', background: 'rgba(0, 168, 255, 0.08)', borderRadius: '6px', border: '1px solid rgba(0, 168, 255, 0.15)' }}>
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === CONTACT === */}
      {contactOpacity > 0 && (
        <div className="zone-overlay-wrapper center-align" style={{ opacity: contactOpacity, transform: `translateY(${(1 - contactOpacity) * 20}px)` }}>
          <div className="glass-panel" style={{ opacity: 1, transform: 'none', textAlign: 'center', maxWidth: '600px' }}>
            <div className="badge">COMMUNICATION STATION</div>
            <h2 className="zone-title">Contact</h2>
            <p className="zone-desc">Ready to connect? Open a channel.</p>
            <div className="comm-links interactive">
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="comm-btn">
                <i className="fa-brands fa-github"></i> GitHub
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="comm-btn">
                <i className="fa-brands fa-linkedin"></i> LinkedIn
              </a>
              <a href={`mailto:${profile.contact.email}`} className="comm-btn">
                <i className="fa-solid fa-envelope"></i> Email
              </a>
            </div>
            <p style={{ marginTop: '30px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
              "Every mission begins with curiosity."
            </p>
          </div>
        </div>
      )}
    </>
  );
}
