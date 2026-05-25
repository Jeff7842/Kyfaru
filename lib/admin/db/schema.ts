// ============================================================
// KYFARU ADMIN — Drizzle schema (NeonDB / PostgreSQL)
// Single source of truth for every dashboard table.
// Mirrors KYFARU_DASHBOARD_SPEC.md §5.
// ============================================================

import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  uuid,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { AdapterAccountType } from 'next-auth/adapters'

// ────────────────────────────────────────────────────────────
// ENUMS
// ────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'admin',
  'manager',
  'viewer',
  'communications',
  'tech',
  'finance',
  'sales',
])

export const projectStatusEnum = pgEnum('project_status', [
  'lead',
  'proposal_sent',
  'signed',
  'in_progress',
  'review',
  'completed',
  'on_hold',
  'cancelled',
])

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
])

export const communicationChannelEnum = pgEnum('communication_channel', [
  'email',
  'whatsapp',
  'sms',
])

export const notificationTypeEnum = pgEnum('notification_type', [
  'payment_due',
  'payment_overdue',
  'project_update',
  'meeting_reminder',
  'report_ready',
  'contract_signed',
  'support_expiry',
  'system',
])

// ────────────────────────────────────────────────────────────
// USERS (Kyfaru team members) — used by Auth.js too
// ────────────────────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    name: text('name').notNull(),
    passwordHash: text('password_hash'),
    role: userRoleEnum('role').notNull().default('viewer'),
    image: text('image'), // for Auth.js
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').notNull().default(true),
    isTwoFactorEnabled: boolean('is_two_factor_enabled').notNull().default(false),
    twoFactorChannel: communicationChannelEnum('two_factor_channel').default('email'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastLoginAt: timestamp('last_login_at'),
    invitedById: uuid('invited_by_id'),
    accessType: text('access_type').notNull().default('permanent'),
    accessFrom: timestamp('access_from'),
    accessUntil: timestamp('access_until'),
    isFrozen: boolean('is_frozen').notNull().default(false),
    githubAccessToken: text('github_access_token'),
    githubTokenExpiry: timestamp('github_token_expiry'),
    githubLogin: text('github_login'),
  },
  (t) => [index('users_email_idx').on(t.email)],
)

// Auth.js adapter tables (accounts, sessions, verification_tokens)
export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
)

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
)

// ────────────────────────────────────────────────────────────
// OTP CODES (Two-Factor)
// ────────────────────────────────────────────────────────────

export const otpCodes = pgTable(
  'otp_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    code: text('code').notNull(), // bcrypt-hashed
    channel: communicationChannelEnum('channel').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('otp_user_idx').on(t.userId)],
)

// ────────────────────────────────────────────────────────────
// LOGIN ATTEMPTS (rate limiting)
// ────────────────────────────────────────────────────────────

export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    ipAddress: text('ip_address').notNull(),
    success: boolean('success').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('login_attempts_email_idx').on(t.email),
    index('login_attempts_ip_idx').on(t.ipAddress),
    index('login_attempts_created_idx').on(t.createdAt),
  ],
)

// ────────────────────────────────────────────────────────────
// CLIENTS
// ────────────────────────────────────────────────────────────

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    contactPerson: text('contact_person'),
    email: text('email').notNull(),
    phone: text('phone'),
    whatsappNumber: text('whatsapp_number'),
    industry: text('industry'),
    logoUrl: text('logo_url'),
    address: text('address'),
    kraPin: text('kra_pin'),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdById: uuid('created_by_id').references(() => users.id),
  },
  (t) => [
    index('clients_email_idx').on(t.email),
    index('clients_name_idx').on(t.name),
  ],
)

// ────────────────────────────────────────────────────────────
// PROJECTS
// ────────────────────────────────────────────────────────────

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectCode: text('project_code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    clientId: uuid('client_id')
      .references(() => clients.id)
      .notNull(),
    assignedToId: uuid('assigned_to_id').references(() => users.id),
    status: projectStatusEnum('status').notNull().default('lead'),
    startDate: timestamp('start_date'),
    expectedEndDate: timestamp('expected_end_date'),
    actualEndDate: timestamp('actual_end_date'),
    goLiveDate: timestamp('go_live_date'),
    supportExpiryDate: timestamp('support_expiry_date'),
    quotedAmount: decimal('quoted_amount', { precision: 12, scale: 2 }),
    currency: text('currency').notNull().default('KES'),
    scopeDocument: jsonb('scope_document'),
    techStack: text('tech_stack').array(),
    termsVersion: text('terms_version').default('v1.0'),
    contractSignedAt: timestamp('contract_signed_at'),
    contractSignedBy: text('contract_signed_by'),
    coverImageUrl: text('cover_image_url'),
    tags: text('tags').array(),
    notes: text('notes'),
    progress: integer('progress').notNull().default(0), // 0..100
    githubRepoUrl: text('github_repo_url'),
    githubRepoOwner: text('github_repo_owner'),
    githubRepoName: text('github_repo_name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdById: uuid('created_by_id').references(() => users.id),
  },
  (t) => [
    index('projects_client_idx').on(t.clientId),
    index('projects_status_idx').on(t.status),
    index('projects_code_idx').on(t.projectCode),
  ],
)

