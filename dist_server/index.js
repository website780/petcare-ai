var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
var __filename, __dirname, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
    vite_config_default = defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client", "src"),
          "@shared": path.resolve(__dirname, "shared")
        }
      },
      root: path.resolve(__dirname, "client"),
      build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true
      }
    });
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseId: text("firebase_id").notNull().unique(),
  appTokenBalance: integer("app_token_balance").default(0),
  // Universal Credit System
  freeScanUsed: integer("free_scan_used").default(0),
  // Legacy
  freeInjuryScanUsed: integer("free_injury_scan_used").default(0),
  // Legacy
  vetChatCredits: integer("vet_chat_credits").default(2),
  // Legacy
  createdAt: timestamp("created_at").defaultNow()
});
var pets = pgTable("pets", {
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
  lastInjuryAnalysis: jsonb("last_injury_analysis")
});
var reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  completed: integer("completed").default(0),
  recurring: text("recurring"),
  dueTime: text("due_time")
});
var vetConsultations = pgTable("vet_consultations", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  reason: text("reason"),
  status: text("status").notNull().default("scheduled"),
  vetNotes: text("vet_notes"),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var groomingAppointments = pgTable("grooming_appointments", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  serviceType: text("service_type").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow()
});
var trainingAppointments = pgTable("training_appointments", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  trainingType: text("training_type").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("scheduled"),
  progress: text("progress"),
  createdAt: timestamp("created_at").defaultNow()
});
var insurancePolicies = pgTable("insurance_policies", {
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
  createdAt: timestamp("created_at").defaultNow()
});
var insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").references(() => insurancePolicies.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  claimDate: timestamp("claim_date").notNull(),
  amount: integer("amount").notNull(),
  reimbursedAmount: integer("reimbursed_amount"),
  description: text("description"),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var petExpenses = pgTable("pet_expenses", {
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
  createdAt: timestamp("created_at").defaultNow()
});
var petsRelations = relations(pets, ({ one, many }) => ({
  user: one(users, {
    fields: [pets.userId],
    references: [users.id]
  }),
  reminders: many(reminders),
  vetConsultations: many(vetConsultations),
  groomingAppointments: many(groomingAppointments),
  trainingAppointments: many(trainingAppointments)
}));
var usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  reminders: many(reminders),
  vetConsultations: many(vetConsultations),
  groomingAppointments: many(groomingAppointments),
  trainingAppointments: many(trainingAppointments),
  insurancePolicies: many(insurancePolicies),
  insuranceClaims: many(insuranceClaims),
  petExpenses: many(petExpenses),
  standaloneScans: many(standaloneScans),
  standaloneVetChats: many(standaloneVetChats)
}));
var insurancePoliciesRelations = relations(insurancePolicies, ({ one, many }) => ({
  user: one(users, {
    fields: [insurancePolicies.userId],
    references: [users.id]
  }),
  pet: one(pets, {
    fields: [insurancePolicies.petId],
    references: [pets.id]
  }),
  claims: many(insuranceClaims)
}));
var insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  policy: one(insurancePolicies, {
    fields: [insuranceClaims.policyId],
    references: [insurancePolicies.id]
  }),
  user: one(users, {
    fields: [insuranceClaims.userId],
    references: [users.id]
  })
}));
var petExpensesRelations = relations(petExpenses, ({ one }) => ({
  user: one(users, {
    fields: [petExpenses.userId],
    references: [users.id]
  }),
  pet: one(pets, {
    fields: [petExpenses.petId],
    references: [pets.id]
  })
}));
var remindersRelations = relations(reminders, ({ one }) => ({
  pet: one(pets, {
    fields: [reminders.petId],
    references: [pets.id]
  }),
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id]
  })
}));
var vetConsultationsRelations = relations(vetConsultations, ({ one }) => ({
  pet: one(pets, {
    fields: [vetConsultations.petId],
    references: [pets.id]
  }),
  user: one(users, {
    fields: [vetConsultations.userId],
    references: [users.id]
  })
}));
var groomingAppointmentsRelations = relations(groomingAppointments, ({ one }) => ({
  pet: one(pets, {
    fields: [groomingAppointments.petId],
    references: [pets.id]
  }),
  user: one(users, {
    fields: [groomingAppointments.userId],
    references: [users.id]
  })
}));
var trainingAppointmentsRelations = relations(trainingAppointments, ({ one }) => ({
  pet: one(pets, {
    fields: [trainingAppointments.petId],
    references: [pets.id]
  }),
  user: one(users, {
    fields: [trainingAppointments.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({ id: true });
var insertPetSchema = createInsertSchema(pets, {
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
var insertReminderSchema = createInsertSchema(reminders).omit({ id: true }).extend({
  dueDate: z.string().transform((str) => new Date(str)),
  dueTime: z.string().optional(),
  recurring: z.enum(["daily", "weekly", "monthly"]).optional()
});
var insertVetConsultationSchema = createInsertSchema(vetConsultations).omit({ id: true, createdAt: true }).extend({
  scheduledDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  followUpDate: z.string().transform((str) => new Date(str)).optional()
});
var analyzeImageResponseSchema = z.object({
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
  trainingProgress: z.string()
});
var insertGroomingAppointmentSchema = createInsertSchema(groomingAppointments).omit({ id: true, createdAt: true }).extend({
  scheduledDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  serviceType: z.enum(["full grooming", "nail trimming", "bath", "brushing"])
});
var insertTrainingAppointmentSchema = createInsertSchema(trainingAppointments).omit({ id: true, createdAt: true }).extend({
  scheduledDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  trainingType: z.enum(["basic obedience", "advanced tricks", "behavior correction", "agility training"])
});
var insertInsurancePolicySchema = createInsertSchema(insurancePolicies, {
  coverageDetails: z.array(z.string()).optional().default([])
}).omit({ id: true, createdAt: true }).extend({
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().transform((str) => new Date(str)).optional()
});
var insertInsuranceClaimSchema = createInsertSchema(insuranceClaims).omit({ id: true, createdAt: true }).extend({
  claimDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["pending", "approved", "denied", "paid"]).default("pending")
});
var insertPetExpenseSchema = createInsertSchema(petExpenses).omit({ id: true, createdAt: true }).extend({
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
    confidence: z.number().optional()
  }).optional()
});
var petPortraits = pgTable("pet_portraits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id),
  originalImageUrl: text("original_image_url").notNull(),
  portraitImageUrl: text("portrait_image_url").notNull(),
  style: text("style").notNull(),
  status: text("status").notNull().default("completed"),
  paid: text("paid").default("false"),
  paymentType: text("payment_type"),
  createdAt: timestamp("created_at").defaultNow()
});
var standaloneScans = pgTable("standalone_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petInfo: jsonb("pet_info").notNull(),
  // { species, breed, weight, age, gender }
  injuryPhotoUrl: text("injury_photo_url").notNull(),
  analysisResults: jsonb("analysis_results").notNull(),
  isPaid: integer("is_paid").default(0),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var standaloneVetChats = pgTable("standalone_vet_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  petInfo: jsonb("pet_info").notNull(),
  chatHistory: jsonb("chat_history").notNull(),
  // Array of { role, content }
  questionsUsed: integer("questions_used").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var processedPayments = pgTable("processed_payments", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  processedAt: timestamp("processed_at").defaultNow()
});
var insertPetPortraitSchema = createInsertSchema(petPortraits).omit({ id: true, createdAt: true });
var insertStandaloneScanSchema = createInsertSchema(standaloneScans).omit({ id: true, createdAt: true });
var insertStandaloneVetChatSchema = createInsertSchema(standaloneVetChats).omit({ id: true, createdAt: true });
var tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  // 'usage', 'top_up'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({ id: true, createdAt: true });
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });

// server/storage.ts
import { eq, desc, sql } from "drizzle-orm";
import ws from "ws";
if (!global.WebSocket) {
  global.WebSocket = ws;
}
if (!process.env.DATABASE_URL) {
  console.log("WARNING: DATABASE_URL is not set. Database operations will fail.");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  connectionTimeoutMillis: 3e4
});
var db = drizzle(pool, { logger: true });
var PostgresStorage = class {
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getUserByFirebaseId(firebaseId) {
    const results = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return results[0];
  }
  async getUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    return user;
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async updateUser(id, updates) {
    const current = await this.getUser(id);
    if (!current) throw new Error(`User ${id} not found`);
    if (updates.email !== void 0) {
      await db.execute(sql`UPDATE users SET email = ${updates.email} WHERE id = ${id}`);
    }
    if (updates.displayName !== void 0) {
      await db.execute(sql`UPDATE users SET display_name = ${updates.displayName} WHERE id = ${id}`);
    }
    if (updates.photoURL !== void 0) {
      await db.execute(sql`UPDATE users SET photo_url = ${updates.photoURL} WHERE id = ${id}`);
    }
    const updated = await this.getUser(id);
    if (!updated) throw new Error(`User ${id} vanished after profile update!`);
    console.log(`[IRON-SYNC] User ${id} Profile Synced. State: SCAN:${updated.freeScanUsed}, INJURY:${updated.freeInjuryScanUsed}, VET:${updated.vetChatCredits}`);
    return updated;
  }
  // NUCLEAR credit update: Using db.execute(sql...) to be 100% sure NO OTHER columns are touched.
  async updateUserCredits(id, field, value) {
    const columnMap = {
      freeScanUsed: "free_scan_used",
      freeInjuryScanUsed: "free_injury_scan_used",
      vetChatCredits: "vet_chat_credits"
    };
    const columnName = columnMap[field];
    console.log(`[STORAGE-NUCLEAR] Atomic update user ${id}: ${columnName} = ${value}`);
    await db.execute(sql`UPDATE users SET ${sql.raw(columnName)} = ${value} WHERE id = ${id}`);
    const updated = await this.getUser(id);
    if (!updated) throw new Error(`User ${id} lost during nuclear update!`);
    const finalState = { ...updated, [field]: value };
    console.log(`[IRON-CREDIT] User ${id} updated ${field} to ${value}. Final State: SCAN:${finalState.freeScanUsed}, INJURE:${finalState.freeInjuryScanUsed}, VET:${finalState.vetChatCredits}`);
    return finalState;
  }
  async adjustUserTokens(id, amount, type, description) {
    console.log(`[TOKEN-ADJUST] Adjusting tokens for user ${id} by ${amount}`);
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const currentBalance = Number(user.appTokenBalance || 0);
    const newBalance = Math.max(0, currentBalance + amount);
    console.log(`[TOKEN-ADJUST] User ${id} Current: ${currentBalance}, Change: ${amount}, New: ${newBalance}`);
    await db.update(users).set({ appTokenBalance: newBalance }).where(eq(users.id, id));
    if (type && description) {
      await db.insert(tokenTransactions).values({
        userId: id,
        amount,
        type,
        description
      });
      console.log(`[TRANSACTION] Logged ${type} for user ${id}: ${description}`);
    }
    const updated = await this.getUser(id);
    if (!updated) throw new Error("User lost during token update");
    return { ...updated, appTokenBalance: newBalance };
  }
  async getTokenTransactions(userId) {
    return await db.select().from(tokenTransactions).where(eq(tokenTransactions.userId, userId)).orderBy(desc(tokenTransactions.createdAt));
  }
  async getLatestSubscription(userId) {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt)).limit(1);
    return sub;
  }
  async createSubscription(sub) {
    const [newSub] = await db.insert(subscriptions).values(sub).returning();
    return newSub;
  }
  async resetUserForTesting(userId) {
    console.log(`[RESET-STORAGE] Resetting user ${userId}`);
    const [updatedUser] = await db.update(users).set({ freeScanUsed: 0, freeInjuryScanUsed: 0, vetChatCredits: 2, appTokenBalance: 0 }).where(eq(users.id, userId)).returning();
    console.log(`[RESET-STORAGE] Updated: freeScanUsed=${updatedUser.freeScanUsed}, vetChatCredits=${updatedUser.vetChatCredits}`);
    console.log(`[RESET-STORAGE] Cleaning dependencies for user ${userId}`);
    const tablesToDelete = [
      reminders,
      vetConsultations,
      groomingAppointments,
      trainingAppointments,
      insuranceClaims,
      insurancePolicies,
      petExpenses,
      petPortraits,
      standaloneScans,
      standaloneVetChats,
      processedPayments,
      tokenTransactions,
      subscriptions,
      pets
      // Final delete
    ];
    for (const table of tablesToDelete) {
      try {
        await db.delete(table).where(eq(table.userId, userId));
      } catch (e) {
        console.warn(`[RESET] Skipping/Failed cleanup for table:`, e instanceof Error ? e.message : e);
        if (table === pets) throw e;
      }
    }
    console.log(`[RESET-STORAGE] Reset complete for user ${userId}`);
    return updatedUser;
  }
  async getPet(id) {
    const results = await db.select().from(pets).where(eq(pets.id, id));
    return results[0];
  }
  async getAllPets(userId) {
    return db.select().from(pets).where(eq(pets.userId, userId));
  }
  async createPet(insertPet) {
    try {
      const [pet] = await db.insert(pets).values(insertPet).returning();
      return pet;
    } catch (error) {
      console.error("[DATABASE-ERROR] Pet creation failed:", {
        message: error.message,
        stack: error.stack,
        insertData: insertPet
      });
      const fallbackPet = { ...insertPet };
      delete fallbackPet.age;
      const [pet] = await db.insert(pets).values(fallbackPet).returning();
      return pet;
    }
  }
  async updatePet(id, updates) {
    const processedUpdates = { ...updates };
    if (updates.lastMoodUpdate) {
      try {
        const parsedDate = new Date(updates.lastMoodUpdate);
        processedUpdates.lastMoodUpdate = parsedDate;
      } catch (error) {
        console.error("Error processing lastMoodUpdate:", error);
        delete processedUpdates.lastMoodUpdate;
      }
    }
    if (updates.nextVaccinationDue) {
      try {
        const parsedDate = new Date(updates.nextVaccinationDue);
        processedUpdates.nextVaccinationDue = parsedDate;
      } catch (error) {
        console.error("Error processing nextVaccinationDue:", error);
        delete processedUpdates.nextVaccinationDue;
      }
    }
    const [updatedPet] = await db.update(pets).set(processedUpdates).where(eq(pets.id, id)).returning();
    return updatedPet;
  }
  async createReminder(reminder) {
    const [newReminder] = await db.insert(reminders).values(reminder).returning();
    return newReminder;
  }
  async getReminders(petId) {
    return db.select().from(reminders).where(eq(reminders.petId, petId));
  }
  async updateReminderStatus(id, updates) {
    const updateData = {};
    if (updates.completed !== void 0) {
      updateData.completed = updates.completed ? 1 : 0;
    }
    if (updates.dueTime !== void 0) {
      updateData.dueTime = updates.dueTime;
    }
    await db.update(reminders).set(updateData).where(eq(reminders.id, id));
  }
  async deleteReminder(id) {
    await db.delete(reminders).where(eq(reminders.id, id));
  }
  async createVetConsultation(consultation) {
    const [newConsultation] = await db.insert(vetConsultations).values(consultation).returning();
    return newConsultation;
  }
  async getVetConsultations(petId) {
    return db.select().from(vetConsultations).where(eq(vetConsultations.petId, petId)).orderBy(vetConsultations.scheduledDate);
  }
  async updateVetConsultation(id, updates) {
    const [updatedConsultation] = await db.update(vetConsultations).set(updates).where(eq(vetConsultations.id, id)).returning();
    return updatedConsultation;
  }
  async cancelVetConsultation(id) {
    await db.update(vetConsultations).set({ status: "cancelled" }).where(eq(vetConsultations.id, id));
  }
  async createGroomingAppointment(appointment) {
    const [newAppointment] = await db.insert(groomingAppointments).values(appointment).returning();
    return newAppointment;
  }
  async getGroomingAppointments(petId) {
    return db.select().from(groomingAppointments).where(eq(groomingAppointments.petId, petId)).orderBy(groomingAppointments.scheduledDate);
  }
  async updateGroomingAppointment(id, updates) {
    const [updatedAppointment] = await db.update(groomingAppointments).set(updates).where(eq(groomingAppointments.id, id)).returning();
    return updatedAppointment;
  }
  async cancelGroomingAppointment(id) {
    await db.update(groomingAppointments).set({ status: "cancelled" }).where(eq(groomingAppointments.id, id));
  }
  async createTrainingAppointment(appointment) {
    const [newAppointment] = await db.insert(trainingAppointments).values(appointment).returning();
    return newAppointment;
  }
  async getTrainingAppointments(petId) {
    return db.select().from(trainingAppointments).where(eq(trainingAppointments.petId, petId)).orderBy(trainingAppointments.scheduledDate);
  }
  async updateTrainingAppointment(id, updates) {
    const [updatedAppointment] = await db.update(trainingAppointments).set(updates).where(eq(trainingAppointments.id, id)).returning();
    return updatedAppointment;
  }
  async cancelTrainingAppointment(id) {
    await db.update(trainingAppointments).set({ status: "cancelled" }).where(eq(trainingAppointments.id, id));
  }
  // Insurance policy operations
  async createInsurancePolicy(policy) {
    const [newPolicy] = await db.insert(insurancePolicies).values(policy).returning();
    return newPolicy;
  }
  async getInsurancePolicies(userId) {
    return db.select().from(insurancePolicies).where(eq(insurancePolicies.userId, userId)).orderBy(desc(insurancePolicies.createdAt));
  }
  async getInsurancePolicy(id) {
    const results = await db.select().from(insurancePolicies).where(eq(insurancePolicies.id, id));
    return results[0];
  }
  async updateInsurancePolicy(id, updates) {
    const [updatedPolicy] = await db.update(insurancePolicies).set(updates).where(eq(insurancePolicies.id, id)).returning();
    return updatedPolicy;
  }
  async deleteInsurancePolicy(id) {
    await db.delete(insurancePolicies).where(eq(insurancePolicies.id, id));
  }
  // Insurance claim operations
  async createInsuranceClaim(claim) {
    const [newClaim] = await db.insert(insuranceClaims).values(claim).returning();
    return newClaim;
  }
  async getInsuranceClaims(userId) {
    return db.select().from(insuranceClaims).where(eq(insuranceClaims.userId, userId)).orderBy(desc(insuranceClaims.claimDate));
  }
  async getClaimsByPolicy(policyId) {
    return db.select().from(insuranceClaims).where(eq(insuranceClaims.policyId, policyId)).orderBy(desc(insuranceClaims.claimDate));
  }
  async updateInsuranceClaim(id, updates) {
    const [updatedClaim] = await db.update(insuranceClaims).set(updates).where(eq(insuranceClaims.id, id)).returning();
    return updatedClaim;
  }
  async deleteInsuranceClaim(id) {
    await db.delete(insuranceClaims).where(eq(insuranceClaims.id, id));
  }
  // Pet expense operations
  async createPetExpense(expense) {
    const [newExpense] = await db.insert(petExpenses).values(expense).returning();
    return newExpense;
  }
  async getPetExpenses(userId) {
    return db.select().from(petExpenses).where(eq(petExpenses.userId, userId)).orderBy(desc(petExpenses.expenseDate));
  }
  async getPetExpensesByPet(petId) {
    return db.select().from(petExpenses).where(eq(petExpenses.petId, petId)).orderBy(desc(petExpenses.expenseDate));
  }
  async updatePetExpense(id, updates) {
    const [updatedExpense] = await db.update(petExpenses).set(updates).where(eq(petExpenses.id, id)).returning();
    return updatedExpense;
  }
  async deletePetExpense(id) {
    await db.delete(petExpenses).where(eq(petExpenses.id, id));
  }
  async createPetPortrait(portrait) {
    const [newPortrait] = await db.insert(petPortraits).values(portrait).returning();
    return newPortrait;
  }
  async getPetPortraits(userId) {
    return db.select().from(petPortraits).where(eq(petPortraits.userId, userId)).orderBy(desc(petPortraits.createdAt));
  }
  async getPetPortrait(id) {
    const [portrait] = await db.select().from(petPortraits).where(eq(petPortraits.id, id));
    return portrait;
  }
  async updatePetPortrait(id, updates) {
    const [updatedPortrait] = await db.update(petPortraits).set(updates).where(eq(petPortraits.id, id)).returning();
    return updatedPortrait;
  }
  async createStandaloneScan(scan) {
    const [newScan] = await db.insert(standaloneScans).values(scan).returning();
    return newScan;
  }
  async getStandaloneScan(id) {
    const [scan] = await db.select().from(standaloneScans).where(eq(standaloneScans.id, id));
    return scan;
  }
  async getStandaloneScans(userId) {
    return db.select().from(standaloneScans).where(eq(standaloneScans.userId, userId)).orderBy(desc(standaloneScans.createdAt));
  }
  async updateStandaloneScan(id, updates) {
    const [updatedScan] = await db.update(standaloneScans).set(updates).where(eq(standaloneScans.id, id)).returning();
    return updatedScan;
  }
  async createStandaloneVetChat(chat) {
    const [newChat] = await db.insert(standaloneVetChats).values(chat).returning();
    return newChat;
  }
  async getStandaloneVetChat(id) {
    const [chat] = await db.select().from(standaloneVetChats).where(eq(standaloneVetChats.id, id));
    return chat;
  }
  async getStandaloneVetChats(userId) {
    return db.select().from(standaloneVetChats).where(eq(standaloneVetChats.userId, userId)).orderBy(desc(standaloneVetChats.createdAt));
  }
  async updateStandaloneVetChat(id, updates) {
    const [updatedChat] = await db.update(standaloneVetChats).set(updates).where(eq(standaloneVetChats.id, id)).returning();
    return updatedChat;
  }
  async isPaymentProcessed(sessionId) {
    const results = await db.select().from(processedPayments).where(eq(processedPayments.stripeSessionId, sessionId));
    return results.length > 0;
  }
  async markPaymentProcessed(userId, sessionId) {
    await db.insert(processedPayments).values({
      userId,
      stripeSessionId: sessionId
    });
  }
  async getAdminAllData() {
    const [
      allUsers,
      allPets,
      allStandaloneScans,
      allStandaloneVetChats,
      allPortraits,
      allReminders,
      allVetConsultations,
      allGroomingAppointments,
      allTrainingAppointments
    ] = await Promise.all([
      db.select().from(users),
      db.select().from(pets),
      db.select().from(standaloneScans),
      db.select().from(standaloneVetChats),
      db.select().from(petPortraits),
      db.select().from(reminders),
      db.select().from(vetConsultations),
      db.select().from(groomingAppointments),
      db.select().from(trainingAppointments)
    ]);
    return allUsers.map((user) => {
      return {
        ...user,
        pets: allPets.filter((p) => p.userId === user.id),
        standaloneScans: allStandaloneScans.filter((s) => s.userId === user.id),
        standaloneVetChats: allStandaloneVetChats.filter((c) => c.userId === user.id),
        petPortraits: allPortraits.filter((p) => p.userId === user.id),
        reminders: allReminders.filter((r) => r.userId === user.id),
        vetConsultations: allVetConsultations.filter((c) => c.userId === user.id),
        groomingAppointments: allGroomingAppointments.filter((g) => g.userId === user.id),
        trainingAppointments: allTrainingAppointments.filter((t) => t.userId === user.id)
      };
    });
  }
};
var storage = new PostgresStorage();

