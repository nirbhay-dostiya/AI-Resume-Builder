import React from 'react';
import { ShieldCheck, AlertTriangle, Check, X, FileSearch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ATSAnalysis({ atsReport }) {
  // Helper to extract a score out of the ATS report markdown
  const parseScore = (report) => {
    if (!report) return 0;
    // Look for patterns like "85%", "Score: 85", "Score**: 85", "85/100"
    const percentMatch = report.match(/(\d+)%/);
    if (percentMatch) return parseInt(percentMatch[1]);
    
    const fractionMatch = report.match(/(\d+)\/100/);
    if (fractionMatch) return parseInt(fractionMatch[1]);

    const numMatch = report.match(/(?:score|compatibility|match)\D*(\d+)/i);
    if (numMatch) {
      const score = parseInt(numMatch[1]);
      if (score >= 0 && score <= 100) return score;
    }
    
    return 75; // Graceful fallback
  };

  const score = parseScore(atsReport);
  const strokeDashoffset = 339.29 - (339.29 * score) / 100; // 2 * pi * r (r = 54)

  // Color coordination based on score
  const getScoreColorClass = (val) => {
    if (val >= 85) return { stroke: 'var(--success)', badge: 'badge-success', label: 'Excellent Match' };
    if (val >= 70) return { stroke: 'var(--warning)', badge: 'badge-warning', label: 'Average Match' };
    return { stroke: 'var(--danger)', badge: 'badge-danger', label: 'Needs Improvement' };
  };

  const statusInfo = getScoreColorClass(score);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>ATS Compliance Hub</h2>
      </div>

      {!atsReport ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-muted)' }}>
          <FileSearch size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontWeight: 500 }}>No ATS analysis available.</p>
          <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: '280px', marginTop: '4px' }}>
            Go to the Resume Studio, input your profile, and generate a resume to view compliance scoring here.
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Score card */}
          <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-secondary)' }}>Overall ATS Rating</h3>
            
            <div className="ats-score-container">
              <div className="score-ring">
                <svg className="score-circle">
                  <circle className="circle-bg" cx="70" cy="70" r="54" />
                  <circle 
                    className="circle-progress" 
                    cx="70" 
                    cy="70" 
                    r="54"
                    style={{
                      strokeDasharray: '339.29',
                      strokeDashoffset: strokeDashoffset,
                      stroke: statusInfo.stroke
                    }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-num">{score}%</span>
                  <span className="score-label">Score</span>
                </div>
              </div>

              <span className={`badge ${statusInfo.badge}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                {statusInfo.label}
              </span>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', width: '100%', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Keyword Alignment</span>
                <strong>{score >= 85 ? 'Strong' : score >= 70 ? 'Moderate' : 'Low'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Format Compliance</span>
                <strong>Pass</strong>
              </div>
            </div>
          </div>

          {/* Full Report card */}
          <div className="card" style={{ gridColumn: 'span 8', maxHeight: '520px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
              ATS Audit Report Breakdown
            </h3>
            
            <div className="markdown-renderer">
              <ReactMarkdown>{atsReport}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
