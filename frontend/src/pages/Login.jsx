import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/contexts/ThemeContext';
import Button from '../Components/common/Button';
import Input from '../Components/common/Input';
import { auth } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await auth.login(formData);
      const { access_token, refresh_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_id', user.id);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: isDark ? '#0a0a0f' : '#f5f5f5',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .fade-slide-in { animation: fadeSlideIn 0.7s ease both; }
        .fade-in-right { animation: fadeInRight 0.7s ease both 0.2s; }
        .float-slow { animation: floatSlow 4s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
      `}</style>

      {/* Left Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: isDark ? '#0a0a0f' : '#f5f5f5',
      }}>
        <div className="fade-slide-in" style={{
          width: '100%',
          maxWidth: 420,
        }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="36" height="36" viewBox="0 0 120 120">
                <rect width="120" height="120" rx="26" fill="#1a1a2e"/>
                <rect x="24" y="27" width="72" height="19" rx="6" fill="white"/>
                <rect x="24" y="52" width="72" height="3" rx="1.5" fill="white" opacity="0.3"/>
                <rect x="24" y="63" width="33" height="19" rx="6" fill="#6C63FF"/>
                <rect x="63" y="63" width="33" height="19" rx="6" fill="#4CC9B0"/>
                <path d="M60 55 L74 63" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
              <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px', color: isDark ? '#f0f0f5' : '#1a1a2e' }}>Splitly</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-1px', color: isDark ? '#f0f0f5' : '#1a1a2e', marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 15, color: isDark ? 'rgba(240,240,245,0.5)' : 'rgba(26,26,46,0.5)', lineHeight: 1.6 }}>
              Sign in to continue splitting expenses with your group.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                marginBottom: 20,
                fontSize: 14,
                color: '#ef4444',
              }}>
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
            />

            <div style={{ marginTop: 18 }}>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              fontSize: 14,
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDark ? 'rgba(240,240,245,0.6)' : 'rgba(26,26,46,0.6)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#6C63FF' }} />
                Remember me
              </label>
              <Link to="#" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              style={{ marginTop: 24 }}
            >
              Sign in
            </Button>

            <p style={{
              marginTop: 20,
              textAlign: 'center',
              fontSize: 14,
              color: isDark ? 'rgba(240,240,245,0.4)' : 'rgba(26,26,46,0.4)',
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 500 }}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Info/Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: isDark ? 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(76,201,176,0.05))' : 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(76,201,176,0.03))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="pulse-glow" style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(108,99,255,0.08)',
          top: '10%',
          right: '-10%',
          filter: 'blur(60px)',
        }} />
        <div className="pulse-glow" style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(76,201,176,0.06)',
          bottom: '10%',
          left: '-10%',
          filter: 'blur(60px)',
          animationDelay: '1.5s',
        }} />

        <div className="fade-in-right" style={{
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="float-slow" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 100,
            padding: '6px 16px 6px 6px',
            marginBottom: 24,
          }}>
            <span style={{
              display: 'inline-block',
              background: '#6C63FF',
              padding: '2px 10px',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 600,
              color: 'white',
              letterSpacing: '0.3px',
            }}>NEW</span>
            <span style={{ fontSize: 12, color: '#a09cff' }}>Split expenses smarter</span>
          </div>

          <h2 style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: '-1px',
            lineHeight: 1.15,
            color: isDark ? '#f0f0f5' : '#1a1a2e',
            marginBottom: 16,
          }}>
            Stop chasing<br />
            <span style={{ color: '#6C63FF' }}>who owes who.</span>
          </h2>

          <p style={{
            fontSize: 16,
            color: isDark ? 'rgba(240,240,245,0.5)' : 'rgba(26,26,46,0.5)',
            lineHeight: 1.7,
            marginBottom: 32,
          }}>
            Splitly automatically tracks shared expenses and tells you exactly who pays whom — no spreadsheets, no awkward texts.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {[
              { icon: '✈️', text: 'Create trips with friends and family' },
              { icon: '💰', text: 'Split expenses equally or by shares' },
              { icon: '✓', text: 'See simplified debts in one tap' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: isDark ? 'rgba(240,240,245,0.7)' : 'rgba(26,26,46,0.7)',
                fontSize: 14,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {item.icon}
                </div>
                {item.text}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: isDark ? '#f0f0f5' : '#1a1a2e' }}>10K+</p>
              <p style={{ fontSize: 12, color: isDark ? 'rgba(240,240,245,0.4)' : 'rgba(26,26,46,0.4)' }}>Trips created</p>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: isDark ? '#f0f0f5' : '#1a1a2e' }}>$5M+</p>
              <p style={{ fontSize: 12, color: isDark ? 'rgba(240,240,245,0.4)' : 'rgba(26,26,46,0.4)' }}>Expenses tracked</p>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: isDark ? '#f0f0f5' : '#1a1a2e' }}>99.9%</p>
              <p style={{ fontSize: 12, color: isDark ? 'rgba(240,240,245,0.4)' : 'rgba(26,26,46,0.4)' }}>Settlement rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;