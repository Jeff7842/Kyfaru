// ============================================================
// PRIVACY POLICY PAGE
// Kenya Data Protection Act 2019 + GDPR compliant.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const RIGHTS = [
  { icon: '👁️', title: 'Right to Access', detail: 'Request a copy of the personal data we hold about you.' },
  { icon: '✏️', title: 'Right to Correct', detail: 'Request correction of inaccurate or incomplete data.' },
  { icon: '🗑️', title: 'Right to Deletion', detail: 'Request deletion of your data where no legal basis for retention exists.' },
  { icon: '🚫', title: 'Right to Object', detail: 'Object to processing of your data for specific purposes.' },
  { icon: '📦', title: 'Right to Portability', detail: 'Receive your data in a structured, machine-readable format.' },
  { icon: '🏛️', title: 'Right to Complain', detail: 'Lodge a complaint with the Office of the Data Protection Commissioner.' },
]

const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who We Are',
    content: (
      <>
        <p>
          <strong className="text-ky-ivory">Kyfaru</strong> is a
          technology company in Nairobi, Kenya. We are the Data Controller for personal
          data collected through the kyfaru.com website.
        </p>
        <div className="flex flex-col gap-1 mt-3 p-4 bg-ky-surface border border-ky-border ky-rounded text-sm font-inter">
          <p><span className="text-ky-faint">Email:</span> <a href="mailto:hello@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">hello@kyfaru.com</a></p>
          <p><span className="text-ky-faint">Website:</span> <a href="https://kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">kyfaru.com</a></p>
          <p><span className="text-ky-faint">Location:</span> Nairobi, Kenya</p>
        </div>
      </>
    ),
  },
  {
    id: 'what-data-we-collect',
    title: 'What Data We Collect',
    content: (
      <>
        <p className="font-display font-semibold text-ky-ivory mb-2">On kyfaru.com:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Name and email address from contact and enquiry forms.</li>
          <li>IP address and browser data collected automatically for analytics purposes.</li>
          <li>Cookie and session data (see the Cookies section below).</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-2">Through client projects:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>
            Where Kyfaru builds and maintains systems for clients, we may process personal data
            belonging to the client&apos;s customers as a <strong className="text-ky-ivory">Data Processor</strong> acting
            under the client&apos;s written instruction.
          </li>
        </ul>
        <div className="flex gap-3 bg-ky-green-hi/10 border border-ky-green-hi/30 border-l-4 border-l-ky-green-hi ky-rounded p-4">
          <span className="text-lg shrink-0">✅</span>
          <div className="text-sm font-inter text-ky-muted">
            <strong className="text-ky-ivory">We do NOT collect:</strong> sensitive personal data without explicit consent, or
            personal data of individuals under 18 years of age without verified guardian consent.
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use-your-data',
    title: 'How We Use Your Data',
    content: (
      <>
        <p className="mb-2">We use the personal data we collect to:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Respond to enquiries and provide requested information about our services.</li>
          <li>Deliver project services and manage ongoing client engagements.</li>
          <li>Send invoices, project updates, and service-related communications.</li>
          <li>Comply with legal and regulatory obligations under Kenyan law.</li>
        </ul>
        <div className="flex gap-3 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded p-4">
          <span className="text-lg shrink-0">🚫</span>
          <div className="text-sm font-inter text-ky-muted">
            <strong className="text-ky-ivory">We do NOT:</strong> sell your data to any third party, use your data for
            advertising without consent, or share client data with competitors.
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'legal-basis-for-processing',
    title: 'Legal Basis for Processing',
    content: (
      <>
        <p className="mb-3">
          Under the Kenya Data Protection Act 2019 (Section 30) and the EU General Data Protection
          Regulation (Article 6), our legal bases for processing personal data are:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { basis: 'Contractual Necessity', detail: 'Processing required to perform a contract with you or take pre-contractual steps at your request.' },
            { basis: 'Legal Obligation', detail: 'Processing required to comply with Kenyan law, including tax and financial reporting obligations.' },
            { basis: 'Legitimate Interests', detail: 'Processing for our legitimate business interests, where these are not overridden by your rights.' },
            { basis: 'Explicit Consent', detail: 'Where required by law, we obtain your clear and specific consent before processing.' },
          ].map((item) => (
            <div key={item.basis} className="p-4 bg-ky-surface border border-ky-border ky-rounded">
              <p className="font-display font-semibold text-ky-ivory text-sm mb-1">{item.basis}</p>
              <p className="text-sm font-inter text-ky-muted leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <>
        <p className="mb-4">We retain personal data only for as long as necessary for its original purpose or as required by law:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-inter border-collapse">
            <thead>
              <tr className="border-b border-ky-border">
                <th className="text-left py-2 pr-4 text-ky-faint font-display text-xs tracking-wider uppercase">Data Category</th>
                <th className="text-left py-2 text-ky-faint font-display text-xs tracking-wider uppercase">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ky-border">
              {[
                { category: 'Project communications & contracts', period: '5 years after project end' },
                { category: 'Financial records & invoices', period: '7 years (Kenya tax requirements)' },
                { category: 'Enquiry data (no engagement follows)', period: '12 months from last contact' },
                { category: 'Website analytics data', period: '24 months rolling' },
              ].map((row) => (
                <tr key={row.category}>
                  <td className="py-3 pr-4 text-ky-muted">{row.category}</td>
                  <td className="py-3 text-ky-ivory">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ky-faint">When data is no longer required, it is securely deleted or anonymised.</p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p className="mb-5">
          Under the Kenya Data Protection Act 2019 (Part IV), you have the following rights
          regarding your personal data:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RIGHTS.map((right) => (
            <div key={right.title} className="flex gap-3 p-4 bg-ky-surface border border-ky-border border-l-4 border-l-ky-green-hi ky-rounded">
              <span className="text-xl shrink-0">{right.icon}</span>
              <div>
                <p className="font-display font-semibold text-ky-ivory text-sm mb-0.5">{right.title}</p>
                <p className="text-sm font-inter text-ky-muted leading-relaxed">{right.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 bg-ky-surface border border-ky-border ky-rounded text-sm font-inter text-ky-muted">
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:legal@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">legal@kyfaru.com</a>.
          We will respond within <strong className="text-ky-ivory">21 days</strong> as required under the Kenya DPA 2019.
        </div>
      </>
    ),
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    content: (
      <>
        <p className="mb-3">
          Kyfaru does not sell your personal data. We share data only in the following limited circumstances:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>
            <strong className="text-ky-ivory">Service Providers:</strong> trusted third parties (hosting providers, email
            delivery services) who process data on our behalf under written data processing agreements
            and confidentiality obligations.
          </li>
          <li>
            <strong className="text-ky-ivory">Legal Authorities:</strong> when required by applicable Kenyan law, court order,
            or regulatory obligation.
          </li>
        </ul>
        <div className="flex gap-3 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded p-4">
          <span className="text-lg shrink-0">🌍</span>
          <p className="text-sm font-inter text-ky-muted">
            <strong className="text-ky-ivory">International transfers:</strong> We do not transfer personal data outside Kenya
            or the European Economic Area (EEA) without appropriate safeguards in place, such as
            standard contractual clauses or adequacy decisions.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <>
        <p className="mb-4">Kyfaru uses cookies to ensure the website functions correctly and to understand usage patterns.</p>
        <div className="flex flex-col gap-3 mb-4">
          {[
            { type: 'Essential Cookies', badge: 'Always Active', description: 'Required for the website to function. Cannot be disabled.', color: 'text-ky-green-hi' },
            { type: 'Analytics Cookies', badge: 'Optional', description: 'Help us understand how visitors use our site. Activated only with your consent.', color: 'text-ky-gold' },
            { type: 'Marketing Cookies', badge: 'Not Used', description: 'We do not use marketing or advertising cookies on kyfaru.com.', color: 'text-ky-faint' },
          ].map((cookie) => (
            <div key={cookie.type} className="flex items-start gap-4 p-4 bg-ky-surface border border-ky-border ky-rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-semibold text-ky-ivory text-sm">{cookie.type}</p>
                  <span className={`text-[11px] font-display tracking-wider ${cookie.color}`}>{cookie.badge}</span>
                </div>
                <p className="text-sm font-inter text-ky-muted">{cookie.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-ky-muted">
          A cookie consent banner is displayed on first visit. You can update your preferences at any
          time via the Cookie Settings link in the site footer.
        </p>
      </>
    ),
  },
  {
    id: 'security-measures',
    title: 'Security Measures',
    content: (
      <>
        <p className="mb-3">
          Kyfaru implements appropriate technical and organisational security measures to protect
          personal data against unauthorised access, alteration, disclosure, or destruction:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>SSL/TLS encryption on all data transmission between clients and our systems.</li>
          <li>Access controls, role-based authentication, and principle of least privilege.</li>
          <li>Regular security reviews and vulnerability assessments.</li>
          <li>
            <strong className="text-ky-ivory">Data breach notification</strong> within 72 hours of discovery,
            as required by the Kenya Data Protection Act 2019.
          </li>
        </ul>
        <p className="mt-3 text-sm text-ky-faint italic">
          No method of electronic transmission or storage is 100% secure. While we take reasonable
          measures, we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: 'complaints',
    title: 'Complaints',
    content: (
      <>
        <p className="mb-4">
          If you believe your data rights have not been respected, you have the right to lodge a
          complaint with the relevant supervisory authority:
        </p>
        <div className="flex flex-col gap-3">
          <div className="p-5 bg-ky-surface border border-ky-border border-l-4 border-l-ky-green-hi ky-rounded">
            <p className="font-display font-semibold text-ky-ivory mb-1">🇰🇪 Kenya</p>
            <p className="text-sm font-inter text-ky-muted mb-1">Office of the Data Protection Commissioner (ODPC)</p>
            <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-sm text-ky-gold hover:text-ky-gold-hi transition-colors">
              www.odpc.go.ke
            </a>
          </div>
          <div className="p-5 bg-ky-surface border border-ky-border border-l-4 border-l-ky-border ky-rounded">
            <p className="font-display font-semibold text-ky-ivory mb-1">🇪🇺 European Union</p>
            <p className="text-sm font-inter text-ky-muted">
              For EU-based individuals, complaints may be submitted to the relevant supervisory
              authority in your country of residence.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-ky-muted">
          You may also contact us directly at{' '}
          <a href="mailto:legal@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">legal@kyfaru.com</a>{' '}
          before escalating to a supervisory authority.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-this-policy',
    title: 'Changes to This Policy',
    content: (
      <>
        <p>
          Kyfaru reserves the right to update this Privacy Policy from time to time to reflect changes
          in our practices, services, or applicable law.
        </p>
        <p>
          We will notify active clients of any material changes at least{' '}
          <strong className="text-ky-ivory">30 days before they take effect</strong>. Continued use of
          our website or services after the notice period constitutes acceptance of the updated policy.
        </p>
        <p>
          The current version of this policy is always available at{' '}
          <a href="/privacy-policy" className="text-ky-gold hover:text-ky-gold-hi transition-colors">
            kyfaru.com/privacy-policy
          </a>
          .
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Privacy Policy"
        labelIcon="ph:shield-check-bold"
        headline={{
          lead: 'Privacy',
          accent: 'Policy',
          tail: '.',
        }}
        subtitle="How Kyfaru collects, uses, and protects personal data — in compliance with the Kenya Data Protection Act 2019 and applicable international law."
      />
      <LegalPageLayout
        sections={SECTIONS}
        lastUpdated="May 2026"
        version="1.0"
        breadcrumb={[
          { label: 'Terms', href: '/terms' },
          { label: 'Privacy Policy' },
        ]}
        showFooterCta
      />
      <Footer />
    </div>
  )
}
