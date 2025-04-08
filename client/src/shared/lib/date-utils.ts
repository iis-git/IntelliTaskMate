// Format a date to "Oct 11" format
export function formatMonthDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format a date to "Wednesday, October 11" format
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Format a time to "9:30 AM" format
export function formatAMPM(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Get a readable representation of the day (Today, Tomorrow, or day of week)
export function getRelativeDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (isSameDay(d, today)) {
    return 'Today';
  } else if (isSameDay(d, tomorrow)) {
    return 'Tomorrow';
  } else {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

// Get the day of the week (0-6, where 0 is Sunday)
export function getDayOfWeek(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getDay();
}

// Format a time as 24-hour format (14:30)
export function format24Hour(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Get days array from a string representation (e.g., "Mon-Fri", "Daily", "Weekends")
export function getDaysFromString(daysString: string): number[] {
  if (!daysString) return [];
  
  const allDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
  const weekends = [0, 6]; // Sunday and Saturday
  
  if (daysString.toLowerCase() === 'daily') {
    return allDays;
  }
  
  if (daysString.toLowerCase() === 'weekdays') {
    return weekdays;
  }
  
  if (daysString.toLowerCase() === 'weekends') {
    return weekends;
  }
  
  if (daysString.includes('-')) {
    const [start, end] = daysString.split('-');
    const daysMap: Record<string, number> = {
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
    };
    
    const startIdx = daysMap[start.toLowerCase().substring(0, 3)];
    const endIdx = daysMap[end.toLowerCase().substring(0, 3)];
    
    if (startIdx !== undefined && endIdx !== undefined) {
      const result = [];
      if (startIdx <= endIdx) {
        for (let i = startIdx; i <= endIdx; i++) {
          result.push(i);
        }
      } else {
        // Handle wrapping around the week (e.g., Fri-Mon)
        for (let i = startIdx; i < 7; i++) {
          result.push(i);
        }
        for (let i = 0; i <= endIdx; i++) {
          result.push(i);
        }
      }
      return result;
    }
  }
  
  // Handle comma-separated days
  if (daysString.includes(',')) {
    const days = daysString.split(',');
    const daysMap: Record<string, number> = {
      'sunday': 0, 'sun': 0,
      'monday': 1, 'mon': 1,
      'tuesday': 2, 'tue': 2,
      'wednesday': 3, 'wed': 3,
      'thursday': 4, 'thu': 4,
      'friday': 5, 'fri': 5,
      'saturday': 6, 'sat': 6
    };
    
    return days
      .map(day => daysMap[day.toLowerCase().trim()])
      .filter(day => day !== undefined);
  }
  
  return [];
}

// Format days array to readable string
export function formatDaysToString(days: number[]): string {
  if (!days || days.length === 0) return 'Once';
  
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const weekdays = [1, 2, 3, 4, 5];
  const weekends = [0, 6];
  
  // Check if it's daily
  if (days.length === 7) {
    return 'Daily';
  }
  
  // Check if it's weekdays
  if (days.length === 5 && weekdays.every(day => days.includes(day))) {
    return 'Mon-Fri';
  }
  
  // Check if it's weekends
  if (days.length === 2 && weekends.every(day => days.includes(day))) {
    return 'Weekends';
  }
  
  // Otherwise, list out the days
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map(day => dayNames[day]).join(', ');
}
