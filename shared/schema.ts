import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Task-related schemas
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  completed: boolean("completed").default(false).notNull(),
  categoryId: integer("category_id"),
  userId: integer("user_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  userId: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Alarm-related schemas
export const alarms = pgTable("alarms", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  time: timestamp("time").notNull(),
  days: text("days"), // e.g. 'daily', 'weekdays', 'mon,wed,fri'
  isActive: boolean("is_active").default(true).notNull(),
  userId: integer("user_id").notNull(),
});

export const insertAlarmSchema = createInsertSchema(alarms).omit({
  id: true,
  userId: true,
});

export type InsertAlarm = z.infer<typeof insertAlarmSchema>;
export type Alarm = typeof alarms.$inferSelect;

// Category-related schemas
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(), // e.g. 'purple', 'blue'
  userId: integer("user_id").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  userId: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Chat messages and AI responses
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isUser: boolean("is_user").default(true).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
  userId: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// User schema (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User Settings schema
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  darkMode: boolean("dark_mode").default(true).notNull(),
  notifications: boolean("notifications").default(true).notNull(),
  aiSuggestions: boolean("ai_suggestions").default(true).notNull(),
  autoTaskCreation: boolean("auto_task_creation").default(true).notNull(),
  calendarSync: boolean("calendar_sync").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const updateUserSettingsSchema = insertUserSettingsSchema.partial();

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

// Define relations between tables
export const usersRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks),
  alarms: many(alarms),
  categories: many(categories),
  messages: many(messages),
  settings: one(userSettings),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

export const alarmsRelations = relations(alarms, ({ one }) => ({
  user: one(users, {
    fields: [alarms.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));
