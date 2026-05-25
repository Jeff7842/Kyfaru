// ============================================================
// SUPPORT & MAINTENANCE POLICY PAGE
// SLA, maintenance retainer, service suspension schedule.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'
import RetainerPrice from '@/components/shared/RetainerPrice'

const SUSPENSION_STEPS = [
  { day: 'Day −14', label: 'First Reminder', detail: 'Invoice reminder sent via email and WhatsApp.', color: 'bg-ky-gold/10 border-ky-gold/40 border-l-ky-gold' },
  { day: 'Day −7', label: 'Second Reminder', detail: 'Reminder sent via email, WhatsApp, and SMS.', color: 'bg-ky-gold/10 border-ky-gold/40 border-l-ky-gold' },
  { day: 'Day −1', label: 'Final Notice', detail: 'Final notice sent on all channels including phone call.', color: 'bg-ky-gold/10 border-ky-gold/40 border-l-ky-gold' },
  { day: 'Day 0', label: 'Payment Due', detail: 'Invoice payment deadline.', color: 'bg-ky-surface border-ky-border border-l-ky-border' },
  { day: 'Day +7', label: 'Overdue Notice', detail: 'Account marked overdue. Late payment interest begins accruing.', color: 'bg-orange-950/30 border-orange-800/40 border-l-orange-500' },
  { day: 'Day +14', label: 'Suspension Warning', detail: '24-hour final notice issued. Client given last opportunity to settle.', color: 'bg-red-950/30 border-red-800/40 border-l-red-500' },
  { day: 'Day +15', label: 'System Suspended', detail: 'System is suspended until all outstanding amounts are paid. Reinstatement fee: KES 2,000.', color: 'bg-red-950/50 border-red-700/50 border-l-red-600' },
]

