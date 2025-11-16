import { BusinessHours } from '@/types/conversation';

export class BusinessHoursManager {
  private businessHours: BusinessHours = {
    timezone: 'America/Toronto',
    schedule: {
      'monday': { open: '08:00', close: '16:00' },
      'tuesday': { open: '08:00', close: '16:00' },
      'wednesday': { open: '08:00', close: '16:00' },
      'thursday': { open: '08:00', close: '16:00' },
      'friday': { open: '08:00', close: '16:00' },
      'saturday': { open: '', close: '' }, // Closed
      'sunday': { open: '', close: '' }    // Closed
    }
  };

  // Check if current time is within business hours
  isBusinessHours(date?: Date): boolean {
    const now = date || new Date();
    
    // Convert to business timezone
    const businessTime = new Date(now.toLocaleString("en-US", { timeZone: this.businessHours.timezone }));
    
    const dayName = businessTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = this.businessHours.schedule[dayName];
    
    // If no schedule for this day, it's closed
    if (!daySchedule || !daySchedule.open || !daySchedule.close) {
      return false;
    }
    
    const currentTime = this.formatTime(businessTime);
    return currentTime >= daySchedule.open && currentTime < daySchedule.close;
  }

  // Get next business day opening time
  getNextBusinessOpening(date?: Date): Date {
    const now = date || new Date();
    let checkDate = new Date(now);
    
    // Check up to 7 days ahead to find next business opening
    for (let i = 0; i < 7; i++) {
      const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const daySchedule = this.businessHours.schedule[dayName];
      
      if (daySchedule && daySchedule.open) {
        // If it's today and we're before opening time
        if (i === 0) {
          const currentTime = this.formatTime(new Date(checkDate.toLocaleString("en-US", { timeZone: this.businessHours.timezone })));
          if (currentTime < daySchedule.open) {
            return this.createBusinessDateTime(checkDate, daySchedule.open);
          }
        } else {
          // It's a future business day
          return this.createBusinessDateTime(checkDate, daySchedule.open);
        }
      }
      
      // Move to next day
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    // Fallback: next Monday at 8 AM
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    return this.createBusinessDateTime(nextMonday, '08:00');
  }

  // Get business hours message in both languages
  getBusinessHoursMessage(language: 'en' | 'fr' = 'en'): string {
    if (language === 'fr') {
      return "Nos heures d'affaires sont du lundi au vendredi de 8h00 à 16h00 (EST). Si c'est une véritable urgence, appelez la ligne d'urgence.";
    }
    
    return "Our business hours are Monday-Friday 8:00 AM to 4:00 PM (EST). If this is a true emergency, please call the emergency line.";
  }

  // Get after-hours message
  getAfterHoursMessage(language: 'en' | 'fr' = 'en'): string {
    const nextOpening = this.getNextBusinessOpening();
    const nextOpeningStr = nextOpening.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: this.businessHours.timezone
    });

    if (language === 'fr') {
      return `Nous sommes actuellement fermés. Nous répondrons le prochain jour ouvrable (${nextOpeningStr}). Si c'est une véritable urgence, appelez la ligne d'urgence maintenant.`;
    }
    
    return `We're currently closed. We'll respond on the next business day (${nextOpeningStr}). If this is a true emergency, please call the emergency line now.`;
  }

  // Check if it's an emergency contact situation
  shouldOfferEmergencyContact(language: 'en' | 'fr' = 'en'): boolean {
    return !this.isBusinessHours();
  }

  // Get emergency contact message
  getEmergencyContactMessage(language: 'en' | 'fr' = 'en'): string {
    if (language === 'fr') {
      return "Pour les vraies urgences (fuite active, feu/fumée, odeur de gaz, absence de chauffage en hiver), appelez immédiatement : 873.660.1498";
    }
    
    return "For true emergencies (active leak, fire/smoke, gas smell, no heat in winter), call immediately: 873.660.1498";
  }

  // Format time as HH:mm
  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }

  // Create a Date object for a specific business day and time
  private createBusinessDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const businessDate = new Date(date);
    businessDate.setHours(hours, minutes, 0, 0);
    
    // Convert from business timezone to local
    const utcTime = businessDate.getTime() + businessDate.getTimezoneOffset() * 60000;
    const businessOffset = this.getTimezoneOffset(this.businessHours.timezone);
    return new Date(utcTime + businessOffset);
  }

  // Get timezone offset in milliseconds
  private getTimezoneOffset(timezone: string): number {
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return target.getTime() - utc.getTime();
  }

  // Update business hours (for configuration)
  updateBusinessHours(newHours: Partial<BusinessHours>): void {
    this.businessHours = { ...this.businessHours, ...newHours };
  }

  // Get current business hours configuration
  getBusinessHours(): BusinessHours {
    return { ...this.businessHours };
  }
}

// Singleton instance
export const businessHoursManager = new BusinessHoursManager();
