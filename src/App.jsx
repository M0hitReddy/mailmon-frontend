import { useState, useEffect, useCallback } from 'react';
import { getMe, googleLogin, logout, deleteAccount } from './api';
import GoogleLogin from './components/GoogleLogin';
import GmailConnect from './components/GmailConnect';
import TelegramLink from './components/TelegramLink';
import { CronHero, CronSettings } from './components/CronControls';
import Modal from './components/Modal';
import './App.css';

/* ---------- Icons ---------- */
export const MIc = {
  mail: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></svg>,
  google: (p) => <svg {...p} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83Z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z" /></svg>,
  tg: (p) => <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#229ED9" /><path fill="#fff" d="M5.4 11.7 17 7.2c.5-.2 1 .2 .9 .8L16 17.5c-.1.5-.6.7-1 .4l-3.3-2.4-1.6 1.5c-.2.2-.4.3-.7.2l.2-3.2 5.9-5.3c.3-.2-.1-.4-.4-.2l-7.3 4.6-3.1-1c-.7-.2-.7-.6.1-1Z" /></svg>,
  check: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>,
  arrow: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  shield: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" /></svg>,
  play: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72c0 .9.97 1.46 1.74 1L20.5 13.5c.77-.46.77-1.54 0-2L9.74 4.14C8.97 3.68 8 4.24 8 5.14Z" /></svg>,
  stop: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3" /></svg>,
  logout: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
  sun: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  moon: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
};

export const SPRING = "all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)";
export const EASE = "all 240ms cubic-bezier(0.22, 1, 0.36, 1)";

