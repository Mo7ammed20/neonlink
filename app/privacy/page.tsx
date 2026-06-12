import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — NeonLink' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-base py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-neon-blue hover:underline text-sm">← Back to Home</Link>

        <h1 className="text-3xl font-display font-bold text-white mt-8 mb-2">Privacy Policy</h1>
        <p className="text-dark-muted text-sm">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-8 text-dark-muted">
          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">What We Collect</h2>
            <p>When you use NeonLink, we collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Account information (name, email, hashed password)</li>
              <li>Links you create and their destination URLs</li>
              <li>Click analytics: IP address, country, browser, device type, referrer</li>
              <li>Usage data for service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">How We Use It</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Provide and improve the NeonLink service</li>
              <li>Display analytics to link owners</li>
              <li>Send important service notifications</li>
              <li>Prevent abuse and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">Data Retention</h2>
            <p>Account data is retained until you delete your account. Click analytics are retained for up to 90 days. You can request deletion of your data at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">Third Parties</h2>
            <p>We do not sell your data. We use infrastructure providers (hosting, database) who process data on our behalf under strict data processing agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">Your Rights</h2>
            <p>You have the right to access, correct, export, or delete your personal data. Contact us at <a href="mailto:privacy@neonlink.io" className="text-neon-blue">privacy@neonlink.io</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">Cookies</h2>
            <p>We use session cookies for authentication only. No tracking or advertising cookies are set without your consent.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
