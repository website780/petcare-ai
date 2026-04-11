import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { type Pet, type InsertPet, type Reminder, type InsertReminder, type User, type InsertUser, type VetConsultation, type InsertVetConsultation, type GroomingAppointment, type InsertGroomingAppointment, type TrainingAppointment, type InsertTrainingAppointment, type InsurancePolicy, type InsertInsurancePolicy, type InsuranceClaim, type InsertInsuranceClaim, type PetExpense, type InsertPetExpense, type PetPortrait, type InsertPetPortrait, type StandaloneScan, type StandaloneVetChat } from "../shared/schema.js";
import { pets, users, reminders, vetConsultations, groomingAppointments, trainingAppointments, insurancePolicies, insuranceClaims, petExpenses, petPortraits, standaloneScans, standaloneVetChats } from "../shared/schema.js";
import { eq, and, desc, sql } from "drizzle-orm";
import ws from "ws";

// Add WebSocket polyfill for Node.js environment
if (!global.WebSocket) {
  (global as any).WebSocket = ws;
}

if (!process.env.DATABASE_URL) {
  console.log("WARNING: DATABASE_URL is not set. Database operations will fail.");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "",
  connectionTimeoutMillis: 5000 
});
const db = drizzle(pool, { logger: true });

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  updateUserCredits(id: number, field: 'freeScanUsed' | 'freeInjuryScanUsed' | 'vetChatCredits', value: number): Promise<User>;

  // Pet operations
  getPet(id: number): Promise<Pet | undefined>;
  getAllPets(userId: number): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet>;

  // Reminder operations
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  getReminders(petId: number): Promise<Reminder[]>;
  updateReminderStatus(id: number, updates: { completed?: boolean; dueTime?: string }): Promise<void>;
  deleteReminder(id: number): Promise<void>;

  // Vet consultation operations
  createVetConsultation(consultation: InsertVetConsultation): Promise<VetConsultation>;
  getVetConsultations(petId: number): Promise<VetConsultation[]>;
  updateVetConsultation(id: number, updates: Partial<InsertVetConsultation>): Promise<VetConsultation>;
  cancelVetConsultation(id: number): Promise<void>;

  // Grooming appointment operations
  createGroomingAppointment(appointment: InsertGroomingAppointment): Promise<GroomingAppointment>;
  getGroomingAppointments(petId: number): Promise<GroomingAppointment[]>;
  updateGroomingAppointment(id: number, updates: Partial<InsertGroomingAppointment>): Promise<GroomingAppointment>;
  cancelGroomingAppointment(id: number): Promise<void>;

  // Training appointment operations
  createTrainingAppointment(appointment: InsertTrainingAppointment): Promise<TrainingAppointment>;
  getTrainingAppointments(petId: number): Promise<TrainingAppointment[]>;
  updateTrainingAppointment(id: number, updates: Partial<InsertTrainingAppointment>): Promise<TrainingAppointment>;
  cancelTrainingAppointment(id: number): Promise<void>;

  // Insurance policy operations
  createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy>;
  getInsurancePolicies(userId: number): Promise<InsurancePolicy[]>;
  getInsurancePolicy(id: number): Promise<InsurancePolicy | undefined>;
  updateInsurancePolicy(id: number, updates: Partial<InsertInsurancePolicy>): Promise<InsurancePolicy>;
  deleteInsurancePolicy(id: number): Promise<void>;

  // Insurance claim operations
  createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim>;
  getInsuranceClaims(userId: number): Promise<InsuranceClaim[]>;
  getClaimsByPolicy(policyId: number): Promise<InsuranceClaim[]>;
  updateInsuranceClaim(id: number, updates: Partial<InsertInsuranceClaim>): Promise<InsuranceClaim>;
  deleteInsuranceClaim(id: number): Promise<void>;

  // Pet expense operations
  createPetExpense(expense: InsertPetExpense): Promise<PetExpense>;
  getPetExpenses(userId: number): Promise<PetExpense[]>;
  getPetExpensesByPet(petId: number): Promise<PetExpense[]>;
  updatePetExpense(id: number, updates: Partial<InsertPetExpense>): Promise<PetExpense>;
  deletePetExpense(id: number): Promise<void>;

  // Pet portrait operations
  createPetPortrait(portrait: InsertPetPortrait): Promise<PetPortrait>;
  getPetPortraits(userId: number): Promise<PetPortrait[]>;
  getPetPortrait(id: number): Promise<PetPortrait | undefined>;
  updatePetPortrait(id: number, updates: Partial<InsertPetPortrait>): Promise<PetPortrait>;

  // Standalone scan operations
  createStandaloneScan(scan: any): Promise<StandaloneScan>;
  getStandaloneScan(id: number): Promise<StandaloneScan | undefined>;
  updateStandaloneScan(id: number, updates: Partial<StandaloneScan>): Promise<StandaloneScan>;
  
  // Standalone vet chat operations
  createStandaloneVetChat(chat: any): Promise<StandaloneVetChat>;
  getStandaloneVetChat(id: number): Promise<StandaloneVetChat | undefined>;
  getStandaloneVetChats(userId: number): Promise<StandaloneVetChat[]>;
  updateStandaloneVetChat(id: number, updates: Partial<StandaloneVetChat>): Promise<StandaloneVetChat>;

  // Testing
  resetUserForTesting(userId: number): Promise<User>;
}

