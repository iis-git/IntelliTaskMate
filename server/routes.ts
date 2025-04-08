import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertAlarmSchema, 
  insertCategorySchema, 
  insertMessageSchema,
  insertUserSettingsSchema,
  updateUserSettingsSchema
} from "../shared/schema";
import OpenAI from "openai";
import { authenticate, register, login, getCurrentUser } from "./auth";
import "./types"; // Import types to extend Express Request

// Initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/user", authenticate, getCurrentUser);

  // Task routes
  app.get("/api/tasks", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      console.log("Task data received:", req.body);
      // Make sure date is parsed correctly if it's a string
      if (req.body.date && typeof req.body.date === 'string') {
        req.body.date = new Date(req.body.date);
      }
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData, req.user.id);
      res.status(201).json(task);
    } catch (error) {
      console.error("Task validation error:", error);
      res.status(400).json({ error: "Invalid task data", details: error.errors || error.message });
    }
  });

  app.patch("/api/tasks/:id", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const id = parseInt(req.params.id);
    const success = await storage.deleteTask(id);
    
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.status(204).send();
  });

  // Alarm routes
  app.get("/api/alarms", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const alarms = await storage.getAlarms(req.user.id);
    res.json(alarms);
  });

  app.post("/api/alarms", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      console.log("Alarm data received:", req.body);
      // Make sure time is parsed correctly if it's a string
      if (req.body.time && typeof req.body.time === 'string') {
        req.body.time = new Date(req.body.time);
      }
      const alarmData = insertAlarmSchema.parse(req.body);
      const alarm = await storage.createAlarm(alarmData, req.user.id);
      res.status(201).json(alarm);
    } catch (error) {
      console.error("Alarm validation error:", error);
      res.status(400).json({ error: "Invalid alarm data", details: error.errors || error.message });
    }
  });

  app.patch("/api/alarms/:id", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const id = parseInt(req.params.id);
      const alarmData = insertAlarmSchema.partial().parse(req.body);
      const alarm = await storage.updateAlarm(id, alarmData);
      
      if (!alarm) {
        return res.status(404).json({ error: "Alarm not found" });
      }
      
      res.json(alarm);
    } catch (error) {
      res.status(400).json({ error: "Invalid alarm data" });
    }
  });

  app.delete("/api/alarms/:id", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const id = parseInt(req.params.id);
    const success = await storage.deleteAlarm(id);
    
    if (!success) {
      return res.status(404).json({ error: "Alarm not found" });
    }
    
    res.status(204).send();
  });

  // Category routes
  app.get("/api/categories", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const categories = await storage.getCategories(req.user.id);
    res.json(categories);
  });

  app.post("/api/categories", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData, req.user.id);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  // Message routes
  app.get("/api/messages", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const messages = await storage.getMessages(req.user.id, limit);
    res.json(messages);
  });

  app.post("/api/messages", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData, req.user.id);
      res.status(201).json(message);

      // If this is a user message, generate AI response
      if (messageData.isUser) {
        await generateAIResponse(messageData.content, req.user.id, res);
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // AI Assistant routes
  app.post("/api/ai/chat", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    try {
      // Store user message
      await storage.createMessage({ content: message, isUser: true }, req.user.id);
      
      // Generate AI response
      await generateAIResponse(message, req.user.id, res);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // User routes
  app.get("/api/user", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove password before sending to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // User Settings routes
  app.get("/api/settings", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Get user settings or create default settings if none exist
      let settings = await storage.getUserSettings(req.user.id);
      
      if (!settings) {
        // Create default settings for the user
        settings = await storage.createUserSettings({
          darkMode: true,
          notifications: true,
          aiSuggestions: true,
          autoTaskCreation: true,
          calendarSync: false
        }, req.user.id);
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ error: "Failed to retrieve settings" });
    }
  });
  
  app.patch("/api/settings", authenticate, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Validate the settings data
      const settingsData = updateUserSettingsSchema.parse(req.body);
      
      // Get existing settings or create new ones
      let settings = await storage.getUserSettings(req.user.id);
      
      if (!settings) {
        // Create new settings with provided data and defaults
        settings = await storage.createUserSettings({
          ...settingsData,
          darkMode: settingsData.darkMode ?? true,
          notifications: settingsData.notifications ?? true,
          aiSuggestions: settingsData.aiSuggestions ?? true,
          autoTaskCreation: settingsData.autoTaskCreation ?? true,
          calendarSync: settingsData.calendarSync ?? false
        }, req.user.id);
      } else {
        // Update existing settings
        settings = await storage.updateUserSettings(req.user.id, settingsData);
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(400).json({ 
        error: "Invalid settings data", 
        details: error.errors || error.message 
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate AI response
async function generateAIResponse(userMessage: string, userId: number, res?: Response) {
  try {
    // Extract task/alarm creation intent from message
    const containsTaskIntent = userMessage.toLowerCase().includes("schedule") || 
                               userMessage.toLowerCase().includes("task") || 
                               userMessage.toLowerCase().includes("appointment") || 
                               userMessage.toLowerCase().includes("meeting") ||
                               userMessage.toLowerCase().includes("remind me to");
    
    const containsAlarmIntent = userMessage.toLowerCase().includes("alarm") || 
                                userMessage.toLowerCase().includes("reminder") || 
                                userMessage.toLowerCase().includes("wake me") || 
                                userMessage.toLowerCase().includes("alert");
    
    let aiResponse = "";
    let createdEntity = null;
    
    // If OpenAI is available, use it for processing
    if (openai) {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Aura, an AI assistant for a task and alarm management app. " + 
                    "Analyze the user message and identify if they want to create a task or set an alarm. " +
                    "If so, extract the relevant details (title, date/time, description if any). " +
                    "Format your response as natural language but also include structured data in JSON format at the end if a task or alarm should be created."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      });
      
      aiResponse = completion.choices[0].message.content || "";
      
      // Check if response contains structured data for task/alarm creation
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[0]);
          
          if (data.type === "task" && data.title && data.date) {
            const task = await storage.createTask({
              title: data.title,
              description: data.description || "",
              date: new Date(data.date),
              completed: false,
              categoryId: data.categoryId || 1
            }, userId);
            
            createdEntity = { type: "task", data: task };
          } else if (data.type === "alarm" && data.title && data.time) {
            const alarm = await storage.createAlarm({
              title: data.title,
              time: new Date(data.time),
              days: data.days || "Once",
              isActive: true
            }, userId);
            
            createdEntity = { type: "alarm", data: alarm };
          }
          
          // Remove the JSON part from the response
          aiResponse = aiResponse.replace(/\{[\s\S]*\}/, "").trim();
        } catch (error) {
          console.error("Failed to parse AI response JSON:", error);
        }
      }
    } else {
      // Fallback if OpenAI is not available - basic intent recognition
      if (containsTaskIntent) {
        // Extract potential date/time
        const timeMatch = userMessage.match(/(\d{1,2})(:\d{2})?\s*(am|pm)?/i);
        let taskTime = new Date();
        
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2].substring(1)) : 0;
          const ampm = timeMatch[3]?.toLowerCase();
          
          if (ampm === "pm" && hours < 12) hours += 12;
          if (ampm === "am" && hours === 12) hours = 0;
          
          taskTime.setHours(hours, minutes, 0, 0);
        }
        
        // Extract tomorrow if mentioned
        if (userMessage.toLowerCase().includes("tomorrow")) {
          taskTime.setDate(taskTime.getDate() + 1);
        }
        
        // Create a simple task
        const title = userMessage.split(" ").slice(0, 4).join(" ") + "...";
        const task = await storage.createTask({
          title: title,
          description: userMessage,
          date: taskTime,
          completed: false,
          categoryId: 1
        }, userId);
        
        aiResponse = `I've added a task for ${title} at ${taskTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Is there anything else you need?`;
        createdEntity = { type: "task", data: task };
      } else if (containsAlarmIntent) {
        // Extract time for alarm
        const timeMatch = userMessage.match(/(\d{1,2})(:\d{2})?\s*(am|pm)?/i);
        let alarmTime = new Date();
        
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2].substring(1)) : 0;
          const ampm = timeMatch[3]?.toLowerCase();
          
          if (ampm === "pm" && hours < 12) hours += 12;
          if (ampm === "am" && hours === 12) hours = 0;
          
          alarmTime.setHours(hours, minutes, 0, 0);
        }
        
        // Create a simple alarm
        const alarm = await storage.createAlarm({
          title: "Alarm",
          time: alarmTime,
          days: "Once",
          isActive: true
        }, userId);
        
        aiResponse = `I've set an alarm for ${alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Is there anything else you need?`;
        createdEntity = { type: "alarm", data: alarm };
      } else {
        aiResponse = "I understand you need assistance. Could you please provide more details about what you'd like me to help you with?";
      }
    }
    
    // Store AI response
    const aiMessage = await storage.createMessage({ content: aiResponse, isUser: false }, userId);
    
    // If a response object was provided, send the AI's response
    if (res) {
      res.json({ 
        message: aiMessage, 
        createdEntity 
      });
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    if (res) {
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  }
}
