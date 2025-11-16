import { 
  ConversationSession, 
  ConversationState, 
  Language, 
  ConversationResponse,
  FormDefinition,
  SlotDefinition
} from '@/types/conversation';
import { messageTemplates } from './message-templates';
import { getFormDefinition } from './form-definitions';

export class ConversationManager {
  private sessions: Map<string, ConversationSession> = new Map();

  // Create or get existing session
  getSession(sessionId: string, userId?: string): ConversationSession {
    if (!this.sessions.has(sessionId)) {
      const session: ConversationSession = {
        id: sessionId,
        userId,
        currentState: 'start',
        language: 'en', // Default to English
        context: {},
        collectedData: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.sessions.set(sessionId, session);
    }
    return this.sessions.get(sessionId)!;
  }

  // Update session state
  updateSession(sessionId: string, updates: Partial<ConversationSession>): void {
    const session = this.getSession(sessionId);
    Object.assign(session, updates, { updatedAt: new Date() });
    this.sessions.set(sessionId, session);
  }

  // Set language preference
  setLanguage(sessionId: string, language: Language): void {
    this.updateSession(sessionId, { language });
  }

  // Process user input and generate response
  async processInput(
    sessionId: string, 
    userInput: string, 
    userId?: string
  ): Promise<ConversationResponse> {
    const session = this.getSession(sessionId, userId);
    
    // Handle language detection from input
    if (this.isLikelyFrench(userInput) && session.language === 'en') {
      session.language = 'fr';
    }

    // If we're in a form, handle form input
    if (session.currentForm) {
      return this.handleFormInput(session, userInput);
    }

    // Handle state transitions based on input
    const nextState = this.determineNextState(session, userInput);
    
    if (nextState) {
      session.currentState = nextState;
      session.updatedAt = new Date();
    }

    // Check if we need to start a form
    const formName = this.getFormForState(session.currentState);
    if (formName) {
      return this.startForm(session, formName);
    }

    // Generate response for current state
    return this.generateResponse(session);
  }

  // Handle form input processing
  private async handleFormInput(
    session: ConversationSession, 
    userInput: string
  ): Promise<ConversationResponse> {
    if (!session.currentForm) {
      throw new Error('No active form found');
    }

    const { definition, currentSlot, data } = session.currentForm;
    const slot = definition.slots[currentSlot];

    // Validate and store input
    const validationResult = this.validateSlotInput(slot, userInput, session.language);
    if (!validationResult.valid) {
      return {
        message: validationResult.error!,
        requiresInput: true,
        inputType: slot.type
      };
    }

    // Store the validated data
    data[slot.name] = validationResult.value;

    // Move to next slot or complete form
    const nextSlotIndex = currentSlot + 1;
    if (nextSlotIndex < definition.slots.length) {
      // Move to next slot
      session.currentForm.currentSlot = nextSlotIndex;
      session.currentForm.data = data;
      
      const nextSlot = definition.slots[nextSlotIndex];
      return {
        message: this.getSlotMessage(nextSlot, session.language),
        requiresInput: true,
        inputType: nextSlot.type,
        quickReplies: this.getSlotOptions(nextSlot, session.language)
      };
    } else {
      // Form complete - submit data
      return this.completeForm(session);
    }
  }

  // Start a form for data collection
  private startForm(session: ConversationSession, formName: string): ConversationResponse {
    const formDefinition = getFormDefinition(formName);
    if (!formDefinition) {
      throw new Error(`Form definition not found: ${formName}`);
    }

    session.currentForm = {
      definition: formDefinition,
      currentSlot: 0,
      data: {}
    };

    const firstSlot = formDefinition.slots[0];
    return {
      message: this.getSlotMessage(firstSlot, session.language),
      requiresInput: true,
      inputType: firstSlot.type,
      quickReplies: this.getSlotOptions(firstSlot, session.language)
    };
  }

  // Complete form and trigger webhook
  private async completeForm(session: ConversationSession): Promise<ConversationResponse> {
    if (!session.currentForm) {
      throw new Error('No active form to complete');
    }

    const { definition, data } = session.currentForm;
    
    // Store collected data
    session.collectedData = { ...session.collectedData, ...data };
    
    // Prepare webhook payload
    const webhookPayload = {
      endpoint: definition.submitAction,
      method: 'POST' as const,
      data: {
        ...data,
        sessionId: session.id,
        userId: session.userId,
        timestamp: new Date().toISOString()
      }
    };

    // Generate confirmation message
    const confirmationMessage = definition.confirmationMessage[session.language];
    
    // Clear current form
    session.currentForm = undefined;
    
    // Move to end_or_more state
    session.currentState = 'end_or_more';

    return {
      message: confirmationMessage,
      webhookAction: webhookPayload,
      nextState: 'end_or_more'
    };
  }

  // Validate slot input
  private validateSlotInput(
    slot: SlotDefinition, 
    input: string, 
    language: Language
  ): { valid: boolean; value?: any; error?: string } {
    const trimmedInput = input.trim();

    // Check required
    if (slot.required && !trimmedInput) {
      return {
        valid: false,
        error: language === 'en' 
          ? 'This field is required.' 
          : 'Ce champ est obligatoire.'
      };
    }

    // Type-specific validation
    switch (slot.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (trimmedInput && !emailRegex.test(trimmedInput)) {
          return {
            valid: false,
            error: language === 'en' 
              ? 'Please enter a valid email address.' 
              : 'Veuillez entrer une adresse courriel valide.'
          };
        }
        break;

      case 'phone':
        if (slot.validation?.pattern) {
          const phoneRegex = new RegExp(slot.validation.pattern);
          if (trimmedInput && !phoneRegex.test(trimmedInput)) {
            return {
              valid: false,
              error: language === 'en' 
                ? 'Please enter a valid phone number.' 
                : 'Veuillez entrer un numéro de téléphone valide.'
            };
          }
        }
        break;

      case 'boolean':
        const booleanValue = this.parseBooleanInput(trimmedInput, language);
        if (booleanValue === null) {
          return {
            valid: false,
            error: language === 'en' 
              ? 'Please answer Yes or No.' 
              : 'Veuillez répondre Oui ou Non.'
          };
        }
        return { valid: true, value: booleanValue };

      case 'select':
        if (slot.options) {
          const validOption = slot.options.find(opt => 
            opt.value.toLowerCase() === trimmedInput.toLowerCase() ||
            opt.label[language].toLowerCase() === trimmedInput.toLowerCase()
          );
          if (!validOption) {
            return {
              valid: false,
              error: language === 'en' 
                ? 'Please select a valid option.' 
                : 'Veuillez sélectionner une option valide.'
            };
          }
          return { valid: true, value: validOption.value };
        }
        break;
    }

    // Length validation
    if (slot.validation?.minLength && trimmedInput.length < slot.validation.minLength) {
      return {
        valid: false,
        error: language === 'en' 
          ? `Please enter at least ${slot.validation.minLength} characters.`
          : `Veuillez entrer au moins ${slot.validation.minLength} caractères.`
      };
    }

    if (slot.validation?.maxLength && trimmedInput.length > slot.validation.maxLength) {
      return {
        valid: false,
        error: language === 'en' 
          ? `Please enter no more than ${slot.validation.maxLength} characters.`
          : `Veuillez entrer au maximum ${slot.validation.maxLength} caractères.`
      };
    }

    return { valid: true, value: trimmedInput };
  }

  // Parse boolean input in both languages
  private parseBooleanInput(input: string, language: Language): boolean | null {
    const lower = input.toLowerCase().trim();
    
    const yesValues = ['yes', 'y', 'true', '1', 'oui', 'o', 'vrai'];
    const noValues = ['no', 'n', 'false', '0', 'non', 'faux'];
    
    if (yesValues.includes(lower)) return true;
    if (noValues.includes(lower)) return false;
    return null;
  }

  // Get message for a slot
  private getSlotMessage(slot: SlotDefinition, language: Language): string {
    let message = slot.label[language];
    
    if (slot.options) {
      const options = slot.options.map(opt => opt.label[language]).join(', ');
      message += ` (${options})`;
    }
    
    return message;
  }

  // Get quick reply options for a slot
  private getSlotOptions(slot: SlotDefinition, language: Language): any[] | undefined {
    if (slot.type === 'boolean') {
      return language === 'en' 
        ? [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
        : [{ label: 'Oui', value: 'yes' }, { label: 'Non', value: 'no' }];
    }
    
    if (slot.options) {
      return slot.options.map(opt => ({
        label: opt.label[language],
        value: opt.value
      }));
    }
    
    return undefined;
  }

  // Determine next state based on current state and input
  private determineNextState(session: ConversationSession, input: string): ConversationState | null {
    const currentState = session.currentState;
    const lowerInput = input.toLowerCase().trim();

    // Handle button/quick reply values
    const template = messageTemplates[currentState];
    if (template.quickReplies) {
      const replies = template.quickReplies[session.language];
      const matchedReply = replies.find(reply => 
        reply.value.toLowerCase() === lowerInput ||
        reply.label.toLowerCase() === lowerInput
      );
      if (matchedReply?.nextState) {
        return matchedReply.nextState;
      }
    }

    // Handle specific state logic
    switch (currentState) {
      case 'start':
      case 'main_menu':
        if (['maintenance', 'entretien', 'maint'].some(word => lowerInput.includes(word))) {
          return 'maint_intro';
        }
        if (['billing', 'facturation', 'payment', 'paiement'].some(word => lowerInput.includes(word))) {
          return 'billing_intro';
        }
        if (['lease', 'bail'].some(word => lowerInput.includes(word))) {
          return 'lease_intro';
        }
        if (['emergency', 'urgence', 'urgent'].some(word => lowerInput.includes(word))) {
          return 'emergency_gate';
        }
        if (['parking', 'stationnement'].some(word => lowerInput.includes(word))) {
          return 'parking_intro';
        }
        if (['internet', 'wifi'].some(word => lowerInput.includes(word))) {
          return 'internet_intro';
        }
        if (['human', 'person', 'humain', 'personne'].some(word => lowerInput.includes(word))) {
          return 'handoff_intro';
        }
        break;

      case 'emergency_gate':
        if (['yes', 'oui', 'y', 'o'].includes(lowerInput)) {
          return 'emergency_now';
        }
        if (['no', 'non', 'n'].includes(lowerInput)) {
          return 'maint_intro';
        }
        break;

      case 'fallback':
        // Try to route again based on input
        return this.determineNextState({ ...session, currentState: 'main_menu' }, input);
    }

    return null;
  }

  // Generate response for current state
  private generateResponse(session: ConversationSession): ConversationResponse {
    const template = messageTemplates[session.currentState];
    const message = template[session.language];
    const quickReplies = template.quickReplies?.[session.language];

    return {
      message,
      quickReplies,
      requiresInput: template.requiresInput,
      inputType: template.inputType
    };
  }

  // Determine if we need to start a form for the current state
  private getFormForState(state: ConversationState): string | null {
    const formMappings: Partial<Record<ConversationState, string>> = {
      'maint_intro': 'maintenance_request',
      'emergency_now': 'emergency_alert',
      'billing_fees': 'billing_fees',
      'lease_transfer': 'lease_transfer',
      'parking_intro': 'parking_request',
      'handoff_intro': 'handoff'
    };

    return formMappings[state] || null;
  }

  // Simple French language detection
  private isLikelyFrench(text: string): boolean {
    const frenchWords = [
      'bonjour', 'salut', 'merci', 'oui', 'non', 'je', 'suis', 'avec', 'pour', 
      'dans', 'sur', 'une', 'des', 'les', 'mon', 'ma', 'mes', 'votre', 'vos',
      'entretien', 'facturation', 'bail', 'urgence', 'stationnement'
    ];
    
    const lowerText = text.toLowerCase();
    const frenchWordCount = frenchWords.filter(word => lowerText.includes(word)).length;
    
    return frenchWordCount >= 2 || lowerText.includes('français');
  }

  // Get all sessions (for admin/debugging)
  getAllSessions(): ConversationSession[] {
    return Array.from(this.sessions.values());
  }

  // Clear old sessions (cleanup)
  clearOldSessions(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt < cutoffTime) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Singleton instance
export const conversationManager = new ConversationManager();
