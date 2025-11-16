import { WebhookPayload } from '@/types/conversation';

export class WebhookHandler {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = process.env.WEBHOOK_BASE_URL || '', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || process.env.WEBHOOK_API_KEY;
  }

  // Execute webhook request
  async executeWebhook(payload: WebhookPayload): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const url = this.baseUrl + payload.endpoint;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...payload.headers
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url, {
        method: payload.method,
        headers,
        body: payload.data ? JSON.stringify(payload.data) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return { success: true, data: responseData };

    } catch (error) {
      console.error('Webhook execution failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Maintenance IQ integration
  async createWorkOrder(data: any): Promise<{ success: boolean; workOrderId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/miq/workorders',
      method: 'POST',
      data: {
        unit: data.unit,
        building_address: data.building_address,
        issue_type: data.issue_type,
        description: data.description,
        access_permission: data.access_permission,
        best_time: data.best_time,
        pets_notes: data.pets_notes,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        preferred_contact: data.preferred_contact,
        priority: this.determinePriority(data.issue_type),
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        workOrderId: result.data?.workOrderId || result.data?.id || 'WO-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Emergency alert integration
  async createEmergencyAlert(data: any): Promise<{ success: boolean; alertId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/alerts/emergency',
      method: 'POST',
      data: {
        summary: data.summary,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        severity: 'critical',
        timestamp: new Date().toISOString(),
        source: 'chatbot',
        session_id: data.sessionId
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        alertId: result.data?.alertId || result.data?.id || 'ALERT-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Billing case creation
  async createBillingCase(data: any): Promise<{ success: boolean; caseId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/billing/case',
      method: 'POST',
      data: {
        unit: data.unit,
        fee_description: data.fee_description,
        fee_date: data.fee_date,
        created_at: new Date().toISOString(),
        status: 'open',
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        caseId: result.data?.caseId || result.data?.id || 'CASE-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Get tenant balance
  async getTenantBalance(unit: string): Promise<{ success: boolean; balance?: number; asOfDate?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: `/admin/ledger?unit=${encodeURIComponent(unit)}`,
      method: 'GET'
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        balance: result.data?.balance || 0,
        asOfDate: result.data?.asOfDate || new Date().toISOString()
      };
    }

    return { success: false, error: result.error };
  }

  // Lease transfer request
  async createLeaseTransfer(data: any): Promise<{ success: boolean; transferId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/lease/transfer',
      method: 'POST',
      data: {
        requester_name: data.requester_name,
        unit: data.unit,
        target_date: data.target_date,
        reason: data.reason,
        created_at: new Date().toISOString(),
        status: 'pending',
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        transferId: result.data?.transferId || result.data?.id || 'TRANSFER-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Lease occupant management
  async addLeaseOccupant(data: any): Promise<{ success: boolean; occupantId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/lease/occupant',
      method: 'POST',
      data: {
        name: data.name,
        email: data.email,
        move_in_date: data.move_in_date,
        relationship: data.relationship,
        unit: data.unit,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        occupantId: result.data?.occupantId || result.data?.id || 'OCC-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Parking assignment
  async assignParking(data: any): Promise<{ success: boolean; assignmentId?: string; waitlisted?: boolean; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/parking/assign',
      method: 'POST',
      data: {
        unit: data.unit,
        vehicle_make: data.vehicle_make,
        vehicle_model: data.vehicle_model,
        vehicle_color: data.vehicle_color,
        license_plate: data.license_plate,
        start_date: data.start_date,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        assignmentId: result.data?.assignmentId || result.data?.id || 'PARK-' + Date.now(),
        waitlisted: result.data?.waitlisted || false
      };
    }

    return { success: false, error: result.error };
  }

  // Move-in appointment
  async scheduleMoveIn(data: any): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/ops/movein/appointment',
      method: 'POST',
      data: {
        unit: data.unit,
        planned_date: data.planned_date,
        contact_phone: data.contact_phone,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        appointmentId: result.data?.appointmentId || result.data?.id || 'MOVEIN-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Move-out appointment
  async scheduleMoveOut(data: any): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/ops/moveout/appointment',
      method: 'POST',
      data: {
        unit: data.unit,
        planned_date: data.planned_date,
        forwarding_email: data.forwarding_email,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        appointmentId: result.data?.appointmentId || result.data?.id || 'MOVEOUT-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Noise complaint
  async createNoiseComplaint(data: any): Promise<{ success: boolean; complaintId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/service/noise',
      method: 'POST',
      data: {
        when: data.when,
        where: data.where,
        who_unit: data.who_unit,
        recurrence: data.recurrence,
        evidence: data.evidence,
        reporter_unit: data.reporter_unit,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        complaintId: result.data?.complaintId || result.data?.id || 'NOISE-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Portal help request
  async createPortalHelpRequest(data: any): Promise<{ success: boolean; helpId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/portal/help',
      method: 'POST',
      data: {
        issue_type: data.issue_type,
        email: data.email,
        description: data.description,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        helpId: result.data?.helpId || result.data?.id || 'HELP-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Get work order status
  async getWorkOrderStatus(workOrderId: string): Promise<{ success: boolean; status?: any; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: `/miq/workorders/${encodeURIComponent(workOrderId)}`,
      method: 'GET'
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        status: result.data
      };
    }

    return { success: false, error: result.error };
  }

  // Document generation
  async generateDocument(data: any): Promise<{ success: boolean; documentId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/admin/docs/generate',
      method: 'POST',
      data: {
        document_type: data.document_type,
        unit: data.unit,
        email_target: data.email_target,
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        documentId: result.data?.documentId || result.data?.id || 'DOC-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Human handoff
  async createHandoffRequest(data: any): Promise<{ success: boolean; handoffId?: string; error?: string }> {
    const payload: WebhookPayload = {
      endpoint: '/handoff/create',
      method: 'POST',
      data: {
        summary: data.summary,
        preferred_contact: data.preferred_contact,
        contact_info: data.contact_info,
        unit: data.unit,
        priority: this.determineHandoffPriority(data.summary),
        department: this.determineHandoffDepartment(data.summary),
        created_at: new Date().toISOString(),
        source: 'chatbot'
      }
    };

    const result = await this.executeWebhook(payload);
    
    if (result.success) {
      return {
        success: true,
        handoffId: result.data?.handoffId || result.data?.id || 'HANDOFF-' + Date.now()
      };
    }

    return { success: false, error: result.error };
  }

  // Helper: Determine work order priority based on issue type
  private determinePriority(issueType: string): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentIssues = ['heating', 'electrical', 'plumbing'];
    const highIssues = ['lock', 'appliance'];
    
    if (urgentIssues.includes(issueType)) return 'urgent';
    if (highIssues.includes(issueType)) return 'high';
    return 'medium';
  }

  // Helper: Determine handoff priority
  private determineHandoffPriority(summary: string): 'low' | 'medium' | 'high' {
    const lowerSummary = summary.toLowerCase();
    
    if (lowerSummary.includes('urgent') || lowerSummary.includes('emergency')) {
      return 'high';
    }
    if (lowerSummary.includes('billing') || lowerSummary.includes('lease')) {
      return 'medium';
    }
    return 'low';
  }

  // Helper: Determine handoff department
  private determineHandoffDepartment(summary: string): 'service' | 'admin' | 'leasing' {
    const lowerSummary = summary.toLowerCase();
    
    if (lowerSummary.includes('maintenance') || lowerSummary.includes('repair')) {
      return 'service';
    }
    if (lowerSummary.includes('lease') || lowerSummary.includes('rental')) {
      return 'leasing';
    }
    return 'admin';
  }
}

// Singleton instance
export const webhookHandler = new WebhookHandler();
