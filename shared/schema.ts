import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseId: text("firebase_id").notNull().unique(),
  appTokenBalance: integer("app_token_balance").default(0), // Universal Credit System
  freeScanUsed: integer("free_scan_used").default(0), // Legacy
  freeInjuryScanUsed: integer("free_injury_scan_used").default(0), // Legacy
  vetChatCredits: integer("vet_chat_credits").default(2), // Legacy
  createdAt: timestamp("created_at").defaultNow(),
});

// Pets table with training-related fields
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  gender: text("gender"),
  imageUrl: text("image_url"),
  imageGallery: text("image_gallery").array(),
  careRecommendations: text("care_recommendations").array(),
  weight: text("weight"),
  size: text("size"),
  lifespan: text("lifespan"),
  vetCareFrequency: text("vet_care_frequency"),
  vetCareDetails: text("vet_care_details").array(),
  groomingSchedule: text("grooming_schedule"),
  groomingDetails: text("grooming_details").array(),
  groomingVideos: text("grooming_videos").array(),
  dietType: text("diet_type"),
  foodRecommendations: text("food_recommendations").array(),
  feedingSchedule: text("feeding_schedule"),
  portionSize: text("portion_size"),
  nutritionalNeeds: text("nutritional_needs").array(),
  foodRestrictions: text("food_restrictions").array(),
  treatRecommendations: text("treat_recommendations").array(),
  currentMood: text("current_mood"),
  moodDescription: text("mood_description"),
  moodRecommendations: text("mood_recommendations").array(),
  lastMoodUpdate: timestamp("last_mood_update").defaultNow(),
  trainingLevel: text("training_level"),
  exerciseNeeds: text("exercise_needs"),
  exerciseSchedule: text("exercise_schedule"),
  exerciseDuration: text("exercise_duration"),
  trainingDetails: text("training_details").array(),
  trainingVideos: text("training_videos").array(),
  trainingSchedule: text("training_schedule"),
  exerciseType: text("exercise_type"),
  trainingProgress: text("training_progress"),
  vaccinationRecords: text("vaccination_records").array(),
  vaccinationSchedule: text("vaccination_schedule"),
  nextVaccinationDue: timestamp("next_vaccination_due"),
  vaccinationNotes: text("vaccination_notes"),
  age: text("age"),
  nutritionAnalysis: jsonb("nutrition_analysis"),
  lastInjuryAnalysis: jsonb("last_injury_analysis"),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  completed: integer("completed").default(0),
  recurring: text("recurring"),
  dueTime: text("due_time"),
});

