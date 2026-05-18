// ============================================================
// INDUSTRIES DATA
// The sectors Kyfaru builds for.
// Add a new industry by copying an entry and updating it.
// ============================================================

import type { Industry } from '@/types'

/** Industries and sectors Kyfaru builds for */
export const industries: Industry[] = [
  { id: 'education',  title: 'Education & Schools',  icon: 'heroicons:academic-cap',     description: 'School systems, learning platforms, and institution management' },
  { id: 'government', title: 'Government & Public',  icon: 'heroicons:building-library', description: 'Digital services, citizen portals, and public-sector systems' },
  { id: 'sme',        title: 'SMEs & Startups',      icon: 'heroicons:rocket-launch',    description: 'Full digital setup for growing businesses ready to scale' },
  { id: 'healthcare', title: 'Healthcare',           icon: 'heroicons:heart',            description: 'Patient management, clinic tools, and health-tech platforms' },
  { id: 'fintech',    title: 'Fintech & Payments',   icon: 'heroicons:banknotes',        description: 'Payment systems, USSD solutions, and financial tools' },
  { id: 'ngo',        title: 'NGOs & Social Impact', icon: 'heroicons:globe-americas',   description: 'Reporting systems, beneficiary management, and impact tools' },
  { id: 'realestate', title: 'Real Estate',          icon: 'heroicons:home',             description: 'Property listings, CRM systems, and client portals' },
  { id: 'retail',     title: 'Retail & E-Commerce',  icon: 'heroicons:shopping-bag',     description: 'Online stores, inventory management, and order systems' },
]
