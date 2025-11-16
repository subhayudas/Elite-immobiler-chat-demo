# Elite Immobilier Property Management Conversation System

This document describes the comprehensive bilingual conversation system implemented for Elite Immobilier's property management chatbot.

## 🏗️ System Architecture

The system is built around a **state-based conversation flow** that handles tenant requests in both English and French, with structured data collection and external system integrations.

### Core Components

1. **Conversation Manager** (`lib/conversation-manager.ts`)
   - Manages conversation state and session data
   - Handles language detection and switching
   - Processes form-based data collection
   - Routes between conversation states

2. **Message Templates** (`lib/message-templates.ts`)
   - Bilingual message templates for all conversation states
   - Quick reply button definitions
   - Structured response formatting

3. **Form Definitions** (`lib/form-definitions.ts`)
   - Slot-based form definitions for data collection
   - Validation rules and input types
   - Multi-step form workflows

4. **Webhook Handler** (`lib/webhook-handler.ts`)
   - Integration with external property management systems
   - Maintenance IQ, RentCafe, and other service integrations
   - Error handling and retry logic

5. **Business Hours Manager** (`lib/business-hours.ts`)
   - Business hours validation
   - After-hours messaging
   - Emergency contact routing

## 🗣️ Conversation Flow

### Main Entry Points

1. **Start** → Welcome message with quick reply options
2. **Main Menu** → Central hub for all services
3. **Emergency Gate** → Critical triage for urgent issues

### Service Modules

#### 🔧 Maintenance (`maint_intro`)
- **Form Collection**: Unit, issue type, description, access permission
- **Integration**: Creates work orders in Maintenance IQ system
- **Confirmation**: Provides work order number and timeline

#### 💳 Billing (`billing_intro`)
- **Pay Rent** → Redirects to RentCafe portal
- **Fee Questions** → Collects details and creates billing case
- **Balance Inquiry** → Retrieves current balance from ledger system

#### 📄 Lease Management (`lease_intro`)
- **Transfer/Assignment** → TAL-compliant lease transfer process
- **Occupant Changes** → Add/remove lease occupants
- **Renewal** → Lease renewal questions and changes
- **Termination** → Amicable termination requests

#### 🚗 Parking (`parking_intro`)
- **Vehicle Registration** → Collects vehicle details and assigns parking
- **Waitlist Management** → Handles parking availability

#### 🌐 Internet/Cable (`internet_intro`)
- **Videotron HELIX Support** → Building vs unit-specific issues
- **Service Routing** → Escalates to appropriate department

#### 👤 Human Handoff (`handoff_intro`)
- **Business Hours Check** → Routes based on availability
- **Department Routing** → Service, Admin, or Leasing teams
- **Priority Assignment** → Based on issue type and urgency

## 🔄 State Management

### Session Data Structure
```typescript
{
  id: string;
  userId?: string;
  currentState: ConversationState;
  language: 'en' | 'fr';
  context: Record<string, any>;
  collectedData: Record<string, any>;
  currentForm?: FormSession;
  createdAt: Date;
  updatedAt: Date;
}
```

### Form Processing
1. **Slot Collection** → Sequential data gathering
2. **Validation** → Type and format checking
3. **Submission** → Webhook integration
4. **Confirmation** → Success message with reference numbers

## 🌐 External Integrations

### Webhook Endpoints

| Endpoint | Purpose | Data |
|----------|---------|------|
| `/miq/workorders` | Maintenance requests | Work order details |
| `/alerts/emergency` | Emergency notifications | Alert details |
| `/admin/billing/case` | Billing inquiries | Fee questions |
| `/admin/lease/transfer` | Lease transfers | Transfer requests |
| `/admin/parking/assign` | Parking assignments | Vehicle details |
| `/handoff/create` | Human escalation | Issue summary |

### Response Handling
- **Success**: Updates message with reference numbers
- **Failure**: Graceful degradation with fallback messages
- **Retry Logic**: Automatic retry for transient failures

## 🌍 Bilingual Support

### Language Detection
- **Automatic Detection**: Based on French keywords and patterns
- **Manual Override**: Users can specify language preference
- **Context Preservation**: Language preference maintained throughout session

### Message Templates
All messages support both languages:
```typescript
{
  en: "English message text",
  fr: "Texte du message français"
}
```

## ⏰ Business Hours Integration

### Schedule
- **Business Hours**: Monday-Friday 8:00 AM - 4:00 PM (EST)
- **After Hours**: Automated responses with next business day information
- **Emergency Override**: Always available emergency contact information

### Routing Logic
- **Business Hours**: Direct human handoff available
- **After Hours**: Queued for next business day response
- **Emergency**: Immediate emergency line referral

## 🚨 Emergency Handling

### Triage Process
1. **Emergency Gate** → "Is this a true emergency?"
2. **Emergency Criteria**: Active leak, fire/smoke, gas smell, no heat in winter
3. **Immediate Action**: Emergency phone number + safety instructions
4. **Alert Creation**: Automatic emergency alert to management

### Safety Instructions
- Turn off water at shutoff
- Cut power at breaker
- Stay clear of danger
- Call emergency line immediately

## 📱 Frontend Integration

### Quick Reply Buttons
- Dynamic button generation based on conversation state
- Emoji icons for visual clarity
- Disabled state during processing

### Message Types
- **Text Messages**: Standard conversation responses
- **Button Messages**: Quick reply options
- **Form Messages**: Data collection prompts
- **Confirmation Messages**: Success notifications

## 🔧 Configuration

### Environment Variables
```bash
# Webhook configuration
WEBHOOK_BASE_URL=https://your-property-management-api.com
WEBHOOK_API_KEY=your-webhook-api-key-here
```

### Business Hours Configuration
```typescript
{
  timezone: 'America/Toronto',
  schedule: {
    'monday': { open: '08:00', close: '16:00' },
    // ... other days
  }
}
```

## 🧪 Testing Conversation Flows

### Test Scenarios

1. **Maintenance Request Flow**
   - Start → "maintenance" → Fill form → Confirm work order

2. **Emergency Flow**
   - Start → "emergency" → "yes" → Emergency instructions

3. **Billing Flow**
   - Start → "billing" → "balance" → Unit number → Balance display

4. **Language Switching**
   - Start in English → Use French keywords → Auto-switch to French

5. **Business Hours**
   - After hours → "handoff" → After-hours message

### Expected Outcomes
- All forms should collect required data
- Webhooks should be called with correct payloads
- Confirmation messages should include reference numbers
- Language should be consistent throughout conversation

## 🚀 Deployment Notes

1. **Environment Setup**: Configure webhook URLs and API keys
2. **External Systems**: Ensure Maintenance IQ, RentCafe, etc. are accessible
3. **Business Hours**: Verify timezone configuration
4. **Emergency Contacts**: Update emergency phone numbers
5. **Testing**: Run through all conversation flows before production

## 📈 Monitoring & Analytics

### Key Metrics
- Conversation completion rates
- Form abandonment rates
- Emergency vs non-emergency classification accuracy
- Language detection accuracy
- Webhook success rates

### Logging
- All conversations are logged with session IDs
- Webhook calls are logged with success/failure status
- Form submissions are tracked for analytics

## 🔒 Security Considerations

- Session data is stored in memory (consider Redis for production)
- Webhook API keys should be securely stored
- Personal data collection follows privacy guidelines
- Emergency alerts are prioritized and secured

---

This conversation system provides a comprehensive, bilingual property management solution that handles the full spectrum of tenant requests while maintaining professional service standards and ensuring emergency situations are properly escalated.
