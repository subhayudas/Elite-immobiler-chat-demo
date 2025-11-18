import { FormDefinition, SlotDefinition } from '@/types/conversation';

// Form definitions for structured data collection

export const maintenanceRequestForm: FormDefinition = {
  slots: [
    {
      name: 'confirm_non_emergency',
      type: 'boolean',
      required: true,
      label: {
        en: 'Confirm this is not an emergency (Yes/No)',
        fr: 'Confirmez que ce n\'est pas une urgence (Oui/Non)'
      }
    },
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: {
        en: 'What is your unit number?',
        fr: 'Quel est votre numéro d\'unité?'
      },
      validation: {
        pattern: '^[A-Za-z0-9-]+$',
        minLength: 1,
        maxLength: 10
      }
    },
    {
      name: 'building_address',
      type: 'text',
      required: false,
      label: {
        en: 'Building address (optional)',
        fr: 'Adresse du bâtiment (optionnel)'
      }
    },
    {
      name: 'issue_type',
      type: 'select',
      required: true,
      label: {
        en: 'What type of issue is this?',
        fr: 'Quel type de problème est-ce?'
      },
      options: [
        { value: 'plumbing', label: { en: 'Plumbing', fr: 'Plomberie' } },
        { value: 'electrical', label: { en: 'Electrical', fr: 'Électricité' } },
        { value: 'appliance', label: { en: 'Appliance', fr: 'Électroménager' } },
        { value: 'lock', label: { en: 'Lock', fr: 'Serrure' } },
        { value: 'heating', label: { en: 'Heating', fr: 'Chauffage' } },
        { value: 'pests', label: { en: 'Pests', fr: 'Parasites' } },
        { value: 'internet', label: { en: 'Internet', fr: 'Internet' } },
        { value: 'other', label: { en: 'Other', fr: 'Autre' } }
      ]
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: {
        en: 'Please describe the issue in detail',
        fr: 'Veuillez décrire le problème en détail'
      },
      validation: {
        minLength: 10,
        maxLength: 500
      }
    },
    {
      name: 'access_permission',
      type: 'boolean',
      required: true,
      label: {
        en: 'Do you give permission for maintenance to access your unit? (Yes/No)',
        fr: 'Donnez-vous la permission à l\'entretien d\'accéder à votre unité? (Oui/Non)'
      }
    },
    {
      name: 'best_time',
      type: 'text',
      required: false,
      label: {
        en: 'If yes, what is the best time window for access?',
        fr: 'Si oui, quelle est la meilleure plage horaire pour l\'accès?'
      }
    },
    {
      name: 'pets_notes',
      type: 'text',
      required: false,
      label: {
        en: 'Any pets or special access notes?',
        fr: 'Des animaux ou des notes d\'accès spéciales?'
      }
    },
    {
      name: 'contact_phone',
      type: 'phone',
      required: false,
      label: {
        en: 'Contact phone number (optional)',
        fr: 'Numéro de téléphone de contact (optionnel)'
      },
      validation: {
        pattern: '^.{3,30}$'
      }
    },
    {
      name: 'contact_email',
      type: 'email',
      required: false,
      label: {
        en: 'Contact email (optional)',
        fr: 'Courriel de contact (optionnel)'
      }
    },
    {
      name: 'preferred_contact',
      type: 'select',
      required: true,
      label: {
        en: 'Preferred contact method',
        fr: 'Méthode de contact préférée'
      },
      options: [
        { value: 'phone', label: { en: 'Phone', fr: 'Téléphone' } },
        { value: 'email', label: { en: 'Email', fr: 'Courriel' } }
      ]
    }
  ],
  submitAction: '/miq/workorders',
  confirmationMessage: {
    en: 'Thanks — your request was created: WO #{{ticket}}. We assign/respond within 48h and aim to complete within 5 business days.',
    fr: 'Merci — votre demande est créée : WO #{{ticket}}. Nous attribuons/répondons sous 48 h et visons une complétion sous 5 jours ouvrables.'
  }
};

export const emergencyAlertForm: FormDefinition = {
  slots: [
    {
      name: 'summary',
      type: 'text',
      required: true,
      label: {
        en: 'Please briefly describe the emergency situation',
        fr: 'Veuillez décrire brièvement la situation d\'urgence'
      },
      validation: {
        minLength: 10,
        maxLength: 200
      }
    },
    {
      name: 'contact_phone',
      type: 'phone',
      required: false,
      label: {
        en: 'Your contact phone number',
        fr: 'Votre numéro de téléphone de contact'
      },
      validation: {
        pattern: '^.{3,30}$'
      }
    },
    {
      name: 'contact_email',
      type: 'email',
      required: false,
      label: {
        en: 'Your contact email',
        fr: 'Votre courriel de contact'
      }
    }
  ],
  submitAction: '/alerts/emergency',
  confirmationMessage: {
    en: 'Emergency alert has been sent. Please call 873.660.1498 immediately if you haven\'t already.',
    fr: 'L\'alerte d\'urgence a été envoyée. Veuillez appeler le 873.660.1498 immédiatement si vous ne l\'avez pas déjà fait.'
  }
};

