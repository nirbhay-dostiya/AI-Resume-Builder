import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ExternalLink, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function JobSearch({ studentProfile }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [query, setQuery] = useState('React Python');
  const [location, setLocation] = useState('All');
  const [experience, setExperience] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = new URL('http://localhost:8000/api/jobs');
      if (query) url.searchParams.append('query', query);
      if (location && location !== 'All') url.searchParams.append('location', location);
      if (experience && experience !== 'All') url.searchParams.append('experience', experience);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      let data = await response.json();
      
      // Sort client-side if needed (relevance is pre-sorted in backend)
      if (sortBy === 'title') {
        data.sort((a, b) => a.title.localeCompare(b.title));
      }

      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location, experience, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const getMatchScoreBadge = (score) => {
    if (score >= 85) return 'badge-success';
    if (score >= 70) return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>AI Job Matching Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Discover matching opportunities based on your skills and target role criteria.
        </p>
      </div>

      {/* Search Header Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flexGrow: 1, position: 'relative', minWidth: '240px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '44px' }}
              placeholder="Search jobs by keywords (e.g. React, Python, FastAPI)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search Jobs</button>
        </form>

        {/* Filters Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '20px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <SlidersHorizontal size={14} />
              <span>Filters:</span>
            </div>

            {/* Location Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</label>
              <select 
                className="form-select" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="Bengaluru">Bengaluru, Karnataka</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
                <option value="Remote">Remote (India)</option>
              </select>
            </div>

            {/* Experience Level Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience</label>
              <select 
                className="form-select" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Internship">Internship</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
          </div>

          {/* Sort By Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ArrowUpDown size={14} />
              <span>Sort By:</span>
            </div>
            <select 
              className="form-select" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Match Score (Highest)</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="spinner spinner-primary" style={{ width: '36px', height: '36px', borderWidth: '3px' }} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Briefcase size={40} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>No matching jobs found.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try widening your search terms or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map((job) => (
            <div key={job.id} className="card fade-in" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flexGrow: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</h3>
                  <span className={`badge ${getMatchScoreBadge(job.match_score)}`} style={{ fontSize: '0.7rem' }}>
                    {job.match_score}% Match
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '12px' }}>
                  {job.company}
                </h4>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} />
                    {job.location} ({job.type})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={14} />
                    {job.experience}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '800px' }}>
                  {job.description}
                </p>

                {/* Key Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '3px 8px', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        color: 'var(--text-secondary)', 
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ alignSelf: 'center' }}>
                <button 
                  onClick={() => setErrorModalVisible(true)} 
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span>Apply on LinkedIn</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom warning modal matching user screenshot */}
      {errorModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#f3f4f6', // Light gray background matching LinkedIn's warning layout
            color: '#1f2937',
            textAlign: 'center',
            padding: '40px 32px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Visual warning illustration mapping the children/roadblock scene */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #ffffff'
              }}>
                <div style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 800
                }}>
                  !
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              Unable to load the page
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
              Job id provided may not be valid or the job posting has been removed.
            </p>

            <button 
              onClick={() => setErrorModalVisible(false)} 
              className="btn"
              style={{
                backgroundColor: '#0a66c2', // LinkedIn official brand color
                color: '#ffffff',
                borderRadius: '24px',
                padding: '10px 32px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'inline-block',
                margin: '0 auto'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#004182'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#0a66c2'}
            >
              Go to Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
