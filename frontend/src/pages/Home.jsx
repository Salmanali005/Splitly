import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [demoAmount, setDemoAmount] = useState(12345);
  const [settled, setSettled] = useState(false);
  const [animating, setAnimating] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  const [isVisible, setIsVisible] = useState({
    stats: false,
    features: false,
    steps: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollY(scrollY);

      // Check visibility for each section
      const checkVisibility = (ref, key) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.75;
          setIsVisible(prev => ({ ...prev, [key]: isVisible }));
        }
      };

      checkVisibility(statsRef, 'stats');
      checkVisibility(featuresRef, 'features');
      checkVisibility(stepsRef, 'steps');
      checkVisibility(ctaRef, 'cta');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(p => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSettle = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setSettled(true);
      setAnimating(false);
    }, 800);
  };

  const handleReset = () => {
    setSettled(false);
  };

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
      label: 'Trip tracking',
      title: 'One trip, one place',
      desc: 'Add members, log every rupee, and see the full picture of any trip — vacation, road trip, or family outing.',
      color: '#6C63FF',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      label: 'Smart splitting',
      title: 'Split your way',
      desc: 'Equal shares, family size, percentages, or custom amounts. Splitly does the math — you enjoy the trip.',
      color: '#4CC9B0',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      label: 'Debt settlement',
      title: 'Settle in one tap',
      desc: 'Simplified debt algorithm tells you exactly who pays whom. No chain of IOUs — just clean, final numbers.',
      color: '#F59E0B',
    },
  ];

  const steps = [
    { n: '01', title: 'Create a trip', desc: 'Name it, set the currency, invite your people.' },
    { n: '02', title: 'Log expenses', desc: 'Add each expense as it happens. Split however makes sense.' },
    { n: '03', title: 'Settle up', desc: 'See the simplified debts and mark them paid. Done.' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#0a0a0f', color: '#f0f0f5', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes slideSettle {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(8px); opacity: 0.5; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 20px) scale(1.03); }
          66% { transform: translate(20px, -15px) scale(0.98); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .fade-up-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .fade-up-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .fade-up-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .fade-up-4 { animation: fadeUp 0.7s ease both 0.55s; }

        .appear-stats { animation: fadeUp 0.8s ease both; }
        .appear-features { animation: fadeUp 0.8s ease both; }
        .appear-steps { animation: fadeUp 0.8s ease both; }
        .appear-cta { animation: fadeUp 0.8s ease both; }

        .nav-link {
          color: rgba(240,240,245,0.6);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #f0f0f5; }
        html, body {
          overflow-x: hidden;
          }

          
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #6C63FF;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-primary:hover {
          background: #5b52e8;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(108,99,255,0.35);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          color: rgba(240,240,245,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        .feature-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.25s ease;
          background: transparent;
          color: rgba(240,240,245,0.5);
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          text-align: left;
        }
        .feature-tab.active {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
          color: #f0f0f5;
        }
        .feature-tab:hover { color: rgba(240,240,245,0.8); }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          borderRadius: 20px;
          transition: all 0.3s ease;
        }
        .card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }

        .settle-btn {
          background: #6C63FF;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .settle-btn:hover { background: #5b52e8; transform: scale(1.03); }
        .settle-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .reset-btn {
          background: rgba(255,255,255,0.08);
          color: rgba(240,240,245,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .reset-btn:hover { background: rgba(255,255,255,0.12); }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .stat-num {
          font-size: 36px;
          font-weight: 600;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #f0f0f5 0%, rgba(240,240,245,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-bar {
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
          margin-top: 16px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .step-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .step-card:hover {
          transform: translateY(-4px) scale(1.01);
        }

        .stat-item {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-item:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .demo-card { display: none; }
          .feature-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 120 120">
              <rect width="120" height="120" rx="26" fill="#1a1a2e"/>
              <rect x="24" y="27" width="72" height="19" rx="6" fill="white"/>
              <rect x="24" y="52" width="72" height="3" rx="1.5" fill="white" opacity="0.3"/>
              <rect x="24" y="63" width="33" height="19" rx="6" fill="#6C63FF"/>
              <rect x="63" y="63" width="33" height="19" rx="6" fill="#4CC9B0"/>
              <path d="M60 55 L46 63" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
              <path d="M60 55 L74 63" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
            </svg>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px' }}>Splitly</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#how" className="nav-link">How it works</a>
            <a href="#features" className="nav-link">Features</a>
            <Link to="/login" className="nav-link">Sign in</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 80 }}>
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(108,99,255,0.15)', top: '5%', left: '-10%', animation: 'orb1 12s ease-in-out infinite' }}/>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(76,201,176,0.1)', bottom: '10%', right: '-5%', animation: 'orb2 15s ease-in-out infinite' }}/>
        <div className="orb" style={{ width: 300, height: 300, background: 'rgba(245,158,11,0.07)', top: '40%', right: '20%', animation: 'orb1 18s ease-in-out infinite reverse' }}/>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <h1 className="fade-up-2 hero-title" style={{
                fontSize: 56, fontWeight: 600, lineHeight: 1.1,
                letterSpacing: '-2px', marginBottom: 20,
              }}>
                Stop chasing<br/>
                <span style={{ color: '#6C63FF' }}>who owes</span><br/>
                who.
              </h1>

              <p className="fade-up-3" style={{ fontSize: 17, color: 'rgba(240,240,245,0.55)', lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
                Splitly tracks every shared expense and tells you exactly who pays whom — no spreadsheets, no awkward texts.
              </p>

              <div className="fade-up-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary">
                  Start for free
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-ghost">Sign in</Link>
              </div>
            </div>

            {/* Demo Card */}
            <div className="demo-card fade-up-3" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24,
                padding: 28,
                backdropFilter: 'blur(20px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(240,240,245,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Kalam Trip</p>
                    <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px' }}>PKR {demoAmount.toLocaleString()}</p>
                  </div>
                  <div style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, padding: '4px 10px', fontSize: 11, color: '#a09cff' }}>
                    2 members
                  </div>
                </div>

                {[
                  { label: 'Hotel', amount: 8000, who: 'Salman' },
                  { label: 'Fuel', amount: 2800, who: 'Salman' },
                  { label: 'Food', amount: 1545, who: 'Nika' },
                ].map((e, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        {i === 0 ? '🏨' : i === 1 ? '⛽' : '🍜'}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{e.label}</p>
                        <p style={{ fontSize: 11, color: 'rgba(240,240,245,0.4)' }}>paid by {e.who}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>PKR {e.amount.toLocaleString()}</p>
                  </div>
                ))}

                <div style={{
                  marginTop: 20,
                  background: settled ? 'rgba(76,201,176,0.08)' : 'rgba(108,99,255,0.08)',
                  border: `1px solid ${settled ? 'rgba(76,201,176,0.2)' : 'rgba(108,99,255,0.2)'}`,
                  borderRadius: 14,
                  padding: '14px 16px',
                  transition: 'all 0.5s ease',
                }}>
                  {settled ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'countUp 0.4s ease' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(76,201,176,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#4CC9B0" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 13, color: '#4CC9B0', fontWeight: 500 }}>All settled up!</span>
                      </div>
                      <button className="reset-btn" onClick={handleReset}>Reset</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 11, color: 'rgba(240,240,245,0.4)', marginBottom: 3 }}>Nika owes Salman</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: '#a09cff' }}>PKR 4,115</p>
                      </div>
                      <button
                        className="settle-btn"
                        onClick={handleSettle}
                        disabled={animating}
                        style={{ animation: animating ? 'slideSettle 0.8s ease' : 'none' }}
                      >
                        {animating ? 'Settling...' : '💰 Settle'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="stats-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { n: '10K+', label: 'Trips created' },
            { n: '$5M+', label: 'Expenses tracked' },
            { n: '50K+', label: 'Happy users' },
            { n: '99.9%', label: 'Settlement rate' },
          ].map((s, i) => (
            <div key={i} className={`stat-item ${isVisible.stats ? 'appear-stats' : ''}`} style={{ animationDelay: `${i * 0.15}s`, opacity: isVisible.stats ? 1 : 0 }}>
              <div className="stat-num">{s.n}</div>
              <p style={{ fontSize: 13, color: 'rgba(240,240,245,0.4)', marginTop: 6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featuresRef} style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, letterSpacing: '2px', color: 'rgba(240,240,245,0.4)', textTransform: 'uppercase', marginBottom: 12 }}>Features</p>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-1px', lineHeight: 1.15 }}>Built for real trips</h2>
            <p style={{ fontSize: 16, color: 'rgba(240,240,245,0.5)', marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>Not a generic finance app — every feature exists because group travel is messy.</p>
          </div>

          <div className="feature-panel" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {features.map((f, i) => (
                <button
                  key={i}
                  className={`feature-tab ${activeFeature === i ? 'active' : ''}`}
                  onClick={() => setActiveFeature(i)}
                  style={{ animationDelay: `${i * 0.1}s`, opacity: isVisible.features ? 1 : 0, animation: isVisible.features ? 'slideFromLeft 0.5s ease both' : 'none' }}
                >
                  <span style={{ color: activeFeature === i ? f.color : 'inherit' }}>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>

            <div className={`card ${isVisible.features ? 'appear-features' : ''}`} style={{ padding: 40, minHeight: 280, opacity: isVisible.features ? 1 : 0 }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: activeFeature === i ? 'block' : 'none',
                  animation: 'fadeIn 0.4s ease',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color, marginBottom: 24,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 14 }}>{f.title}</h3>
                  <p style={{ fontSize: 16, color: 'rgba(240,240,245,0.55)', lineHeight: 1.75, maxWidth: 480 }}>{f.desc}</p>
                </div>
              ))}
              <div className="progress-bar" style={{ marginTop: 40 }}>
                <div className="progress-fill" style={{ width: `${((activeFeature + 1) / 3) * 100}%`, background: features[activeFeature].color, transition: 'width 0.4s ease, background 0.4s ease' }}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" ref={stepsRef} style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, letterSpacing: '2px', color: 'rgba(240,240,245,0.4)', textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-1px' }}>Three steps, zero drama</h2>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className={`step-card card ${isVisible.steps ? 'appear-steps' : ''}`} style={{ padding: 32, opacity: isVisible.steps ? 1 : 0, animationDelay: `${i * 0.2}s` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6C63FF', letterSpacing: '1px', marginBottom: 16 }}>{s.n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(240,240,245,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div className="orb" style={{ width: 400, height: 400, background: 'rgba(108,99,255,0.12)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'orb1 10s ease-in-out infinite' }}/>
            <div style={{ position: 'relative', zIndex: 1 }} className={`${isVisible.cta ? 'appear-cta' : ''}`} style={{ opacity: isVisible.cta ? 1 : 0 }}>
              <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
                Your next trip<br/>starts here.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(240,240,245,0.5)', lineHeight: 1.7, marginBottom: 40 }}>
                Create your first trip in under a minute. Split expenses, track debts, and settle up — without the awkwardness.
              </p>
              <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                Create your first trip
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px', color: 'rgba(240,240,245,0.35)', fontSize: 13 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 120 120">
              <rect width="120" height="120" rx="26" fill="#1a1a2e"/>
              <rect x="24" y="27" width="72" height="19" rx="6" fill="white"/>
              <rect x="24" y="52" width="72" height="3" rx="1.5" fill="white" opacity="0.3"/>
              <rect x="24" y="63" width="33" height="19" rx="6" fill="#6C63FF"/>
              <rect x="63" y="63" width="33" height="19" rx="6" fill="#4CC9B0"/>
            </svg>
            <span>© 2026 Splitly</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;