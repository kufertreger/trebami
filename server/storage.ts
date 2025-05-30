import { ads, type Ad, type InsertAd } from "@shared/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

export interface IStorage {
  getAds(filters?: { category?: string; location?: string; search?: string }): Promise<Ad[]>;
  getAdById(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
}

export class MemStorage implements IStorage {
  private ads: Map<number, Ad>;
  private currentId: number;

  constructor() {
    this.ads = new Map();
    this.currentId = 1;
    
    // Add some sample data for development
    this.seedData();
  }

  private seedData() {
    const sampleAds: Omit<Ad, 'id'>[] = [
      {
        title: "Potrebno čuvanje deteta sutra uveče",
        description: "Trebam nekoga da mi čuva ćerku (5 godina) sutra od 19h do 23h. Dete je mirno, samo treba da bude neko tu dok ja ne stignem sa posla. Ćerka je navikla na bakke pa nije problematična.",
        category: "childcare",
        location: "Novi Beograd",
        email: "marija.s@example.com",
        urgency: "medium",
        createdAt: new Date()
      },
      {
        title: "Montaža IKEA nameštaja",
        description: "Kupio sam garderobnu kliznu u IKEA-i i trebam nekoga da mi je sastavi. Imam sav alat, samo fali znanje i vreme.",
        category: "household",
        location: "Zemun",
        email: "stefan.m@example.com",
        urgency: "low",
        createdAt: new Date()
      },
      {
        title: "Prevoz do aerodroma",
        description: "Trebam prevoz od Vračara do aerodroma u četvrtak ujutru oko 6h. Mogu podeliti troškove goriva.",
        category: "transport",
        location: "Vračar",
        email: "ana.p@example.com",
        urgency: "high",
        createdAt: new Date()
      }
    ];

    sampleAds.forEach(ad => {
      const id = this.currentId++;
      this.ads.set(id, { ...ad, id });
    });
  }

  async getAds(filters?: { category?: string; location?: string; search?: string }): Promise<Ad[]> {
    let filteredAds = Array.from(this.ads.values());

    if (filters?.category) {
      filteredAds = filteredAds.filter(ad => ad.category === filters.category);
    }

    if (filters?.location) {
      filteredAds = filteredAds.filter(ad => 
        ad.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredAds = filteredAds.filter(ad => 
        ad.title.toLowerCase().includes(searchTerm) ||
        ad.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredAds.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAdById(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.currentId++;
    const ad: Ad = {
      ...insertAd,
      id,
      createdAt: new Date()
    };
    this.ads.set(id, ad);
    return ad;
  }
}

export const storage = new MemStorage();
