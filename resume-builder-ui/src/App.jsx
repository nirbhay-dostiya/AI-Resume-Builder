import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, BarChart3, GraduationCap, Briefcase, Gift, Moon, Sun, LogOut } from 'lucide-react';
import Auth from './components/Auth';
import ResumeStudio from './components/ResumeStudio';
import ATSAnalysis from './components/ATSAnalysis';
import CareerCoach from './components/CareerCoach';
import JobSearch from './components/JobSearch';
import BonusHub from './components/BonusHub';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume');
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Shared inputs & outputs state
  const [studentProfile, setStudentProfile] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');

  const [resume, setResume] = useState('');
  const [atsReport, setAtsReport] = useState('');
  const [improvementPlan, setImprovementPlan] = useState('');

  // Bonus output states
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedinAbout, setLinkedinAbout] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState('');

  // Load from local storage for quick reload comfort
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setIsAuthenticated(true);
    }
    const savedTheme = localStorage.getItem('theme_dark');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Update dark class on HTML node when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme_dark', darkMode);
  }, [darkMode]);

  const handleLogin = (profile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('user_profile');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <Sparkles size={26} style={{ color: 'var(--primary)' }} />
          <span className="logo-text">AI Resume Pro</span>
        </div>

        <nav className="nav-links">
          <button
            onClick={() => setActiveTab('resume')}
            className={`nav-item ${activeTab === 'resume' ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>Resume Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`nav-item ${activeTab === 'ats' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>ATS Auditor</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`nav-item ${activeTab === 'coach' ? 'active' : ''}`}
          >
            <GraduationCap size={18} />
            <span>Career Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            <span>Job Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('bonus')}
            className={`nav-item ${activeTab === 'bonus' ? 'active' : ''}`}
          >
            <Gift size={18} />
            <span>Bonus Hub</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="nav-item"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-workspace">
        {/* Top welcome header */}
        <header className="top-bar">
          <div className="user-welcome">
            <h1>Welcome, {userProfile?.name || 'Jane Doe'}!</h1>
            <p>Ready to tailor your credentials and secure your dream role?</p>
          </div>
          
          <div className="top-bar-actions">
            {resume && (
              <div 
                style={{
                  fontSize: '0.85rem',
                  padding: '6px 12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}
              >
                Resume Ready
              </div>
            )}
          </div>
        </header>

        {/* Tab Switchboard rendering active component */}
        <div style={{ flexGrow: 1 }}>
          {activeTab === 'resume' && (
            <ResumeStudio
              studentProfile={studentProfile}
              setStudentProfile={setStudentProfile}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              provider={provider}
              setProvider={setProvider}
              apiKey={apiKey}
              setApiKey={setApiKey}
              resume={resume}
              setResume={setResume}
              setAtsReport={setAtsReport}
              setImprovementPlan={setImprovementPlan}
              setCoverLetter={setCoverLetter}
              setLinkedinAbout={setLinkedinAbout}
              setInterviewQuestions={setInterviewQuestions}
            />
          )}

          {activeTab === 'ats' && (
            <ATSAnalysis 
              atsReport={atsReport} 
            />
          )}

          {activeTab === 'coach' && (
            <CareerCoach 
              improvementPlan={improvementPlan} 
            />
          )}

          {activeTab === 'jobs' && (
            <JobSearch 
              studentProfile={studentProfile} 
            />
          )}

          {activeTab === 'bonus' && (
            <BonusHub
              studentProfile={studentProfile}
              jobDescription={jobDescription}
              provider={provider}
              apiKey={apiKey}
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              linkedinAbout={linkedinAbout}
              setLinkedinAbout={setLinkedinAbout}
              interviewQuestions={interviewQuestions}
              setInterviewQuestions={setInterviewQuestions}
            />
          )}
        </div>
      </main>
    </div>
  );
}