export const vetConsultations = pgTable("vet_consultations", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  reason: text("reason"),
  status: text("status").notNull().default('scheduled'),
  vetNotes: text("vet_notes"),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groomingAppointments = pgTable("grooming_appointments", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  serviceType: text("service_type").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default('scheduled'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add training appointments table
export const trainingAppointments = pgTable("training_appointments", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  trainingType: text("training_type").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default('scheduled'),
  progress: text("progress"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet insurance policies table
export const insurancePolicies = pgTable("insurance_policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id),
  providerName: text("provider_name").notNull(),
  policyNumber: text("policy_number"),
  planType: text("plan_type").notNull(),
  monthlyPremium: integer("monthly_premium").notNull(),
  annualDeductible: integer("annual_deductible").notNull(),
  reimbursementRate: integer("reimbursement_rate").notNull(),
  annualLimit: integer("annual_limit"),
  coverageDetails: text("coverage_details").array(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insurance claims table
export const insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").references(() => insurancePolicies.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  claimDate: timestamp("claim_date").notNull(),
  amount: integer("amount").notNull(),
  reimbursedAmount: integer("reimbursed_amount"),
  description: text("description"),
  category: text("category").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet expenses table
export const petExpenses = pgTable("pet_expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id),
  category: text("category").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  vendor: text("vendor"),
  expenseDate: timestamp("expense_date").notNull(),
  isRecurring: integer("is_recurring").default(0),
  recurringFrequency: text("recurring_frequency"),
  receiptUrl: text("receipt_url"),
  receiptOcr: jsonb("receipt_ocr"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const petsRelations = relations(pets, ({ one, many }) => ({
  user: one(users, {
    fields: [pets.userId],
    references: [users.id],
  }),
  reminders: many(reminders),
  vetConsultations: many(vetConsultations),
  groomingAppointments: many(groomingAppointments),
  trainingAppointments: many(trainingAppointments),
}));

export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  reminders: many(reminders),
  vetConsultations: many(vetConsultations),
  groomingAppointments: many(groomingAppointments),
  trainingAppointments: many(trainingAppointments),
  insurancePolicies: many(insurancePolicies),
  insuranceClaims: many(insuranceClaims),
  petExpenses: many(petExpenses),
  standaloneScans: many(standaloneScans),
  standaloneVetChats: many(standaloneVetChats),
}));

export const insurancePoliciesRelations = relations(insurancePolicies, ({ one, many }) => ({
  user: one(users, {
    fields: [insurancePolicies.userId],
    references: [users.id],
  }),
  pet: one(pets, {
    fields: [insurancePolicies.petId],
    references: [pets.id],
  }),
  claims: many(insuranceClaims),
}));

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  policy: one(insurancePolicies, {
    fields: [insuranceClaims.policyId],
    references: [insurancePolicies.id],
  }),
  user: one(users, {
    fields: [insuranceClaims.userId],
    references: [users.id],
  }),
}));

export const petExpensesRelations = relations(petExpenses, ({ one }) => ({
  user: one(users, {
    fields: [petExpenses.userId],
    references: [users.id],
  }),
  pet: one(pets, {
    fields: [petExpenses.petId],
    references: [pets.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  pet: one(pets, {
    fields: [reminders.petId],
    references: [pets.id],
  }),
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));

export const vetConsultationsRelations = relations(vetConsultations, ({ one }) => ({
  pet: one(pets, {
    fields: [vetConsultations.petId],
    references: [pets.id],
  }),
  user: one(users, {
    fields: [vetConsultations.userId],
    references: [users.id],
  }),
}));

export const groomingAppointmentsRelations = relations(groomingAppointments, ({ one }) => ({
  pet: one(pets, {
    fields: [groomingAppointments.petId],
    references: [pets.id],
  }),
  user: one(users, {
    fields: [groomingAppointments.userId],
    references: [users.id],
  }),
}));

export const trainingAppointmentsRelations = relations(trainingAppointments, ({ one }) => ({
  pet: one(pets, {
    fields: [trainingAppointments.petId],
    references: [pets.id],
  }),
  user: one(users, {
    fields: [trainingAppointments.userId],
    references: [users.id],
  }),
}));

// Schemas and Types
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPetSchema = createInsertSchema(pets, {
  careRecommendations: z.array(z.string()).optional().default([]),
  vetCareDetails: z.array(z.string()).optional().default([]),
  groomingDetails: z.array(z.string()).optional().default([]),
  groomingVideos: z.array(z.string()).optional().default([]),
  foodRecommendations: z.array(z.string()).optional().default([]),
  nutritionalNeeds: z.array(z.string()).optional().default([]),
  foodRestrictions: z.array(z.string()).optional().default([]),
  treatRecommendations: z.array(z.string()).optional().default([]),
  moodRecommendations: z.array(z.string()).optional().default([]),
  imageGallery: z.array(z.string()).optional().default([]),
  vaccinationRecords: z.array(z.string()).optional().default([])
}).omit({ id: true }).extend({
  gender: z.string().nullable().optional(),
  age: z.string().nullable().optional()
});

export const insertReminderSchema = createInsertSchema(reminders)
  .omit({ id: true })
  .extend({
    dueDate: z.string().transform((str) => new Date(str)),
    dueTime: z.string().optional(),
    recurring: z.enum(["daily", "weekly", "monthly"]).optional(),
  });

export const insertVetConsultationSchema = createInsertSchema(vetConsultations)
  .omit({ id: true, createdAt: true })
  .extend({
    scheduledDate: z.string().transform((str) => new Date(str)),
    status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
    followUpDate: z.string().transform((str) => new Date(str)).optional(),
  });

export const analyzeImageResponseSchema = z.object({
  species: z.string(),
  breed: z.string().nullable(),
  gender: z.string().nullable(),
  description: z.string(),
  weight: z.string().nullable(),
  size: z.string().nullable(),
  lifespan: z.string(),
  vetCareFrequency: z.string(),
  vetCareDetails: z.array(z.string()),
  groomingSchedule: z.string(),
  groomingDetails: z.array(z.string()),
  groomingVideos: z.array(z.object({
    url: z.string(),
    title: z.string()
  })),
  careRecommendations: z.array(z.string()),
  dietType: z.string(),
  foodRecommendations: z.array(z.string()),
  feedingSchedule: z.string(),
  portionSize: z.string(),
  nutritionalNeeds: z.array(z.string()),
  foodRestrictions: z.array(z.string()),
  treatRecommendations: z.array(z.string()),
  currentMood: z.string(),
  moodDescription: z.string(),
  moodRecommendations: z.array(z.string()),
  trainingLevel: z.string(),
  exerciseNeeds: z.string(),
  exerciseSchedule: z.string(),
  exerciseDuration: z.string(),
  trainingDetails: z.array(z.string()),
  trainingVideos: z.array(z.object({
    url: z.string(),
    title: z.string()
  })),
  trainingSchedule: z.string().nullable().optional(),
  exerciseType: z.string(),
  trainingProgress: z.string(),
});

export const insertGroomingAppointmentSchema = createInsertSchema(groomingAppointments)
  .omit({ id: true, createdAt: true })
  .extend({
    scheduledDate: z.string().transform((str) => new Date(str)),
    status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
    serviceType: z.enum(["full grooming", "nail trimming", "bath", "brushing"]),
  });

// Add schema for training appointments
export const insertTrainingAppointmentSchema = createInsertSchema(trainingAppointments)
  .omit({ id: true, createdAt: true })
  .extend({
    scheduledDate: z.string().transform((str) => new Date(str)),
    status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
    trainingType: z.enum(["basic obedience", "advanced tricks", "behavior correction", "agility training"]),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type VetConsultation = typeof vetConsultations.$inferSelect;
export type InsertVetConsultation = z.infer<typeof insertVetConsultationSchema>;
export type AnalyzeImageResponse = z.infer<typeof analyzeImageResponseSchema>;
export type GroomingAppointment = typeof groomingAppointments.$inferSelect;
export type InsertGroomingAppointment = z.infer<typeof insertGroomingAppointmentSchema>;
export type TrainingAppointment = typeof trainingAppointments.$inferSelect;
export type InsertTrainingAppointment = z.infer<typeof insertTrainingAppointmentSchema>;

// Insurance policy schemas and types
export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies, {
  coverageDetails: z.array(z.string()).optional().default([]),
})
  .omit({ id: true, createdAt: true })
  .extend({
    startDate: z.string().transform((str) => new Date(str)).optional(),
    endDate: z.string().transform((str) => new Date(str)).optional(),
  });

export const insertInsuranceClaimSchema = createInsertSchema(insuranceClaims)
  .omit({ id: true, createdAt: true })
  .extend({
    claimDate: z.string().transform((str) => new Date(str)),
    status: z.enum(["pending", "approved", "denied", "paid"]).default("pending"),
  });

export const insertPetExpenseSchema = createInsertSchema(petExpenses)
  .omit({ id: true, createdAt: true })
  .extend({
    expenseDate: z.string().transform((str) => new Date(str)),
    recurringFrequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
    receiptUrl: z.string().optional(),
    receiptOcr: z.object({
      amount: z.number().optional(),
      vendor: z.string().optional(),
      date: z.string().optional(),
      category: z.string().optional(),
      currency: z.string().optional(),
      rawText: z.string().optional(),
      confidence: z.number().optional(),
    }).optional(),
  });

export const petPortraits = pgTable("pet_portraits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id),
  originalImageUrl: text("original_image_url").notNull(),
  portraitImageUrl: text("portrait_image_url").notNull(),
  style: text("style").notNull(),
  status: text("status").notNull().default("completed"),
  paid: text("paid").default("false"),
  paymentType: text("payment_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const standaloneScans = pgTable("standalone_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petInfo: jsonb("pet_info").notNull(), // { species, breed, weight, age, gender }
  injuryPhotoUrl: text("injury_photo_url").notNull(),
  analysisResults: jsonb("analysis_results").notNull(),
  isPaid: integer("is_paid").default(0),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const standaloneVetChats = pgTable("standalone_vet_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petInfo: jsonb("pet_info").notNull(),
  chatHistory: jsonb("chat_history").notNull(), // Array of { role, content }
  questionsUsed: integer("questions_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const processedPayments = pgTable("processed_payments", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
});

export const insertPetPortraitSchema = createInsertSchema(petPortraits)
  .omit({ id: true, createdAt: true });

export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type InsertInsuranceClaim = z.infer<typeof insertInsuranceClaimSchema>;
export type PetExpense = typeof petExpenses.$inferSelect;
export type InsertPetExpense = z.infer<typeof insertPetExpenseSchema>;
export type PetPortrait = typeof petPortraits.$inferSelect;
export type InsertPetPortrait = z.infer<typeof insertPetPortraitSchema>;

export const insertStandaloneScanSchema = createInsertSchema(standaloneScans).omit({ id: true, createdAt: true });
export const insertStandaloneVetChatSchema = createInsertSchema(standaloneVetChats).omit({ id: true, createdAt: true });

export type StandaloneScan = typeof standaloneScans.$inferSelect;
export type StandaloneVetChat = typeof standaloneVetChats.$inferSelect;

// Token Transactions table
export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // 'usage', 'top_up'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), 
  status: text("status").notNull(), 
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({ id: true, createdAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });

export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;