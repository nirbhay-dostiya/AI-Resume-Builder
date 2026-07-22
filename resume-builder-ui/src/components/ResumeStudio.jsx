import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Copy, FileDown, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ResumeStudio({
  studentProfile,
  setStudentProfile,
  jobDescription,
  setJobDescription,
  provider,
  setProvider,
  apiKey,
  setApiKey,
  resume,
  setResume,
  setAtsReport,
  setImprovementPlan,
  setCoverLetter,
  setLinkedinAbout,
  setInterviewQuestions
}) {
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [copied, setCopied] = useState(false);
  
  const profileInputRef = useRef(null);
  const jdInputRef = useRef(null);

  // Read file utility
  const handleFileUpload = (e, targetSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      targetSetter(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format) => {
    if (!resume) return;
    try {
      const response = await fetch('http://localhost:8000/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: resume,
          format: format,
          filename: 'Tailored_Resume'
        })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tailored_Resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting document: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentProfile.trim()) {
      alert('Please fill in or upload a Student Profile.');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please fill in or upload a Job Description.');
      return;
    }

    setLoading(true);
    setLoadingStage('Initializing CrewAI agents...');
    
    // Reset outputs
    setResume('');
    setAtsReport('');
    setImprovementPlan('');
    setCoverLetter('');
    setLinkedinAbout('');
    setInterviewQuestions('');

    try {
      // Stage timer simulation for UX
      const timer = setTimeout(() => {
        setLoadingStage('Resume Writer Agent: Crafting tailored experience bullet points...');
      }, 5000);

      const timer2 = setTimeout(() => {
        setLoadingStage('ATS Reviewer Agent: Auditing compliance score & checking keywords...');
      }, 15000);

      const timer3 = setTimeout(() => {
        setLoadingStage('Career Coach Agent: Mapping 3-month skill gaps roadmap...');
      }, 25000);

      const formData = new FormData();
      formData.append('student_profile_text', studentProfile);
      formData.append('job_description_text', jobDescription);
      formData.append('provider', provider);
      formData.append('api_key', apiKey);

      const response = await fetch('http://localhost:8000/api/generate-resume', {
        method: 'POST',
        body: formData
      });

      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate resume');
      }

      const res = await response.json();
      const data = res.data;
      
      setResume(data.resume);
      setAtsReport(data.ats_report);
      setImprovementPlan(data.improvement_plan);
    } catch (err) {
      alert('Error generating resume: ' + err.message);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, targetSetter) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        targetSetter(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fade-in">
      <div className="top-bar-actions" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Resume Generation Studio</h2>
      </div>

      <div className="dashboard-grid">
        {/* Input Configuration Column */}
        <div className="card" style={{ gridColumn: 'span 5' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            Configure Generation
          </h3>

          <form onSubmit={handleSubmit}>


            {/* Profile Input */}
            <div className="form-group">
              <div className="flex-between">
                <label className="form-label">Student Profile (Skills, Projects, Experience)</label>
                <button
                  type="button"
                  onClick={() => profileInputRef.current.click()}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Upload size={12} /> Upload file
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept=".txt"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, setStudentProfile)}
                />
              </div>

              {!studentProfile.trim() ? (
                <div
                  className="upload-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setStudentProfile)}
                  onClick={() => profileInputRef.current.click()}
                >
                  <Upload size={28} className="upload-icon" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>Drag & Drop profile text file here</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>or click to browse from files</p>
                </div>
              ) : (
                <textarea
                  className="form-textarea"
                  style={{ height: '140px' }}
                  value={studentProfile}
                  onChange={(e) => setStudentProfile(e.target.value)}
                />
              )}
            </div>

            {/* Job Description Input */}
            <div className="form-group">
              <div className="flex-between">
                <label className="form-label">Target Job Description</label>
                <button
                  type="button"
                  onClick={() => jdInputRef.current.click()}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Upload size={12} /> Upload file
                </button>
                <input
                  ref={jdInputRef}
                  type="file"
                  accept=".txt"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, setJobDescription)}
                />
              </div>

              {!jobDescription.trim() ? (
                <div
                  className="upload-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setJobDescription)}
                  onClick={() => jdInputRef.current.click()}
                >
                  <Upload size={28} className="upload-icon" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>Drag & Drop job description file here</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>or click to browse from files</p>
                </div>
              ) : (
                <textarea
                  className="form-textarea"
                  style={{ height: '140px' }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Generating Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate ATS Optimized Resume</span>
                </>
              )}
            </button>

            {/* Clear Inputs */}
            {(studentProfile || jobDescription) && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={() => {
                  setStudentProfile('');
                  setJobDescription('');
                }}
                disabled={loading}
              >
                Clear Inputs
              </button>
            )}
          </form>
        </div>

        {/* Output Resume Column */}
        <div className="card" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', borderWidth: '4px', marginBottom: '24px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>CrewAI Multitask Process Active</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '360px' }}>{loadingStage}</p>
            </div>
          ) : !resume ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ marginBottom: '16px' }} />
              <p style={{ fontWeight: 500 }}>No resume generated yet.</p>
              <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: '280px', marginTop: '4px' }}>
                Fill in the configurations and click Generate to run the AI multi-agent workflow.
              </p>
            </div>
          ) : (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tailored ATS-Friendly Resume</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                    {copied ? <CheckCircle size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', gap: '4px' }}>
                      <FileDown size={16} />
                      <span>Download</span>
                    </button>
                    {/* Dropdown for formats */}
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '4px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '120px',
                      padding: '4px 0'
                    }}>
                      <button onClick={() => handleExport('pdf')} style={{ padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>PDF Export</button>
                      <button onClick={() => handleExport('docx')} style={{ padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Word (DOCX)</button>
                      <button onClick={() => {
                        const blob = new Blob([resume], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume.md';
                        a.click();
                      }} style={{ padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Markdown</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable preview area */}
              <div style={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: '520px',
                paddingRight: '8px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px'
              }}>
                <div className="markdown-renderer">
                  <ReactMarkdown>{resume}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
