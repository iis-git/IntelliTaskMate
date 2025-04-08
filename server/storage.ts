import { 
  Task, InsertTask, 
  Alarm, InsertAlarm,
  Category, InsertCategory,
  Message, InsertMessage,
  User, InsertUser,
  users
} from "@shared/schema";

interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask, userId: number): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Alarm operations
  getAlarms(userId: number): Promise<Alarm[]>;
  getAlarm(id: number): Promise<Alarm | undefined>;
  createAlarm(alarm: InsertAlarm, userId: number): Promise<Alarm>;
  updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined>;
  deleteAlarm(id: number): Promise<boolean>;
  
  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory, userId: number): Promise<Category>;
  
  // Message operations
  getMessages(userId: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage, userId: number): Promise<Message>;
}

class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private alarms: Map<number, Alarm>;
  private categories: Map<number, Category>;
  private messages: Map<number, Message>;
  
  private userId: number;
  private taskId: number;
  private alarmId: number;
  private categoryId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.alarms = new Map();
    this.categories = new Map();
    this.messages = new Map();
    
    this.userId = 1;
    this.taskId = 1;
    this.alarmId = 1;
    this.categoryId = 1;
    this.messageId = 1;
    
    // Pre-populate with default user
    this.createUser({
      username: "demo",
      password: "demo",
      name: "Alex",
      email: "alex@example.com"
    });
    
    // Pre-populate with default categories
    this.createCategory({ name: "Daily", color: "purple" }, 1);
    this.createCategory({ name: "Work", color: "blue" }, 1);
    this.createCategory({ name: "Personal", color: "purple" }, 1);
    
    // Pre-populate with sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.createTask({
      title: "Morning routine",
      description: "Complete morning meditation and exercise",
      date: new Date(new Date().setHours(7, 0, 0, 0)),
      completed: false,
      categoryId: 1
    }, 1);
    
    this.createTask({
      title: "Team meeting",
      description: "Weekly sprint planning with design team",
      date: new Date(new Date().setHours(10, 0, 0, 0)),
      completed: false,
      categoryId: 2
    }, 1);
    
    this.createTask({
      title: "Doctor's appointment",
      description: "Annual check-up",
      date: new Date(new Date().setHours(14, 0, 0, 0)),
      completed: false,
      categoryId: 3
    }, 1);
    
    this.createTask({
      title: "Write daily report",
      description: "Include project updates",
      date: new Date(new Date().setHours(16, 30, 0, 0)),
      completed: false,
      categoryId: 2
    }, 1);
    
    this.createTask({
      title: "Review presentation slides",
      description: "Check for errors and improve visuals",
      date: new Date(new Date().setHours(9, 30, 0, 0)),
      completed: true,
      categoryId: 2
    }, 1);
    
    // Pre-populate with sample alarms
    this.createAlarm({
      title: "Morning Workout",
      time: new Date(new Date().setHours(7, 0, 0, 0)),
      days: "Daily",
      isActive: true
    }, 1);
    
    this.createAlarm({
      title: "Meeting Reminder",
      time: new Date(new Date().setHours(10, 45, 0, 0)),
      days: "Mon-Fri",
      isActive: true
    }, 1);
    
    this.createAlarm({
      title: "Evening Meditation",
      time: new Date(new Date().setHours(21, 0, 0, 0)),
      days: "Daily",
      isActive: true
    }, 1);
    
    this.createAlarm({
      title: "Weekend Run",
      time: new Date(new Date().setHours(8, 30, 0, 0)),
      days: "Sat-Sun",
      isActive: false
    }, 1);
    
    // Pre-populate with sample messages
    this.createMessage({
      content: "Hi there! I'm Aura, your personal AI assistant. How can I help you today?",
      isUser: false
    }, 1);
    
    this.createMessage({
      content: "I need to schedule a doctor's appointment tomorrow at 2pm",
      isUser: true
    }, 1);
    
    this.createMessage({
      content: "I've added a task for your doctor's appointment tomorrow at 2:00 PM. Would you like me to set a reminder as well?",
      isUser: false
    }, 1);
    
    this.createMessage({
      content: "Yes, please set a reminder 30 minutes before",
      isUser: true
    }, 1);
    
    this.createMessage({
      content: "I've set a reminder for 1:30 PM tomorrow. Anything else you need help with?",
      isUser: false
    }, 1);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask, userId: number): Promise<Task> {
    const id = this.taskId++;
    const newTask: Task = { ...task, id, userId };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Alarm methods
  async getAlarms(userId: number): Promise<Alarm[]> {
    return Array.from(this.alarms.values()).filter(alarm => alarm.userId === userId);
  }

  async getAlarm(id: number): Promise<Alarm | undefined> {
    return this.alarms.get(id);
  }

  async createAlarm(alarm: InsertAlarm, userId: number): Promise<Alarm> {
    const id = this.alarmId++;
    const newAlarm: Alarm = { ...alarm, id, userId };
    this.alarms.set(id, newAlarm);
    return newAlarm;
  }

  async updateAlarm(id: number, alarmUpdate: Partial<InsertAlarm>): Promise<Alarm | undefined> {
    const alarm = this.alarms.get(id);
    if (!alarm) return undefined;
    
    const updatedAlarm: Alarm = { ...alarm, ...alarmUpdate };
    this.alarms.set(id, updatedAlarm);
    return updatedAlarm;
  }

  async deleteAlarm(id: number): Promise<boolean> {
    return this.alarms.delete(id);
  }

  // Category methods
  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(category => category.userId === userId);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory, userId: number): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id, userId };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Message methods
  async getMessages(userId: number, limit?: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (limit) {
      return userMessages.slice(-limit);
    }
    return userMessages;
  }

  async createMessage(message: InsertMessage, userId: number): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = { 
      ...message, 
      id, 
      userId, 
      timestamp: new Date() 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
export type { IStorage };
