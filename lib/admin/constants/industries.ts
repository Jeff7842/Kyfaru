// 20 common industries for the client form dropdown.
export const INDUSTRIES = [
  'Agriculture',
  'Automotive',
  'Construction & Real Estate',
  'Consulting',
  'E-commerce & Retail',
  'Education',
  'Energy & Utilities',
  'Fashion & Beauty',
  'Finance & Banking',
  'Food & Beverage',
  'Government & NGO',
  'Healthcare',
  'Hospitality & Tourism',
  'Legal',
  'Logistics & Transport',
  'Manufacturing',
  'Media & Entertainment',
  'Professional Services',
  'Technology & Software',
  'Telecommunications',
] as const

export const INDUSTRY_OPTIONS = INDUSTRIES.map((i) => ({ value: i, label: i }))
