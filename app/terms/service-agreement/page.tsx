// ============================================================
// SERVICE AGREEMENT PAGE
// Full legal terms for all Kyfaru project engagements.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'scope-and-deliverables',
    title: 'Scope and Deliverables',
    content: (
      <ol className="list-decimal pl-6 flex flex-col gap-3">
        <li>
          All services are limited to what is written in the Scope of Work (SOW) document attached to
          the signed Project Agreement. No work shall be performed outside the defined SOW without a
          written Change Request approved by both parties.
        </li>
        <li>
          Any feature, page, integration, or function <strong className="text-ky-ivory">not listed in the SOW</strong> is
          outside scope and requires a written Change Request before work begins. Verbal or informal
          requests do not constitute scope changes.
        </li>
        <li>
          Content creation — including photography, copywriting, video production, and graphic design
          assets not specified in the SOW — is the Client&apos;s responsibility. Kyfaru is not liable
          for delays arising from absent or inadequate content.
        </li>
        <li>
          If the Client fails to provide required materials within <strong className="text-ky-ivory">5 business days</strong> of
          written request, project timelines extend on a day-for-day basis from the date of the
          missed deadline. No penalty or claim for delay may be made against Kyfaru where the cause
          of delay is the Client&apos;s failure to deliver required inputs.
        </li>
      </ol>
    ),
  },
  {
    id: 'design-and-change-requests',
    title: 'Design and Change Requests',
    content: (
      <ol className="list-decimal pl-6 flex flex-col gap-3">
        <li>
          Kyfaru presents designs for Client approval before development begins. Design approval
          must be given in writing before Kyfaru proceeds to the build phase.
        </li>
        <li>
          The Client receives up to <strong className="text-ky-ivory">two (2) revision rounds per design phase</strong>.
          A <em>revision</em> means adjusting existing elements. A <em>redesign</em> — starting
          over with a fundamentally different direction — constitutes a Change Request and will be
          quoted accordingly.
        </li>
        <li>
          Design approval is given in writing within <strong className="text-ky-ivory">5 business days</strong> of
          presentation. Failure to respond within this period shall be deemed approval of the
          submitted design, and development may proceed.
        </li>
        <li>
          Once a design section has been approved and built, any change to that built section
          constitutes a Change Request and will attract additional fees as agreed in writing.
        </li>
        <li>
          Change Requests must be submitted in writing. Kyfaru will respond with the cost and
          timeline impact within 5 business days. No work on the Change Request begins until the
          Client approves the quoted cost and pays any required deposit.
        </li>
      </ol>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <ol className="list-decimal pl-6 flex flex-col gap-3">
        <li>
          All bespoke code, designs, database schemas, and documentation created specifically for
          the Client under this Agreement transfer to the Client upon <strong className="text-ky-ivory">full and final
          payment</strong> of all outstanding amounts.
        </li>
        <li>
          Until full payment is received, all work product — including partially completed
          deliverables — remains the exclusive intellectual property of Kyfaru. The Client
          acquires no rights to unpaid deliverables.
        </li>
        <li>
          Kyfaru retains all pre-existing intellectual property, including frameworks, internal
          libraries, development methodologies, and reusable components used in the project.
          Upon full payment, a <strong className="text-ky-ivory">non-exclusive, perpetual licence</strong> to use this
          pre-existing IP within the Client&apos;s system is granted. This licence does not
          permit use in other projects or redistribution without a separate written licence.
        </li>
        <li>
          The Client warrants that all content provided to Kyfaru — including images, copy, logos,
          trademarks, and third-party materials — is owned by the Client or properly licensed, and
          that its use does not infringe third-party intellectual property rights.
        </li>
        <li>
          Kyfaru may include the completed system in its portfolio and marketing materials unless
          the Client opts out in writing within <strong className="text-ky-ivory">30 days of the system&apos;s go-live date</strong>.
        </li>
      </ol>
    ),
  },
  {
    id: 'credentials-and-handover',
    title: 'Credentials and Handover',
    content: (
      <>
        <div className="flex gap-4 bg-ky-gold/10 border border-ky-gold/40 border-l-4 border-l-ky-gold ky-rounded p-5 mb-5">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <p className="font-display font-semibold text-ky-ivory mb-1">Important — Credential Release Condition</p>
            <p className="text-sm font-inter text-ky-muted leading-relaxed">
              Credentials — including system passwords, API keys, database access credentials, and
              domain logins — are handed over <strong className="text-ky-ivory">ONLY after full and final payment</strong> of
              all outstanding amounts. No partial handover will be made against outstanding balances.
            </p>
          </div>
        </div>
        <ol className="list-decimal pl-6 flex flex-col gap-3">
          <li>
            The standard handover package includes: full source code repository access, database
            credentials, hosting account access, API keys, domain registrar login, system
            architecture documentation, and a one-hour (1hr) training session.
          </li>
          <li>
            Kyfaru does not retain copies of Client credentials after handover, unless the parties
            have entered a separate Managed Services arrangement in writing.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    content: (
      <>
        <p>Both parties agree to the following confidentiality obligations:</p>
        <ol className="list-decimal pl-6 flex flex-col gap-3 mt-3">
          <li>
            All project information, technical documentation, business data, and communications
            exchanged under this Agreement are confidential and shall not be disclosed to any
            third party without prior written consent of the disclosing party.
          </li>
          <li>
            Neither party shall make any public disclosure, press release, or statement regarding
            any dispute arising under this Agreement without the prior written consent of the
            other party.
          </li>
          <li>
            These confidentiality obligations survive the termination of this Agreement for a
            period of <strong className="text-ky-ivory">five (5) years</strong> from the date of termination.
          </li>
          <li>
            Exemptions apply to disclosures required by law or a court order, provided the
            disclosing party gives the other party reasonable advance notice where legally permissible.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'client-responsibilities',
    title: 'Client Responsibilities',
    content: (
      <>
        <p>The Client undertakes to:</p>
        <ol className="list-decimal pl-6 flex flex-col gap-3 mt-3">
          <li>
            Designate one (1) authorised decision-maker who is empowered to give binding approvals
            on behalf of the Client throughout the project.
          </li>
          <li>
            Respond to requests, queries, and approval submissions within <strong className="text-ky-ivory">5 business days</strong>.
            Delays caused by the Client&apos;s failure to respond will extend project timelines
            on a day-for-day basis.
          </li>
          <li>
            Provide accurate, complete, and legally usable content and materials in a timely manner.
          </li>
          <li>
            Maintain independent backups of all existing data before any migration, update, or
            system change. Kyfaru is not liable for any data loss where the Client has not
            maintained adequate backups.
          </li>
          <li>
            Not modify, alter, or instruct third parties to modify the system without Kyfaru&apos;s
            prior written approval during the project period. Unauthorised modifications void any
            applicable warranty.
          </li>
          <li>
            Comply with all applicable Kenyan and international laws in connection with the
            operation and use of the delivered system.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'warranties',
    title: 'Warranties',
    content: (
      <>
        <p className="font-display font-semibold text-ky-ivory mb-3">Kyfaru warrants that:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-5">
          <li>Services will be delivered with reasonable professional skill and care.</li>
          <li>The system will perform materially in accordance with the agreed SOW at the time of delivery.</li>
          <li>To Kyfaru&apos;s knowledge, the deliverables do not infringe the intellectual property rights of any third party.</li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-3">The Client warrants that:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>It has full legal authority to enter into this Agreement.</li>
          <li>All content and materials provided to Kyfaru are legally usable and do not infringe third-party rights.</li>
          <li>It will operate the delivered system lawfully and in compliance with all applicable laws.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <div className="flex gap-4 bg-ky-gold/10 border border-ky-gold/40 border-l-4 border-l-ky-gold ky-rounded p-5 mb-5">
          <span className="text-2xl shrink-0">⚖️</span>
          <div>
            <p className="font-display font-semibold text-ky-ivory mb-1">Liability Cap</p>
            <p className="text-sm font-inter text-ky-muted leading-relaxed">
              Kyfaru&apos;s total aggregate liability to the Client under or in connection with this
              Agreement shall not exceed the <strong className="text-ky-ivory">total Project Fee paid in the preceding
              12 months</strong>, regardless of the form of action, whether in contract, tort, or otherwise.
            </p>
          </div>
        </div>
        <p className="mb-3">Kyfaru is not liable for:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Loss of revenue, profits, or anticipated savings.</li>
          <li>Indirect, consequential, incidental, or punitive losses of any kind.</li>
          <li>Data loss or corruption where the Client has not maintained independent backups.</li>
          <li>Issues arising from modifications made to the system by the Client or third parties.</li>
          <li>Outages, failures, or data loss caused by third-party service providers (hosting, DNS, payment gateways, etc.).</li>
          <li>Any loss or damage arising from the Client&apos;s failure to comply with Kyfaru&apos;s written recommendations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'client-caused-losses',
    title: 'Client-Caused Losses',
    content: (
      <>
        <p className="mb-3">
          Kyfaru bears zero liability for system problems, data loss, security incidents, or
          service failures caused by any of the following:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Client actions or decisions regarding the operation or configuration of the system.</li>
          <li>Failure by the Client or its staff to implement Kyfaru&apos;s written security recommendations.</li>
          <li>Sharing, mishandling, or losing access credentials.</li>
          <li>Unauthorised modifications to the system by the Client or any third party engaged by the Client.</li>
          <li>Failure to renew hosting subscriptions, domain registrations, or third-party service plans in a timely manner.</li>
          <li>Outages or failures attributable to third-party service providers beyond Kyfaru&apos;s control.</li>
        </ul>
        <p className="mt-3 text-sm italic text-ky-faint">
          The Client agrees to indemnify and hold Kyfaru harmless from any claims, costs, or damages
          arising from the Client&apos;s misuse or mismanagement of the delivered system.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    content: (
      <ol className="list-decimal pl-6 flex flex-col gap-3">
        <li>
          Many systems built by Kyfaru integrate third-party services such as payment gateways,
          SMS platforms, email providers, cloud hosting, and mapping services. These services are
          subject to their own terms, pricing, and availability, which are outside Kyfaru&apos;s control.
        </li>
        <li>
          Kyfaru will recommend suitable third-party services but is not responsible for their
          continued availability, pricing changes, or compliance changes after project delivery.
        </li>
        <li>
          Any third-party service costs (subscriptions, API fees, transactional charges) are the
          Client&apos;s responsibility unless explicitly included in the SOW.
        </li>
      </ol>
    ),
  },
  {
    id: 'traffic-and-infrastructure',
    title: 'Traffic and Infrastructure',
    content: (
      <ol className="list-decimal pl-6 flex flex-col gap-3">
        <li>
          Kyfaru designs and provisions infrastructure based on expected traffic and usage
          projections documented in the SOW. Performance is guaranteed only within those
          documented parameters.
        </li>
        <li>
          In the event of unexpected traffic spikes or scaling requirements beyond the original
          specification, Kyfaru will provide a written quote for infrastructure upgrades. Emergency
          scaling may be performed with Client authorisation and will be invoiced accordingly.
        </li>
        <li>
          Kyfaru is not liable for performance degradation caused by traffic volumes that
          materially exceed agreed projections, unless the Client has engaged Kyfaru to plan
          for such volumes.
        </li>
      </ol>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    content: (
      <>
        <p className="font-display font-semibold text-ky-ivory mb-3">Termination by Kyfaru:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-5">
          <li>With 60 days written notice for termination for convenience.</li>
          <li>
            Immediately upon the Client&apos;s failure to pay any invoice within 14 days of the
            due date, following a written overdue notice.
          </li>
          <li>
            Immediately upon a material breach of this Agreement by the Client that remains
            uncured for 30 days following written notice of the breach.
          </li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-3">Termination by Client:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-5">
          <li>
            With 30 days written notice, subject to the forfeit and payment terms set out in
            Kyfaru&apos;s Refund &amp; Payment Policy.
          </li>
        </ul>
        <p className="font-display font-semibold text-ky-ivory mb-3">On Termination:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>All confidential information must be returned or securely destroyed by each party.</li>
          <li>The Client must pay all amounts due for work completed up to the effective termination date.</li>
          <li>Intellectual property transfers to the Client only upon full settlement of all outstanding amounts.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'dispute-resolution',
    title: 'Dispute Resolution',
    content: (
      <>
        <p className="mb-4">
          The parties agree to resolve any dispute arising under this Agreement through the following
          escalating process:
        </p>
        <div className="flex flex-col gap-4">
          {[
            {
              step: '01',
              label: 'Good Faith Negotiation',
              detail: 'The parties shall first attempt to resolve the dispute through direct, good-faith negotiation within 14 days of the dispute arising.',
            },
            {
              step: '02',
              label: 'Mediation',
              detail: 'If negotiation fails, the dispute shall be referred to mediation in Nairobi, Kenya. Mediation costs shall be shared equally between the parties.',
            },
            {
              step: '03',
              label: 'Arbitration',
              detail: 'If mediation fails, the dispute shall be finally resolved by binding arbitration under the Arbitration Act, Cap. 49 of the Laws of Kenya. Seat: Nairobi. Language: English. One (1) arbitrator agreed upon by the parties, or appointed by the Chairman of the Chartered Institute of Arbitrators, Kenya Branch.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 bg-ky-surface border border-ky-border ky-rounded">
              <span className="text-[11px] font-display font-bold text-ky-green-hi tracking-wider shrink-0 mt-0.5">{item.step}</span>
              <div>
                <p className="font-display font-semibold text-ky-ivory mb-1">{item.label}</p>
                <p className="text-sm font-inter text-ky-muted leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ky-muted">
          Nothing in this clause prevents either party from seeking urgent injunctive or other
          interim relief from a court of competent jurisdiction in Kenya at any time.
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
          This Agreement is governed by and construed in accordance with the laws of the Republic
          of Kenya, including the Law of Contract Act, Cap. 23.
        </p>
        <p>
          Subject to the dispute resolution procedure set out above, both parties irrevocably
          submit to the jurisdiction of the courts of Kenya for matters that require judicial
          determination.
        </p>
      </>
    ),
  },
]

export default function ServiceAgreementPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Service Agreement"
        labelIcon="ph:file-text-bold"
        headline={{
          lead: 'Service',
          accent: 'Agreement',
          tail: '.',
        }}
        subtitle="The complete terms governing Kyfaru's software development services — scope, IP, payments, and obligations of both parties."
      />
      <LegalPageLayout
        sections={SECTIONS}
        lastUpdated="1 January 2025"
        version="1.0"
        breadcrumb={[
          { label: 'Terms', href: '/terms' },
          { label: 'Service Agreement' },
        ]}
        showFooterCta
      />
      <Footer />
    </div>
  )
}