export function Wordmark({ size = "text-xl" }) {
  return (
    <div className={`${size} font-semibold tracking-tight flex items-center gap-2.5 text-[var(--color-heading)]`} style={{ letterSpacing: "-0.02em" }}>
      <div className="w-8 h-8 flex items-center justify-center bg-[var(--color-accent)] text-[var(--color-accent-ink)]" style={{ borderRadius: 10, boxShadow: "0 4px 14px -4px rgba(0,0,0,0.25)" }}>
        <MIc.mail className="w-4 h-4" />
      </div>
      <span>mailmon<span className="text-[var(--color-accent)]">.</span></span>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stagedInterval, setStagedInterval] = useState(60);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data);
      if (data.cron_interval) {
        setStagedInterval(data.cron_interval);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail') === 'connected' || params.get('error')) {
      window.history.replaceState({}, '', '/');
      fetchUser();
    }
  }, [fetchUser]);

  const handleGoogleLogin = async (credential) => {
    setLoginError('');
    try {
      await googleLogin(credential);
      fetchUser();
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setUser(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  if (loading) {
    return <div className="min-h-full flex items-center justify-center p-6 text-[var(--color-muted)]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="flex justify-center mb-12">
            <Wordmark size="text-2xl" />
          </div>
          <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)]" style={{ borderRadius: 28, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 40px -12px rgba(0,0,0,0.10)" }}>
            <p className="font-mono text-[10px] uppercase mb-4 text-[var(--color-accent)]" style={{ letterSpacing: "0.2em" }}>Sign in</p>
            <h1 className="text-[26px] font-semibold leading-[1.15] text-[var(--color-heading)]" style={{ letterSpacing: "-0.025em" }}>
              Watch your inbox<br />on autopilot.
            </h1>
            <p className="text-[14px] mt-3.5 leading-[1.55] text-[var(--color-muted)]" style={{ letterSpacing: "-0.01em" }}>
              Mailmon scans Gmail for topics you care about and pings you on Telegram, at the cadence you choose.
            </p>
            
            <div className="mt-7">
              <GoogleLogin onSuccess={handleGoogleLogin} isDark={isDark} />
            </div>
            {loginError && <div className="mt-4 text-[13px] text-[var(--color-danger)]">{loginError}</div>}

            <div className="mt-6 flex items-start gap-2 text-[12px] text-[var(--color-muted)]">
              <MIc.shield className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent)]" />
              <p className="leading-relaxed">OAuth 2.0, read-only Gmail scope. We never store your emails.</p>
            </div>
          </div>
          <p className="text-center text-[11px] mt-6 text-[var(--color-muted)]">
            By continuing you agree to the Terms &amp; Privacy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        {/* Top */}
        <div className="flex items-center justify-between mb-12">
          <Wordmark />
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-medium leading-none text-[var(--color-heading)]">{user.name}</p>
              <p className="text-[10px] mt-0.5 leading-none text-[var(--color-muted)]">{user.email}</p>
            </div>
            <button onClick={toggleTheme} title="Toggle Theme" className="w-9 h-9 flex items-center justify-center active:scale-[0.95] text-[var(--color-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-card)]" style={{ borderRadius: 999, transition: SPRING }}>
              {isDark ? <MIc.sun className="w-4 h-4" /> : <MIc.moon className="w-4 h-4" />}
            </button>
            {user.picture ? (
               <img src={user.picture} alt="" className="w-9 h-9 rounded-full" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.2)" }} />
            ) : (
               <div className="w-9 h-9 text-[13px] font-semibold flex items-center justify-center bg-[var(--color-accent)] text-[var(--color-accent-ink)]" style={{ borderRadius: 999, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.2)" }}>
                 {user.name ? user.name[0].toUpperCase() : 'M'}
               </div>
            )}
            <button onClick={handleLogout} title="Log out" className="w-9 h-9 flex items-center justify-center active:scale-[0.95] text-[var(--color-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-card)]" style={{ borderRadius: 999, transition: SPRING }}>
              <MIc.logout className="w-4 h-4" />
            </button>
             <button onClick={() => setIsDeleteModalOpen(true)} title="Delete Account" className="w-9 h-9 flex items-center justify-center active:scale-[0.95] text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-card)]" style={{ borderRadius: 999, transition: SPRING }}>
              <svg fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-4 h-4"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-9">
          <p className="font-mono text-[10px] uppercase mb-2.5 text-[var(--color-accent)]" style={{ letterSpacing: "0.2em" }}>Monitor</p>
          <h1 className="text-[32px] font-semibold leading-[1.1] text-[var(--color-heading)]" style={{ letterSpacing: "-0.03em" }}>
            Hey {user.name ? user.name.split(" ")[0] : 'there'}.
          </h1>
          <p className="text-[14px] mt-2 text-[var(--color-muted)]" style={{ letterSpacing: "-0.01em" }}>
            Connect your accounts, choose your frequency, and start monitoring.
          </p>
        </div>

        <CronHero
          enabled={user.cron_enabled}
          interval={stagedInterval}
          nextRunAt={user.next_run_at}
          gmailConnected={user.gmail_connected}
          telegramLinked={user.telegram_linked}
          onUpdate={fetchUser}
        />

        {/* Step 1 */}
        <section className="mb-7 mt-9">
          <div className="flex items-baseline justify-between mb-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-[var(--color-muted)]">01</span>
              <h2 className="text-[15px] font-medium text-[var(--color-heading)]" style={{ letterSpacing: "-0.01em" }}>Connect accounts</h2>
            </div>
            <span className="font-mono text-[11px] whitespace-nowrap text-[var(--color-muted)]">{(user.gmail_connected ? 1 : 0) + (user.telegram_linked ? 1 : 0)} / 2</span>
          </div>
          <div className="space-y-2.5">
            <GmailConnect connected={user.gmail_connected} email={user.email} onUpdate={fetchUser} />
            <TelegramLink linked={user.telegram_linked} onUpdate={fetchUser} />
          </div>
        </section>

        <CronSettings
          enabled={user.cron_enabled}
          interval={stagedInterval}
          setInterval={setStagedInterval}
          gmailConnected={user.gmail_connected}
          telegramLinked={user.telegram_linked}
          onUpdate={fetchUser}
        />

        <p className="text-center text-[11px] mt-14 text-[var(--color-muted)]">
          mailmon · v0.1
        </p>

        <Modal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete your account?"
          description="This will permanently remove your account and all associated data. This action cannot be undone."
          confirmText="Delete Account"
          isDanger={true}
        />
      </div>
    </div>
  );
}
