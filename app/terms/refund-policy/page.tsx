// ============================================================
// REFUND & PAYMENT POLICY PAGE
// Payment schedule, forfeit amounts, cancellation terms.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'payment-schedule',
    title: 'Payment Schedule',
    content: (
      <>
        <p className="mb-5">
          Unless otherwise agreed in the Project Agreement, all Kyfaru projects follow a standard
          three-milestone payment structure:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-inter border-collapse">
            <thead>
              <tr className="border-b border-ky-border">
                <th className="text-left py-3 pr-4 text-ky-faint font-display text-xs tracking-wider uppercase">Milestone</th>
                <th className="text-left py-3 pr-4 text-ky-faint font-display text-xs tracking-wider uppercase">Amount</th>
                <th className="text-left py-3 text-ky-faint font-display text-xs tracking-wider uppercase">Due When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ky-border">
              {[
                { milestone: 'Milestone 1 — Deposit', amount: '40% of total', when: 'On signing of Project Agreement' },
                { milestone: 'Milestone 2 — Staging', amount: '30% of total', when: 'On Client approval of staging build' },
                { milestone: 'Milestone 3 — Final', amount: '30% of total', when: 'Before go-live / final delivery' },
              ].map((row) => (
                <tr key={row.milestone}>
                  <td className="py-3 pr-4 text-ky-ivory font-display font-semibold">{row.milestone}</td>
                  <td className="py-3 pr-4 text-ky-gold font-display font-bold">{row.amount}</td>
                  <td className="py-3 text-ky-muted">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded text-sm font-inter text-ky-muted">
          <strong className="text-ky-ivory">Important:</strong> Kyfaru does not begin any project work until Milestone 1 (the
          deposit) has been received in full.
        </div>
      </>
    ),
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods',
    content: (
      <>
        <p className="mb-4">Kyfaru accepts payment via the following methods:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { method: 'M-Pesa', detail: 'Paybill or Buy Goods (till number). Details provided on each invoice.' },
            { method: 'Bank Transfer', detail: 'Bank account details provided on each invoice.' },
          ].map((m) => (
            <div key={m.method} className="p-4 bg-ky-surface border border-ky-border ky-rounded">
              <p className="font-display font-semibold text-ky-ivory mb-1">{m.method}</p>
              <p className="text-sm font-inter text-ky-muted">{m.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-ky-muted">
          All invoices are due within <strong className="text-ky-ivory">7 days</strong> of the invoice date
          unless otherwise stated in the Project Agreement.
        </p>
      </>
    ),
  },
  {
    id: 'late-payment',
    title: 'Late Payment',
    content: (
      <>
        <div className="flex gap-4 bg-ky-gold/10 border border-ky-gold/30 border-l-4 border-l-ky-gold ky-rounded p-5 mb-4">
          <span className="text-2xl shrink-0">📅</span>
          <div>
            <p className="font-display font-semibold text-ky-ivory mb-1">Late Payment Interest</p>
            <p className="text-sm font-inter text-ky-muted">
              A charge of <strong className="text-ky-ivory">2% per calendar month</strong> applies to
              any outstanding balance not settled by the invoice due date. Interest is calculated
              from the due date to the actual date of payment.
            </p>
          </div>
        </div>
        <p className="text-sm text-ky-muted">
          Kyfaru reserves the right to pause or suspend all active project work on accounts with
          outstanding overdue invoices, without liability for resulting delays.
        </p>
      </>
    ),
  },
  {
    id: 'cancellation-and-forfeit',
    title: 'Cancellation and Forfeit',
    content: (
      <>
        <p className="mb-5">
          The following amounts are forfeited upon cancellation of a project, representing Kyfaru&apos;s
          genuine pre-estimate of losses including resource reallocation and lost opportunity costs:
        </p>
        <div className="flex flex-col gap-3 mb-5">
          {[
            {
              stage: 'After signing — before work begins',
              forfeit: '100% of Milestone 1 deposit',
              detail: 'The full deposit is non-refundable as it covers project setup, resource allocation, and planning costs.',
              severity: 'bg-ky-gold/10 border-ky-gold/40 border-l-ky-gold',
            },
            {
              stage: 'After work begins — before Milestone 2',
              forfeit: 'Milestone 1 deposit + 20% of remaining balance',
              detail: 'Reflects work completed to date plus resource reallocation costs.',
              severity: 'bg-orange-950/30 border-orange-800/40 border-l-orange-500',
            },
            {
              stage: 'After Milestone 2 payment — before go-live',
              forfeit: 'Full remaining project balance is due',
              detail: 'At this stage, the majority of work is complete. The full remaining balance becomes immediately payable.',
              severity: 'bg-red-950/30 border-red-800/40 border-l-red-500',
            },
          ].map((row) => (
            <div key={row.stage} className={`p-5 border border-l-4 ky-rounded ${row.severity}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <p className="font-display font-semibold text-ky-ivory text-sm">{row.stage}</p>
                <p className="font-display font-bold text-ky-gold text-sm shrink-0">{row.forfeit}</p>
              </div>
              <p className="text-sm font-inter text-ky-muted">{row.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-sm italic text-ky-faint">
          These amounts represent Kyfaru&apos;s genuine pre-estimate of loss including resource
          reallocation and lost opportunity costs. They are not penalties.
        </p>
      </>
    ),
  },
  {
    id: 'credential-handover-conditions',
    title: 'Credential Handover Conditions',
    content: (
      <>
        <div className="flex gap-4 bg-ky-gold/10 border border-ky-gold/40 border-l-4 border-l-ky-gold ky-rounded p-5 mb-5">
          <span className="text-2xl shrink-0">🔐</span>
          <div>
            <p className="font-display font-semibold text-ky-ivory mb-1">Credential Release Condition</p>
            <p className="text-sm font-inter text-ky-muted leading-relaxed">
              System credentials — including passwords, API keys, database access credentials, and
              domain logins — are released <strong className="text-ky-ivory">ONLY when all outstanding invoices and project
              fees are fully settled</strong>. No partial handover will be made.
            </p>
          </div>
        </div>
        <p className="font-display font-semibold text-ky-ivory mb-3">Upon full and final payment, the Client receives:</p>
        <div className="flex flex-col gap-2">
          {[
            'Source code repository access (GitHub / GitLab)',
            'Hosting account credentials',
            'Database access credentials',
            'Domain registrar login',
            'All API keys and third-party account credentials',
            'One (1) hour training session',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 bg-ky-surface border border-ky-border ky-rounded text-sm font-inter text-ky-muted">
              <span className="text-ky-green-hi text-base">✓</span>
              {item}
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'support-retainer-refund',
    title: 'Refund Policy for Support Retainer',
    content: (
      <>
        <p className="mb-4">The following terms apply to the Monthly Maintenance Retainer:</p>
        <ul className="list-disc pl-6 flex flex-col gap-3">
          <li>
            The monthly retainer fee is <strong className="text-ky-ivory">non-refundable</strong> once
            the calendar month has commenced, regardless of the volume of support activity in that month.
          </li>
          <li>
            The retainer may be cancelled with <strong className="text-ky-ivory">30 days written notice</strong>.
            The retainer remains active and payable during the notice period.
          </li>
          <li>
            No refund is issued for partial months. If cancellation takes effect mid-month, the
            full month&apos;s fee remains due.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'third-party-service-costs',
    title: 'Third-Party Service Costs',
    content: (
      <>
        <p className="mb-4">
          The following costs are not refundable by Kyfaru, as they are governed by third-party
          providers&apos; own refund policies:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
          <li>Domain registration and renewal fees.</li>
          <li>Hosting platform subscription costs.</li>
          <li>Payment gateway setup or integration fees.</li>
          <li>SMS platform credits or email service subscription credits.</li>
        </ul>
        <p className="text-sm text-ky-muted">
          Where Kyfaru has facilitated payment of third-party services on the Client&apos;s behalf,
          any refund requests must be made directly to the relevant service provider.
        </p>
      </>
    ),
  },
]

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />
      <PageHero
        label="Refund & Payment Policy"
        labelIcon="ph:currency-circle-dollar-bold"
        headline={{
          lead: 'Refund &',
          accent: 'Payment',
          tail: 'Policy.',
        }}
        subtitle="Payment milestones, forfeit amounts, late payment charges, cancellation consequences, and credential handover conditions."
      />
      <LegalPageLayout
        sections={SECTIONS}
        lastUpdated="1 January 2025"
        version="1.0"
        breadcrumb={[
          { label: 'Terms', href: '/terms' },
          { label: 'Refund & Payment Policy' },
        ]}
        showFooterCta
      />
      <Footer />
    </div>
  )
}
