import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness, Check,
  CheckCircle2, ChevronDown, CircleHelp, ClipboardCheck, FileText, FileUp,
  GraduationCap, Lightbulb, LoaderCircle, Menu, RefreshCw, ShieldCheck,
  Sparkles, Target, UploadCloud, WandSparkles, X,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const demoResume = `UTKARSH PATEL\nAhmedabad, Gujarat | utkarsh.patel@email.com | +91 98765 43210\n\nPROFESSIONAL SUMMARY\nBSc Chemistry graduate with hands-on academic project experience in data analysis, Python, SQL and Power BI. Interested in using data to solve business problems and communicate useful insights.\n\nSKILLS\nPython, Pandas, NumPy, SQL Server, Power BI, Excel, Data Cleaning, Data Visualization\n\nPROJECTS\nStudent AI Tool Usage Analysis | SQL, Python, Pandas\n- Analysed survey responses from 3,600+ students to explore patterns in AI tool usage.\n- Used SQL and Python to clean data and evaluate relationships between usage and academic outcomes.\n\nWeather Intelligence Across Indian Cities | Python, APIs\n- Collected and analysed weather information for 324+ Indian cities.\n- Used Python and API data to compare weather conditions across locations.\n\nEDUCATION\nBSc Chemistry | Example University | 2024\n`;

const scoreColor = (score) => score >= 80 ? 'good' : score >= 60 ? 'mid' : 'low';

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference;
  return (
    <div className="score-ring-wrap" aria-label={`Overall resume score ${score} out of 100`}>
      <svg className="score-ring" viewBox="0 0 140 140" role="img">
        <circle cx="70" cy="70" r={radius} className="ring-track" />
        <circle cx="70" cy="70" r={radius} className={`ring-value ${scoreColor(score)}`} strokeDasharray={`${dash} ${circumference}`} />
      </svg>
      <div className="score-ring-label">
        <strong>{score}</strong>
        <span>out of 100</span>
      </div>
    </div>
  );
}

function SectionScore({ section }) {
  const Icon = section.name.toLowerCase().includes('skill') ? WandSparkles
    : section.name.toLowerCase().includes('experience') ? BriefcaseBusiness
      : section.name.toLowerCase().includes('project') ? ClipboardCheck
        : section.name.toLowerCase().includes('education') ? GraduationCap
          : section.name.toLowerCase().includes('format') ? FileText : Target;
  return (
    <article className="section-score">
      <div className="section-score-top">
        <span className="section-icon"><Icon size={17} /></span>
        <span className="section-name">{section.name}</span>
        <strong className={`section-number ${scoreColor(section.score)}`}>{section.score}</strong>
      </div>
      <div className="meter"><span className={scoreColor(section.score)} style={{ width: `${section.score}%` }} /></div>
      <p>{section.feedback}</p>
    </article>
  );
}

