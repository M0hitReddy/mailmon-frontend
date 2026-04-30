import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="max-w-[640px] mx-auto px-6 py-20 animate-fadeIn min-h-full bg-[var(--color-surface)]">
      <Link to="/" className="text-[12px] font-medium text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors mb-12 inline-block">
        ← Back
      </Link>

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1 className="text-[28px] font-semibold text-[var(--color-heading)] mb-8 tracking-tight">
          Terms of Service
        </h1>

        <div className="space-y-8 text-[14px] leading-relaxed text-[var(--color-muted)]">
          <section>
            <h2 className="text-[16px] font-semibold text-[var(--color-heading)] mb-2">1. Terms</h2>
            <p>By using this service, you agree to these terms. The service is provided "as is" without warranty.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-[var(--color-heading)] mb-2">2. Usage</h2>
            <p>You are responsible for your account security. Use the service only for legal purposes.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-[var(--color-heading)] mb-2">3. Liability</h2>
            <p>We are not liable for any damages arising from the use of this service or missed notifications.</p>
          </section>
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <p className="text-[11px] text-[var(--color-muted)] opacity-50">Last updated: May 2026</p>
      </footer>
    </div>
  );
}
