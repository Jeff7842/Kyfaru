// ============================================================
// CASE STUDIES — PLACEHOLDER DATA
// Add a real case study by copying an entry and updating values.
// industry must match an Industry.id from industries.ts.
// ============================================================

import type { CaseStudy } from '@/types'

/** All case studies shown on /case-studies */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'nairobi-day-school',
    clientName: 'Nairobi Day School',
    title: 'A Complete School Management System in Six Weeks',
    industry: 'education',
    duration: '6 weeks',
    challenge:
      'Nairobi Day School relied on spreadsheets and paper records to manage 1,400 students across enrollment, fees, attendance, and reports. Errors were frequent and parents had no real-time visibility.',
    solution:
      'Kyfaru designed and built a custom school management platform — student records, fee tracking, attendance, performance dashboards, and parent portals — deployed in under six weeks with full staff training.',
    results: [
      '98% reduction in fee-tracking errors',
      'Real-time parent visibility into student progress',
      '4 hours per week saved per administrator',
      '100% staff adoption within the first 30 days',
    ],
  },
  {
    slug: 'kisumu-fintech-ussd',
    clientName: 'Kisumu Fintech Startup',
    title: 'A USSD Payment Gateway That Reached 10,000 Rural Users in 30 Days',
    industry: 'fintech',
    duration: '8 weeks',
    challenge:
      'A Kisumu-based fintech startup wanted to extend their service to rural customers — most of whom did not own smartphones or have reliable data access.',
    solution:
      'Kyfaru built a USSD payment gateway integrated with M-Pesa, allowing any feature-phone user to send, receive, and store funds without internet — coupled with an admin dashboard for the operations team.',
    results: [
      '10,000+ rural users onboarded in the first month',
      '320% increase in transaction volume',
      'Zero downtime since launch',
      'Profitable from month two of operation',
    ],
  },
]

/**
 * Returns all case studies.
 */
export function getAllCaseStudies(): CaseStudy[] {
  try {
    return caseStudies
  } catch (error) {
    console.error('[getAllCaseStudies] Error:', error)
    return []
  }
}

/**
 * Looks up one case study by slug.
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  try {
    return caseStudies.find((cs) => cs.slug === slug)
  } catch (error) {
    console.error('[getCaseStudyBySlug] Error:', error)
    return undefined
  }
}
