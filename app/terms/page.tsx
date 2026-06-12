import Link from 'next/link'

export const metadata = { title: 'Terms of Service — NeonLink' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-base py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-display">
        <Link href="/" className="text-neon-blue hover:underline text-sm">← Back to Home</Link>

        <h1 className="text-3xl font-display font-bold text-white mt-8 mb-2">Terms of Service</h1>
        <p className="text-dark-muted text-sm">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-8 text-dark-muted">
          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By using NeonLink, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">2. Prohibited Uses</h2>
            <p>You may not use NeonLink to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Distribute malware, spam, or phishing content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Attempt to circumvent our rate limiting or security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">3. Account Responsibility</h2>
            <p>You are responsible for all activity that occurs under your account. Keep your credentials secure and notify us immediately of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">4. Service Availability</h2>
            <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to modify or discontinue the service at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p>NeonLink is provided &quot;as is&quot; without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-semibold text-white mb-3">6. Contact</h2>
            <p>Questions? Email us at <a href="mailto:legal@neonlink.io" className="text-neon-blue">legal@neonlink.io</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
