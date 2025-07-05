import { users, goals, type User, type InsertUser, type Goal, type InsertGoal } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Goal management methods
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoalsByChat(chatId: string): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  completeGoal(id: number, completedBy: string): Promise<Goal | undefined>;
  getActiveGoalsByChat(chatId: string): Promise<Goal[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async getGoalsByChat(chatId: string): Promise<Goal[]> {
    return await db.select().from(goals)
      .where(eq(goals.chatId, chatId))
      .orderBy(desc(goals.createdAt));
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal || undefined;
  }

  async completeGoal(id: number, completedBy: string): Promise<Goal | undefined> {
    const [updatedGoal] = await db
      .update(goals)
      .set({
        status: "completed",
        completedAt: new Date(),
        completedBy,
      })
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal || undefined;
  }

  async getActiveGoalsByChat(chatId: string): Promise<Goal[]> {
    return await db.select().from(goals)
      .where(and(
        eq(goals.chatId, chatId),
        eq(goals.status, "in_progress")
      ))
      .orderBy(desc(goals.createdAt));
  }
}

export const storage = new DatabaseStorage();
