// ============================================================
// PRIVACY POLICY PAGE
// Legal document with sticky scroll-spy sidebar TOC.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          Kyfaru (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;)
          respects your privacy and is committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, and safeguard
          your information when you visit our website or use our Services.
        </p>
        <p>
          By using our website and Services, you consent to the practices
          described in this policy. If you do not agree, please do not use our
          Services.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>We collect several types of information from and about users:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            <strong className="text-ky-ivory">Identity Data:</strong> first
            name, last name, company, job title.
          </li>
          <li>
            <strong className="text-ky-ivory">Contact Data:</strong> email
            address, phone number, billing address, location.
          </li>
          <li>
            <strong className="text-ky-ivory">Technical Data:</strong> IP
            address, browser type and version, device information, time zone,
            operating system.
          </li>
          <li>
            <strong className="text-ky-ivory">Usage Data:</strong> pages
            visited, time spent on pages, links clicked, referral sources.
          </li>
          <li>
            <strong className="text-ky-ivory">Project Data:</strong> any
            information you provide in quote forms, contact forms, or during
            project engagements.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Respond to enquiries and provide requested Services.</li>
          <li>Process payments and manage billing.</li>
          <li>Send service-related notifications and updates.</li>
          <li>Improve our website, Services, and user experience.</li>
          <li>Comply with legal obligations.</li>
          <li>Prevent fraud and ensure the security of our Services.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our website and store certain information. Cookies are small data
          files placed on your device.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, some parts of our Services may
          not function properly without cookies.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'How We Share Your Information',
    content: (
      <>
        <p>We do not sell your personal data. We may share information with:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            <strong className="text-ky-ivory">Service Providers:</strong>{' '}
            trusted third parties who help operate our website and Services
            (e.g. hosting, analytics, payment processing).
          </li>
          <li>
            <strong className="text-ky-ivory">Legal Authorities:</strong> when
            required by law or to protect our rights.
          </li>
          <li>
            <strong className="text-ky-ivory">Business Transfers:</strong> in
            connection with mergers, acquisitions, or sale of assets.
          </li>
        </ul>
        <p>
          All third parties are required to handle your data in accordance with
          this Privacy Policy and applicable laws.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <>
        <p>
          We retain your personal data only for as long as necessary to fulfil
          the purposes for which it was collected, including legal, accounting,
          or reporting requirements.
        </p>
        <p>
          When data is no longer needed, we securely delete or anonymise it.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Data Security',
    content: (
      <>
        <p>
          We implement appropriate technical and organisational measures to
          protect your personal data, including encryption in transit, secure
          servers, and access controls.
        </p>
        <p>
          However, no method of transmission over the internet or electronic
          storage is 100% secure. We cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your personal data.</li>
          <li>Object to or restrict processing of your data.</li>
          <li>Request data portability.</li>
          <li>Withdraw consent at any time.</li>
        </ul>
        <p>
          To exercise these rights, contact us at{' '}
          <a href="mailto:privacy@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">
            privacy@kyfaru.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-Party Links',
    content: (
      <>
        <p>
          Our Services may contain links to third-party websites or services.
          We are not responsible for the privacy practices of these third
          parties. We encourage you to review their privacy policies before
          providing any personal data.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children\u2019s Privacy',
    content: (
      <>
        <p>
          Our Services are not intended for individuals under the age of 18.
          We do not knowingly collect personal data from children. If you
          believe a child has provided us with personal data, please contact us
          so we can remove it.
        </p>
      </>
    ),
  },
  {
    id: 'international',
    title: 'International Transfers',
    content: (
      <>
        <p>
          Your information may be transferred to and processed in countries
          other than your country of residence. These countries may have
          different data protection laws.
        </p>
        <p>
          When we transfer your data internationally, we ensure appropriate
          safeguards are in place to protect your information.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by posting the new policy on this page and
          updating the &ldquo;last updated&rdquo; date.
        </p>
        <p>
          We encourage you to review this policy periodically.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>
          For questions about this Privacy Policy or how we handle your data,
          contact us at{' '}
          <a href="mailto:privacy@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">
            privacy@kyfaru.com
          </a>{' '}
          or through our website contact form.
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Legal"
        labelIcon="heroicons:lock-closed"
        headline={{
          lead: 'Privacy',
          accent: 'Policy',
          tail: '.',
        }}
        subtitle="How we collect, use, and protect your personal data when you work with Kyfaru."
      />
      <LegalPageLayout sections={SECTIONS} lastUpdated="May 2026" />
      <Footer />
    </div>
  )
}