const SECTIONS: LegalSection[] = [
  {
    id: 'free-support-period',
    title: 'Free Support Period',
    content: (
      <>
        <p className="mb-4">
          Every system delivered by Kyfaru is covered by a free support period of{' '}
          <strong className="text-ky-ivory">30 calendar days</strong> commencing from the system&apos;s
          go-live date.
        </p>
        <p className="font-display font-semibold text-ky-ivory mb-2">Covered under free support:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Bugs and defects that are directly attributable to Kyfaru&apos;s own development work.</li>
          <li>Functional failures that existed at the time of delivery and go-live.</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-2">NOT covered under free support:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>New feature requests or design changes.</li>
          <li>Issues caused by the Client or the Client&apos;s staff.</li>
          <li>Third-party service outages or API failures.</li>
          <li>Misuse or unauthorised modification of the system.</li>
        </ul>
        <div className="p-4 bg-ky-surface border border-ky-border ky-rounded text-sm font-inter text-ky-muted">
          <strong className="text-ky-ivory">Response time:</strong> 48 business hours. <br />
          <strong className="text-ky-ivory">Communication:</strong> WhatsApp, email, and phone.
        </div>
      </>
    ),
  },
  {
    id: 'monthly-maintenance-retainer',
    title: 'Monthly Maintenance Retainer',
    content: (
      <>
        <div className="p-4 bg-ky-surface border border-ky-border ky-rounded mb-5">
          <div className="flex items-center justify-between mb-1">
            <p className="font-display font-semibold text-ky-ivory">Monthly Fee</p>
            <RetainerPrice />
          </div>
          <p className="text-sm text-ky-muted font-inter">Invoiced on the 1st of each calendar month. Payment due within 7 days.</p>
        </div>
        <p className="font-display font-semibold text-ky-ivory mb-2">Included in the retainer:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Security patches, dependency updates, and minor platform updates.</li>
          <li>One (1) minor feature addition or enhancement per month.</li>
          <li>Ongoing performance monitoring.</li>
          <li>Priority bug response within <strong className="text-ky-ivory">24 business hours</strong>.</li>
          <li>Monthly system health report delivered by the 5th business day of the following month.</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-2">NOT included in the retainer:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Major new features (quoted and invoiced separately).</li>
          <li>Emergency out-of-hours support (available but billed separately).</li>
          <li>Third-party service subscription costs (hosting, SMS, email platforms).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'monthly-system-report',
    title: 'Monthly System Report',
    content: (
      <>
        <p className="mb-4">
          Clients on the Monthly Maintenance Retainer receive a system health report delivered by
          the <strong className="text-ky-ivory">5th business day of each month</strong>.
        </p>
        <p className="font-display font-semibold text-ky-ivory mb-2">Report contents:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Uptime statistics and availability summary for the preceding month.</li>
          <li>Incident summary — any issues encountered and their resolution.</li>
          <li>Performance metrics (load times, error rates, server health).</li>
          <li>Upcoming maintenance windows, renewals, or required updates.</li>
          <li>Recommendations for improvements or risk mitigations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'service-suspension-schedule',
    title: 'Service Suspension Schedule',
    content: (
      <>
        <p className="mb-6 text-sm text-ky-muted">
          The following timeline applies to overdue Monthly Maintenance Retainer invoices. Kyfaru
          follows this schedule consistently to ensure transparency and fairness.
        </p>
        <div className="flex flex-col gap-3">
          {SUSPENSION_STEPS.map((step) => (
            <div
              key={step.day}
              className={`flex gap-4 p-4 border border-l-4 ky-rounded ${step.color}`}
            >
              <div className="shrink-0 w-20">
                <p className="text-[11px] font-display font-bold text-ky-ivory tracking-wider">{step.day}</p>
              </div>
              <div>
                <p className="font-display font-semibold text-ky-ivory text-sm mb-0.5">{step.label}</p>
                <p className="text-sm font-inter text-ky-muted leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded text-sm font-inter text-ky-muted">
          <strong className="text-ky-ivory">Reinstatement:</strong> Following suspension, a reinstatement fee of{' '}
          <strong className="text-ky-ivory">KES 2,000</strong> applies in addition to all outstanding balances.
          The system will be restored within 24 hours of full payment receipt.
        </div>
      </>
    ),
  },
  {
    id: 'managed-services',
    title: 'Managed Services',
    content: (
      <>
        <p className="mb-4">
          Under a Managed Services arrangement, Kyfaru can manage recurring third-party service
          obligations on the Client&apos;s behalf, including:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Hosting plan renewals.</li>
          <li>Domain registration and renewal.</li>
          <li>Business email service accounts.</li>
          <li>Third-party API and platform subscriptions.</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-2">Key conditions:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            Client funds are held in a designated client account and applied to renewals.
            <strong className="text-ky-ivory"> Kyfaru never uses its own funds</strong> to cover Client service costs.
          </li>
          <li>Monthly itemised expense statements are provided to the Client.</li>
          <li>The Client retains beneficial ownership of all accounts managed under this arrangement.</li>
          <li>This arrangement requires a separate written Managed Services Agreement.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'what-support-does-not-cover',
    title: 'What Support Does Not Cover',
    content: (
      <>
        <p className="mb-4">The following are explicitly excluded from both free and retainer support:</p>
        <div className="flex flex-col gap-3">
          {[
            { title: 'Out-of-Scope Features', detail: 'Features or functionality not included in the original project SOW.' },
            { title: 'Client-Modification Issues', detail: 'Problems arising from changes made by the Client or third parties engaged by the Client.' },
            { title: 'Staff Training', detail: 'Training of new staff members or extended onboarding sessions. These are quoted separately.' },
            { title: 'Client-Caused Data Loss', detail: 'Data recovery from loss caused by Client actions, including accidental deletion or failure to maintain backups.' },
            { title: 'Emergency Traffic Scaling', detail: 'Sudden traffic events requiring emergency infrastructure scaling. These are covered but billed separately with prior written notice and authorisation.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4 bg-red-950/20 border border-red-900/30 border-l-4 border-l-red-600 ky-rounded">
              <span className="text-red-400 text-sm font-display font-bold shrink-0 mt-0.5">✕</span>
              <div>
                <p className="font-display font-semibold text-ky-ivory text-sm mb-0.5">{item.title}</p>
                <p className="text-sm font-inter text-ky-muted">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
]

export default function SupportPolicyPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Support Policy"
        labelIcon="ph:headset-bold"
        headline={{
          lead: 'Support &',
          accent: 'Maintenance',
          tail: 'Policy.',
        }}
        subtitle="Free support periods, Monthly Maintenance Retainer terms, response SLAs, monthly reports, and service suspension procedures."
      />
      <LegalPageLayout
        sections={SECTIONS}
        lastUpdated="1 January 2025"
        version="1.0"
        breadcrumb={[
          { label: 'Terms', href: '/terms' },
          { label: 'Support Policy' },
        ]}
        showFooterCta
      />
      <Footer />
    </div>
  )
}