export const billingFeesForm: FormDefinition = {
  slots: [
    {
      name: 'fee_description',
      type: 'text',
      required: true,
      label: {
        en: 'What fee are you asking about?',
        fr: 'De quels frais parlez-vous?'
      },
      validation: {
        minLength: 5,
        maxLength: 200
      }
    },
    {
      name: 'fee_date',
      type: 'date',
      required: true,
      label: {
        en: 'What date was this fee charged?',
        fr: 'À quelle date ces frais ont-ils été facturés?'
      }
    },
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: {
        en: 'Your unit number',
        fr: 'Votre numéro d\'unité'
      }
    }
  ],
  submitAction: '/admin/billing/case',
  confirmationMessage: {
    en: 'Your billing inquiry has been submitted. We\'ll review and respond within 2 business days.',
    fr: 'Votre demande de facturation a été soumise. Nous examinerons et répondrons dans les 2 jours ouvrables.'
  }
};

export const leaseTransferForm: FormDefinition = {
  slots: [
    {
      name: 'requester_name',
      type: 'text',
      required: true,
      label: {
        en: 'Your full name',
        fr: 'Votre nom complet'
      }
    },
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: {
        en: 'Your unit number',
        fr: 'Votre numéro d\'unité'
      }
    },
    {
      name: 'target_date',
      type: 'date',
      required: true,
      label: {
        en: 'Target transfer date',
        fr: 'Date cible du transfert'
      }
    },
    {
      name: 'reason',
      type: 'text',
      required: true,
      label: {
        en: 'Reason for lease transfer',
        fr: 'Raison du transfert de bail'
      },
      validation: {
        minLength: 10,
        maxLength: 300
      }
    }
  ],
  submitAction: '/admin/lease/transfer',
  confirmationMessage: {
    en: 'Your lease transfer request has been submitted. We\'ll send you the next steps and checklist within 2 business days.',
    fr: 'Votre demande de transfert de bail a été soumise. Nous vous enverrons les prochaines étapes et la liste de vérification dans les 2 jours ouvrables.'
  }
};

export const parkingRequestForm: FormDefinition = {
  slots: [
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: {
        en: 'Your unit number',
        fr: 'Votre numéro d\'unité'
      }
    },
    {
      name: 'vehicle_make',
      type: 'text',
      required: true,
      label: {
        en: 'Vehicle make',
        fr: 'Marque du véhicule'
      }
    },
    {
      name: 'vehicle_model',
      type: 'text',
      required: true,
      label: {
        en: 'Vehicle model',
        fr: 'Modèle du véhicule'
      }
    },
    {
      name: 'vehicle_color',
      type: 'text',
      required: true,
      label: {
        en: 'Vehicle color',
        fr: 'Couleur du véhicule'
      }
    },
    {
      name: 'license_plate',
      type: 'text',
      required: true,
      label: {
        en: 'License plate number',
        fr: 'Numéro de plaque d\'immatriculation'
      }
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: {
        en: 'When do you need parking to start?',
        fr: 'Quand avez-vous besoin que le stationnement commence?'
      }
    }
  ],
  submitAction: '/admin/parking/assign',
  confirmationMessage: {
    en: 'Your parking request has been submitted. We\'ll assign a stall or add you to the waitlist and notify you within 2 business days.',
    fr: 'Votre demande de stationnement a été soumise. Nous attribuerons une place ou vous ajouterons à la liste d\'attente et vous aviserons dans les 2 jours ouvrables.'
  }
};

export const handoffForm: FormDefinition = {
  slots: [
    {
      name: 'summary',
      type: 'text',
      required: true,
      label: {
        en: 'Please summarize your issue or question',
        fr: 'Veuillez résumer votre problème ou question'
      },
      validation: {
        minLength: 10,
        maxLength: 500
      }
    },
    {
      name: 'preferred_contact',
      type: 'select',
      required: true,
      label: {
        en: 'How would you prefer to be contacted?',
        fr: 'Comment préféreriez-vous être contacté?'
      },
      options: [
        { value: 'phone', label: { en: 'Phone', fr: 'Téléphone' } },
        { value: 'email', label: { en: 'Email', fr: 'Courriel' } }
      ]
    },
    {
      name: 'contact_info',
      type: 'text',
      required: true,
      label: {
        en: 'Your contact information (phone or email)',
        fr: 'Vos informations de contact (téléphone ou courriel)'
      }
    },
    {
      name: 'unit',
      type: 'text',
      required: false,
      label: {
        en: 'Your unit number (if applicable)',
        fr: 'Votre numéro d\'unité (si applicable)'
      }
    }
  ],
  submitAction: '/handoff/create',
  confirmationMessage: {
    en: 'Your request has been forwarded to our team. We\'ll respond within one business day during business hours (Mon-Fri 8:00-16:00 EST).',
    fr: 'Votre demande a été transmise à notre équipe. Nous répondrons dans un jour ouvrable pendant les heures d\'affaires (Lun-Ven 8h00-16h00 EST).'
  }
};

// Helper function to get form by name
export function getFormDefinition(formName: string): FormDefinition | null {
  const forms: Record<string, FormDefinition> = {
    'maintenance_request': maintenanceRequestForm,
    'emergency_alert': emergencyAlertForm,
    'billing_fees': billingFeesForm,
    'lease_transfer': leaseTransferForm,
    'parking_request': parkingRequestForm,
    'handoff': handoffForm
  };
  
  return forms[formName] || null;
}