export class PostgresStorage implements IStorage {
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return results[0];
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const current = await this.getUser(id);
    if (!current) throw new Error(`User ${id} not found`);

    // NUCLEAR PROFILE ISOLATION: Explicitly only update profile columns via Raw SQL
    if (updates.email !== undefined) {
      await (db as any).execute(sql`UPDATE users SET email = ${updates.email} WHERE id = ${id}`);
    }
    if (updates.displayName !== undefined) {
      await (db as any).execute(sql`UPDATE users SET display_name = ${updates.displayName} WHERE id = ${id}`);
    }
    if (updates.photoURL !== undefined) {
      await (db as any).execute(sql`UPDATE users SET photo_url = ${updates.photoURL} WHERE id = ${id}`);
    }

    const updated = await this.getUser(id);
    if (!updated) throw new Error(`User ${id} vanished after profile update!`);
    
    console.log(`[IRON-SYNC] User ${id} Profile Synced. State: SCAN:${updated.freeScanUsed}, INJURY:${updated.freeInjuryScanUsed}, VET:${updated.vetChatCredits}`);
    return updated;
  }

  // NUCLEAR credit update: Using db.execute(sql...) to be 100% sure NO OTHER columns are touched.
  async updateUserCredits(id: number, field: 'freeScanUsed' | 'freeInjuryScanUsed' | 'vetChatCredits', value: number): Promise<User> {
    const columnMap = {
      freeScanUsed: 'free_scan_used',
      freeInjuryScanUsed: 'free_injury_scan_used',
      vetChatCredits: 'vet_chat_credits'
    };
    
    const columnName = columnMap[field];
    console.log(`[STORAGE-NUCLEAR] Atomic update user ${id}: ${columnName} = ${value}`);
    
    // Perform raw SQL update
    await (db as any).execute(sql`UPDATE users SET ${sql.raw(columnName)} = ${value} WHERE id = ${id}`);
    
    // READ-AFTER-WRITE PROTECTION: Fetch freshly but merge with our known latest state 
    // to protect against eventual consistency lag in serverless environments
    const updated = await this.getUser(id);
    if (!updated) throw new Error(`User ${id} lost during nuclear update!`);
    
    const finalState = { ...updated, [field]: value };
    console.log(`[IRON-CREDIT] User ${id} updated ${field} to ${value}. Final State: SCAN:${finalState.freeScanUsed}, INJURE:${finalState.freeInjuryScanUsed}, VET:${finalState.vetChatCredits}`);
    return finalState;
  }

  async resetUserForTesting(userId: number): Promise<User> {
    console.log(`[RESET-STORAGE] Resetting user ${userId}`);
    
    // Step 1: Reset the user flags
    const [updatedUser] = await db.update(users)
      .set({ freeScanUsed: 0, freeInjuryScanUsed: 0, vetChatCredits: 2 })
      .where(eq(users.id, userId))
      .returning();
    console.log(`[RESET-STORAGE] Updated: freeScanUsed=${updatedUser.freeScanUsed}, vetChatCredits=${updatedUser.vetChatCredits}`);

    // Step 2: Delete all associated records
    await db.delete(pets).where(eq(pets.userId, userId));
    await db.delete(standaloneScans).where(eq(standaloneScans.userId, userId));
    await db.delete(standaloneVetChats).where(eq(standaloneVetChats.userId, userId));
    await db.delete(petPortraits).where(eq(petPortraits.userId, userId));
    console.log(`[RESET-STORAGE] All data deleted for user ${userId}`);

    return updatedUser;
  }

  async getPet(id: number): Promise<Pet | undefined> {
    const results = await db.select().from(pets).where(eq(pets.id, id));
    return results[0];
  }

  async getAllPets(userId: number): Promise<Pet[]> {
    return db.select().from(pets).where(eq(pets.userId, userId));
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const [pet] = await db.insert(pets).values(insertPet).returning();
    return pet;
  }

  async updatePet(id: number, updates: Partial<InsertPet>): Promise<Pet> {
    const processedUpdates = { ...updates };

    if (updates.lastMoodUpdate) {
      try {
        const parsedDate = new Date(updates.lastMoodUpdate);
        processedUpdates.lastMoodUpdate = parsedDate;
      } catch (error) {
        console.error('Error processing lastMoodUpdate:', error);
        delete processedUpdates.lastMoodUpdate;
      }
    }

    if ((updates as any).nextVaccinationDue) {
      try {
        const parsedDate = new Date((updates as any).nextVaccinationDue);
        (processedUpdates as any).nextVaccinationDue = parsedDate;
      } catch (error) {
        console.error('Error processing nextVaccinationDue:', error);
        delete (processedUpdates as any).nextVaccinationDue;
      }
    }

    const [updatedPet] = await db.update(pets)
      .set(processedUpdates)
      .where(eq(pets.id, id))
      .returning();
    return updatedPet;
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db.insert(reminders).values(reminder).returning();
    return newReminder;
  }

  async getReminders(petId: number): Promise<Reminder[]> {
    return db.select().from(reminders).where(eq(reminders.petId, petId));
  }

  async updateReminderStatus(id: number, updates: { completed?: boolean; dueTime?: string }): Promise<void> {
    const updateData: Record<string, any> = {};

    if (updates.completed !== undefined) {
      updateData.completed = updates.completed ? 1 : 0;
    }

    if (updates.dueTime !== undefined) {
      updateData.dueTime = updates.dueTime;
    }

    await db.update(reminders)
      .set(updateData)
      .where(eq(reminders.id, id));
  }

  async deleteReminder(id: number): Promise<void> {
    await db.delete(reminders).where(eq(reminders.id, id));
  }

  async createVetConsultation(consultation: InsertVetConsultation): Promise<VetConsultation> {
    const [newConsultation] = await db.insert(vetConsultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  async getVetConsultations(petId: number): Promise<VetConsultation[]> {
    return db.select()
      .from(vetConsultations)
      .where(eq(vetConsultations.petId, petId))
      .orderBy(vetConsultations.scheduledDate);
  }

  async updateVetConsultation(id: number, updates: Partial<InsertVetConsultation>): Promise<VetConsultation> {
    const [updatedConsultation] = await db.update(vetConsultations)
      .set(updates)
      .where(eq(vetConsultations.id, id))
      .returning();
    return updatedConsultation;
  }

  async cancelVetConsultation(id: number): Promise<void> {
    await db.update(vetConsultations)
      .set({ status: 'cancelled' })
      .where(eq(vetConsultations.id, id));
  }

  async createGroomingAppointment(appointment: InsertGroomingAppointment): Promise<GroomingAppointment> {
    const [newAppointment] = await db.insert(groomingAppointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getGroomingAppointments(petId: number): Promise<GroomingAppointment[]> {
    return db.select()
      .from(groomingAppointments)
      .where(eq(groomingAppointments.petId, petId))
      .orderBy(groomingAppointments.scheduledDate);
  }

  async updateGroomingAppointment(id: number, updates: Partial<InsertGroomingAppointment>): Promise<GroomingAppointment> {
    const [updatedAppointment] = await db.update(groomingAppointments)
      .set(updates)
      .where(eq(groomingAppointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async cancelGroomingAppointment(id: number): Promise<void> {
    await db.update(groomingAppointments)
      .set({ status: 'cancelled' })
      .where(eq(groomingAppointments.id, id));
  }

  async createTrainingAppointment(appointment: InsertTrainingAppointment): Promise<TrainingAppointment> {
    const [newAppointment] = await db.insert(trainingAppointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getTrainingAppointments(petId: number): Promise<TrainingAppointment[]> {
    return db.select()
      .from(trainingAppointments)
      .where(eq(trainingAppointments.petId, petId))
      .orderBy(trainingAppointments.scheduledDate);
  }

  async updateTrainingAppointment(id: number, updates: Partial<InsertTrainingAppointment>): Promise<TrainingAppointment> {
    const [updatedAppointment] = await db.update(trainingAppointments)
      .set(updates)
      .where(eq(trainingAppointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async cancelTrainingAppointment(id: number): Promise<void> {
    await db.update(trainingAppointments)
      .set({ status: 'cancelled' })
      .where(eq(trainingAppointments.id, id));
  }

  // Insurance policy operations
  async createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy> {
    const [newPolicy] = await db.insert(insurancePolicies).values(policy).returning();
    return newPolicy;
  }

  async getInsurancePolicies(userId: number): Promise<InsurancePolicy[]> {
    return db.select()
      .from(insurancePolicies)
      .where(eq(insurancePolicies.userId, userId))
      .orderBy(desc(insurancePolicies.createdAt));
  }

  async getInsurancePolicy(id: number): Promise<InsurancePolicy | undefined> {
    const results = await db.select().from(insurancePolicies).where(eq(insurancePolicies.id, id));
    return results[0];
  }

  async updateInsurancePolicy(id: number, updates: Partial<InsertInsurancePolicy>): Promise<InsurancePolicy> {
    const [updatedPolicy] = await db.update(insurancePolicies)
      .set(updates)
      .where(eq(insurancePolicies.id, id))
      .returning();
    return updatedPolicy;
  }

  async deleteInsurancePolicy(id: number): Promise<void> {
    await db.delete(insurancePolicies).where(eq(insurancePolicies.id, id));
  }

  // Insurance claim operations
  async createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim> {
    const [newClaim] = await db.insert(insuranceClaims).values(claim).returning();
    return newClaim;
  }

  async getInsuranceClaims(userId: number): Promise<InsuranceClaim[]> {
    return db.select()
      .from(insuranceClaims)
      .where(eq(insuranceClaims.userId, userId))
      .orderBy(desc(insuranceClaims.claimDate));
  }

  async getClaimsByPolicy(policyId: number): Promise<InsuranceClaim[]> {
    return db.select()
      .from(insuranceClaims)
      .where(eq(insuranceClaims.policyId, policyId))
      .orderBy(desc(insuranceClaims.claimDate));
  }

  async updateInsuranceClaim(id: number, updates: Partial<InsertInsuranceClaim>): Promise<InsuranceClaim> {
    const [updatedClaim] = await db.update(insuranceClaims)
      .set(updates)
      .where(eq(insuranceClaims.id, id))
      .returning();
    return updatedClaim;
  }

  async deleteInsuranceClaim(id: number): Promise<void> {
    await db.delete(insuranceClaims).where(eq(insuranceClaims.id, id));
  }

  // Pet expense operations
  async createPetExpense(expense: InsertPetExpense): Promise<PetExpense> {
    const [newExpense] = await db.insert(petExpenses).values(expense).returning();
    return newExpense;
  }

  async getPetExpenses(userId: number): Promise<PetExpense[]> {
    return db.select()
      .from(petExpenses)
      .where(eq(petExpenses.userId, userId))
      .orderBy(desc(petExpenses.expenseDate));
  }

  async getPetExpensesByPet(petId: number): Promise<PetExpense[]> {
    return db.select()
      .from(petExpenses)
      .where(eq(petExpenses.petId, petId))
      .orderBy(desc(petExpenses.expenseDate));
  }

  async updatePetExpense(id: number, updates: Partial<InsertPetExpense>): Promise<PetExpense> {
    const [updatedExpense] = await db.update(petExpenses)
      .set(updates)
      .where(eq(petExpenses.id, id))
      .returning();
    return updatedExpense;
  }

  async deletePetExpense(id: number): Promise<void> {
    await db.delete(petExpenses).where(eq(petExpenses.id, id));
  }

  async createPetPortrait(portrait: InsertPetPortrait): Promise<PetPortrait> {
    const [newPortrait] = await db.insert(petPortraits).values(portrait).returning();
    return newPortrait;
  }

  async getPetPortraits(userId: number): Promise<PetPortrait[]> {
    return db.select()
      .from(petPortraits)
      .where(eq(petPortraits.userId, userId))
      .orderBy(desc(petPortraits.createdAt));
  }

  async getPetPortrait(id: number): Promise<PetPortrait | undefined> {
    const [portrait] = await db.select()
      .from(petPortraits)
      .where(eq(petPortraits.id, id));
    return portrait;
  }

  async updatePetPortrait(id: number, updates: Partial<InsertPetPortrait>): Promise<PetPortrait> {
    const [updatedPortrait] = await db.update(petPortraits)
      .set(updates)
      .where(eq(petPortraits.id, id))
      .returning();
    return updatedPortrait;
  }

  async createStandaloneScan(scan: any): Promise<StandaloneScan> {
    const [newScan] = await db.insert(standaloneScans).values(scan).returning();
    return newScan;
  }

  async getStandaloneScan(id: number): Promise<StandaloneScan | undefined> {
    const [scan] = await db.select().from(standaloneScans).where(eq(standaloneScans.id, id));
    return scan;
  }

  async updateStandaloneScan(id: number, updates: Partial<StandaloneScan>): Promise<StandaloneScan> {
    const [updatedScan] = await db.update(standaloneScans)
      .set(updates)
      .where(eq(standaloneScans.id, id))
      .returning();
    return updatedScan;
  }

  async createStandaloneVetChat(chat: any): Promise<StandaloneVetChat> {
    const [newChat] = await db.insert(standaloneVetChats).values(chat).returning();
    return newChat;
  }

  async getStandaloneVetChat(id: number): Promise<StandaloneVetChat | undefined> {
    const [chat] = await db.select().from(standaloneVetChats).where(eq(standaloneVetChats.id, id));
    return chat;
  }

  async getStandaloneVetChats(userId: number): Promise<StandaloneVetChat[]> {
    return db.select()
      .from(standaloneVetChats)
      .where(eq(standaloneVetChats.userId, userId))
      .orderBy(desc(standaloneVetChats.createdAt));
  }

  async updateStandaloneVetChat(id: number, updates: Partial<StandaloneVetChat>): Promise<StandaloneVetChat> {
    const [updatedChat] = await db.update(standaloneVetChats)
      .set(updates)
      .where(eq(standaloneVetChats.id, id))
      .returning();
    return updatedChat;
  }
}

export const storage = new PostgresStorage();