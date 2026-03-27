import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for now - Enhanced cybersecurity profile
  useEffect(() => {
    setTimeout(() => {
      const userData = {
        name: 'Agent Phoenix',
        email: 'phoenix@cybersim.elite',
        role: 'Security Analyst',
        clearanceLevel: 'Level 3',
        operativeId: 'CSE-2024-001',
        joinDate: '2024-01-15',
        lastActive: '2024-01-26T10:30:00Z',
        avatar: '🕵️‍♂️',
        bio: 'Elite cybersecurity operative specializing in advanced persistent threat detection and incident response. Passionate about ethical hacking and building robust defense systems.',
        location: 'San Francisco, CA',
        company: 'CyberDefense Corp',
        website: 'https://phoenix-security.dev',
        github: 'agent-phoenix',
        linkedin: 'phoenix-cybersec',
        skills: ['Penetration Testing', 'Incident Response', 'Malware Analysis', 'Network Security', 'Python', 'Linux Administration', 'Digital Forensics', 'Threat Hunting'],
        certifications: [
          { name: 'CISSP', issuer: 'ISC2', date: '2023-06-15', verified: true },
          { name: 'CEH', issuer: 'EC-Council', date: '2023-03-20', verified: true },
          { name: 'GCIH', issuer: 'SANS', date: '2023-09-10', verified: true },
          { name: 'OSCP', issuer: 'Offensive Security', date: '2023-12-05', verified: true }
        ],
        stats: {
          totalLabs: 12,
          completedLabs: 8,
          totalScore: 1850,
          currentStreak: 15,
          longestStreak: 23,
          rank: 'Elite Operative',
          rankProgress: 75,
          nextRank: 'Master Guardian'
        },
        achievements: [
          { id: 1, name: 'First Blood', description: 'Complete your first lab', icon: '🏆', earned: true, date: '2024-01-16' },
          { id: 2, name: 'Speed Demon', description: 'Complete 5 labs in one day', icon: '⚡', earned: true, date: '2024-01-20' },
          { id: 3, name: 'Perfect Score', description: 'Get 100% on any lab', icon: '🎯', earned: true, date: '2024-01-22' },
          { id: 4, name: 'Elite Streak', description: '15-day learning streak', icon: '🔥', earned: true, date: '2024-01-25' },
          { id: 5, name: 'Master Hacker', description: 'Complete all attack labs', icon: '⚔️', earned: false, date: null },
          { id: 6, name: 'Guardian Shield', description: 'Complete all defense labs', icon: '🛡️', earned: false, date: null }
        ],
        recentActivity: [
          { type: 'lab_completed', title: 'Malware Analysis & Detection', score: 200, date: '2024-01-26T09:15:00Z' },
          { type: 'achievement_earned', title: 'Elite Streak Achievement', date: '2024-01-25T14:30:00Z' },
          { type: 'lab_completed', title: 'Web Application Security Testing', score: 170, date: '2024-01-24T16:45:00Z' },
          { type: 'article_read', title: 'Advanced SQL Injection Techniques', date: '2024-01-23T11:20:00Z' },
          { type: 'lab_completed', title: 'System Hardening', score: 150, date: '2024-01-22T13:10:00Z' }
        ],
        preferences: {
          emailNotifications: true,
          labReminders: true,
          weeklyDigest: true,
          publicProfile: true,
          darkMode: true,
          difficulty: 'advanced',
          language: 'en'
        }
      };
      setUser(userData);
      setFormData(userData);
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankColor = (rank) => {
    const colors = {
      'Recruit': '#10b981',
      'Specialist': '#3b82f6',
      'Elite Operative': '#8b5cf6',
      'Master Guardian': '#f59e0b',
      'Legend': '#ef4444'
    };
    return colors[rank] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Accessing operative profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Enhanced Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">{user.avatar}</div>
          <div className="profile-basic-info">
            <h1>{user.name}</h1>
            <div className="profile-badges">
              <span className="role-badge">{user.role}</span>
              <span className="clearance-badge">{user.clearanceLevel}</span>
              <span 
                className="rank-badge" 
                style={{ backgroundColor: getRankColor(user.stats.rank) }}
              >
                {user.stats.rank}
              </span>
            </div>
            <p className="operative-id">Operative ID: {user.operativeId}</p>
            <p className="profile-join-date">Enlisted: {formatDate(user.joinDate)}</p>
            <p className="last-active">Last Active: {formatDateTime(user.lastActive)}</p>
          </div>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn primary" onClick={() => setIsEditing(true)}>
              <span className="btn-icon">⚙️</span>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn ghost" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{user.stats.completedLabs}</div>
            <div className="stat-label">Labs Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-number">{user.stats.totalScore}</div>
            <div className="stat-label">Total Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">{user.stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{user.stats.rankProgress}%</div>
            <div className="stat-label">Rank Progress</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <>
            {/* Personal Information */}
            <div className="profile-section">
              <div className="section-header">
                <h2>🔍 Personal Information</h2>
              </div>
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="form-value">{user.name}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="form-value">{user.email}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="form-value">{user.location || 'Classified'}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Organization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your organization"
                      />
                    ) : (
                      <div className="form-value">{user.company || 'Classified'}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tell us about your cybersecurity journey..."
                    />
                  ) : (
                    <div className="form-value">{user.bio || 'No bio provided'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="profile-section">
              <div className="section-header">
                <h2>🛡️ Skills & Certifications</h2>
              </div>
              
              <div className="skills-section">
                <h3>Technical Skills</h3>
                <div className="skills-container">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      {skill}
                    </div>
                  ))}
                  {isEditing && (
                    <button className="skill-tag add-skill">
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

              <div className="certifications-section">
                <h3>Professional Certifications</h3>
                <div className="certifications-grid">
                  {user.certifications.map((cert, index) => (
                    <div key={index} className="certification-card">
                      <div className="cert-header">
                        <h4>{cert.name}</h4>
                        {cert.verified && <span className="verified-badge">✅ Verified</span>}
                      </div>
                      <p className="cert-issuer">{cert.issuer}</p>
                      <p className="cert-date">Earned: {formatDate(cert.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="profile-section">
              <div className="section-header">
                <h2>🌐 Professional Links</h2>
              </div>
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="form-value">
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                            {user.website}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="github">GitHub</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="github"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="username"
                      />
                    ) : (
                      <div className="form-value">
                        {user.github ? (
                          <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                            @{user.github}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="linkedin">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="profile-name"
                    />
                  ) : (
                    <div className="form-value">
                      {user.linkedin ? (
                        <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                          linkedin.com/in/{user.linkedin}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>🏆 Achievements & Badges</h2>
              <p>Unlock achievements by completing labs and reaching milestones</p>
            </div>
            <div className="achievements-grid">
              {user.achievements.map((achievement) => (
                <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                    {achievement.earned && (
                      <div className="achievement-date">
                        Earned: {formatDate(achievement.date)}
                      </div>
                    )}
                  </div>
                  {achievement.earned && <div className="earned-badge">✅</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>📊 Recent Activity</h2>
              <p>Your latest actions and progress</p>
            </div>
            <div className="activity-timeline">
              {user.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'lab_completed' && '🎯'}
                    {activity.type === 'achievement_earned' && '🏆'}
                    {activity.type === 'article_read' && '📚'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activity.type === 'lab_completed' && `Completed: ${activity.title}`}
                      {activity.type === 'achievement_earned' && `Earned: ${activity.title}`}
                      {activity.type === 'article_read' && `Read: ${activity.title}`}
                    </div>
                    {activity.score && (
                      <div className="activity-score">Score: {activity.score} points</div>
                    )}
                    <div className="activity-date">{formatDateTime(activity.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <>
            {/* Preferences */}
            <div className="profile-section">
              <div className="section-header">
                <h2>⚙️ Preferences</h2>
              </div>
              <div className="preferences-form">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications about new labs and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="preferences.emailNotifications"
                      checked={formData.preferences?.emailNotifications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Lab Reminders</h3>
                    <p>Get reminded to continue your learning streak</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="preferences.labReminders"
                      checked={formData.preferences?.labReminders}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Weekly Digest</h3>
                    <p>Receive a weekly summary of your progress</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="preferences.weeklyDigest"
                      checked={formData.preferences?.weeklyDigest}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Public Profile</h3>
                    <p>Make your profile visible to other operatives</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="preferences.publicProfile"
                      checked={formData.preferences?.publicProfile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="profile-section">
              <div className="section-header">
                <h2>🔐 Account Security</h2>
              </div>
              <div className="account-actions">
                <button className="btn ghost">
                  <span className="btn-icon">🔑</span>
                  Change Password
                </button>
                <button className="btn ghost">
                  <span className="btn-icon">📱</span>
                  Two-Factor Authentication
                </button>
                <button className="btn ghost">
                  <span className="btn-icon">📥</span>
                  Download Data
                </button>
                <button className="btn danger">
                  <span className="btn-icon">🗑️</span>
                  Delete Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}