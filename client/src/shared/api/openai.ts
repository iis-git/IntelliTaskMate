import { apiRequest } from "./queryClient";

export async function sendMessageToAI(message: string) {
  try {
    const response = await apiRequest("POST", "/api/ai/chat", { message });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw error;
  }
}

export function extractTaskInformation(text: string): {
  title?: string;
  description?: string;
  date?: Date;
  time?: string;
} {
  const result: {
    title?: string;
    description?: string;
    date?: Date;
    time?: string;
  } = {};

  // Try to extract a title (first sentence or first N words)
  const firstSentenceMatch = text.match(/^(.*?)[.!?](?:\s|$)/);
  if (firstSentenceMatch && firstSentenceMatch[1].length < 50) {
    result.title = firstSentenceMatch[1].trim();
  } else {
    const words = text.split(' ');
    result.title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  }

  // Set the full text as description
  result.description = text;

  // Try to extract date and time
  const timeMatch = text.match(/(\d{1,2})(:\d{2})?\s*(am|pm|AM|PM)/);
  const dateMatch = text.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  
  const now = new Date();
  
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2].substring(1)) : 0;
    const ampm = timeMatch[3].toLowerCase();
    
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    
    result.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    now.setHours(hours, minutes, 0, 0);
    result.date = new Date(now);
  }
  
  if (dateMatch) {
    const day = dateMatch[1].toLowerCase();
    const today = new Date();
    
    if (day === 'tomorrow') {
      today.setDate(today.getDate() + 1);
      result.date = today;
    } else if (day !== 'today') {
      // Handle days of the week
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(day);
      if (targetDay !== -1) {
        const currentDay = today.getDay();
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7; // Next week if day has passed
        
        today.setDate(today.getDate() + daysToAdd);
        result.date = today;
      }
    } else {
      result.date = today;
    }
  }
  
  return result;
}