// server/routes.ts
import OpenAI2 from "openai";
import { z as z2 } from "zod";
import fetch from "node-fetch";

// server/lib/openai.ts
import OpenAI from "openai";
var apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.log("WARNING: OPENAI_API_KEY is not set. AI features will fail.");
}
var openai = new OpenAI({ apiKey: apiKey || "sk_test_placeholder" });
async function generateTrainingPlan(pet) {
  try {
    let trainingCategories;
    if (pet.species.toLowerCase() === "dog") {
      trainingCategories = [
        { category: "Basic Commands", step: "Essential commands like sit, stay, come, down", type: "basic" },
        { category: "Exercise Goals", step: "Daily exercise routines and physical conditioning", type: "exercise" },
        { category: "House Training", step: "Bathroom habits and indoor behavior", type: "behavioral" },
        { category: "Leash Training", step: "Walking properly on leash without pulling", type: "behavioral" },
        { category: "Socialization", step: "Interaction with people, pets, and environments", type: "behavioral" },
        { category: "Advanced Tricks", step: "Fun and impressive tricks for mental stimulation", type: "basic" }
      ];
    } else if (pet.species.toLowerCase() === "cat") {
      trainingCategories = [
        { category: "Basic Commands", step: "Essential commands like come, sit, stay using treats", type: "basic" },
        { category: "Exercise Goals", step: "Play sessions and physical activity routines", type: "exercise" },
        { category: "Litter Training", step: "Proper litter box usage and habits", type: "behavioral" },
        { category: "Harness Training", step: "Getting comfortable with harness and supervised outdoor time", type: "behavioral" },
        { category: "Socialization", step: "Interaction with people, other cats, and new environments", type: "behavioral" },
        { category: "Clicker Training", step: "Using positive reinforcement for tricks and behavior", type: "basic" }
      ];
    } else {
      trainingCategories = [
        { category: "Basic Commands", step: "Species-appropriate basic responses and interactions", type: "basic" },
        { category: "Exercise Goals", step: "Physical activity and enrichment appropriate for the species", type: "exercise" },
        { category: "Habitat Training", step: "Proper use of living space and designated areas", type: "behavioral" },
        { category: "Handling Training", step: "Getting comfortable with human interaction and handling", type: "behavioral" },
        { category: "Socialization", step: "Interaction with humans and environmental adaptation", type: "behavioral" },
        { category: "Enrichment Activities", step: "Mental stimulation and species-specific behaviors", type: "basic" }
      ];
    }
    const prompt = `As a professional pet trainer with expertise in ${pet.species} behavior, analyze the following pet details and provide a comprehensive training plan with exactly 6 modules. Format the response as a JSON object with the fields specified below:

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || "Not specified"}
- Size: ${pet.size || "Not specified"}
- Age/Life Stage: Based on lifespan of ${pet.lifespan}

Required JSON format with EXACTLY these 6 categories:
{
  "trainingLevel": "string (Beginner/Intermediate/Advanced)",
  "exerciseNeeds": "string describing general exercise requirements for ${pet.species}",
  "exerciseSchedule": "string with recommended schedule",
  "exerciseDuration": "string with recommended duration per session",
  "trainingDetails": [
    {
      "category": "${trainingCategories[0].category}",
      "step": "${trainingCategories[0].step}",
      "type": "${trainingCategories[0].type}",
      "description": "detailed explanation specific to ${pet.species} training methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[1].category}",
      "step": "${trainingCategories[1].step}",
      "type": "${trainingCategories[1].type}",
      "description": "detailed explanation specific to ${pet.species} exercise and fitness",
      "duration": "estimated time to establish routine",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific fitness goals to check for progress"],
      "tips": ["array of 3-5 helpful tips for ${pet.species} exercise"]
    },
    {
      "category": "${trainingCategories[2].category}",
      "step": "${trainingCategories[2].step}",
      "type": "${trainingCategories[2].type}",
      "description": "detailed explanation specific to ${pet.species} behavioral training",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[3].category}",
      "step": "${trainingCategories[3].step}",
      "type": "${trainingCategories[3].type}",
      "description": "detailed explanation specific to ${pet.species} behavioral methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[4].category}",
      "step": "${trainingCategories[4].step}",
      "type": "${trainingCategories[4].type}",
      "description": "detailed explanation specific to ${pet.species} socialization techniques",
      "duration": "estimated time to see improvement",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific social behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips for ${pet.species} socialization"]
    },
    {
      "category": "${trainingCategories[5].category}",
      "step": "${trainingCategories[5].step}",
      "type": "${trainingCategories[5].type}",
      "description": "detailed explanation specific to ${pet.species} advanced training methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific advanced behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    }
  ],
  "exerciseType": "string describing recommended exercise types for ${pet.species}",
  "trainingProgress": "Not Started"
}

CRITICAL REQUIREMENTS:
1. MUST include exactly 6 training modules - no more, no less
2. Each module must have 3-5 checkpoints and 3-5 tips
3. Adapt ALL content specifically for ${pet.species} - not generic pet advice
4. Use species-appropriate terminology and techniques
5. Categories must be distributed as: 2 Basic Commands modules, 1 Exercise Goals module, 3 Behavioral Training modules
6. Make each step specific, actionable, and include clear success criteria for ${pet.species}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const trainingPlan = JSON.parse(response.choices[0].message.content || "{}");
    if (!trainingPlan.trainingDetails || !Array.isArray(trainingPlan.trainingDetails)) {
      throw new Error("Training plan missing trainingDetails array");
    }
    if (trainingPlan.trainingDetails.length !== 6) {
      throw new Error(`Expected exactly 6 training modules, got ${trainingPlan.trainingDetails.length}`);
    }
    const typeCount = { basic: 0, exercise: 0, behavioral: 0 };
    trainingPlan.trainingDetails.forEach((detail) => {
      if (detail.type && typeCount.hasOwnProperty(detail.type)) {
        typeCount[detail.type]++;
      }
    });
    if (typeCount.basic !== 2 || typeCount.exercise !== 1 || typeCount.behavioral !== 3) {
      console.warn(`Training plan type distribution incorrect: ${JSON.stringify(typeCount)}. Expected: basic=2, exercise=1, behavioral=3`);
    }
    return trainingPlan;
  } catch (error) {
    console.error("Error generating training plan:", error);
    throw new Error("Failed to generate training plan");
  }
}
async function generateNutritionPlan(pet) {
  try {
    const prompt = `As a certified pet nutritionist and veterinary nutritionist, analyze the following pet details and provide comprehensive, evidence-based nutrition recommendations. Provide specific brand names, product names, and detailed nutritional guidance.

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || "Not specified"}
- Size: ${pet.size || "Not specified"}
- Weight: ${pet.weight || "Not specified"}
- Age/Life Stage: Based on lifespan of ${pet.lifespan}

Provide nutrition recommendations in this JSON format:
{
  "dietType": "string (omnivore/carnivore/herbivore/etc.)",
  "feedingSchedule": "string with recommended feeding frequency",
  "portionSize": "string with portion guidance based on size/weight",
  "nutritionalNeeds": ["array of key nutritional requirements"],
  "foodRecommendations": [
    {
      "productName": "specific product name",
      "brand": "brand name (use real brands like Hill's Science Diet, Royal Canin, Blue Buffalo, etc.)",
      "category": "string (dry food/wet food/treats/supplements)",
      "activeIngredients": ["array of key ingredients"],
      "benefits": "detailed explanation of how this food helps the pet",
      "feedingGuide": "specific portion recommendations",
      "specialNotes": "any special considerations or veterinary notes"
    }
  ],
  "foodRestrictions": ["array of foods/ingredients to avoid for this species/breed"],
  "treatRecommendations": ["array of healthy treat options"],
  "specialConsiderations": "any breed-specific or species-specific dietary needs"
}

Ensure all recommendations are based on current veterinary nutritional science and include real, available pet food brands and products. Focus on high-quality, nutritionally complete options appropriate for the specific species and breed.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const nutritionPlan = JSON.parse(response.choices[0].message.content || "{}");
    return nutritionPlan;
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    throw new Error("Failed to generate nutrition plan");
  }
}
async function generatePersonalizedNutrition(params) {
  try {
    const prompt = `As a certified veterinary nutritionist, provide detailed, science-based nutrition recommendations for this specific pet. Use real AAFCO guidelines and veterinary nutritional science.

Pet Details:
- Species: ${params.species}
- Breed: ${params.breed}
- Weight: ${params.weight} lbs
- Activity Level: ${params.activityLevel}
- Age: ${params.age || "Adult"}

Calculate precise nutritional requirements and provide recommendations in this JSON format:
{
  "dailyCalories": number,
  "protein": {
    "grams": number,
    "percentage": number,
    "sources": ["list of best protein sources for this pet"]
  },
  "fats": {
    "grams": number,
    "percentage": number,
    "sources": ["list of healthy fat sources"]
  },
  "carbohydrates": {
    "grams": number,
    "percentage": number,
    "sources": ["list of appropriate carb sources"]
  },
  "recommendedFoods": [
    {
      "productName": "specific product name",
      "brand": "real brand name",
      "dailyAmount": "cups or cans per day",
      "caloriesPerServing": number,
      "proteinContent": "percentage",
      "fatContent": "percentage",
      "reasons": "why this food is ideal for this specific pet"
    }
  ],
  "feedingSchedule": "optimal feeding times and frequency",
  "specialConsiderations": "breed-specific or activity-level specific notes",
  "supplementRecommendations": ["if any supplements are beneficial"],
  "warningFoods": ["list of specific food names to avoid for this breed - just the food names"]
}

IMPORTANT: For warningFoods array, only return SHORT food names like:
- "Chocolate" (not "Chocolate can be toxic to dogs")
- "Grapes" (not "Grapes and raisins should be avoided")
- "Onions" (not "Onions can cause anemia in pets")

Base calculations on:
- RER (Resting Energy Requirement) = 70 \xD7 (weight in kg)^0.75
- Activity multipliers: Sedentary (1.2-1.4), Moderate (1.6-1.8), Active (2.0-3.0), Very Active (3.0-5.0)
- AAFCO minimum protein requirements
- Breed-specific nutritional considerations`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const nutritionAnalysis = JSON.parse(response.choices[0].message.content || "{}");
    return nutritionAnalysis;
  } catch (error) {
    console.error("Error generating personalized nutrition:", error);
    throw new Error("Failed to generate personalized nutrition analysis");
  }
}
async function generateVaccinationPlan(pet) {
  try {
    const prompt = `As a licensed veterinarian with expertise in preventive care, provide comprehensive vaccination requirements for this specific pet. Consider their species, breed, and typical health needs.

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || "Not specified"}
- Size: ${pet.size || "Not specified"}
- Lifespan: ${pet.lifespan || "Not specified"}

Provide a detailed vaccination plan in this JSON format:
{
  "vaccinationSchedule": "A comprehensive description of the overall vaccination schedule for this species and breed, including puppy/kitten series timing, booster schedules, and annual requirements",
  "vaccinationNotes": "Important breed-specific considerations, common health predispositions, and special vaccination notes for this particular breed",
  "coreVaccines": [
    {
      "name": "Vaccine name",
      "protectsAgainst": "What disease(s) it protects against",
      "initialSeries": "When to start and how many doses for initial series",
      "boosterFrequency": "How often boosters are needed (annual, 3-year, etc.)",
      "required": true,
      "notes": "Any special considerations"
    }
  ],
  "nonCoreVaccines": [
    {
      "name": "Vaccine name",
      "protectsAgainst": "What disease(s) it protects against",
      "recommendedFor": "What situations/lifestyles this is recommended for",
      "boosterFrequency": "How often boosters are needed",
      "required": false,
      "notes": "Any special considerations"
    }
  ],
  "ageBasedSchedule": [
    {
      "ageRange": "6-8 weeks",
      "vaccines": ["List of vaccines due at this age"],
      "notes": "Any notes for this age period"
    }
  ],
  "breedSpecificRisks": ["List of health conditions this breed is predisposed to that may affect vaccination decisions"],
  "nextVaccinationDue": "Estimated date for first/next vaccination based on typical schedule (use ISO date format like 2025-02-01)"
}

IMPORTANT:
- Include ALL core vaccines required by law or veterinary standards for this species
- Include relevant non-core vaccines based on breed and common lifestyles
- For ${pet.species}, ensure species-appropriate vaccines (don't include dog vaccines for cats, etc.)
- Be specific about timing (weeks, months, years) for all schedules
- Consider breed-specific health predispositions when making recommendations`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const vaccinationPlan = JSON.parse(response.choices[0].message.content || "{}");
    const vaccinationRecords = [
      ...vaccinationPlan.coreVaccines.map((vaccine) => JSON.stringify({
        name: vaccine.name,
        dateAdministered: null,
        nextDue: null,
        veterinarian: null,
        notes: vaccine.notes || `Core vaccine - ${vaccine.protectsAgainst}`,
        status: "upcoming",
        isCore: true,
        protectsAgainst: vaccine.protectsAgainst,
        boosterFrequency: vaccine.boosterFrequency
      })),
      ...vaccinationPlan.nonCoreVaccines.map((vaccine) => JSON.stringify({
        name: vaccine.name,
        dateAdministered: null,
        nextDue: null,
        veterinarian: null,
        notes: vaccine.notes || `Recommended for: ${vaccine.recommendedFor}`,
        status: "upcoming",
        isCore: false,
        protectsAgainst: vaccine.protectsAgainst,
        boosterFrequency: vaccine.boosterFrequency,
        recommendedFor: vaccine.recommendedFor
      }))
    ];
    return {
      vaccinationRecords,
      vaccinationSchedule: vaccinationPlan.vaccinationSchedule,
      vaccinationNotes: vaccinationPlan.vaccinationNotes,
      nextVaccinationDue: vaccinationPlan.nextVaccinationDue ? new Date(vaccinationPlan.nextVaccinationDue) : null,
      ageBasedSchedule: vaccinationPlan.ageBasedSchedule,
      breedSpecificRisks: vaccinationPlan.breedSpecificRisks
    };
  } catch (error) {
    console.error("Error generating vaccination plan:", error);
    return {
      vaccinationRecords: [],
      vaccinationSchedule: `Regular vaccination schedule recommended for ${pet.species}. Consult your veterinarian for a personalized vaccination plan.`,
      vaccinationNotes: `Standard vaccinations for ${pet.breed || pet.species} should be discussed with your veterinarian.`,
      nextVaccinationDue: null,
      ageBasedSchedule: [],
      breedSpecificRisks: []
    };
  }
}
async function analyzePetBasic(imageData) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a veterinary assistant. Identify the pet in the image and provide basic details."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this pet image and provide the following in JSON format: { species, breed, weight (approx in lbs) }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error in analyzePetBasic:", error);
    throw new Error("Failed to identify pet basic info");
  }
}

