import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ads, type Ad, type InsertAd } from "@shared/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

export interface IStorage {
  getAds(filters?: { category?: string; location?: string; search?: string }): Promise<Ad[]>;
  getAdById(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
}

// Database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export class DbStorage implements IStorage {
  async getAds(filters?: { category?: string; location?: string; search?: string }): Promise<Ad[]> {
    let query = db.select().from(ads);
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(ads.category, filters.category));
    }

    if (filters?.location) {
      conditions.push(ilike(ads.location, `%${filters.location}%`));
    }

    if (filters?.search) {
      conditions.push(
        ilike(ads.title, `%${filters.search}%`)
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(desc(ads.createdAt));
    return results;
  }

  async getAdById(id: number): Promise<Ad | undefined> {
    const results = await db.select().from(ads).where(eq(ads.id, id));
    return results[0];
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const results = await db.insert(ads).values(insertAd).returning();
    return results[0];
  }
}

export const storage = new DbStorage();
