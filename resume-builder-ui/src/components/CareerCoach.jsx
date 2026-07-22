import React from 'react';
import { Award, Compass, ListChecks, Calendar, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CareerCoach({ improvementPlan }) {
  // Helper to extract monthly roadmap chunks for visual rendering
  const parseRoadmap = (plan) => {
    if (!plan) return [];
    
    const months = [];
    const monthRegex = /(Month\s+\d+|Phase\s+\d+|Week\s+\d+\-\d+|Month\s+One|Month\s+Two|Month\s+Three)/gi;
    
    // Find positions of "Month 1", "Month 2", etc.
    const lines = plan.split('\n');
    let currentMonth = null;
    let currentContent = [];

    for (let line of lines) {
      const stripped = line.strip ? line.strip() : line.trim();
      const match = stripped.match(monthRegex);
      
      if (match) {
        if (currentMonth) {
          months.push({ title: currentMonth, content: currentContent.join('\n') });
        }
        currentMonth = stripped.replace(/^[#\-\*\s]+/, ''); // Clean headers
        currentContent = [];
      } else if (currentMonth) {
        currentContent.push(line);
      }
    }
    
    if (currentMonth && currentContent.length > 0) {
      months.push({ title: currentMonth, content: currentContent.join('\n') });
    }
    
    // If no months were successfully parsed, return a default mock structured list for demo purposes
    if (months.length === 0) {
      return [
        {
          title: "Month 1: Foundation & Skill Building",
          content: "Focus on learning core missing skills (e.g. backend FastAPI, SQL query writing, API security). Take courses like AWS Cloud Practitioner and practice on projects."
        },
        {
          title: "Month 2: Project Deployment & Integration",
          content: "Implement Docker containers, set up PostgreSQL databases, and build a full-stack project linking React with FastAPI. Focus on testing and Pytest coverage."
        },
        {
          title: "Month 3: Advanced Optimization & Application",
          content: "Refine portfolio projects. Optimize React speed, practice mock interviews, customize resume/cover letters for target companies, and start active applications."
        }
      ];
    }
    
    return months;
  };

  const roadmapItems = parseRoadmap(improvementPlan);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Career Coach & Skills Gap Dashboard</h2>
      </div>

      {!improvementPlan ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-muted)' }}>
          <Compass size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontWeight: 500 }}>No career roadmap available.</p>
          <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: '280px', marginTop: '4px' }}>
            Input your student profile and job description in Resume Studio and generate your resume to activate the Career Coach.
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Skill gaps analysis / suggestions left column */}
          <div className="card" style={{ gridColumn: 'span 7', maxHeight: '560px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListChecks size={20} style={{ color: 'var(--primary)' }} />
              Skills Gap & Course Recommendations
            </h3>

            <div className="markdown-renderer">
              <ReactMarkdown>{improvementPlan}</ReactMarkdown>
            </div>
          </div>

          {/* Visual Timeline right column */}
          <div className="card" style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} style={{ color: 'var(--accent)' }} />
              3-Month Learning Roadmap
            </h3>

            <div className="timeline" style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '460px', paddingRight: '8px' }}>
              {roadmapItems.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />
                  <h4 className="timeline-title">{item.title}</h4>
                  <div className="timeline-content" style={{ fontSize: '0.85rem', marginTop: '4px', whiteSpace: 'pre-line' }}>
                    {item.content.replace(/^[#\-\*\s]+/, '')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Award style={{ color: 'var(--primary)', flexShrink: 0 }} size={24} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Recommendation:</strong> Complete these certifications within 90 days to raise your ATS score to <strong>90%+</strong>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
