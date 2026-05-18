// ============================================================
// TERMS OF SERVICE PAGE
// Legal document with sticky scroll-spy sidebar TOC.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: (
      <>
        <p>
          By accessing or using the Kyfaru website, products, or services
          (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use
          our Services.
        </p>
        <p>
          These terms apply to all visitors, users, and others who access or use
          the Services. By using the Services, you represent that you are at
          least 18 years old, or the age of majority in your jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    title: 'Description of Services',
    content: (
      <>
        <p>
          Kyfaru provides software development, design, AI integration, and
          consulting services for businesses and individuals. Specific Services
          may include but are not limited to:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Web and mobile application development</li>
          <li>UI/UX design and brand systems</li>
          <li>USSD solutions and integrations</li>
          <li>AI integration powered by Mwamba AI</li>
          <li>Backend, database, and infrastructure work</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any Service at
          any time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: 'user-obligations',
    title: 'User Obligations',
    content: (
      <>
        <p>You agree to:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Provide accurate, current, and complete information when requested.</li>
          <li>Use the Services only for lawful purposes and in compliance with all applicable laws.</li>
          <li>Not interfere with or disrupt the Services or servers.</li>
          <li>Not attempt to gain unauthorized access to any part of the Services.</li>
          <li>Maintain the confidentiality of any account credentials provided to you.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment & Billing',
    content: (
      <>
        <p>
          Fees for project-based engagements are agreed upon in writing before
          work begins, typically through a signed Statement of Work or
          Contract. Payment milestones, deliverables, and timelines are
          specified in each individual agreement.
        </p>
        <p>
          Unless otherwise stated, all fees are quoted in Kenyan Shillings (KES).
          Late payments may incur additional fees or pause active work until
          accounts are settled.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <>
        <p>
          Upon full payment of all fees owed, ownership of deliverables created
          specifically for you under a project agreement transfers to you,
          subject to any third-party licences and any Kyfaru pre-existing tools,
          libraries, or frameworks used in delivery.
        </p>
        <p>
          Kyfaru retains ownership of its proprietary methodologies, internal
          tools, and any reusable code components that exist independently of
          your project. We may showcase work in our portfolio unless otherwise
          agreed in writing.
        </p>
      </>
    ),
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    content: (
      <>
        <p>
          We treat all client information, code, designs, and business details
          as confidential. We do not disclose project specifics to third parties
          without your written consent, except as required by law.
        </p>
        <p>
          Mutual NDAs are available upon request for sensitive engagements.
        </p>
      </>
    ),
  },
  {
    id: 'warranties',
    title: 'Warranties & Disclaimers',
    content: (
      <>
        <p>
          We deliver Services with reasonable skill and care, in line with
          industry standards. However, the Services are provided &ldquo;as
          is&rdquo; without warranties of any kind, either express or implied,
          including but not limited to merchantability or fitness for a
          particular purpose.
        </p>
        <p>
          We do not guarantee that the Services will be uninterrupted,
          error-free, or free from external attacks or vulnerabilities.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <p>
          To the maximum extent permitted by law, Kyfaru shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          including loss of profits, data, or business, even if advised of the
          possibility of such damages.
        </p>
        <p>
          Our total cumulative liability for any claim related to the Services
          shall not exceed the total fees paid by you to Kyfaru in the twelve
          (12) months preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    content: (
      <>
        <p>
          Either party may terminate a project engagement with written notice as
          specified in the relevant Statement of Work. Upon termination, you
          remain responsible for all fees for Services performed up to the
          termination date.
        </p>
        <p>
          We may terminate or suspend access to the Services immediately,
          without notice, for any breach of these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the Republic of Kenya, without regard to its conflict of law
          provisions.
        </p>
        <p>
          Any disputes arising out of or related to these Terms shall be
          resolved through good-faith negotiation. If unresolved, disputes
          shall be submitted to the courts of Nairobi, Kenya.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: (
      <>
        <p>
          We reserve the right to modify these Terms at any time. We will
          provide notice of material changes by posting the updated Terms on
          our website with a new &ldquo;last updated&rdquo; date.
        </p>
        <p>
          Your continued use of the Services after such changes constitutes
          acceptance of the new Terms.
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
          Questions about these Terms? Reach us at{' '}
          <a href="mailto:legal@kyfaru.com" className="text-ky-gold hover:text-ky-gold-hi transition-colors">
            legal@kyfaru.com
          </a>{' '}
          or through the contact form on our website.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Legal"
        labelIcon="heroicons:scale"
        headline={{
          lead: 'Terms of',
          accent: 'Service',
          tail: '.',
        }}
        subtitle="The rules of engagement when working with Kyfaru. Please read carefully."
      />
      <LegalPageLayout sections={SECTIONS} lastUpdated="May 2026" />
      <Footer />
    </div>
  )
}
