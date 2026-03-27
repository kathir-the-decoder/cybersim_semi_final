import React, { useState, useEffect, useRef } from 'react'
import '../App.css'

// A simple educational lab. Safe, client-side simulation only.
const DEMO_FLAG = 'flag{cybersim_lab_demo}'

export default function AttackLab({ onClose }) {
  const [started, setStarted] = useState(false)
  const [log, setLog] = useState([])
  const [checkpoints, setCheckpoints] = useState({
    openedLab: false,
    copiedPayload: false,
    exploited: false,
    extractedFlag: false,
    submitted: false,
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [flagInput, setFlagInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const terminalRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [log])

  function startLab() {
    setStarted(true)
    setLog([`Lab started — ${new Date().toLocaleTimeString()}`])
    setCheckpoints(c => ({ ...c, openedLab: true }))
    setMessage(null)
    setFlagInput('')
    setUsername('')
    setPassword('')
  }

  function resetLab() {
    setStarted(false)
    setLog([])
    setCheckpoints({ openedLab: false, copiedPayload: false, exploited: false, extractedFlag: false, submitted: false })
    setMessage(null)
    setFlagInput('')
    setUsername('')
    setPassword('')
  }

  function appendLog(line) {
    setLog(l => [...l, line])
  }

  // Simulated vulnerable login handler (client-side safe demonstration)
  function submitLogin(e) {
    e?.preventDefault()
    appendLog(`POST /login -> username=${username} password=${password}`)

    // naive SQLi-like check: payload contains OR or 1=1
    const u = (username || '').toLowerCase()
    if (u.includes("' or ") || u.includes(' or ') || u.includes("1=1") || u.includes("'='1") ) {
      appendLog('Login bypass successful — authenticated as admin')
      appendLog('Reading secret file: /var/www/flag.txt')
      appendLog(`FLAG: ${DEMO_FLAG}`)
      setCheckpoints(c => ({ ...c, exploited: true, extractedFlag: true }))
      setMessage({ type: 'success', text: 'Exploit worked — flag revealed in logs.' })
    } else {
      setMessage({ type: 'error', text: 'Login failed. Try a SQLi payload in the username (demo).' })
    }
  }

  function copyPayload(p) {
    navigator.clipboard?.writeText(p).then(() => {
      appendLog(`Copied payload: ${p}`)
      setCheckpoints(c => ({ ...c, copiedPayload: true }))
      setMessage({ type: 'info', text: 'Payload copied to clipboard — paste it into the username field.' })
    }).catch(() => {
      setMessage({ type: 'error', text: 'Could not copy to clipboard — copy manually.' })
    })
  }

  function runTerminalCommand(cmd) {
    appendLog(`$ ${cmd}`)
    const lc = (cmd || '').toLowerCase()
    if (lc.includes('curl') && lc.includes('flag')) {
      appendLog('curl http://localhost:3001/flag -> ' + DEMO_FLAG)
      setCheckpoints(c => ({ ...c, extractedFlag: true }))
      setMessage({ type: 'success', text: 'Flag fetched via simulated curl.' })
    } else if (lc.includes('ls') || lc.includes('cat')) {
      appendLog('Simulated filesystem: /var/www/flag.txt (contains secret)')
    } else {
      appendLog('Command executed (simulated). Try `curl http://localhost:3001/flag` or `cat /var/www/flag.txt`')
    }
  }

  function submitFlag(e) {
    e?.preventDefault()
    if (flagInput.trim() === DEMO_FLAG) {
      setCheckpoints(c => ({ ...c, submitted: true }))
      appendLog('Flag submitted: ' + flagInput)
      setMessage({ type: 'success', text: 'Correct — lab complete. Well done!' })
    } else {
      appendLog('Flag submission attempt: ' + flagInput)
      setMessage({ type: 'error', text: 'Incorrect flag — try again or extract it from the logs/terminal.' })
    }
  }

  // compact UI helpers
  const payloads = ["' OR '1'='1", "' OR '1'='1' -- ", "admin' -- "]

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>SQL Injection — Student Lab</h2>
          <div style={{ color: '#cbd5e1' }}>A short, safe, client-side lab that demonstrates a basic SQL injection workflow.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => { if (onClose) onClose() }}>Exit</button>
          <button className="btn" onClick={resetLab}>Reset</button>
          {!started ? <button className="btn primary" onClick={startLab}>Start Lab</button> : null}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16, marginTop: 12 }}>
        <section style={{ textAlign: 'left' }}>
          <h3>Overview</h3>
          <p style={{ color: '#e6eef8' }}>This lab guides the learner through a minimal SQL injection scenario: a naive login form that is vulnerable to a simple boolean-based injection. The goal is to bypass login and extract the secret flag.</p>

          <h4>Learning objectives</h4>
          <ul>
            <li>Understand how naive input handling can be abused with SQL injection.</li>
            <li>Practice a safe, simulated exploitation workflow (form payloads and simple commands).</li>
            <li>Extract and submit a flag to demonstrate success.</li>
          </ul>

          <h4>Steps</h4>
          <ol>
            <li>Start the lab session.</li>
            <li>Open the simulated vulnerable login form and try a payload.</li>
            <li>Use the simulated terminal or form to retrieve the flag.</li>
            <li>Submit the extracted flag in the submission box.</li>
          </ol>

          <div style={{ marginTop: 12 }}>
            <h4>Simulated vulnerable page</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, background: 'var(--surface)', color: 'var(--text)' }}>
              <form onSubmit={submitLogin}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 13 }}>Username</label>
                  <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" className="atk-input" />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 13 }}>Password</label>
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" className="atk-input" />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn primary" disabled={!started} type="submit">Login</button>
                  <button type="button" className="btn ghost" onClick={()=>{ setUsername(''); setPassword(''); }}>Clear</button>
                </div>
              </form>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>Quick payloads</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {payloads.map(p => (
                    <button key={p} className="btn" onClick={()=>copyPayload(p)} disabled={!started}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Simulated terminal</h4>
            <div style={{ border: '1px solid #ddd', padding: 8, borderRadius: 8, background: '#000', color: '#d1d5db' }}>
              <div ref={terminalRef} style={{ maxHeight: 160, overflow: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13, background: '#071018', borderRadius: 6 }}>
                {log.length === 0 ? <div style={{ color: '#94a3b8' }}>Terminal output will appear here.</div> : log.map((l,i)=>(<div key={i}><span style={{ color: '#6ee7b7' }}>$</span> {l}</div>))}
              </div>
              <TerminalInput onRun={(cmd)=>{ if (!started) { setMessage({ type:'error', text: 'Start the lab first.' }); return } runTerminalCommand(cmd) }} />
            </div>
          </div>
        </section>

        <aside style={{ textAlign: 'left' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: 'var(--surface)', color: 'var(--text)' }}>
            <h4>Checkpoints</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><input type="checkbox" checked={checkpoints.openedLab} readOnly /> Open lab</li>
              <li><input type="checkbox" checked={checkpoints.copiedPayload} readOnly /> Copied payload</li>
              <li><input type="checkbox" checked={checkpoints.exploited} readOnly /> Exploited the form</li>
              <li><input type="checkbox" checked={checkpoints.extractedFlag} readOnly /> Extracted flag</li>
              <li><input type="checkbox" checked={checkpoints.submitted} readOnly /> Submitted flag</li>
            </ul>

            <div style={{ marginTop: 12 }}>
              <h4>Submit flag</h4>
              <form onSubmit={submitFlag}>
                <input value={flagInput} onChange={(e)=>setFlagInput(e.target.value)} placeholder="flag{...}" className="atk-input" style={{ marginBottom: 8 }} />
                <button className="btn primary" type="submit" disabled={!started}>Submit</button>
              </form>
              {message ? <div style={{ marginTop: 8, color: message.type==='success' ? '#86efac' : (message.type==='error' ? '#ff6b6b' : '#cbd5e1') }}>{message.text}</div> : null}
            </div>

            <div style={{ marginTop: 12 }}>
              <h4>Hints</h4>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={showHint} onChange={()=>setShowHint(s=>!s)} /> Show hint</label>
              {showHint ? <div style={{ marginTop: 8, color: '#cbd5e1' }}>Try payloads that turn the WHERE clause true, e.g. <code>' OR '1'='1</code>. You can also use the terminal: <code>curl http://localhost:3001/flag</code>.</div> : null}
            </div>

            <div style={{ marginTop: 12 }}>
              <h4>Tools / quick start</h4>
              <pre style={{ background:'#0b1220', color:'#d1d5db', padding:8, borderRadius:6, fontSize:12 }}># Example (replace with a real vulnerable image)
docker run --rm -p 3001:3001 some-vuln-image
# then open http://localhost:3001</pre>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

function TerminalInput({ onRun }) {
  const [cmd, setCmd] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input value={cmd} onChange={(e)=>setCmd(e.target.value)} placeholder="run command (simulated) e.g. curl http://localhost:3001/flag" style={{ flex: 1, padding: 8, background:'#0b1220', color:'#fff', border:'1px solid #23303a', borderRadius:6 }} />
      <button className="btn" onClick={()=>{ onRun(cmd); setCmd('') }}>Run</button>
    </div>
  )
}
