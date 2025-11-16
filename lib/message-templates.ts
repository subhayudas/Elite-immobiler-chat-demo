import { MessageTemplate, QuickReply, ConversationState } from '@/types/conversation';

// Message templates for all conversation states
export const messageTemplates: Record<ConversationState, MessageTemplate> = {
  start: {
    en: "Hello! I'm your Elite Immobilier assistant. I can help with maintenance requests, billing, lease questions, and more. How can I assist you today?",
    fr: "Bonjour! Je suis votre assistant Elite Immobilier. Je peux vous aider avec les demandes d'entretien, la facturation, les questions de bail, et plus encore. Comment puis-je vous aider aujourd'hui?",
    quickReplies: {
      en: [
        { label: "Maintenance", value: "maintenance", nextState: "maint_intro" },
        { label: "Billing", value: "billing", nextState: "billing_intro" },
        { label: "Lease", value: "lease", nextState: "lease_intro" },
        { label: "Emergency", value: "emergency", nextState: "emergency_gate" },
        { label: "Other", value: "other", nextState: "main_menu" }
      ],
      fr: [
        { label: "Entretien", value: "maintenance", nextState: "maint_intro" },
        { label: "Facturation", value: "billing", nextState: "billing_intro" },
        { label: "Bail", value: "lease", nextState: "lease_intro" },
        { label: "Urgence", value: "emergency", nextState: "emergency_gate" },
        { label: "Autre", value: "other", nextState: "main_menu" }
      ]
    }
  },

  main_menu: {
    en: "What can I help you with today?",
    fr: "Avec quoi puis-je vous aider aujourd'hui?",
    quickReplies: {
      en: [
        { label: "🔧 Maintenance", value: "maintenance", nextState: "maint_intro" },
        { label: "💳 Billing", value: "billing", nextState: "billing_intro" },
        { label: "📄 Lease", value: "lease", nextState: "lease_intro" },
        { label: "🚗 Parking", value: "parking", nextState: "parking_intro" },
        { label: "🌐 Internet", value: "internet", nextState: "internet_intro" },
        { label: "📋 Status", value: "status", nextState: "status_intro" },
        { label: "📁 Documents", value: "documents", nextState: "docs_intro" },
        { label: "👤 Talk to Person", value: "handoff", nextState: "handoff_intro" }
      ],
      fr: [
        { label: "🔧 Entretien", value: "maintenance", nextState: "maint_intro" },
        { label: "💳 Facturation", value: "billing", nextState: "billing_intro" },
        { label: "📄 Bail", value: "lease", nextState: "lease_intro" },
        { label: "🚗 Stationnement", value: "parking", nextState: "parking_intro" },
        { label: "🌐 Internet", value: "internet", nextState: "internet_intro" },
        { label: "📋 Statut", value: "status", nextState: "status_intro" },
        { label: "📁 Documents", value: "documents", nextState: "docs_intro" },
        { label: "👤 Parler à quelqu'un", value: "handoff", nextState: "handoff_intro" }
      ]
    }
  },

  emergency_gate: {
    en: "Is this a true emergency (active leak, fire/smoke, gas smell, a situation requiring emergency workers, or no heat in winter)?",
    fr: "S'agit-il d'une véritable urgence (fuite active, feu/fumée, odeur de gaz, situation nécessitant les services d'urgence, ou absence de chauffage en hiver)?",
    quickReplies: {
      en: [
        { label: "Yes", value: "yes", nextState: "emergency_now" },
        { label: "No", value: "no", nextState: "maint_intro" }
      ],
      fr: [
        { label: "Oui", value: "yes", nextState: "emergency_now" },
        { label: "Non", value: "no", nextState: "maint_intro" }
      ]
    }
  },

  emergency_now: {
    en: "Please call the emergency line now: 873.660.1498. This line is for emergencies only. If safe, turn off water at the shutoff, cut power at the breaker, and stay clear.",
    fr: "SVP appelez la ligne d'urgence maintenant : 873.660.1498. Cette ligne est réservée aux urgences. Si c'est sécuritaire, fermez l'eau au robinet d'arrêt, coupez l'alimentation au disjoncteur et éloignez-vous.",
    requiresInput: true,
    inputType: "text"
  },

  maint_intro: {
    en: "Let's log a maintenance request.",
    fr: "Enregistrons une demande d'entretien.",
    quickReplies: {
      en: [
        { label: "Continue", value: "continue", nextState: "maint_intro" }
      ],
      fr: [
        { label: "Continuer", value: "continue", nextState: "maint_intro" }
      ]
    }
  },

  billing_intro: {
    en: "How can I help with billing?",
    fr: "Comment puis-je vous aider avec la facturation?",
    quickReplies: {
      en: [
        { label: "Pay rent", value: "pay", nextState: "billing_pay" },
        { label: "Question about charges/fees", value: "fees", nextState: "billing_fees" },
        { label: "See my balance", value: "balance", nextState: "billing_balance" },
        { label: "Portal help", value: "portal", nextState: "portal_intro" }
      ],
      fr: [
        { label: "Payer le loyer", value: "pay", nextState: "billing_pay" },
        { label: "Question sur des frais", value: "fees", nextState: "billing_fees" },
        { label: "Voir mon solde", value: "balance", nextState: "billing_balance" },
        { label: "Aide portail", value: "portal", nextState: "portal_intro" }
      ]
    }
  },

  billing_pay: {
    en: "Use your RentCafe tenant portal: Direct Debit, Debit, or Credit.",
    fr: "Utilisez votre portail RentCafe : prélèvement, débit ou carte de crédit.",
    quickReplies: {
      en: [
        { label: "Open RentCafe", value: "open_portal", nextState: "billing_intro" },
        { label: "Forgot password?", value: "forgot_password", nextState: "portal_intro" },
        { label: "Back", value: "back", nextState: "billing_intro" }
      ],
      fr: [
        { label: "Ouvrir RentCafe", value: "open_portal", nextState: "billing_intro" },
        { label: "Mot de passe oublié?", value: "forgot_password", nextState: "portal_intro" },
        { label: "Retour", value: "back", nextState: "billing_intro" }
      ]
    }
  },

  billing_fees: {
    en: "We charge only to cover provider costs; unpaid service fees are sent to collections — they're not pursued at TAL. Please provide details about the fee in question and the date.",
    fr: "Nous facturons pour couvrir les coûts du fournisseur; les frais impayés vont en agence de recouvrement — non poursuivis au TAL. Veuillez fournir les détails sur les frais en question et la date.",
    requiresInput: true,
    inputType: "text"
  },

  billing_balance: {
    en: "I'll check your current balance. Please provide your unit number.",
    fr: "Je vais vérifier votre solde actuel. Veuillez fournir votre numéro d'unité.",
    requiresInput: true,
    inputType: "text"
  },

  lease_intro: {
    en: "What lease matter can I help you with?",
    fr: "Avec quelle question de bail puis-je vous aider?",
    quickReplies: {
      en: [
        { label: "Lease transfer/assignment", value: "transfer", nextState: "lease_transfer" },
        { label: "Add/remove occupant", value: "occupant", nextState: "lease_occupant" },
        { label: "Lease renewal", value: "renewal", nextState: "lease_renewal" },
        { label: "Early termination", value: "termination", nextState: "lease_termination" }
      ],
      fr: [
        { label: "Cession de bail", value: "transfer", nextState: "lease_transfer" },
        { label: "Ajouter/retirer un occupant", value: "occupant", nextState: "lease_occupant" },
        { label: "Renouvellement", value: "renewal", nextState: "lease_renewal" },
        { label: "Résiliation amiable", value: "termination", nextState: "lease_termination" }
      ]
    }
  },

  lease_transfer: {
    en: "We follow Québec rules (TAL timelines). Please provide your name, target date, and reason for the transfer.",
    fr: "Nous suivons les règles du Québec (délais TAL). Veuillez fournir votre nom, la date cible et la raison du transfert.",
    requiresInput: true,
    inputType: "text"
  },

  lease_occupant: {
    en: "Please provide: name, email, move-in date, relationship, and any required documents.",
    fr: "Veuillez fournir : nom, courriel, date d'emménagement, relation et tout document requis.",
    requiresInput: true,
    inputType: "text"
  },

  lease_renewal: {
    en: "Leases auto-renew at current terms absent notices. What questions or changes do you have?",
    fr: "Les baux se renouvellent automatiquement aux conditions actuelles sans avis. Quelles questions ou changements avez-vous?",
    requiresInput: true,
    inputType: "text"
  },

  lease_termination: {
    en: "For amicable termination, please provide your target date and reason.",
    fr: "Pour une résiliation amiable, veuillez fournir votre date cible et la raison.",
    requiresInput: true,
    inputType: "text"
  },

  move_in_intro: {
    en: "I'll help you with move-in information. Please provide your planned move-in date/time and contact phone.",
    fr: "Je vais vous aider avec les informations d'emménagement. Veuillez fournir votre date/heure d'emménagement prévue et votre téléphone de contact.",
    requiresInput: true,
    inputType: "text"
  },

  move_out_intro: {
    en: "For move-out, please provide your move-out date/time and forwarding email. I'll send you the cleaning checklist and equipment return information.",
    fr: "Pour le déménagement, veuillez fournir votre date/heure de déménagement et votre courriel de redirection. Je vous enverrai la liste de nettoyage et les informations de retour d'équipement.",
    requiresInput: true,
    inputType: "text"
  },

  parking_intro: {
    en: "Please provide: vehicle make/model/color, license plate, stall needs, and start date.",
    fr: "Veuillez fournir : marque/modèle/couleur du véhicule, plaque d'immatriculation, besoins de stationnement et date de début.",
    requiresInput: true,
    inputType: "text"
  },

  noise_intro: {
    en: "Please describe: when, where, who/which unit if known, how often it occurs, and any evidence you have.",
    fr: "Veuillez décrire : quand, où, qui/quelle unité si connue, à quelle fréquence cela se produit, et toute preuve que vous avez.",
    requiresInput: true,
    inputType: "text"
  },

  internet_intro: {
    en: "Building internet/cable is via Videotron HELIX. Please provide your building + unit + symptom (no service/building-wide vs in-unit).",
    fr: "L'internet/câble du bâtiment est via Videotron HELIX. Veuillez fournir votre bâtiment + unité + symptôme (pas de service/à l'échelle du bâtiment vs dans l'unité).",
    requiresInput: true,
    inputType: "text"
  },

  portal_intro: {
    en: "I can help with password reset, email verification, account creation, or browser tips. What do you need help with?",
    fr: "Je peux vous aider avec la réinitialisation du mot de passe, la vérification de courriel, la création de compte ou des conseils de navigateur. Avec quoi avez-vous besoin d'aide?",
    requiresInput: true,
    inputType: "text"
  },

  status_intro: {
    en: "Do you have a Work Order number?",
    fr: "Avez-vous un numéro de demande de travail?",
    quickReplies: {
      en: [
        { label: "Yes", value: "yes", nextState: "status_with_wo" },
        { label: "No", value: "no", nextState: "status_by_unit" }
      ],
      fr: [
        { label: "Oui", value: "yes", nextState: "status_with_wo" },
        { label: "Non", value: "no", nextState: "status_by_unit" }
      ]
    }
  },

  status_with_wo: {
    en: "Please provide your Work Order number.",
    fr: "Veuillez fournir votre numéro de demande de travail.",
    requiresInput: true,
    inputType: "text"
  },

  status_by_unit: {
    en: "Please provide your unit number and describe the issue or date range.",
    fr: "Veuillez fournir votre numéro d'unité et décrire le problème ou la plage de dates.",
    requiresInput: true,
    inputType: "text"
  },

  docs_intro: {
    en: "What document do you need?",
    fr: "Quel document avez-vous besoin?",
    quickReplies: {
      en: [
        { label: "Rent receipts", value: "receipts", nextState: "docs_intro" },
        { label: "Address attestation", value: "attestation", nextState: "docs_intro" },
        { label: "Proof of tenancy", value: "proof", nextState: "docs_intro" },
        { label: "Insurance reminder", value: "insurance", nextState: "docs_intro" }
      ],
      fr: [
        { label: "Reçus de loyer", value: "receipts", nextState: "docs_intro" },
        { label: "Attestation d'adresse", value: "attestation", nextState: "docs_intro" },
        { label: "Preuve de location", value: "proof", nextState: "docs_intro" },
        { label: "Rappel d'assurance", value: "insurance", nextState: "docs_intro" }
      ]
    }
  },

  handoff_intro: {
    en: "I'll connect you to our team. Please provide a summary of your issue and your preferred contact method.",
    fr: "Je vais vous mettre en contact avec notre équipe. Veuillez fournir un résumé de votre problème et votre méthode de contact préférée.",
    requiresInput: true,
    inputType: "text"
  },

  fallback: {
    en: "Sorry, I didn't catch that. I can help with maintenance, payments, leases, parking, portal, internet, documents, or connect you to a person.",
    fr: "Désolé, je n'ai pas compris. Je peux aider pour l'entretien, les paiements, les baux, le stationnement, le portail, l'internet, les documents, ou vous mettre en contact avec quelqu'un.",
    quickReplies: {
      en: [
        { label: "Maintenance", value: "maintenance", nextState: "maint_intro" },
        { label: "Payments", value: "billing", nextState: "billing_intro" },
        { label: "Lease", value: "lease", nextState: "lease_intro" },
        { label: "Parking", value: "parking", nextState: "parking_intro" },
        { label: "Internet", value: "internet", nextState: "internet_intro" },
        { label: "Human", value: "handoff", nextState: "handoff_intro" }
      ],
      fr: [
        { label: "Entretien", value: "maintenance", nextState: "maint_intro" },
        { label: "Paiements", value: "billing", nextState: "billing_intro" },
        { label: "Bail", value: "lease", nextState: "lease_intro" },
        { label: "Stationnement", value: "parking", nextState: "parking_intro" },
        { label: "Internet", value: "internet", nextState: "internet_intro" },
        { label: "Humain", value: "handoff", nextState: "handoff_intro" }
      ]
    }
  },

  end_or_more: {
    en: "Anything else today?",
    fr: "Puis-je aider avec autre chose?",
    quickReplies: {
      en: [
        { label: "Main menu", value: "menu", nextState: "main_menu" },
        { label: "Talk to a person", value: "handoff", nextState: "handoff_intro" },
        { label: "End chat", value: "end", nextState: "start" }
      ],
      fr: [
        { label: "Menu principal", value: "menu", nextState: "main_menu" },
        { label: "Parler à quelqu'un", value: "handoff", nextState: "handoff_intro" },
        { label: "Terminer", value: "end", nextState: "start" }
      ]
    }
  }
};

// Issue type options for maintenance requests
export const issueTypeOptions = {
  en: [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'appliance', label: 'Appliance' },
    { value: 'lock', label: 'Lock' },
    { value: 'heating', label: 'Heating' },
    { value: 'pests', label: 'Pests' },
    { value: 'internet', label: 'Internet' },
    { value: 'other', label: 'Other' }
  ],
  fr: [
    { value: 'plumbing', label: 'Plomberie' },
    { value: 'electrical', label: 'Électricité' },
    { value: 'appliance', label: 'Électroménager' },
    { value: 'lock', label: 'Serrure' },
    { value: 'heating', label: 'Chauffage' },
    { value: 'pests', label: 'Parasites' },
    { value: 'internet', label: 'Internet' },
    { value: 'other', label: 'Autre' }
  ]
};