// server/routes.ts
import Stripe from "stripe";
var rawSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
var cleanSecretKey = rawSecretKey.replace(/\s/g, "");
var stripe = new Stripe(cleanSecretKey);
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
var injuryAnalysisResponseSchema = z2.object({
  hasInjury: z2.boolean(),
  injuryDescription: z2.string().nullable().optional(),
  severity: z2.enum(["LOW", "MEDIUM", "HIGH", "NONE"]).nullable().optional().default("NONE"),
  recommendations: z2.array(z2.string()).optional().default([]),
  requiredVetVisit: z2.boolean().optional().default(false),
  immediateActions: z2.array(z2.string()).optional().default([]),
  treatmentOptions: z2.array(z2.object({
    name: z2.string(),
    description: z2.string().optional().default(""),
    type: z2.string().optional().default("OTHER"),
    // Changed from enum to string for flexibility
    brandNames: z2.array(z2.string()).optional().default([]),
    activeIngredients: z2.array(z2.string()).optional().default([]),
    usage: z2.string().optional().default("As needed"),
    precautions: z2.array(z2.string()).optional().default([]),
    expectedResults: z2.string().optional().default("")
  })).optional().default([])
});
function registerRoutes(app2) {
  app2.get("/api/health", async (_req, res) => {
    try {
      await storage.getUserByFirebaseId("health-check");
      res.json({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        service: "pet-ai-companion-api"
      });
    } catch (err) {
      res.status(503).json({ status: "unhealthy", reason: "Database unavailable" });
    }
  });
  app2.get("/api/admin/all-data", async (req, res) => {
    try {
      const data = await storage.getAdminAllData();
      res.json(data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
  app2.post("/api/auth/sync", async (req, res) => {
    try {
      const { email, displayName, photoURL, firebaseId } = req.body;
      let user = await storage.getUserByFirebaseId(firebaseId);
      if (!user) {
        user = await storage.createUser({
          email,
          displayName,
          photoURL,
          firebaseId
        });
        user = await storage.adjustUserTokens(user.id, 40, "welcome", "Welcome Bonus - 40 Free Tokens");
        console.log(`[WELCOME] Granted 40 free tokens to new user ${user.id}`);
      } else {
        user = await storage.updateUser(user.id, {
          email,
          displayName,
          photoURL
        });
      }
      console.log(`[SYNC-FINAL] Returning user ${user.id} -> SCAN:${user.freeScanUsed}, INJURY:${user.freeInjuryScanUsed}, VET:${user.vetChatCredits}, TOKENS:${user.appTokenBalance}`);
      res.json(user);
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({
        error: "Failed to sync user",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/auth/reset-test-account", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "User ID required" });
      const updatedUser = await storage.resetUserForTesting(Number(userId));
      res.json({
        success: true,
        freeScanUsed: updatedUser.freeScanUsed,
        freeInjuryScanUsed: updatedUser.freeInjuryScanUsed,
        vetChatCredits: updatedUser.vetChatCredits
      });
    } catch (error) {
      console.error("[RESET] Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        error: "Failed to reset account",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : void 0
      });
    }
  });
  app2.get("/api/youtube/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query is required" });
      }
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      if (!response.ok) {
        console.error("YouTube API error:", data);
        throw new Error("Failed to fetch from YouTube API");
      }
      const videos = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
      res.json(videos);
    } catch (error) {
      console.error("Error searching YouTube:", error);
      res.status(500).json({ error: "Failed to search YouTube videos" });
    }
  });
  app2.get("/api/places/search", async (req, res) => {
    const serviceTypeStr = typeof req.query.serviceType === "string" ? req.query.serviceType : "groomer";
    try {
      const { location, petType } = req.query;
      if (!location || typeof location !== "string") {
        return res.status(400).json({ error: "Location is required" });
      }
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        return res.status(500).json({ error: "Google Maps API key is required but not configured" });
      }
      const validServiceTypes = ["groomer", "vet", "trainer"];
      if (!validServiceTypes.includes(serviceTypeStr)) {
        return res.status(400).json({
          error: "Invalid service type",
          message: `Service type must be one of: ${validServiceTypes.join(", ")}`
        });
      }
      console.log(`Searching for ${petType || ""} ${serviceTypeStr} near ${location}`);
      try {
        const serviceTerms = {
          "groomer": "pet groomer",
          "vet": "veterinarian animal hospital",
          "trainer": "pet trainer dog training"
        };
        const searchTerm = serviceTerms[serviceTypeStr] || "pet groomer";
        const locationIsZipCode = /^\d{5}(-\d{4})?$/.test(location.trim());
        const searchQuery = locationIsZipCode ? `${petType || ""} ${searchTerm} in zip code ${location}`.trim() : `${petType || ""} ${searchTerm} near ${location}`.trim();
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.status !== "OK" || !geocodeData.results[0]) {
          console.error("Geocoding error:", geocodeData);
          return res.status(400).json({
            error: "Unable to find the specified location",
            details: geocodeData.error_message || "Geocoding failed"
          });
        }
        const { lat, lng } = geocodeData.results[0].geometry.location;
        const searchRadius = locationIsZipCode ? 15e3 : 5e3;
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&keyword=${encodeURIComponent(searchQuery)}&type=establishment&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();
        if (placesData.status !== "OK" && placesData.status !== "ZERO_RESULTS") {
          console.error("Places API error:", placesData);
          const serviceTypeErrorMessages = {
            "groomer": "Failed to search for groomers",
            "vet": "Failed to search for veterinarians",
            "trainer": "Failed to search for trainers"
          };
          return res.status(400).json({
            error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers",
            details: placesData.error_message || `Google Maps API error: ${placesData.status}`
          });
        }
        const groomers = (placesData.results || []).map((place) => ({
          placeId: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openNow: place.opening_hours?.open_now,
          photos: place.photos ? place.photos.map((photo) => ({
            reference: photo.photo_reference,
            width: photo.width,
            height: photo.height,
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          })) : [],
          icon: place.icon
        }));
        if (groomers.length === 0) {
          const serviceTypeErrorMessages = {
            "groomer": "No groomer results found",
            "vet": "No veterinarian results found",
            "trainer": "No trainer results found"
          };
          const serviceTypeMessageDetails = {
            "groomer": "No pet groomers were found in this location.",
            "vet": "No veterinarians were found in this location.",
            "trainer": "No pet trainers were found in this location."
          };
          return res.status(404).json({
            error: serviceTypeErrorMessages[serviceTypeStr] || "No service providers found",
            message: `${serviceTypeMessageDetails[serviceTypeStr] || "No service providers were found."} Try a different search area or search term.`
          });
        }
        const detailedGroomers = await Promise.all(
          groomers.slice(0, 5).map(async (groomer) => {
            try {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${groomer.placeId}&fields=name,formatted_address,formatted_phone_number,website,url&key=${process.env.GOOGLE_MAPS_API_KEY}`;
              const detailsResponse = await fetch(detailsUrl);
              const detailsData = await detailsResponse.json();
              if (detailsData.status === "OK" && detailsData.result) {
                return {
                  ...groomer,
                  address: detailsData.result.formatted_address || groomer.address,
                  phone: detailsData.result.formatted_phone_number,
                  website: detailsData.result.website,
                  url: detailsData.result.url
                };
              }
              return groomer;
            } catch (error) {
              console.error(`Error fetching details for ${groomer.name}:`, error);
              return groomer;
            }
          })
        );
        const responseStructure = {
          "groomer": "groomers",
          "vet": "veterinarians",
          "trainer": "trainers"
        };
        const response = {
          searchLocation: {
            address: geocodeData.results[0].formatted_address,
            location: { lat, lng }
          }
        };
        response.groomers = detailedGroomers;
        if (serviceTypeStr !== "groomer") {
          response[responseStructure[serviceTypeStr]] = detailedGroomers;
        }
        res.json(response);
      } catch (error) {
        console.error("Error in Google Maps API:", error);
        const serviceTypeErrorMessages = {
          "groomer": "Failed to search for groomers",
          "vet": "Failed to search for veterinarians",
          "trainer": "Failed to search for trainers"
        };
        return res.status(500).json({
          error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers",
          details: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      console.error(`Error searching for ${serviceTypeStr}:`, error);
      const serviceTypeErrorMessages = {
        "groomer": "Failed to search for groomers",
        "vet": "Failed to search for veterinarians",
        "trainer": "Failed to search for trainers"
      };
      res.status(500).json({
        error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/analyze", async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        console.error("No image data provided in request body");
        return res.status(400).json({ error: "No image data provided" });
      }
      if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is not configured");
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      const { userId, firebaseId } = req.body;
      let targetUser = null;
      if (firebaseId) {
        targetUser = await storage.getUserByFirebaseId(firebaseId);
      } else if (userId) {
        targetUser = await storage.getUser(Number(userId));
      }
      if (targetUser) {
        if ((targetUser.appTokenBalance || 0) < 5) {
          return res.status(402).json({ error: "Insufficient tokens. 5 Tokens required for pet profile analysis." });
        }
      }
      console.log("Starting image analysis with OpenAI Vision API");
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert in pet emotion analysis and facial expression detection.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this pet image. Provide the following information in JSON format (Exclude description and careRecommendations):\n{\n  species: string,\n  breed: string | null,\n  gender: string | null,\n  weight: string | null,\n  size: string | null,\n  lifespan: string,\n  vetCareFrequency: string,\n  vetCareDetails: string[],\n  groomingSchedule: string,\n  groomingDetails: string[],\n  groomingVideos: { url: string, title: string }[],\n  dietType: string,\n  foodRecommendations: string[],\n  feedingSchedule: string,\n  portionSize: string,\n  nutritionalNeeds: string[],\n  foodRestrictions: string[],\n  treatRecommendations: string[],\n  currentMood: string,\n  moodDescription: string,\n  moodRecommendations: string[],\n  trainingLevel: string,\n  exerciseNeeds: string,\n  exerciseSchedule: string,\n  exerciseDuration: string,\n  trainingDetails: string[],\n  trainingVideos: { url: string, title: string }[],\n  exerciseType: string,\n  trainingProgress: string\n}\n"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4e3
      });
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }
      const analysis = JSON.parse(content);
      if (targetUser) {
        console.log(`[SCAN-SUCCESS] Deducting 5 tokens for user ${targetUser.id} after successful analysis`);
        await storage.adjustUserTokens(targetUser.id, -5, "usage", "Pet Profile Analysis");
      }
      if (targetUser && Number(targetUser.freeScanUsed || 0) < 2) {
        await storage.updateUserCredits(targetUser.id, "freeScanUsed", Number(targetUser.freeScanUsed || 0) + 1);
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({
        error: "Failed to analyze image",
        details: error?.message || String(error)
      });
    }
  });
  app2.post("/api/standalone/analyze-body", async (req, res) => {
    try {
      const { imageData } = req.body;
      const result = await analyzePetBasic(imageData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to identify pet" });
    }
  });
  app2.get("/api/standalone/scan/:id", async (req, res) => {
    try {
      const scanId = Number(req.params.id);
      const scan = await storage.getStandaloneScan(scanId);
      if (!scan) return res.status(404).json({ error: "Scan not found" });
      res.json(scan);
    } catch (error) {
      console.error("Error fetching standalone scan:", error);
      res.status(500).json({ error: "Failed to fetch scan" });
    }
  });
  app2.get("/api/standalone/scans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const scans = await storage.getStandaloneScans(Number(userId));
      res.json(scans);
    } catch (error) {
      console.error("Error fetching standalone scans:", error);
      res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });
  app2.post("/api/standalone/scan", async (req, res) => {
    try {
      const { userId, petInfo, injuryPhotoUrl, analysisResults } = req.body;
      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });
      let isPaid = 1;
      if ((user.appTokenBalance || 0) < 10) {
        return res.status(402).json({ error: "Insufficient tokens. 10 Tokens required for injury scan." });
      }
      const scan = await storage.createStandaloneScan({
        userId,
        petInfo,
        injuryPhotoUrl,
        analysisResults,
        isPaid
      });
      console.log(`[SCAN-INJURY] Deducting 10 Tokens for user ${user.id} after successful scan save`);
      await storage.adjustUserTokens(user.id, -10, "usage", "AI Injury Scan");
      res.json({
        scanId: scan.id,
        isPaid: Boolean(isPaid || scan.isPaid)
      });
    } catch (error) {
      console.error("Error saving scan:", error);
      res.status(500).json({ error: "Failed to save scan results" });
    }
  });
  app2.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const { type, userId, metadata } = req.body;
      console.log(`[Stripe] Creating checkout for type: ${type}, userId: ${userId}`);
      let baseLink = "";
      if (type.startsWith("portrait") || type === "vet_chat_pack" || type === "injury_report" || type === "credit_topup") {
        let amount = 1500;
        let description = "Pet AI Feature";
        if (type === "injury_report") {
          amount = 499;
          description = "Pet AI Companion - Professional Injury Analysis";
        } else if (type === "vet_chat_pack") {
          amount = 1500;
          description = "Pet AI Companion - 5 Expert AI Vet Questions";
        } else if (type === "credit_topup") {
          if (metadata?.package === "tier_1") {
            amount = 999;
            description = "Pet AI Companion - Starter Pack (150 Tokens)";
          } else if (metadata?.package === "tier_2" || metadata?.package === "100_credits") {
            amount = 1999;
            description = "Pet AI Companion - Pro Pack (350 Tokens)";
          } else if (metadata?.package === "20_credits") {
            amount = 500;
            description = "Pet AI Companion - 20 Universal Credits";
          } else {
            amount = 1999;
            description = "Pet AI Companion - Pro Pack (350 Tokens)";
          }
        } else if (type.startsWith("portrait")) {
          amount = 900;
          description = "Pet AI Companion - Professional HD Portrait";
          if (type === "portrait_print") {
            const prices = {
              "5x5": 1500,
              "8x8": 2500,
              "12x12": 3500,
              "16x16": 4900,
              "24x24": 6900,
              "36x36": 9900
            };
            amount = prices[metadata?.printSize] || 1500;
            description = `AI Pet Portrait - Premium Canvas Print (${metadata?.printSize}")`;
          }
        }
        const origin = req.get("origin") || `${req.protocol}://${req.get("host")}`;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: { name: description },
              unit_amount: amount
            },
            quantity: 1
          }],
          mode: "payment",
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cancel`,
          client_reference_id: `user_${userId || "unknown"}${metadata?.portraitId ? `|portrait_${metadata.portraitId}` : ""}${metadata?.scanId ? `|scan_${metadata.scanId}` : ""}|type_${type}`,
          metadata: {
            type,
            scanId: String(metadata?.scanId || ""),
            portraitId: String(metadata?.portraitId || ""),
            package: String(metadata?.package || "")
          }
        });
        return res.json({ url: session.url });
      }
      if (type === "home_analysis") {
        baseLink = (process.env.STRIPE_LINK || "").trim().replace(/^"(.*)"$/, "$1");
      }
      if (!baseLink || baseLink.trim() === "") {
        console.error(`[Stripe] Error: Fallback link is missing for type: ${type}.`);
        return res.status(500).json({ error: "Payment configuration missing on server" });
      }
      const normalizedLink = baseLink.trim().replace(/\s/g, "");
      const url = new URL(normalizedLink);
      const refId = `user_${userId || "unknown"}${metadata?.scanId ? `|scan_${metadata.scanId}` : ""}|type_${type}`;
      console.log(`[Stripe] Redirecting user ${userId} for type ${type} with refId: ${refId}`);
      url.searchParams.append("client_reference_id", refId);
      res.json({ url: url.toString() });
    } catch (error) {
      console.error("[Stripe] Payment initiation error:", {
        message: error?.message,
        type: req.body.type,
        userId: req.body.userId,
        stack: error?.stack
      });
      res.status(500).json({
        error: "Failed to generate payment redirect",
        details: error?.message || String(error)
      });
    }
  });
  const fulfillOrder = async (session, typeHint) => {
    console.log(`[Stripe-Fulfillment] Starting fulfillment for session: ${session.id}, Hint: ${typeHint}`);
    const alreadyProcessed = await storage.isPaymentProcessed(session.id);
    if (alreadyProcessed) {
      console.warn(`[Stripe-Fulfillment] REJECTED: Session ${session.id} already processed.`);
      return false;
    }
    const refId = session.client_reference_id || "";
    const parts = refId.split("|");
    let userIdPart = parts.find((p) => p.startsWith("user_"))?.replace("user_", "");
    const scanIdPart = parts.find((p) => p.startsWith("scan_"))?.replace("scan_", "");
    const portraitIdPart = parts.find((p) => p.startsWith("portrait_"))?.replace("portrait_", "");
    const typePart = parts.find((p) => p.startsWith("type_"))?.replace("type_", "") || session.metadata?.type || typeHint;
    if (!userIdPart && session.customer_details?.email) {
      console.log(`[Stripe-Fulfillment] No UserID in metadata. Forensic email lookup: ${session.customer_details.email}`);
      const userFoundByEmail = await storage.getUserByEmail(session.customer_details.email);
      if (userFoundByEmail) {
        userIdPart = String(userFoundByEmail.id);
        console.log(`[Stripe-Fulfillment] Forensic Match! Found User:${userIdPart}`);
      }
    }
    console.log(`[Stripe-Fulfillment] Finalizing: User:${userIdPart}, Type:${typePart}, ScanID:${scanIdPart}, PortraitID:${portraitIdPart}`);
    console.log(`[Stripe-Fulfillment] session.metadata:`, JSON.stringify(session.metadata));
    let wasFulfilled = false;
    if (scanIdPart) {
      await storage.updateStandaloneScan(Number(scanIdPart), { isPaid: 1 });
      wasFulfilled = true;
    } else if (portraitIdPart) {
      const type = session.metadata?.type;
      await storage.updatePetPortrait(Number(portraitIdPart), {
        paid: "true",
        paymentType: type === "portrait_print" ? "print" : "hd_download"
      });
      wasFulfilled = true;
    } else if (userIdPart) {
      const user = await storage.getUser(Number(userIdPart));
      if (user) {
        if (typePart === "credit_topup") {
          const packageType = session.metadata?.package;
          const amount = session.amount_total || 0;
          let tokensToAdd = 150;
          let planName = "Token Top-up";
          if (packageType === "tier_1" || amount === 999) {
            tokensToAdd = 150;
            planName = "Starter Pack (150 Tokens)";
          } else if (packageType === "tier_2" || amount === 1999) {
            tokensToAdd = 350;
            planName = "Pro Pack (350 Tokens)";
          } else if (packageType === "20_credits") {
            tokensToAdd = 20;
            planName = "Legacy 20 Pack";
          } else if (packageType === "100_credits" || amount === 2e3) {
            tokensToAdd = 100;
            planName = "Legacy 100 Pack";
          }
          await storage.adjustUserTokens(user.id, tokensToAdd, "top_up", planName);
          wasFulfilled = true;
        } else if (session.amount_total === 1500 || typePart === "vet_chat_pack" || typePart === "vet_chat") {
          await storage.updateUserCredits(user.id, "vetChatCredits", (user.vetChatCredits || 0) + 5);
          wasFulfilled = true;
        } else if (typePart === "home_analysis") {
          await storage.updateUserCredits(user.id, "freeScanUsed", 0);
          wasFulfilled = true;
        } else if (typePart === "injury_report") {
          await storage.updateUserCredits(user.id, "freeInjuryScanUsed", 0);
          wasFulfilled = true;
        }
      }
    }
    if (wasFulfilled) {
      console.log(`[Stripe-Fulfillment] SUCCESS: Fulfillment completed for ID:${userIdPart || scanIdPart}`);
      if (userIdPart) {
        await storage.markPaymentProcessed(Number(userIdPart), session.id);
      }
      return true;
    }
    console.warn(`[Stripe-Fulfillment] FAILED: No matching feature found to unlock for session ${session.id}`);
    return false;
  };
  app2.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const signature = Array.isArray(sig) ? sig[0] : sig;
    let event;
    try {
      if (!signature || typeof signature !== "string") {
        return res.status(400).send("Missing stripe-signature header");
      }
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (event.type === "checkout.session.completed") {
      await fulfillOrder(event.data.object);
    }
    res.json({ received: true });
  });
  app2.get("/api/stripe/fulfill-session", async (req, res) => {
    try {
      const sessionId = req.query.sessionId;
      if (!sessionId) return res.status(400).send("sessionId required");
      console.log(`[Direct-Fulfillment] Verifying session: ${sessionId}`);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        const success = await fulfillOrder(session);
        console.log(`[Stripe-Success] Found and processed session: ${session.id}`);
        return res.json({
          success,
          type: session.metadata?.type || "unknown",
          metadata: session.metadata,
          // Return all metadata for client-side routing
          message: success ? "Your purchase has been fulfilled!" : "Partial match found."
        });
      }
      res.json({ success: false, message: "Payment not verified yet." });
    } catch (error) {
      console.error("[Direct-Fulfillment] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/stripe/fulfill-by-email", async (req, res) => {
    try {
      const email = req.query.email;
      const typeHint = req.query.type;
      if (!email) return res.status(400).send("email required");
      console.log(`[Email-Forensics] Searching recent sessions for: ${email}, Hint: ${typeHint}`);
      const sessions = await stripe.checkout.sessions.list({
        limit: 30,
        // Increased limit for better chance of finding it
        expand: ["data.customer_details"]
      });
      const emailSessions = sessions.data.filter(
        (s) => s.customer_details?.email?.toLowerCase() === email.toLowerCase()
      );
      if (emailSessions.length === 0) {
        return res.json({ success: false, message: `No sessions found for ${email}` });
      }
      const FIFTEEN_MINUTES_AGO = Math.floor(Date.now() / 1e3) - 900;
      let match = null;
      for (const s of emailSessions) {
        if (s.payment_status === "paid" && s.created >= FIFTEEN_MINUTES_AGO) {
          const alreadyProcessed = await storage.isPaymentProcessed(s.id);
          if (alreadyProcessed) continue;
          const meta = s.metadata?.type;
          const refId = s.client_reference_id || "";
          const isExactMatch = meta === typeHint || refId.includes(`type_${typeHint}`);
          const isUntagged = !meta && !refId.includes("type_");
          let priceMatches = true;
          const amount = s.amount_total || 0;
          if (typeHint === "vet_chat_pack" && amount < 1e3) priceMatches = false;
          if ((typeHint === "home_analysis" || typeHint === "injury_report") && amount > 1e3) priceMatches = false;
          let finalMatch = false;
          if (isExactMatch) finalMatch = true;
          if (isUntagged && typeHint === "home_analysis") {
            const FIVE_MINUTES_AGO = Math.floor(Date.now() / 1e3) - 300;
            if (s.created >= FIVE_MINUTES_AGO) {
              finalMatch = true;
            }
          }
          if (finalMatch && priceMatches) {
            match = s;
            break;
          }
        }
      }
      if (match) {
        console.log(`[Email-Forensics] Found new paid session: ${match.id}`);
        const success = await fulfillOrder(match, typeHint);
        return res.json({
          success,
          type: typeHint || "unknown",
          metadata: match.metadata,
          message: "Found and processed your payment!"
        });
      }
      res.json({ success: false, message: `Found ${emailSessions.length} session(s), but none are 'paid' yet.` });
    } catch (error) {
      console.error("[Email-Forensics] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/stripe/simulate-success", async (req, res) => {
    const { userId, type } = req.query;
    if (!userId) return res.status(400).send("userId required");
    console.log(`[SIMULATION] Manually triggering success for User:${userId}, Type:${type}`);
    if (type === "home_analysis") {
      await storage.updateUserCredits(Number(userId), "freeScanUsed", 0);
      res.send(`Successfully simulated home_analysis payment for user ${userId}. You can now scan again!`);
    } else if (type === "injury_report") {
      await storage.updateUserCredits(Number(userId), "freeInjuryScanUsed", 0);
      res.send(`Successfully simulated injury_report payment for user ${userId}. You can now start a new injury scan!`);
    } else if (type === "vet_chat_pack") {
      const user = await storage.getUser(Number(userId));
      if (user) {
        await storage.updateUserCredits(user.id, "vetChatCredits", (user.vetChatCredits || 0) + 5);
        res.send(`Successfully simulated vet_chat_pack payment for user ${userId}. 5 credits added!`);
      } else {
        res.status(404).send("User not found");
      }
    } else {
      res.send("Simulation type not recognized. Use type=home_analysis, type=injury_report or type=vet_chat_pack");
    }
  });
  app2.post("/api/analyze/injury", async (req, res) => {
    try {
      const { imageData, petSpecies, petBreed, injuryDetails } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "No image data provided" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      let detailsContext = "";
      if (injuryDetails) {
        detailsContext = `Additional details provided by the pet owner:
`;
        if (injuryDetails.location) detailsContext += `- Location: ${injuryDetails.location}
`;
        const getDurationText = (duration) => {
          switch (duration) {
            case "less-than-day":
              return "Less than 24 hours";
            case "1-3-days":
              return "1-3 days";
            case "3-7-days":
              return "3-7 days";
            case "more-than-week":
              return "More than a week";
            case "chronic":
              return "Chronic/Recurring";
            default:
              return duration;
          }
        };
        if (injuryDetails.duration) {
          detailsContext += `- Duration: ${getDurationText(injuryDetails.duration)}
`;
        }
        if (injuryDetails.symptoms && injuryDetails.symptoms.length > 0) {
          detailsContext += `- Observed symptoms: ${injuryDetails.symptoms.join(", ")}
`;
        }
        if (injuryDetails.description) {
          detailsContext += `- Additional details: ${injuryDetails.description}
`;
        }
      }
      const petContext = `The image is of a ${petSpecies}${petBreed ? ` (${petBreed} breed)` : ""}. `;
      const speciesGuidance = `Please provide recommendations and treatments that are specifically appropriate for ${petSpecies}${petBreed ? ` of the ${petBreed} breed` : ""}, considering any breed-specific health concerns.`;
      console.log("Starting pet-specific injury analysis with OpenAI Vision API");
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a veterinary expert specialized in identifying pet injuries and providing detailed treatment recommendations specific to different animal species and breeds. You have particular expertise with ${petSpecies}${petBreed ? `, especially the ${petBreed} breed` : ""}.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${petContext}Analyze this image for any visible injuries or health issues. ${speciesGuidance}

${detailsContext}

Provide detailed analysis in this JSON format:
{
  hasInjury: boolean,
  injuryDescription: string or null,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE',
  recommendations: string[],
  requiredVetVisit: boolean,
  immediateActions: string[],
  treatmentOptions: Array<{
    name: string,
    description: string,
    type: 'MEDICATION' | 'OINTMENT' | 'BANDAGE' | 'OTHER',
    brandNames: string[],
    activeIngredients: string[],
    usage: string,
    precautions: string[],
    expectedResults: string
  }>
}

Make sure all recommendations are safe and appropriate for ${petSpecies}${petBreed ? ` of the ${petBreed} breed` : ""}. For medications and ointments, provide specific brand names, active ingredients, detailed usage instructions, and expected results. Include common veterinary medications and treatments available over-the-counter or through veterinary prescription.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4e3
      });
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }
      try {
        const parsedContent = JSON.parse(content);
        const analysis = injuryAnalysisResponseSchema.parse(parsedContent);
        res.json(analysis);
      } catch (error) {
        if (error instanceof z2.ZodError) {
          console.error("Zod Validation Error:", JSON.stringify(error.errors, null, 2));
          return res.status(500).json({
            error: "Failed to validate AI response",
            details: "Injury analysis format was incorrect",
            validationErrors: error.errors
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error analyzing injury:", error);
      res.status(500).json({
        error: "Failed to analyze injury",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/chat/injury", async (req, res) => {
    try {
      const { message, petId, petSpecies, petBreed, analysisContext } = req.body;
      if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      console.log(`Processing injury chat for pet ID: ${petId}`);
      const chatHistoryPrompt = analysisContext.chatHistory?.length > 0 ? "Previous conversation:\n" + analysisContext.chatHistory.map(
        (msg) => `${msg.role === "user" ? "Pet Owner" : "Veterinary Assistant"}: ${msg.content}`
      ).join("\n") : "";
      const analysisPrompt = `
Based on the previous analysis, the pet has ${analysisContext.hasInjury ? "an injury" : "no significant injury"}.
${analysisContext.injuryDescription ? `The injury description is: ${analysisContext.injuryDescription}` : ""}
${analysisContext.severity ? `The severity level is: ${analysisContext.severity}` : ""}
`;
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a veterinary assistant providing follow-up guidance for a pet injury. You're answering questions about a ${petSpecies}${petBreed ? ` (${petBreed})` : ""}. 
            
Focus on providing specific and practical advice with actual product names and treatment options. Include real brand names and medicine names that are commonly used for the specific condition or injury.

For example:
- For pain management: Mention specific medications like Rimadyl (carprofen), Metacam (meloxicam), or Galliprant (grapiprant) with general dosing guidelines based on pet size.
- For wound care: Suggest specific products like Vetericyn Wound Care, 3M Vetbond Tissue Adhesive, or Neosporin (avoiding those with pain relievers for cats).
- For bandaging: Recommend specific brands like 3M Vetrap, PetFlex, or CoFlex.

Your answers should be:
1. Specific and detailed with actual product recommendations
2. Include exact brand names, active ingredients, and application methods
3. Clear and tailored to the pet's species, breed, and injury type
4. Factually accurate about injury treatment options
5. Compassionate and practical

Only mention consulting a veterinarian once if absolutely necessary for severe injuries. For routine care, provide direct actionable advice without repeatedly suggesting vet visits.`
          },
          {
            role: "user",
            content: `${analysisPrompt}
            
${chatHistoryPrompt}

Pet Owner: ${message}`
          }
        ],
        max_tokens: 2e3
      });
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error("No response generated");
      }
      res.json({ response: responseContent });
    } catch (error) {
      console.error("Error in injury chat:", error);
      res.status(500).json({
        error: "Failed to generate chat response",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/chat/vet", async (req, res) => {
    try {
      const { message, petId, userId, petSpecies, petBreed, petInfo, chatHistory, category, injuryContext } = req.body;
      const species = petSpecies || petInfo?.species || "pet";
      const breed = petBreed || petInfo?.breed || "";
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });
      if ((user.appTokenBalance || 0) < 5) {
        return res.status(402).json({ error: "Insufficient tokens. 5 Tokens required per message." });
      }
      if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      console.log(`Processing vet chat for pet ID: ${petId}, category: ${category || "general"}`);
      const chatHistoryPrompt = chatHistory?.length > 0 ? "Previous conversation:\n" + chatHistory.map(
        (msg) => `${msg.role === "user" ? "Pet Owner" : "Veterinary Assistant"}: ${msg.content}`
      ).join("\n") : "";
      let injuryAnalysisContext = "";
      if (injuryContext) {
        if (typeof injuryContext === "string") {
          injuryAnalysisContext = `
RECENT INJURY SCAN FINDINGS:
${injuryContext}
`;
        } else if (typeof injuryContext === "object") {
          injuryAnalysisContext = `
RECENT INJURY SCAN FINDINGS:
- Description: ${injuryContext.injuryDescription || "N/A"}
- Severity: ${injuryContext.severity || "N/A"}
- Recommended Immediate Actions: ${injuryContext.immediateActions?.join(", ") || "N/A"}
- Treatment Options: ${injuryContext.treatmentOptions?.map((o) => o.name).join(", ") || "N/A"}
`;
        }
      }
      let categoryContext = "";
      if (category) {
        switch (category) {
          case "behaviour":
            categoryContext = "The pet owner is asking about behavioral issues, which may include unusual behaviors, aggression, anxiety, or training concerns.";
            break;
          case "diet":
            categoryContext = "The pet owner is asking about diet and nutrition, which may include food recommendations, diet changes, weight issues, or eating habits.";
            break;
          case "symptom":
            categoryContext = "The pet owner is asking about general symptoms or health concerns, which may include lethargy, vomiting, digestive issues, or other non-visible health issues.";
            break;
          case "preventcare":
            categoryContext = "The pet owner is asking about preventive care, which may include vaccinations, parasite prevention, dental care, or routine check-ups.";
            break;
          case "senior":
            categoryContext = "The pet owner is asking about senior pet care, which may include aging-related issues, mobility problems, cognitive changes, or special needs for older pets.";
            break;
          default:
            categoryContext = "The pet owner is asking a general question about their pet's health.";
        }
      }
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a veterinary assistant providing guidance on pet health issues. You're answering questions about a ${species}${breed ? ` (${breed})` : ""}. 
            
${injuryAnalysisContext}
${categoryContext}

Focus on providing specific, actionable advice with real brand names and medicine names where appropriate. For example, instead of saying "use a flea treatment," recommend specific products like "Frontline Plus, Advantage II, or Seresto collars." For supplements, mention specific brands like "Cosequin, Dasuquin, or Nordic Naturals Omega-3 Pet." For medications, refer to common veterinary medicines by name when appropriate.

Your answers should be:
1. Specific and detailed, with actual product recommendations and dosing guidelines where appropriate (e.g., "For a ${species} of this breed, typical products include X, Y, and Z")
2. Include exact brand names, active ingredients, and typical application methods
3. Clear and tailored to the pet's species and breed characteristics
4. Factually accurate about pet health concerns
5. Compassionate and reassuring in tone

Only mention consulting a veterinarian once briefly if absolutely necessary, and only for the most serious conditions. For routine matters, provide direct advice without constantly deferring to vet consultations.`
          },
          {
            role: "user",
            content: `${chatHistoryPrompt}

Pet Owner: ${message}`
          }
        ],
        max_tokens: 2e3
      });
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error("No response generated");
      }
      console.log(`[VET-CHAT-SUCCESS] Deducting 5 tokens for user ${user.id} after successful response`);
      await storage.adjustUserTokens(user.id, -5, "usage", "AI Vet Consultation");
      await storage.updateUserCredits(user.id, "vetChatCredits", Math.max(0, (user.vetChatCredits || 0) - 1));
      res.json({ response: responseContent });
    } catch (error) {
      console.error("Error in vet chat:", error);
      res.status(500).json({
        error: "Failed to generate chat response",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/standalone/vet-chat/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const chats = await storage.getStandaloneVetChats(Number(userId));
      res.json(chats);
    } catch (error) {
      console.error("Error fetching vet chats:", error);
      res.status(500).json({ error: "Failed to fetch vet chat history" });
    }
  });
  app2.get("/api/users/:userId/portraits", async (req, res) => {
    try {
      const { userId } = req.params;
      const portraits = await storage.getPetPortraits(Number(userId));
      res.json(portraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch pet portraits" });
    }
  });
  app2.get("/api/standalone/vet-chat/latest", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        console.log("[VET-CHAT-LOAD] Missing userId in query");
        return res.status(400).json({ error: "User ID required" });
      }
      console.log(`[VET-CHAT-LOAD] Searching for sessions for user: ${userId}`);
      const chats = await storage.getStandaloneVetChats(Number(userId));
      if (chats.length > 0) {
        console.log(`[VET-CHAT-LOAD] Found ${chats.length} sessions. Returning latest: ${chats[0].id}`);
      } else {
        console.log(`[VET-CHAT-LOAD] No sessions found for user ${userId}`);
      }
      res.json(chats[0] || null);
    } catch (error) {
      console.error("[VET-CHAT-LOAD-ERROR] Failed to fetch latest chat:", error);
      res.status(500).json({ error: "Failed to fetch latest chat" });
    }
  });
  app2.post("/api/standalone/vet-chat", async (req, res) => {
    try {
      const { userId, petInfo, chatHistory, id } = req.body;
      if (!userId) {
        console.log("[VET-CHAT-SAVE] Missing userId in body");
        return res.status(400).json({ error: "User ID required" });
      }
      let chat;
      if (id) {
        chat = await storage.updateStandaloneVetChat(Number(id), {
          petInfo,
          chatHistory
        });
        console.log(`[VET-CHAT-SAVE] UPDATED session ${id} for user ${userId}. History length: ${chatHistory?.length}`);
      } else {
        chat = await storage.createStandaloneVetChat({
          userId: Number(userId),
          petInfo,
          chatHistory: chatHistory || [],
          questionsUsed: 0
        });
        console.log(`[VET-CHAT-SAVE] CREATED new session ${chat.id} for user ${userId}`);
      }
      res.json(chat);
    } catch (error) {
      console.error("[VET-CHAT-SAVE-ERROR] Failed to save standalone vet chat:", error);
      res.status(500).json({ error: "Failed to save chat" });
    }
  });
  app2.get("/api/pets/:id", async (req, res) => {
    try {
      const pet = await storage.getPet(Number(req.params.id));
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }
      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ error: "Failed to fetch pet", details: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/pets", async (req, res) => {
    try {
      const { userId } = req.query;
      console.log("Fetching pets for userId:", userId);
      if (!userId || typeof userId !== "string") {
        console.error("Invalid or missing userId in request:", userId);
        return res.status(400).json({ error: "User ID is required" });
      }
      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) {
        console.error("Failed to parse userId to number:", userId);
        return res.status(400).json({ error: "Invalid user ID format" });
      }
      const pets2 = await storage.getAllPets(numericUserId);
      console.log("Retrieved pets for user:", pets2);
      res.json(pets2);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({
        error: "Failed to fetch pets",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/pets", async (req, res) => {
    try {
      console.log("Creating pet with data:", req.body);
      if (req.body.imageUrl) {
        console.log("Initial image URL received:", req.body.imageUrl);
        req.body.imageGallery = [req.body.imageUrl];
      }
      console.log("Creating pet with processed data:", req.body);
      const pet = await storage.createPet(req.body);
      if (!pet) {
        console.error("Failed to create pet - no pet returned from storage");
        return res.status(500).json({ error: "Failed to create pet" });
      }
      try {
        console.log("Generating training, nutrition, and vaccination plans for pet:", pet);
        const [trainingPlan, nutritionPlan, vaccinationPlan] = await Promise.all([
          generateTrainingPlan(pet),
          generateNutritionPlan(pet),
          generateVaccinationPlan(pet)
        ]);
        console.log("Generated training plan:", trainingPlan);
        console.log("Generated nutrition plan:", nutritionPlan);
        console.log("Generated vaccination plan:", vaccinationPlan);
        const processedTrainingPlan = {
          ...trainingPlan,
          // Serialize training details if they are objects
          trainingDetails: trainingPlan.trainingDetails ? trainingPlan.trainingDetails.map((detail) => {
            try {
              if (typeof detail === "object" && detail !== null) {
                console.log("Serializing training detail:", detail);
                const serialized = JSON.stringify(detail);
                console.log("Serialized result:", serialized);
                return serialized;
              }
              return String(detail);
            } catch (error) {
              console.error("Error serializing training detail:", error, detail);
              return JSON.stringify({
                step: typeof detail === "string" ? detail : "Training Step",
                description: "Training detail could not be processed properly",
                duration: "Not specified",
                prerequisites: [],
                difficulty: "Beginner",
                checkpoints: ["Complete this task"],
                tips: []
              });
            }
          }) : []
        };
        const processedNutritionPlan = {
          ...nutritionPlan,
          // Serialize food recommendations as JSON strings to store in database
          foodRecommendations: nutritionPlan.foodRecommendations ? nutritionPlan.foodRecommendations.map((food) => {
            if (typeof food === "object" && food !== null) {
              console.log("Serializing food recommendation:", food);
              return JSON.stringify(food);
            }
            return String(food);
          }) : []
        };
        const updatedPet = await storage.updatePet(pet.id, {
          ...processedTrainingPlan,
          ...processedNutritionPlan,
          vaccinationRecords: vaccinationPlan.vaccinationRecords,
          vaccinationSchedule: vaccinationPlan.vaccinationSchedule,
          vaccinationNotes: vaccinationPlan.vaccinationNotes,
          nextVaccinationDue: vaccinationPlan.nextVaccinationDue
        });
        console.log("Successfully created pet with training, nutrition, and vaccination plans:", updatedPet);
        res.status(201).json(updatedPet);
      } catch (error) {
        console.error("Error generating training, nutrition, or vaccination plan:", error);
        const updatedPet = await storage.updatePet(pet.id, {
          trainingDetails: [
            "Basic Commands: Start with sit, stay, and come",
            "Leash Training: Practice walking without pulling",
            "Socialization: Expose to different environments and other pets",
            "Positive Reinforcement: Reward good behavior with treats"
          ],
          trainingLevel: "Beginner",
          exerciseNeeds: "Regular daily exercise needed",
          exerciseSchedule: "Twice daily, morning and evening",
          exerciseDuration: "30-45 minutes per session",
          exerciseType: "Walks, play sessions, and training exercises",
          dietType: "Consult veterinarian",
          feedingSchedule: "2-3 times daily",
          nutritionalNeeds: ["Balanced nutrition", "Fresh water"],
          foodRecommendations: ["Consult with veterinarian for species-specific recommendations"],
          foodRestrictions: ["Avoid toxic foods for this species"],
          treatRecommendations: ["Species-appropriate healthy treats"],
          vaccinationRecords: [],
          vaccinationSchedule: `Regular vaccination schedule recommended for ${pet.species}. Consult your veterinarian for a personalized vaccination plan.`,
          vaccinationNotes: null,
          nutritionAnalysis: null,
          lastInjuryAnalysis: null
        });
        res.status(201).json(updatedPet);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({
        error: "Failed to create pet",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/pets/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const pet = await storage.getPet(id);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }
      if (req.body.imageUrl) {
        console.log("Image gallery update detected.  Adding image:", req.body.imageUrl);
        req.body.imageGallery = Array.from(/* @__PURE__ */ new Set([
          ...pet.imageGallery || [],
          ...req.body.imageGallery || []
        ]));
      }
      const updatedPet = await storage.updatePet(id, req.body);
      res.json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Failed to update pet", details: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/pets/:petId/reminders", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const currentDate = /* @__PURE__ */ new Date();
      if (req.body.dueTime) {
        const [hours, minutes] = req.body.dueTime.split(":").map(Number);
        currentDate.setHours(hours, minutes, 0, 0);
      }
      const reminder = insertReminderSchema.parse({
        ...req.body,
        petId,
        dueDate: currentDate.toISOString()
      });
      const newReminder = await storage.createReminder(reminder);
      res.status(201).json(newReminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({
        error: "Failed to create reminder",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/pets/:petId/reminders", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const reminders2 = await storage.getReminders(petId);
      const formattedReminders = reminders2.map((reminder) => {
        const date = new Date(reminder.dueDate);
        return {
          ...reminder,
          dueTime: reminder.dueTime || `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
        };
      });
      res.json(formattedReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders", details: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.patch("/api/reminders/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = z2.object({
        completed: z2.boolean().optional(),
        dueTime: z2.string().optional()
      }).parse(req.body);
      await storage.updateReminderStatus(id, updateData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: "Failed to update reminder", details: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.delete("/api/reminders/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteReminder(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder", details: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/pets/:petId/consultations", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const consultation = insertVetConsultationSchema.parse({
        ...req.body,
        petId
      });
      const newConsultation = await storage.createVetConsultation(consultation);
      res.status(201).json(newConsultation);
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(500).json({
        error: "Failed to create consultation",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/pets/:petId/consultations", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const consultations = await storage.getVetConsultations(petId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({
        error: "Failed to fetch consultations",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/consultations/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertVetConsultationSchema.partial().parse(req.body);
      const updatedConsultation = await storage.updateVetConsultation(id, updates);
      res.json(updatedConsultation);
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).json({
        error: "Failed to update consultation",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/consultations/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelVetConsultation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      res.status(500).json({
        error: "Failed to cancel consultation",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/pets/:petId/grooming", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointment = insertGroomingAppointmentSchema.parse({
        ...req.body,
        petId
      });
      const newAppointment = await storage.createGroomingAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating grooming appointment:", error);
      res.status(500).json({
        error: "Failed to create grooming appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/pets/:petId/grooming", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointments = await storage.getGroomingAppointments(petId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching grooming appointments:", error);
      res.status(500).json({
        error: "Failed to fetch grooming appointments",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/grooming/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertGroomingAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateGroomingAppointment(id, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating grooming appointment:", error);
      res.status(500).json({
        error: "Failed to update grooming appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/grooming/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelGroomingAppointment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling grooming appointment:", error);
      res.status(500).json({
        error: "Failed to cancel grooming appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/pets/:petId/training", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointment = insertTrainingAppointmentSchema.parse({
        ...req.body,
        petId
      });
      const newAppointment = await storage.createTrainingAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating training appointment:", error);
      res.status(500).json({
        error: "Failed to create training appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/pets/:petId/training", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointments = await storage.getTrainingAppointments(petId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching training appointments:", error);
      res.status(500).json({
        error: "Failed to fetch training appointments",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/training/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertTrainingAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateTrainingAppointment(id, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating training appointment:", error);
      res.status(500).json({
        error: "Failed to update training appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/training/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelTrainingAppointment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling training appointment:", error);
      res.status(500).json({
        error: "Failed to cancel training appointment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/nutrition/analyze", async (req, res) => {
    try {
      const { breed, weight, activityLevel, species, age, userId } = req.body;
      if (!breed || !weight || !activityLevel || !species) {
        return res.status(400).json({
          error: "Missing required fields: breed, weight, activityLevel, and species are required"
        });
      }
      if (userId !== void 0 && userId !== null) {
        const user = await storage.getUser(Number(userId));
        if (!user) return res.status(404).json({ error: "User not found" });
        if ((user.appTokenBalance || 0) < 3) {
          return res.status(402).json({ error: "Insufficient tokens. 3 Tokens required." });
        }
        console.log(`[NUTRITION] Consuming 3 Tokens for user ${user.id}`);
        await storage.adjustUserTokens(user.id, -3, "usage", "AI Nutrition Analysis");
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      const nutritionAnalysis = await generatePersonalizedNutrition({
        breed,
        weight: Number(weight),
        activityLevel,
        species,
        age: age ? Number(age) : void 0
      });
      res.json(nutritionAnalysis);
    } catch (error) {
      console.error("Error generating nutrition analysis:", error);
      res.status(500).json({
        error: "Failed to generate nutrition analysis",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/tokens/deduct", async (req, res) => {
    try {
      const { userId, amount, reason } = req.body;
      if (!userId || !amount) {
        return res.status(400).json({ error: "userId and amount are required" });
      }
      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });
      if ((user.appTokenBalance || 0) < amount) {
        return res.status(402).json({ error: `Insufficient tokens. ${amount} Tokens required.` });
      }
      console.log(`[TOKEN-CONSUME] Consuming ${amount} Tokens for user ${user.id}. Reason: ${reason || "Generic"}`);
      const updatedUser = await storage.adjustUserTokens(user.id, -amount, "usage", reason || "Token Deduction");
      res.json(updatedUser);
    } catch (error) {
      console.error("Error deducting tokens:", error);
      res.status(500).json({ error: "Failed to deduct tokens" });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      if (!userId) return res.status(400).send("userId required");
      const transactions = await storage.getTokenTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/subscriptions/latest", async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      if (!userId) return res.status(400).send("userId required");
      const sub = await storage.getLatestSubscription(userId);
      res.json(sub || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });
  app2.post("/api/users/:userId/insurance-policies", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const policy = insertInsurancePolicySchema.parse({
        ...req.body,
        userId
      });
      const newPolicy = await storage.createInsurancePolicy(policy);
      res.status(201).json(newPolicy);
    } catch (error) {
      console.error("Error creating insurance policy:", error);
      res.status(500).json({
        error: "Failed to create insurance policy",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/users/:userId/insurance-policies", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const policies = await storage.getInsurancePolicies(userId);
      res.json(policies);
    } catch (error) {
      console.error("Error fetching insurance policies:", error);
      res.status(500).json({
        error: "Failed to fetch insurance policies",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const policy = await storage.getInsurancePolicy(id);
      if (!policy) {
        return res.status(404).json({ error: "Insurance policy not found" });
      }
      res.json(policy);
    } catch (error) {
      console.error("Error fetching insurance policy:", error);
      res.status(500).json({
        error: "Failed to fetch insurance policy",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertInsurancePolicySchema.partial().parse(req.body);
      const updatedPolicy = await storage.updateInsurancePolicy(id, updates);
      res.json(updatedPolicy);
    } catch (error) {
      console.error("Error updating insurance policy:", error);
      res.status(500).json({
        error: "Failed to update insurance policy",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.delete("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteInsurancePolicy(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting insurance policy:", error);
      res.status(500).json({
        error: "Failed to delete insurance policy",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/users/:userId/insurance-claims", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const claim = insertInsuranceClaimSchema.parse({
        ...req.body,
        userId
      });
      const newClaim = await storage.createInsuranceClaim(claim);
      res.status(201).json(newClaim);
    } catch (error) {
      console.error("Error creating insurance claim:", error);
      res.status(500).json({
        error: "Failed to create insurance claim",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/users/:userId/insurance-claims", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const claims = await storage.getInsuranceClaims(userId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching insurance claims:", error);
      res.status(500).json({
        error: "Failed to fetch insurance claims",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/insurance-policies/:policyId/claims", async (req, res) => {
    try {
      const policyId = Number(req.params.policyId);
      const claims = await storage.getClaimsByPolicy(policyId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching claims by policy:", error);
      res.status(500).json({
        error: "Failed to fetch claims",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/insurance-claims/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertInsuranceClaimSchema.partial().parse(req.body);
      const updatedClaim = await storage.updateInsuranceClaim(id, updates);
      res.json(updatedClaim);
    } catch (error) {
      console.error("Error updating insurance claim:", error);
      res.status(500).json({
        error: "Failed to update insurance claim",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.delete("/api/insurance-claims/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteInsuranceClaim(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting insurance claim:", error);
      res.status(500).json({
        error: "Failed to delete insurance claim",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/expenses/ocr", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Image is required" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      console.log("Starting receipt OCR analysis with OpenAI Vision API");
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert receipt scanner and OCR specialist for pet-related expenses. Analyze the receipt image and extract the following information accurately:
- Total amount (in cents, as an integer - e.g., $45.99 = 4599)
- Vendor/merchant name
- Date of purchase (in ISO format YYYY-MM-DD)
- Category (one of: vet_visit, food, medication, grooming, training, supplies, insurance, emergency, other)
- Currency code (e.g., USD, EUR, GBP)
- Key items purchased (as rawText summary)
- Confidence level (0-1 float indicating how confident you are in the extraction)

For pet expense categories:
- vet_visit: Veterinary services, checkups, treatments
- food: Pet food, treats, supplements
- medication: Prescriptions, flea/tick treatments, vitamins
- grooming: Grooming services, bathing, haircuts
- training: Training classes, obedience school
- supplies: Toys, beds, leashes, carriers, litter
- insurance: Pet insurance premiums
- emergency: Emergency vet visits, urgent care
- other: Anything else pet-related

Always respond in valid JSON format.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this receipt and extract the expense information. If the receipt is not readable or not a valid receipt, indicate low confidence. Extract the total amount, vendor, date, and categorize the expense."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1e3
      });
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }
      console.log("Receipt OCR response:", content);
      const parsedContent = JSON.parse(content);
      const ocrResult = {
        amount: typeof parsedContent.amount === "number" ? parsedContent.amount : null,
        vendor: parsedContent.vendor || parsedContent.merchant || null,
        date: parsedContent.date || null,
        category: parsedContent.category || "other",
        currency: parsedContent.currency || "USD",
        rawText: parsedContent.rawText || parsedContent.items || parsedContent.description || null,
        confidence: typeof parsedContent.confidence === "number" ? parsedContent.confidence : 0.5
      };
      res.json(ocrResult);
    } catch (error) {
      console.error("Error analyzing receipt:", error);
      res.status(500).json({
        error: "Failed to analyze receipt",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/users/:userId/expenses", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const expense = insertPetExpenseSchema.parse({
        ...req.body,
        userId
      });
      const newExpense = await storage.createPetExpense(expense);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        error: "Failed to create expense",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/users/:userId/expenses", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const expenses = await storage.getPetExpenses(userId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({
        error: "Failed to fetch expenses",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/pets/:petId/expenses", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const expenses = await storage.getPetExpensesByPet(petId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching pet expenses:", error);
      res.status(500).json({
        error: "Failed to fetch pet expenses",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.patch("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertPetExpenseSchema.partial().parse(req.body);
      const updatedExpense = await storage.updatePetExpense(id, updates);
      res.json(updatedExpense);
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({
        error: "Failed to update expense",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deletePetExpense(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({
        error: "Failed to delete expense",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/portraits/generate", async (req, res) => {
    try {
      const { imageBase64, style, userId, petId } = req.body;
      if (!imageBase64 || !style || !userId) {
        return res.status(400).json({ error: "Image, style, and userId are required" });
      }
      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });
      if ((user.appTokenBalance || 0) < 5) {
        return res.status(402).json({ error: "Insufficient tokens. 5 Tokens required for portrait generation." });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      const stylePrompts = {
        "watercolor": "Transform this pet photo into a beautiful watercolor painting style. Use soft, flowing watercolor washes with gentle color bleeding. Keep the pet recognizable but with an artistic watercolor aesthetic. Light, airy feel with subtle paper texture.",
        "oil-painting": "Transform this pet photo into a classic oil painting style reminiscent of Renaissance pet portraits. Rich, deep colors with visible brushstrokes. Dramatic lighting with a regal, majestic feel. Museum-quality fine art style.",
        "pop-art": "Transform this pet photo into a vibrant Andy Warhol inspired pop art style. Bold, bright contrasting colors, strong outlines, halftone dot patterns. Fun, energetic, and modern graphic art feel.",
        "anime": "Transform this pet photo into a beautiful anime/manga illustration style. Large expressive eyes, clean lines, vibrant colors. Japanese animation aesthetic with a cute, kawaii feel.",
        "pencil-sketch": "Transform this pet photo into a detailed pencil sketch drawing. Fine graphite lines, realistic shading, cross-hatching technique. Black and white with subtle tonal gradations. Classical drawing style.",
        "pixel-art": "Transform this pet photo into a charming retro pixel art style. 16-bit or 32-bit gaming aesthetic with visible pixels. Bright, nostalgic color palette. Fun, retro gaming feel.",
        "stained-glass": "Transform this pet photo into a beautiful stained glass window art style. Bold black outlines separating colorful glass-like sections. Rich, jewel-toned colors with light appearing to shine through.",
        "art-nouveau": "Transform this pet photo into an elegant Art Nouveau illustration style. Flowing organic lines, decorative floral borders, muted earthy color palette. Inspired by Alphonse Mucha.",
        "cyberpunk": "Transform this pet photo into a futuristic cyberpunk digital art style. Neon glowing accents, dark background, holographic effects. High-tech, futuristic aesthetic with vibrant neon colors.",
        "impressionist": "Transform this pet photo into a beautiful Impressionist painting style inspired by Monet. Soft, dappled light effects, loose brushstrokes, pastel and natural color palette. Outdoor garden-like atmosphere."
      };
      const stylePrompt = stylePrompts[style] || stylePrompts["watercolor"];
      const visionResponse = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Perform a forensic physical analysis of this pet for a world-class portrait artist. Describe its species, breed, and most importantly, identifying landmarks: the unique pattern of its fur/spots, exact shape of the face and snout, distinct ear positioning, eye color, and any asymmetrical markings. Your description will be used to recreate this exact individual pet in an artistic style. Be extremely specific about identity markers. 2-3 detailed sentences."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 400
      });
      const petDescription = visionResponse.choices[0]?.message?.content || "a cute pet";
      const imageResponse = await openai2.images.generate({
        model: "dall-e-3",
        prompt: `${stylePrompt}

The subject is: ${petDescription}

IMPORTANT: Create a stylized artistic portrait that preserves the unique identity markers mentioned. It must be a single centered composition of just this pet with a complementary background. If the style is Anime, use a high-fidelity 'Seinen' anime aesthetic that respects the pet's actual bone structure and facial proportions.`,
        n: 1,
        size: "1024x1024",
        quality: "hd"
      });
      const generatedImageUrl = imageResponse.data?.[0]?.url;
      if (!generatedImageUrl) {
        throw new Error("Failed to generate portrait image");
      }
      const imageRes = await fetch(generatedImageUrl);
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const portraitBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
      const portrait = await storage.createPetPortrait({
        userId,
        petId: petId || null,
        originalImageUrl: imageBase64.substring(0, 200) + "...",
        portraitImageUrl: portraitBase64,
        style,
        status: "completed",
        paid: "false",
        paymentType: null
      });
      console.log(`[PORTRAIT] Deducting 5 tokens for user ${user.id} after successful generation`);
      await storage.adjustUserTokens(user.id, -5, "usage", "AI Portrait Generation");
      res.json({
        id: portrait.id,
        portraitImageUrl: portraitBase64,
        style,
        status: "completed"
      });
    } catch (error) {
      console.error("Error generating portrait:", error);
      res.status(500).json({
        error: "Failed to generate portrait",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/users/:userId/portraits", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Valid user ID is required" });
      }
      const portraits = await storage.getPetPortraits(userId);
      res.json(portraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch portraits" });
    }
  });
  app2.get("/api/portraits/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const portrait = await storage.getPetPortrait(id);
      if (!portrait) {
        return res.status(404).json({ error: "Portrait not found" });
      }
      res.json(portrait);
    } catch (error) {
      console.error("Error fetching portrait:", error);
      res.status(500).json({ error: "Failed to fetch portrait" });
    }
  });
  app2.post("/api/chat/initial-questions", async (req, res) => {
    try {
      const { petSpecies, petBreed, severity } = req.body;
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a vet. Generate 4 specific follow-up questions for a ${petSpecies}${petBreed ? ` ${petBreed}` : ""} with a ${severity || "potential"} injury. Return JSON with "questions" array of 4 strings.`
          },
          {
            role: "user",
            content: `Generate 4 questions to ask owner about this ${petSpecies}${petBreed ? ` ${petBreed}` : ""}'s condition.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });
      const content = response.choices[0].message.content;
      if (!content) throw new Error("No content");
      const data = JSON.parse(content);
      res.json({ questions: data.questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });
  return createServer(app2);
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();
  const viteConfig = (await Promise.resolve().then(() => (init_vite_config(), vite_config_exports))).default;
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const rootDir = process.cwd();
  const distPath = path2.resolve(rootDir, "dist");
  if (!fs.existsSync(distPath)) {
    const altDistPath = path2.resolve(rootDir, "public");
    if (!fs.existsSync(altDistPath)) {
      log("WARNING: Could not find build directory in dist/public or public. Static files may fail to serve.");
    }
  }
  const finalPath = fs.existsSync(distPath) ? distPath : path2.resolve(rootDir, "public");
  app2.use(express2.static(finalPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(finalPath, "index.html"));
  });
}

// server/index.ts
import compression from "compression";
import rateLimit from "express-rate-limit";
var app = express3();
app.use(compression());
var apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1e3,
  // 5 minutes
  max: 500,
  // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/", apiLimiter);
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express3.json({ limit: "25mb" })(req, res, next);
  }
});
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express3.urlencoded({ extended: false, limit: "25mb" })(req, res, next);
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  log("Starting server initialization...");
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripeLink = process.env.STRIPE_LINK_INJURY;
  if (!stripeKey) log("WARNING: STRIPE_SECRET_KEY is not set!");
  if (!stripeLink) log("WARNING: STRIPE_LINK_INJURY is not set!");
  if (stripeKey && stripeLink) log("SUCCESS: Stripe configuration loaded for primary features.");
  const server = registerRoutes(app);
  app.use((err, _req, res, _next) => {
    if (err.type === "entity.too.large") {
      res.status(413).json({
        error: "File too large",
        details: "The uploaded file exceeds the maximum allowed size of 20MB"
      });
      return;
    }
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    log("Setting up Vite in development mode...");
    await setupVite(app, server);
  } else {
    log("Setting up static file serving...");
    serveStatic(app);
  }
  if (app.get("env") === "development") {
    const port = Number(process.env.PORT) || 5e3;
    server.listen(port, "0.0.0.0", () => {
      log(`Server started successfully, serving on port ${port}`);
    });
  }
})();
var index_default = app;
export {
  index_default as default
};
