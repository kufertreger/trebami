import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  urgency: text("urgency").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(5, "Naslov mora imati najmanje 5 karaktera"),
  description: z.string().min(20, "Opis mora imati najmanje 20 karaktera"),
  category: z.enum(["childcare", "household", "transport", "repair", "cleaning", "gardening", "shopping", "other"]),
  location: z.string().min(2, "Molimo unesite lokaciju"),
  email: z.string().email("Molimo unesite valjan email"),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
});

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;
