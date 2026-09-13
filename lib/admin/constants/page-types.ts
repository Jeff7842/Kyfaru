// Common website page types for the project Pages planner.
export const PAGE_TYPES = [
  'Home',
  'Shop',
  'Product Detail',
  'Cart',
  'Checkout',
  'About',
  'Contact',
  'Account/Dashboard',
  'Blog',
  'Blog Post',
  'FAQ',
  'Terms & Privacy',
  'Custom',
] as const

export const PAGE_TYPE_OPTIONS = PAGE_TYPES.map((t) => ({ value: t, label: t }))
