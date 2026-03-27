import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Terminal from '../components/Terminal';
import { labsAPI } from '../services/api';

export default function SQLInjectionLab({ onClose }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [terminalLines, setTerminalLines] = useState([
    { type: 'system', text: '╔══════════════════════════════════════════╗' },
    { type: 'system', text: '║   💉  SQL INJECTION LAB — ATTACK MODE   ║' },
    { type: 'system', text: '╚══════════════════════════════════════════╝' },
    { type: 'system', text: '' },
    { type: 'info',   text: 'Mission: Bypass the login form using SQL injection.' },
    { type: 'info',   text: 'Enter payloads in the username field below.' },
    { type: 'system', text: '' },
    { type: 'info',   text: 'Hint: Try  \'  OR  1=1--  in the username field.' },
    { type: 'system', text: '' },
  ]);
  const [capturedFlag, setCapturedFlag] = useState('');
  const [flagInput, setFlagInput] = useState('');
  const [labDone, setLabDone] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const addLine = (type, text) =>
    setTerminalLines(prev => [...prev, { type, text }]);

  const loadLab = useCallback(async () => {
    try {
      setLoading(true);
      const labData = await labsAPI.getBySlug(slug || 'sql-injection');
      setLab(labData.data);
      await labsAPI.start(labData.data._id);
    } catch (err) {
      console.error('Failed to load lab:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { loadLab(); }, [loadLab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    addLine('input', `> Username: ${username}`);
    addLine('input', `> Password: ${'*'.repeat(password.length || 1)}`);

    try {
      const result = await labsAPI.execute({
        labId: lab._id,
        input: { username, password },
        action: 'attack',
      });

      if (result.data.success) {
        addLine('success', '');
        addLine('success', '✅ ACCESS GRANTED!');
        addLine('success', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (result.data.sqlInjected) {
          addLine('success', '🔓 SQL Injection Successful!');
          addLine('warning', '⚠️  Authentication Bypass Detected');
          addLine('success', `👤 Logged in as: ${result.data.user?.username}`);
          addLine('success', `🔐 Role: ${result.data.user?.role}`);
        }
        addLine('success', '');
        addLine('flag',    '🚩 FLAG: ' + result.data.flag);
        addLine('success', '');
        addLine('info',    'Enter the flag below to complete the lab.');
        setCapturedFlag(result.data.flag);
      } else {
        addLine('error', '❌ Access Denied — ' + (result.data.message || 'Invalid credentials'));
      }
    } catch {
      addLine('error', '❌ Error executing attack');
    }

    setUsername('');
    setPassword('');
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    try {
      const result = await labsAPI.submitFlag({ labId: lab._id, flag: flagInput.trim() });

      if (result.data.success) {
        if (result.data.alreadyCompleted) {
          addLine('warning', '⚠️  Lab already completed — points already awarded.');
          setLabDone(true);
          setTimeout(() => { if (onClose) onClose(); else navigate('/learn'); }, 2000);
          return;
        }
        addLine('success', '');
        addLine('success', '🏆 LAB COMPLETED!');
        addLine('success', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        addLine('success', `Points earned: +${result.data.score}`);
        addLine('success', `Total points:  ${result.data.totalPoints}`);
        if (result.data.newAchievements?.length > 0) {
          addLine('success', '');
          addLine('success', '🎉 NEW ACHIEVEMENT!');
          result.data.newAchievements.forEach(a =>
            addLine('success', `  ${a.icon} ${a.name}`)
          );
        }
        setLabDone(true);
        setTimeout(() => { if (onClose) onClose(); else navigate('/learn'); }, 3000);
      } else {
        addLine('error', '❌ Incorrect flag. Try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      addLine('error', `❌ Error: ${msg}`);
    }
    setFlagInput('');
  };

  const hints = lab?.hints || [];

  const getColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error':   return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'flag':    return '#FFD700';
      case 'input':   return 'var(--primary)';
      default:        return 'var(--muted)';
    }
  };

  return (
    <div className="sqli-container">
      {/* Header */}
      <div className="sqli-header">
        <div>
          <h1>💉 {lab?.title || 'SQL Injection Lab'}</h1>
          <div className="sqli-meta">
            <span className={`difficulty ${lab?.difficulty}`}>{lab?.difficulty}</span>
            <span className="points">+{lab?.points} pts</span>
          </div>
        </div>
        <button className="btn ghost" onClick={onClose || (() => navigate('/learn'))}>← Exit Lab</button>
      </div>

      <div className="sqli-body">
        {/* Left: mission brief */}
        <div className="sqli-sidebar">
          <div className="sqli-card">
            <h3>📋 Mission Brief</h3>
            <p>{lab?.description}</p>
          </div>
          <div className="sqli-card">
            <h3>🎯 Objectives</h3>
            <ul>
              {lab?.instructions?.map((inst, i) => (
                <li key={i}>{inst.text}</li>
              ))}
            </ul>
          </div>
          <div className="sqli-card">
            <h3>💡 Hints</h3>
            {hints.slice(0, currentHint + 1).map((h, i) => (
              <p key={i} className="hint-text">• {h}</p>
            ))}
            {currentHint < hints.length - 1 && (
              <button className="btn ghost small" onClick={() => setCurrentHint(c => c + 1)}>
                Next Hint
              </button>
            )}
          </div>
        </div>

        {/* Right: terminal + login form */}
        <div className="sqli-main">
          {/* Terminal output */}
          <div className="sqli-terminal">
            <div className="term-bar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="term-title">terminal — sql-injection</span>
            </div>
            <div className="term-body">
              {terminalLines.map((line, i) => (
                <div key={i} className="term-line" style={{ color: getColor(line.type) }}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>

          {/* Login form */}
          <div className="sqli-card login-card">
            <h3>🔐 Vulnerable Login Form</h3>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                placeholder="Username  (inject here)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
                disabled={!!capturedFlag}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={!!capturedFlag}
              />
              <button type="submit" className="btn primary" disabled={!!capturedFlag || !lab}>
                Login
              </button>
            </form>
            <p className="login-hint">Try: <code>' OR 1=1--</code> in the username field</p>
          </div>

          {/* Flag submit — only shown after flag is captured */}
          {capturedFlag && !labDone && (
            <div className="sqli-card flag-card">
              <h3>🚩 Submit Flag</h3>
              <form onSubmit={handleFlagSubmit} className="flag-form">
                <input
                  type="text"
                  placeholder="flag{...}"
                  value={flagInput}
                  onChange={e => setFlagInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn primary">Submit</button>
              </form>
            </div>
          )}

          {labDone && (
            <div className="sqli-card done-card">
              <h3>🏆 Lab Complete! Redirecting...</h3>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sqli-container { max-width: 1300px; margin: 0 auto; padding: 2rem; }

        .sqli-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .sqli-header h1 { font-size: 1.7rem; margin-bottom: 0.4rem; }
        .sqli-meta { display: flex; gap: 1rem; align-items: center; }

        .difficulty { padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; }
        .difficulty.beginner     { background: rgba(16,185,129,0.2); color: #10b981; }
        .difficulty.intermediate { background: rgba(245,158,11,0.2); color: #f59e0b; }
        .difficulty.advanced     { background: rgba(239,68,68,0.2);  color: #ef4444; }
        .points { color: #fbbf24; font-weight: 600; }

        .sqli-body { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }

        .sqli-sidebar { display: flex; flex-direction: column; gap: 1rem; }

        .sqli-card {
          background: rgba(26,31,46,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .sqli-card h3 { color: var(--primary); margin-bottom: 0.75rem; font-size: 0.95rem; }
        .sqli-card p  { color: var(--muted); font-size: 0.88rem; line-height: 1.5; }
        .sqli-card ul { list-style: none; padding: 0; margin: 0; }
        .sqli-card li { color: var(--muted); font-size: 0.85rem; padding: 0.3rem 0 0.3rem 1.2rem; position: relative; }
        .sqli-card li::before { content: '→'; position: absolute; left: 0; color: var(--primary); }

        .hint-text { color: #f59e0b; font-size: 0.85rem; margin-bottom: 0.5rem; }

        .sqli-main { display: flex; flex-direction: column; gap: 1rem; }

        /* Terminal */
        .sqli-terminal {
          background: #0a0e1a;
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 12px;
          overflow: hidden;
          flex: 1;
        }
        .term-bar {
          display: flex; align-items: center; gap: 0.4rem;
          background: rgba(255,255,255,0.04);
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot.red    { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green  { background: #10b981; }
        .term-title { margin-left: 0.5rem; font-size: 0.8rem; color: var(--muted); font-family: monospace; }
        .term-body {
          padding: 1rem 1.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.7;
          min-height: 220px;
          max-height: 340px;
          overflow-y: auto;
        }
        .term-line { white-space: pre-wrap; word-break: break-all; }

        /* Login form */
        .login-card h3 { color: var(--danger); }
        .login-form { display: flex; flex-direction: column; gap: 0.6rem; }
        .login-form input {
          padding: 0.7rem 1rem;
          background: rgba(10,14,26,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text);
          font-size: 0.9rem;
        }
        .login-form input:focus { outline: none; border-color: var(--danger); }
        .login-form input:disabled { opacity: 0.4; cursor: not-allowed; }
        .login-hint { margin-top: 0.75rem; font-size: 0.82rem; color: var(--muted); }
        .login-hint code { color: var(--primary); background: rgba(0,200,255,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; }

        /* Flag submit */
        .flag-card { border-color: rgba(255,215,0,0.3); background: rgba(255,215,0,0.05); }
        .flag-card h3 { color: #FFD700; }
        .flag-form { display: flex; gap: 0.75rem; }
        .flag-form input {
          flex: 1;
          padding: 0.7rem 1rem;
          background: rgba(10,14,26,0.8);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 8px;
          color: #FFD700;
          font-family: monospace;
          font-size: 0.9rem;
        }
        .flag-form input:focus { outline: none; border-color: #FFD700; }

        /* Done */
        .done-card { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08); }
        .done-card h3 { color: #10b981; }

        @media (max-width: 900px) {
          .sqli-body { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
