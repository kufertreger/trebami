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
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.rdrofqiviimajxmefrqc:H5SsG2%23ZGxAe%24%3Fz@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Initialize database tables
async function initializeTables() {
  try {
    await client`
      CREATE TABLE IF NOT EXISTS "ads" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "category" text NOT NULL,
        "location" text NOT NULL,
        "email" text NOT NULL,
        "urgency" text DEFAULT 'medium' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log("✅ Database tables initialized");
    
    // Add sample data if table is empty
    const existingAds = await client`SELECT COUNT(*) FROM ads`;
    if (existingAds[0].count === '0') {
      await client`
        INSERT INTO ads (title, description, category, location, email, urgency)
        VALUES 
        ('Potrebno čuvanje deteta sutra uveče', 'Trebam nekoga da mi čuva ćerku (5 godina) sutra od 19h do 23h. Dete je mirno, samo treba da bude neko tu dok ja ne stignem sa posla. Ćerka je navikla na bake pa nije problematična.', 'childcare', 'Novi Beograd', 'marija.s@example.com', 'medium'),
        ('Montaža IKEA nameštaja', 'Kupio sam garderobnu kliznu u IKEA-i i trebam nekoga da mi je sastavi. Imam sav alat, samo fali znanje i vreme.', 'household', 'Zemun', 'stefan.m@example.com', 'low'),
        ('Prevoz do aerodroma', 'Trebam prevoz od Vračara do aerodroma u četvrtak ujutru oko 6h. Mogu podeliti troškove goriva.', 'transport', 'Vračar', 'ana.p@example.com', 'high')
      `;
      console.log("✅ Sample data added");
    }
  } catch (error) {
    console.error("❌ Error initializing database tables:", error);
  }
}

// Initialize tables on startup
initializeTables();

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