// ────────────────────────────────────────────────────────────
// PROJECT MILESTONES (40 / 30 / 30 payment stages)
// ────────────────────────────────────────────────────────────

export const projectMilestones = pgTable(
  'project_milestones',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    percentage: integer('percentage').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    dueDate: timestamp('due_date'),
    paidAt: timestamp('paid_at'),
    notes: text('notes'),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('milestones_project_idx').on(t.projectId)],
)

// ────────────────────────────────────────────────────────────
// INVOICES
// ────────────────────────────────────────────────────────────

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    invoiceNumber: text('invoice_number').notNull().unique(),
    projectId: uuid('project_id')
      .references(() => projects.id)
      .notNull(),
    clientId: uuid('client_id')
      .references(() => clients.id)
      .notNull(),
    milestoneId: uuid('milestone_id').references(() => projectMilestones.id),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('KES'),
    vatAmount: decimal('vat_amount', { precision: 12, scale: 2 }).default('0'),
    status: invoiceStatusEnum('status').notNull().default('draft'),
    issuedAt: timestamp('issued_at'),
    dueDate: timestamp('due_date').notNull(),
    paidAt: timestamp('paid_at'),
    paymentMethod: text('payment_method'),
    paymentReference: text('payment_reference'),
    lineItems: jsonb('line_items').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdById: uuid('created_by_id').references(() => users.id),
  },
  (t) => [
    index('invoices_project_idx').on(t.projectId),
    index('invoices_client_idx').on(t.clientId),
    index('invoices_status_idx').on(t.status),
    index('invoices_due_date_idx').on(t.dueDate),
  ],
)

// ────────────────────────────────────────────────────────────
// EXPENSES
// ────────────────────────────────────────────────────────────

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('KES'),
  paidAt: timestamp('paid_at'),
  receiptUrl: text('receipt_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
})

// ────────────────────────────────────────────────────────────
// CALENDAR EVENTS
// ────────────────────────────────────────────────────────────

export const calendarEvents = pgTable(
  'calendar_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    eventType: text('event_type').notNull(),
    startAt: timestamp('start_at').notNull(),
    endAt: timestamp('end_at'),
    isAllDay: boolean('is_all_day').default(false),
    projectId: uuid('project_id').references(() => projects.id),
    clientId: uuid('client_id').references(() => clients.id),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    meetingLink: text('meeting_link'),
    location: text('location'),
    attendeeEmails: text('attendee_emails').array(),
    isRecurring: boolean('is_recurring').default(false),
    recurrenceRule: text('recurrence_rule'),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    createdById: uuid('created_by_id').references(() => users.id),
  },
  (t) => [
    index('events_start_at_idx').on(t.startAt),
    index('events_project_idx').on(t.projectId),
  ],
)

// ────────────────────────────────────────────────────────────
// NOTIFICATIONS (in-app)
// ────────────────────────────────────────────────────────────

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    readAt: timestamp('read_at'),
    projectId: uuid('project_id').references(() => projects.id),
    clientId: uuid('client_id').references(() => clients.id),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    actionUrl: text('action_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('notifications_user_idx').on(t.userId),
    index('notifications_read_idx').on(t.isRead),
  ],
)

// ────────────────────────────────────────────────────────────
// COMMUNICATION LOGS
// ────────────────────────────────────────────────────────────

export const communicationLogs = pgTable(
  'communication_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    channel: communicationChannelEnum('channel').notNull(),
    direction: text('direction').notNull().default('outbound'), // outbound | inbound
    toAddress: text('to_address').notNull(),
    fromAddress: text('from_address'),
    subject: text('subject'),
    body: text('body').notNull(),
    status: text('status').notNull(), // sent | failed | delivered | stub_sent | received
    externalId: text('external_id'),
    error: text('error'),
    projectId: uuid('project_id').references(() => projects.id),
    clientId: uuid('client_id').references(() => clients.id),
    sentById: uuid('sent_by_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('comms_client_idx').on(t.clientId),
    index('comms_channel_idx').on(t.channel),
  ],
)

// ────────────────────────────────────────────────────────────
// AUDIT LOGS
// ────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: uuid('entity_id'),
    before: jsonb('before'),
    after: jsonb('after'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('audit_user_idx').on(t.userId),
    index('audit_entity_idx').on(t.entityType, t.entityId),
    index('audit_created_at_idx').on(t.createdAt),
  ],
)

// ────────────────────────────────────────────────────────────
// PROJECT FILES
// ────────────────────────────────────────────────────────────

