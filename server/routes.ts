import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAdSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all ads with optional filters
  app.get("/api/ads", async (req, res) => {
    try {
      const { category, location, search } = req.query;
      const filters = {
        category: category as string,
        location: location as string,
        search: search as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof typeof filters]) {
          delete filters[key as keyof typeof filters];
        }
      });

      const ads = await storage.getAds(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Greška pri preuzimanju oglasa" });
    }
  });

  // Get single ad by ID
  app.get("/api/ads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Nevaljan ID oglasa" });
      }

      const ad = await storage.getAdById(id);
      if (!ad) {
        return res.status(404).json({ message: "Oglas nije pronađen" });
      }

      res.json(ad);
    } catch (error) {
      console.error("Error fetching ad:", error);
      res.status(500).json({ message: "Greška pri preuzimanju oglasa" });
    }
  });

  // Create new ad
  app.post("/api/ads", async (req, res) => {
    try {
      const validationResult = insertAdSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Neispravni podaci", 
          errors: validationError.details 
        });
      }

      const ad = await storage.createAd(validationResult.data);
      res.status(201).json(ad);
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).json({ message: "Greška pri kreiranju oglasa" });
    }
  });

  // Contact ad poster (simulate email sending)
  app.post("/api/ads/:id/contact", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Nevaljan ID oglasa" });
      }

      const ad = await storage.getAdById(id);
      if (!ad) {
        return res.status(404).json({ message: "Oglas nije pronađen" });
      }

      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Sva polja su obavezna" });
      }

      // In a real app, this would send an email
      console.log(`Contact message for ad ${id}:`, { name, email, message });
      
      res.json({ message: "Poruka je uspešno poslata" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Greška pri slanju poruke" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
