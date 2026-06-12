import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for personal projects',
    features: [
      '50 short links',
      'Basic analytics (7 days)',
      'QR code generation',
      'Custom aliases',
      'Password protection',
      '1 API key',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 9,
    period: 'per month',
    description: 'For creators and small businesses',
    features: [
      '500 short links',
      'Analytics up to 30 days',
      'QR code generation',
      'Custom aliases',
      'Password protection',
      '5 API keys',
      'Priority support',
      'Link expiration',
    ],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: 29,
    period: 'per month',
    description: 'For teams and high-volume use',
    features: [
      'Unlimited short links',
      'Analytics up to 90 days',
      'QR code generation',
      'Custom aliases',
      'Password protection',
      '10 API keys',
      'Priority support',
      'Link expiration',
      'Bulk import/export',
      'White-label ready',
    ],
    cta: 'Start Business',
    href: '/register?plan=business',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark-base py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-dark-muted text-lg max-w-xl mx-auto">
            Start free. Upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`glass-card p-8 flex flex-col space-y-6 relative ${
                plan.highlight
                  ? 'border-neon-blue shadow-neon-md ring-1 ring-neon-blue/30'
                  : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div>
                <h2 className="text-xl font-display font-bold text-white">{plan.name}</h2>
                <p className="text-dark-muted text-sm mt-1">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-4xl font-display font-black text-white">
                  ${plan.price}
                </span>
                <span className="text-dark-muted text-sm mb-1">/{plan.period}</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  plan.highlight
                    ? 'btn-neon'
                    : 'btn-ghost'
                }`}
              >
                {plan.highlight && <Zap className="w-4 h-4" />}
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-dark-muted">
          All plans include SSL encryption and 99.9% uptime SLA.{' '}
          <Link href="/login" className="text-neon-blue hover:underline">Already have an account?</Link>
        </p>
      </div>
    </div>
  )
}