export const projectFiles = pgTable('project_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  size: integer('size'),
  uploadedById: uuid('uploaded_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ────────────────────────────────────────────────────────────
// MESSAGE TEMPLATES
// ────────────────────────────────────────────────────────────

export const messageTemplates = pgTable('message_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  channel: communicationChannelEnum('channel').notNull(),
  subject: text('subject'),
  body: text('body').notNull(),
  variables: text('variables').array(), // e.g. ['client_name', 'invoice_number']
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
})

// ────────────────────────────────────────────────────────────
// EXPORT TYPES
// ────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
export type Expense = typeof expenses.$inferSelect
export type NewExpense = typeof expenses.$inferInsert
export type CalendarEvent = typeof calendarEvents.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type CommunicationLog = typeof communicationLogs.$inferSelect
export type AuditLog = typeof auditLogs.$inferSelect
export type ProjectMilestone = typeof projectMilestones.$inferSelect
export type ProjectFile = typeof projectFiles.$inferSelect
export type MessageTemplate = typeof messageTemplates.$inferSelect

// ────────────────────────────────────────────────────────────
// RELATIONS  (required for db.query … with: { … })
// ────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  otpCodes: many(otpCodes),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
  communicationLogs: many(communicationLogs, { relationName: 'commsLogSentBy' }),
  createdClients: many(clients, { relationName: 'clientCreatedBy' }),
  createdProjects: many(projects, { relationName: 'projectCreatedBy' }),
  assignedProjects: many(projects, { relationName: 'projectAssignedTo' }),
  createdInvoices: many(invoices, { relationName: 'invoiceCreatedBy' }),
  createdExpenses: many(expenses, { relationName: 'expenseCreatedBy' }),
  projectFiles: many(projectFiles, { relationName: 'projectFileUploadedBy' }),
  messageTemplates: many(messageTemplates, { relationName: 'messageTemplateCreatedBy' }),
  calendarEvents: many(calendarEvents, { relationName: 'calendarEventCreatedBy' }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const otpCodesRelations = relations(otpCodes, ({ one }) => ({
  user: one(users, { fields: [otpCodes.userId], references: [users.id] }),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [clients.createdById],
    references: [users.id],
    relationName: 'clientCreatedBy',
  }),
  projects: many(projects),
  invoices: many(invoices),
  notifications: many(notifications),
  communicationLogs: many(communicationLogs),
  calendarEvents: many(calendarEvents),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  assignedTo: one(users, {
    fields: [projects.assignedToId],
    references: [users.id],
    relationName: 'projectAssignedTo',
  }),
  createdBy: one(users, {
    fields: [projects.createdById],
    references: [users.id],
    relationName: 'projectCreatedBy',
  }),
  milestones: many(projectMilestones),
  invoices: many(invoices),
  expenses: many(expenses),
  files: many(projectFiles),
  calendarEvents: many(calendarEvents),
  notifications: many(notifications),
  communicationLogs: many(communicationLogs),
}))

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  project: one(projects, { fields: [projectMilestones.projectId], references: [projects.id] }),
}))

export const invoicesRelations = relations(invoices, ({ one }) => ({
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  milestone: one(projectMilestones, { fields: [invoices.milestoneId], references: [projectMilestones.id] }),
  createdBy: one(users, {
    fields: [invoices.createdById],
    references: [users.id],
    relationName: 'invoiceCreatedBy',
  }),
}))

export const expensesRelations = relations(expenses, ({ one }) => ({
  project: one(projects, { fields: [expenses.projectId], references: [projects.id] }),
  createdBy: one(users, {
    fields: [expenses.createdById],
    references: [users.id],
    relationName: 'expenseCreatedBy',
  }),
}))

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  project: one(projects, { fields: [calendarEvents.projectId], references: [projects.id] }),
  client: one(clients, { fields: [calendarEvents.clientId], references: [clients.id] }),
  invoice: one(invoices, { fields: [calendarEvents.invoiceId], references: [invoices.id] }),
  createdBy: one(users, {
    fields: [calendarEvents.createdById],
    references: [users.id],
    relationName: 'calendarEventCreatedBy',
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  project: one(projects, { fields: [notifications.projectId], references: [projects.id] }),
  client: one(clients, { fields: [notifications.clientId], references: [clients.id] }),
  invoice: one(invoices, { fields: [notifications.invoiceId], references: [invoices.id] }),
}))

export const communicationLogsRelations = relations(communicationLogs, ({ one }) => ({
  project: one(projects, { fields: [communicationLogs.projectId], references: [projects.id] }),
  client: one(clients, { fields: [communicationLogs.clientId], references: [clients.id] }),
  sentBy: one(users, {
    fields: [communicationLogs.sentById],
    references: [users.id],
    relationName: 'commsLogSentBy',
  }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}))

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, { fields: [projectFiles.projectId], references: [projects.id] }),
  uploadedBy: one(users, {
    fields: [projectFiles.uploadedById],
    references: [users.id],
    relationName: 'projectFileUploadedBy',
  }),
}))

export const messageTemplatesRelations = relations(messageTemplates, ({ one }) => ({
  createdBy: one(users, {
    fields: [messageTemplates.createdById],
    references: [users.id],
    relationName: 'messageTemplateCreatedBy',
  }),
}))
