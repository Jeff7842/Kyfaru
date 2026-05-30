// ============================================================
// ACCEPTABLE USE POLICY PAGE
// What clients may and may not do with systems Kyfaru builds.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'your-responsibilities',
    title: 'Your Responsibilities as System Owner',
    content: (
      <>
        <p className="mb-4">
          Once a system is handed over, the Client becomes the System Owner and assumes full
          responsibility for:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>How the system is operated and the purposes for which it is used.</li>
          <li>All personal data collected from the Client&apos;s customers through the system.</li>
          <li>Compliance with all applicable Kenyan and international laws in connection with the system&apos;s operation.</li>
          <li>Keeping system software, plugins, and dependencies updated — especially security-related updates.</li>
          <li>All content published on or through the system.</li>
        </ul>
        <div className="mt-4 flex gap-3 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded p-4">
          <span className="text-lg shrink-0">ℹ️</span>
          <p className="text-sm font-inter text-ky-muted">
            Kyfaru&apos;s liability for the system ends at handover unless the Client has engaged an
            ongoing Managed Services or Monthly Maintenance Retainer arrangement.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'permitted-use',
    title: 'Permitted Use',
    content: (
      <>
        <p className="mb-4">Clients are permitted to:</p>
        <div className="flex flex-col gap-2">
          {[
            'Use the system for its intended, documented business purpose.',
            'Add content, products, users, and data as the system was designed to accommodate.',
            'Engage Kyfaru for additional development, features, or maintenance.',
            'Transfer ownership of the system to another legal entity, provided written notice is given to Kyfaru and the transfer complies with all applicable laws.',
            'Engage other developers after credential handover, subject to the restrictions in the Modifications section below.',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3 bg-ky-surface border border-ky-border border-l-4 border-l-ky-green-hi ky-rounded text-sm font-inter text-ky-muted">
              <span className="text-ky-green-hi font-bold shrink-0">✓</span>
              {item}
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'prohibited-use',
    title: 'Prohibited Use',
    content: (
      <>
        <p className="mb-4">Clients must NOT use systems built by Kyfaru to:</p>
        <div className="flex flex-col gap-2">
          {[
            'Engage in any activity that is unlawful under the laws of Kenya or any other applicable jurisdiction.',
            'Store, transmit, or facilitate the distribution of malicious code, spyware, ransomware, or any harmful software.',
            'Infringe the intellectual property rights of any third party.',
            'Collect personal data from individuals without a compliant privacy policy and proper consent mechanism.',
            'Process personal data in violation of the Kenya Data Protection Act 2019 or applicable data protection laws.',
            'Process financial payments outside licensed and regulated payment channels.',
            'Operate a business or service without holding all required licences, permits, and regulatory approvals.',
            'Engage in fraud, deception, phishing, or any activity intended to mislead users or third parties.',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-900/30 border-l-4 border-l-red-600 ky-rounded text-sm font-inter text-ky-muted">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              {item}
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications',
    content: (
      <>
        <p className="font-display font-semibold text-ky-ivory mb-3">The Client may:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-5">
          <li>Add, edit, or remove content within the CMS or admin interface without restriction.</li>
          <li>Engage other developers to work on the system after credential handover.</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-3">The Client must NOT:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            Modify the system&apos;s core architecture, database schema, or infrastructure without
            first notifying Kyfaru in writing. Such modifications void any applicable warranty or
            support agreement.
          </li>
          <li>
            Use code, components, or systems built by Kyfaru in other projects without obtaining
            a separate written licence from Kyfaru.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-and-privacy-compliance',
    title: 'Data and Privacy Compliance',
    content: (
      <>
        <p className="mb-4">
          Where the Client&apos;s system collects, stores, or processes personal data of third
          parties, the Client acts as the <strong className="text-ky-ivory">Data Controller</strong> in
          respect of that data. As Data Controller, the Client must:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Publish a legally compliant Privacy Policy on their system before going live.</li>
          <li>Implement proper consent mechanisms before collecting personal data from users.</li>
          <li>
            Register as a Data Controller with the Office of the Data Protection Commissioner (ODPC)
            if required under the Kenya Data Protection Act 2019.
          </li>
          <li>
            Take full responsibility for any data breaches, regulatory investigations, or penalties
            arising from the Client&apos;s management or mismanagement of the system.
          </li>
        </ul>
        <div className="flex gap-3 bg-ky-surface border border-ky-border ky-rounded p-4 text-sm font-inter text-ky-muted">
          <span className="text-lg shrink-0">🏛️</span>
          <p>
            For guidance on data protection obligations, visit the{' '}
            <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-ky-gold hover:text-ky-gold-hi transition-colors">
              Office of the Data Protection Commissioner
            </a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'consequences-of-misuse',
    title: 'Consequences of Misuse',
    content: (
      <>
        <p className="mb-4">
          Where Kyfaru has reasonable grounds to believe that a system it built is being used in
          violation of this Acceptable Use Policy, Kyfaru reserves the right to:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            Withdraw all support and maintenance services for the system immediately and without
            refund of any prepaid fees.
          </li>
          <li>
            Publicly disassociate from the system, including removing the system from Kyfaru&apos;s
            portfolio and public references.
          </li>
          <li>
            Pursue appropriate legal remedies for any reputational, financial, or legal harm
            caused to Kyfaru as a result of the Client&apos;s misuse.
          </li>
        </ul>
        <p className="mt-4 text-sm italic text-ky-faint">
          Nothing in this section limits Kyfaru&apos;s right to pursue any other legal remedy
          available under the laws of Kenya.
        </p>
      </>
    ),
  },
]

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Acceptable Use Policy"
        labelIcon="ph:check-square-bold"
        headline={{
          lead: 'Acceptable',
          accent: 'Use',
          tail: 'Policy.',
        }}
        subtitle="What clients may and may not do with systems built by Kyfaru — data handling, modifications, compliance, and consequences of misuse."
      />
      <LegalPageLayout
        sections={SECTIONS}
        lastUpdated="12Th April 2026"
        version="1.3"
        breadcrumb={[
          { label: 'Terms', href: '/terms' },
          { label: 'Acceptable Use Policy' },
        ]}
        showFooterCta
      />
      <Footer />
    </div>
  )
}