function ResultView({ result, onStartOver }) {
  const match = result.keyword_match || {};
  return (
    <div className="results-wrap" id="results">
      <div className="results-heading">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> YOUR RESUME REPORT</div>
          <h2>Your review is ready.</h2>
          <p>Use this feedback to make your experience clearer and more relevant.</p>
        </div>
        <button className="button button-light reset-button" onClick={onStartOver}><RefreshCw size={16} /> New review</button>
      </div>

      {result.notice && <div className="notice"><CircleHelp size={17} /><span>{result.notice}</span></div>}

      <section className="overview-card">
        <div className="overview-main">
          <div className="score-copy">
            <span className="muted-label">OVERALL RESUME SCORE</span>
            <div className="score-title-row"><h3>{result.overall_score}<span>/100</span></h3><span className={`score-pill ${scoreColor(result.overall_score)}`}>{result.overall_score >= 80 ? 'Strong' : result.overall_score >= 60 ? 'Good start' : 'Needs work'}</span></div>
            <p>{result.summary}</p>
            <div className="candidate-chip"><Award size={15} /> Profile level: {result.candidate_level || 'Unclear'}</div>
          </div>
          <ScoreRing score={result.overall_score} />
        </div>
        <div className="overview-foot"><ShieldCheck size={15} /> {result.mode === 'groq' ? 'AI-powered review' : 'Demo review'} <span className="dot-separator">·</span> Based on the resume text provided</div>
      </section>

      <section className="report-section">
        <div className="section-heading"><div><span className="eyebrow">BREAKDOWN</span><h3>Section-wise feedback</h3></div><span className="section-count">{result.sections?.length || 0} areas reviewed</span></div>
        <div className="section-grid">{result.sections?.map((section) => <SectionScore section={section} key={section.name} />)}</div>
      </section>

      <div className="insight-grid">
        <section className="insight-card strength-card">
          <div className="insight-title"><span className="insight-icon green"><CheckCircle2 size={18} /></span><div><span className="eyebrow">WHAT'S WORKING</span><h3>Your strengths</h3></div></div>
          {result.strengths?.length ? <ul className="clean-list">{result.strengths.map((item, index) => <li key={index}><Check size={15} />{item}</li>)}</ul> : <p className="empty-copy">No clear strengths were returned. Review your section feedback below.</p>}
        </section>
        <section className="insight-card action-card">
          <div className="insight-title"><span className="insight-icon purple"><Lightbulb size={18} /></span><div><span className="eyebrow">NEXT STEPS</span><h3>How to improve</h3></div></div>
          <div className="action-list">
            {result.improvements?.map((item, index) => <article className="action-item" key={`${item.title}-${index}`}>
              <div className="action-item-top"><span className={`priority priority-${(item.priority || 'medium').toLowerCase()}`}>{item.priority || 'Medium'} priority</span><span className="action-index">{String(index + 1).padStart(2, '0')}</span></div>
              <h4>{item.title}</h4><p>{item.detail}</p>
              {item.example && <div className="example-box"><span>EXAMPLE</span><p>{item.example}</p></div>}
            </article>)}
          </div>
        </section>
      </div>

      {match.match_score !== null && match.match_score !== undefined && (
        <section className="match-card">
          <div className="section-heading"><div><span className="eyebrow">JOB DESCRIPTION MATCH</span><h3>How closely does it line up?</h3></div><div className="match-score">{match.match_score}<span>%</span></div></div>
          <p className="match-description">This is an indicative keyword and evidence comparison, not a guaranteed ATS score.</p>
          <div className="keyword-columns">
            <div><h4><CheckCircle2 size={16} /> Found in your resume</h4><div className="keyword-list">{match.matched_keywords?.length ? match.matched_keywords.map((word) => <span className="keyword found" key={word}>{word}</span>) : <span className="keyword-empty">No direct matches found by the review.</span>}</div></div>
            <div><h4><Target size={16} /> Consider addressing</h4><div className="keyword-list">{match.missing_keywords?.length ? match.missing_keywords.map((word) => <span className="keyword missing" key={word}>{word}</span>) : <span className="keyword-empty">No obvious missing keywords detected.</span>}</div></div>
          </div>
        </section>
      )}

      <p className="disclaimer"><ShieldCheck size={15} /> {result.disclaimer}</p>
    </div>
  );
}

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [activeInput, setActiveInput] = useState('upload');
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiHealth, setApiHealth] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const fileRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`).then((res) => res.ok ? res.json() : null).then(setApiHealth).catch(() => setApiHealth({ status: 'offline', ai_enabled: false }));
  }, []);

  const onFile = (chosen) => {
    if (!chosen) return;
    if (chosen.type !== 'application/pdf' && !chosen.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.');
      return;
    }
    if (chosen.size > 5 * 1024 * 1024) {
      setError('Your PDF is larger than 5 MB. Please choose a smaller file.');
      return;
    }
    setError('');
    setFile(chosen);
    setActiveInput('upload');
  };

  const analyze = async (event) => {
    event.preventDefault();
    setError('');
    if (activeInput === 'upload' && !file) {
      setError('Choose a PDF file or switch to the paste-text option.');
      return;
    }
    if (activeInput === 'paste' && !resumeText.trim()) {
      setError('Paste your resume text before analysing.');
      textRef.current?.focus();
      return;
    }
    setLoading(true);
    const form = new FormData();
    if (activeInput === 'upload' && file) form.append('file', file);
    if (activeInput === 'paste') form.append('resume_text', resumeText);
    if (jobDescription.trim()) form.append('job_description', jobDescription);
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: form });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || 'Unable to analyse the resume. Please try again.');
      setResult(body);
      window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (err) {
      setError(`${err.message}. Make sure the Python backend is running at ${API_BASE}.`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AI Resume Reviewer home"><span className="brand-mark"><Sparkles size={19} /></span><span>resume<span className="brand-accent">wise</span></span></a>
        <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'}>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#review-form" onClick={() => setMobileMenu(false)}>Review resume</a>
        </nav>
        <div className="topbar-right">
          <span className={`api-status ${apiHealth?.status === 'ok' ? 'online' : 'offline'}`}><span />{apiHealth?.status === 'ok' ? (apiHealth.ai_enabled ? 'AI ready' : 'Demo mode') : 'Connect backend'}</span>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-badge"><span className="badge-sparkle"><Sparkles size={13} /></span> A clearer path to your next opportunity</div>
            <h1>Your resume,<br /><span>reviewed smarter.</span></h1>
            <p className="hero-subtitle">Get thoughtful feedback, a clear score, and practical ways to make your experience stand out.</p>
            <div className="hero-trust"><span><CheckCircle2 size={16} /> Actionable suggestions</span><span><ShieldCheck size={16} /> No app-side storage</span></div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" />
            <div className="visual-card visual-back"><div className="visual-line short" /><div className="visual-line" /><div className="visual-line medium" /><div className="visual-blocks"><i /><i /><i /></div></div>
            <div className="visual-card visual-front"><div className="visual-card-header"><span className="mini-avatar">U</span><div><b>Resume review</b><small>Profile overview</small></div><span className="mini-check"><Check size={13} /></span></div><div className="visual-score-row"><div className="visual-score">86<small>/100</small></div><div className="visual-score-copy"><b>Looking good!</b><small>You're on the right track.</small></div></div><div className="visual-mini-bars"><span style={{ width: '82%' }} /><span style={{ width: '67%' }} /><span style={{ width: '91%' }} /></div></div>
            <div className="floating-sparkle"><Sparkles size={20} /></div>
          </div>
        </section>

        <section className="review-layout" id="review-form">
          <div className="form-panel">
            <div className="panel-heading"><div><span className="eyebrow">LET'S GET STARTED</span><h2>Review your resume</h2><p>Share your resume and we'll take a closer look.</p></div><div className="step-count">01 <span>/ 01</span></div></div>
            <form onSubmit={analyze}>
              <div className="field-heading"><label>Your resume</label><span className="required-label">REQUIRED</span></div>
              <div className="input-tabs" role="tablist" aria-label="Resume input method">
                <button type="button" role="tab" aria-selected={activeInput === 'upload'} className={activeInput === 'upload' ? 'input-tab active' : 'input-tab'} onClick={() => { setActiveInput('upload'); setError(''); }}><FileUp size={16} /> Upload PDF</button>
                <button type="button" role="tab" aria-selected={activeInput === 'paste'} className={activeInput === 'paste' ? 'input-tab active' : 'input-tab'} onClick={() => { setActiveInput('paste'); setError(''); }}><FileText size={16} /> Paste text</button>
              </div>
              {activeInput === 'upload' ? (
                <div className={`upload-zone ${file ? 'has-file' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}>
                  <input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => onFile(e.target.files?.[0])} />
                  {file ? <><span className="upload-icon success-upload"><CheckCircle2 size={22} /></span><div className="selected-file"><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(0)} KB · PDF document</span></div><button type="button" className="remove-file" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} aria-label="Remove selected file"><X size={17} /></button></> : <><span className="upload-icon"><UploadCloud size={23} /></span><strong>Drop your PDF here</strong><span className="upload-sub">or <button type="button" className="browse-link" onClick={() => fileRef.current?.click()}>browse files</button> from your device</span><span className="upload-limit">PDF only · Max file size 5 MB</span></>}
                </div>
              ) : (
                <div className="paste-wrap"><textarea ref={textRef} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste the text from your resume here...&#10;&#10;Include your summary, skills, experience, projects, and education for a more complete review." rows={11} maxLength={45000} /><div className="text-count">{resumeText.length.toLocaleString()} / 45,000 characters</div></div>
              )}

              <div className="optional-divider"><span>OPTIONAL</span></div>
              <button type="button" className="optional-toggle" onClick={() => setShowJobDescription(!showJobDescription)} aria-expanded={showJobDescription}><span className="optional-icon"><Target size={17} /></span><span><b>Match against a job description</b><small>See relevant keywords and skills to consider.</small></span>{showJobDescription ? <ChevronDown className="chevron rotated" size={18} /> : <ChevronDown className="chevron" size={18} />}</button>
              {showJobDescription && <div className="job-description-wrap"><label htmlFor="job-description">Paste the job description</label><textarea id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the role requirements and responsibilities here..." rows={6} maxLength={20000} /><div className="text-count">{jobDescription.length.toLocaleString()} / 20,000 characters</div></div>}

              {error && <div className="error-message"><CircleHelp size={16} />{error}</div>}
              <button type="submit" className="button button-primary analyze-button" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Reviewing your resume...</> : <>Review my resume <ArrowRight size={18} /></>}</button>
              <p className="privacy-note"><ShieldCheck size={14} /> This app does not save your resume to a database. When AI mode is enabled, resume text is sent to Groq for analysis; review Groq’s data terms before uploading sensitive information.</p>
            </form>
          </div>

          <aside className="side-panel" id="how-it-works">
            <div className="side-card side-how"><span className="side-card-icon"><WandSparkles size={20} /></span><span className="eyebrow">SIMPLE BY DESIGN</span><h3>A better resume starts with a clearer picture.</h3><div className="how-steps"><div className="how-step"><span>01</span><div><b>Share your resume</b><p>Upload a PDF or paste your resume text.</p></div></div><div className="how-step"><span>02</span><div><b>Get your review</b><p>See an overall score and feedback by section.</p></div></div><div className="how-step"><span>03</span><div><b>Make it stronger</b><p>Use practical suggestions to improve your story.</p></div></div></div></div>
            <div className="side-card side-tip"><div className="tip-top"><span><Lightbulb size={17} /></span> PRO TIP</div><p>Use specific examples and measurable results where they are accurate. Clear evidence makes your achievements easier to understand.</p><a href="#review-form">Start with your resume <ArrowUpRight size={14} /></a></div>
            <div className="side-caption"><ShieldCheck size={14} /> No app-side storage. AI mode sends resume text to Groq for analysis.</div>
          </aside>
        </section>

        {result && <ResultView result={result} onStartOver={reset} />}
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Sparkles size={16} /></span><span>resume<span className="brand-accent">wise</span></span></a><span>Thoughtful feedback for your next step.</span><a href="#top">Back to top <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
