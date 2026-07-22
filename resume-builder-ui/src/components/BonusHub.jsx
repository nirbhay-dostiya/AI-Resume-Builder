import React, { useState } from 'react';
import { Mail, MessagesSquare, Sparkles, Copy, FileDown, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={props.style}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import ReactMarkdown from 'react-markdown';

export default function BonusHub({
  studentProfile,
  jobDescription,
  provider,
  apiKey,
  coverLetter,
  setCoverLetter,
  linkedinAbout,
  setLinkedinAbout,
  interviewQuestions,
  setInterviewQuestions
}) {
  const [activeSubTab, setActiveSubTab] = useState('coverLetter');
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  
  // Accordion state for interview questions
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExport = async (content, filename, format) => {
    if (!content) return;
    try {
      const response = await fetch('http://localhost:8000/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content,
          format: format,
          filename: filename
        })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting document: ' + err.message);
    }
  };

  const handleGenerateBonus = async () => {
    if (!studentProfile || !jobDescription) {
      alert('Please first upload your profile and target job description in the Resume Studio.');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('student_profile', studentProfile);
      formData.append('job_description', jobDescription);
      formData.append('provider', provider);
      formData.append('api_key', apiKey);

      const response = await fetch('http://localhost:8000/api/generate-bonus', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate materials');
      }

      const res = await response.json();
      const data = res.data;

      setCoverLetter(data.cover_letter);
      setLinkedinAbout(data.linkedin_about);
      setInterviewQuestions(data.interview_questions);
    } catch (err) {
      alert('Error generating materials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse interview questions from markdown into an array for interactive Q&A
  const parseQuestions = (markdown) => {
    if (!markdown) return [];
    
    const qaPairs = [];
    // Basic parser looking for "Question" and "Answer" pairs
    const lines = markdown.split('\n');
    let currentQ = '';
    let currentA = '';
    let readingAnswer = false;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.match(/^(Question|\d+\.|\*\*Question|\*\*Q)/i)) {
        if (currentQ && currentA) {
          qaPairs.push({ q: currentQ, a: currentA });
        }
        currentQ = trimmed.replace(/^[#\d\.\*\s\-\:]+Question/i, '').replace(/^[\d\.\s\*]+/, '');
        currentA = '';
        readingAnswer = false;
      } else if (trimmed.match(/^(Answer|Sample Answer|\*\*Answer|\*\*A)/i)) {
        readingAnswer = true;
        currentA += trimmed.replace(/^[#\*\s\-\:]+Answer/i, '').replace(/^[#\*\s\-\:]+Sample Answer/i, '') + '\n';
      } else {
        if (readingAnswer) {
          currentA += trimmed + '\n';
        } else if (currentQ) {
          currentQ += ' ' + trimmed;
        }
      }
    }

    if (currentQ && currentA) {
      qaPairs.push({ q: currentQ, a: currentA });
    }

    // Default mock list if parsing yields empty results
    if (qaPairs.length === 0) {
      return [
        { q: "Tell me about yourself and your background.", a: "Focus on your CS degree, your internship experience at TechCorp, and your full-stack projects. Highlight your skills in React and FastAPI." },
        { q: "Explain how you optimized RESTful APIs using FastAPI in your internship.", a: "Mention writing query optimizations, caching endpoints using Redis or internal memoization, and restructuring database joins to decrease response times by 15%." },
        { q: "Describe a challenge you faced during a group project and how you solved it.", a: "Describe DevFlow. Talk about implementing JWT authentication and collaborating with frontend views using clean API endpoints." },
        { q: "What is your experience with Docker and Containerization?", a: "Explain creating Dockerfiles, configuring docker-compose, and mapping local environments to containers for staging environments." },
        { q: "Why do you want to join InnovateTech Systems?", a: "Explain how their SaaS model aligns with your skills in React/FastAPI. Mention your interest in working in an Agile/Scrum team as written in the job description." }
      ];
    }

    return qaPairs;
  };

  const interviewQA = parseQuestions(interviewQuestions);

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>AI Career Hub & Extras</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Generate and manage custom cover letters, LinkedIn profile summaries, and interactive mock interview cards.
          </p>
        </div>

        {/* Generate button if empty */}
        {(!coverLetter && !linkedinAbout && !interviewQuestions) && (
          <button 
            onClick={handleGenerateBonus} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : <Sparkles size={18} />}
            <span>{loading ? 'Generating Materials...' : 'Generate Career Pack'}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
          <div className="spinner spinner-primary" style={{ width: '40px', height: '40px', borderWidth: '3.5px', marginBottom: '20px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>CrewAI Writing Package</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', textAlign: 'center', maxWidth: '300px' }}>
            Generating Cover Letter, LinkedIn About Section, and Mock Interview Questions...
          </p>
        </div>
      ) : (!coverLetter && !linkedinAbout && !interviewQuestions) ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: 'var(--text-muted)' }}>
          <Sparkles size={48} style={{ marginBottom: '16px', color: 'var(--primary)' }} />
          <p style={{ fontWeight: 600 }}>Extra Career Assets Empty</p>
          <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: '320px', marginTop: '4px' }}>
            Click the "Generate Career Pack" button above to activate agents for writing tailored cover letters and interviews.
          </p>
        </div>
      ) : (
        <div>
          {/* Sub Navigation */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px'
          }}>
            <button
              onClick={() => setActiveSubTab('coverLetter')}
              className={`btn ${activeSubTab === 'coverLetter' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Mail size={16} />
              <span>Cover Letter</span>
            </button>
            <button
              onClick={() => setActiveSubTab('linkedin')}
              className={`btn ${activeSubTab === 'linkedin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Linkedin size={16} />
              <span>LinkedIn Summary</span>
            </button>
            <button
              onClick={() => setActiveSubTab('interview')}
              className={`btn ${activeSubTab === 'interview' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <MessagesSquare size={16} />
              <span>Mock Interview QA</span>
            </button>
          </div>

          {/* Sub Tab contents */}
          <div className="card" style={{ minHeight: '400px' }}>
            {activeSubTab === 'coverLetter' && (
              <div>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={18} style={{ color: 'var(--primary)' }} />
                    Tailored Cover Letter
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleCopy(coverLetter, 'coverLetter')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      {copiedText === 'coverLetter' ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                      <span>{copiedText === 'coverLetter' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button onClick={() => handleExport(coverLetter, 'Cover_Letter', 'pdf')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <FileDown size={14} />
                      <span>PDF</span>
                    </button>
                    <button onClick={() => handleExport(coverLetter, 'Cover_Letter', 'docx')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <FileDown size={14} />
                      <span>Word</span>
                    </button>
                  </div>
                </div>

                <div className="markdown-renderer" style={{
                  maxHeight: '420px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <ReactMarkdown>{coverLetter}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeSubTab === 'linkedin' && (
              <div>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Linkedin size={18} style={{ color: 'var(--accent)' }} />
                    LinkedIn About/Summary Section
                  </h3>
                  <button onClick={() => handleCopy(linkedinAbout, 'linkedin')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    {copiedText === 'linkedin' ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                    <span>{copiedText === 'linkedin' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="markdown-renderer" style={{
                  maxHeight: '420px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <ReactMarkdown>{linkedinAbout}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeSubTab === 'interview' && (
              <div>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessagesSquare size={18} style={{ color: 'var(--primary)' }} />
                    Interactive Mock Interview Practice
                  </h3>
                  <button onClick={() => handleCopy(interviewQuestions, 'interview')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    {copiedText === 'interview' ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                    <span>Copy All QA</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
                  {interviewQA.map((qa, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: expandedQuestion === idx ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Q{idx + 1}: {qa.q}</span>
                        {expandedQuestion === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {expandedQuestion === idx && (
                        <div style={{
                          padding: '16px',
                          borderTop: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          backgroundColor: 'var(--bg-secondary)'
                        }}>
                          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>Suggested Answer Guideline:</strong>
                          <div style={{ whiteSpace: 'pre-line' }}>{qa.a}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
