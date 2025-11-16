// Core conversation types for the property management system

export type Language = 'en' | 'fr';

export type ConversationState = 
  | 'start'
  | 'main_menu'
  | 'emergency_gate'
  | 'emergency_now'
  | 'maint_intro'
  | 'billing_intro'
  | 'billing_pay'
  | 'billing_fees'
  | 'billing_balance'
  | 'lease_intro'
  | 'lease_transfer'
  | 'lease_occupant'
  | 'lease_renewal'
  | 'lease_termination'
  | 'move_in_intro'
  | 'move_out_intro'
  | 'parking_intro'
  | 'noise_intro'
  | 'internet_intro'
  | 'portal_intro'
  | 'status_intro'
  | 'status_with_wo'
  | 'status_by_unit'
  | 'docs_intro'
  | 'handoff_intro'
  | 'fallback'
  | 'end_or_more';

export type ButtonAction = {
  label: string;
  value: string;
  nextState?: ConversationState;
};

export type QuickReply = {
  en: ButtonAction[];
  fr: ButtonAction[];
};

export type MessageTemplate = {
  en: string;
  fr: string;
  quickReplies?: QuickReply;
  requiresInput?: boolean;
  inputType?: 'text' | 'email' | 'phone' | 'select' | 'multiselect';
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
};

export type SlotDefinition = {
  name: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'boolean' | 'date' | 'time';
  required: boolean;
  label: MessageTemplate;
  options?: { value: string; label: MessageTemplate }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
};

export type FormDefinition = {
  slots: SlotDefinition[];
  submitAction: string;
  confirmationMessage: MessageTemplate;
};

export type ConversationSession = {
  id: string;
  userId?: string;
  currentState: ConversationState;
  language: Language;
  context: Record<string, any>;
  collectedData: Record<string, any>;
  currentForm?: {
    definition: FormDefinition;
    currentSlot: number;
    data: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type WebhookPayload = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  headers?: Record<string, string>;
};

export type ConversationResponse = {
  message: string;
  quickReplies?: ButtonAction[];
  requiresInput?: boolean;
  inputType?: string;
  nextState?: ConversationState;
  webhookAction?: WebhookPayload;
  endConversation?: boolean;
};

export type IssueType = 
  | 'plumbing'
  | 'electrical'
  | 'appliance'
  | 'lock'
  | 'heating'
  | 'pests'
  | 'internet'
  | 'other';

export type MaintenanceRequest = {
  unit: string;
  building_address?: string;
  issue_type: IssueType;
  description: string;
  access_permission: boolean;
  best_time?: string;
  pets_notes?: string;
  contact_phone?: string;
  contact_email?: string;
  preferred_contact: 'phone' | 'email';
};

export type EmergencyAlert = {
  summary: string;
  contact_phone?: string;
  contact_email?: string;
  timestamp: Date;
  severity: 'high' | 'critical';
};

export type BusinessHours = {
  timezone: string;
  schedule: {
    [key: string]: { // day of week
      open: string; // HH:mm format
      close: string; // HH:mm format
    };
  };
};
