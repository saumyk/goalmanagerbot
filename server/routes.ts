import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoalBot } from "./telegram-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get("/health", (req, res) => {
    res.json({ 
      status: "healthy",
      service: "GoalBot",
      timestamp: new Date().toISOString()
    });
  });

  // Bot status endpoint
  app.get("/api/bot/status", async (req, res) => {
    try {
      res.json({ 
        status: "online",
        message: "GoalBot is running",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error",
        message: "Bot status check failed" 
      });
    }
  });

  // Get goals for monitoring (optional web interface)
  app.get("/api/goals", async (req, res) => {
    try {
      const chatId = req.query.chatId as string;
      if (!chatId) {
        return res.status(400).json({ message: "chatId is required" });
      }
      
      const goals = await storage.getGoalsByChat(chatId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching goals" });
    }
  });

  // Initialize the Telegram bot
  const bot = new GoalBot();
  await bot.start();

  const httpServer = createServer(app);
  return httpServer;
}
