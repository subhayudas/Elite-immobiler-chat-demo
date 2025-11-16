import { NextResponse } from "next/server";
import { conversationManager } from "@/lib/conversation-manager";
import { webhookHandler } from "@/lib/webhook-handler";
import { businessHoursManager } from "@/lib/business-hours";
import { ConversationResponse } from "@/types/conversation";

export async function POST(req: Request) {
  try {
    const { messages, sessionId, userId } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Process the conversation
    const response = await processConversation(currentSessionId, userMessage.content, userId);

    // Handle webhook actions if present
    if (response.webhookAction) {
      try {
        const webhookResult = await executeWebhookAction(response.webhookAction, response);
        
        // Update response with webhook results
        if (webhookResult.success && webhookResult.data) {
          response.message = interpolateMessage(response.message, webhookResult.data);
        }
      } catch (webhookError) {
        console.error('Webhook execution failed:', webhookError);
        // Continue with response even if webhook fails
      }
    }

    // Return structured response
    return NextResponse.json({
      message: response.message,
      quickReplies: response.quickReplies || [],
      requiresInput: response.requiresInput || false,
      inputType: response.inputType || 'text',
      sessionId: currentSessionId,
      nextState: response.nextState,
      endConversation: response.endConversation || false
    });

  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

// Process conversation using our conversation manager
async function processConversation(
  sessionId: string, 
  userInput: string, 
  userId?: string
): Promise<ConversationResponse> {
  try {
    // Check business hours for handoff scenarios
    const session = conversationManager.getSession(sessionId, userId);
    
    // Add business hours context for handoff requests
    if (session.currentState === 'handoff_intro' && !businessHoursManager.isBusinessHours()) {
      const afterHoursMsg = businessHoursManager.getAfterHoursMessage(session.language);
      const emergencyMsg = businessHoursManager.getEmergencyContactMessage(session.language);
      
      return {
        message: `${afterHoursMsg}\n\n${emergencyMsg}`,
        nextState: 'end_or_more'
      };
    }

    // Process the input through conversation manager
    return await conversationManager.processInput(sessionId, userInput, userId);
    
  } catch (error) {
    console.error('Conversation processing error:', error);
    
    // Fallback response
    return {
      message: "I'm sorry, I encountered an issue. Please try again or contact us directly at 873.660.1498.",
      nextState: 'fallback'
    };
  }
}

// Execute webhook actions
async function executeWebhookAction(
  webhookAction: any, 
  response: ConversationResponse
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { endpoint, data } = webhookAction;
  
  try {
    switch (endpoint) {
      case '/miq/workorders':
        return await webhookHandler.createWorkOrder(data);
        
      case '/alerts/emergency':
        return await webhookHandler.createEmergencyAlert(data);
        
      case '/admin/billing/case':
        return await webhookHandler.createBillingCase(data);
        
      case '/admin/lease/transfer':
        return await webhookHandler.createLeaseTransfer(data);
        
      case '/admin/lease/occupant':
        return await webhookHandler.addLeaseOccupant(data);
        
      case '/admin/parking/assign':
        return await webhookHandler.assignParking(data);
        
      case '/ops/movein/appointment':
        return await webhookHandler.scheduleMoveIn(data);
        
      case '/ops/moveout/appointment':
        return await webhookHandler.scheduleMoveOut(data);
        
      case '/service/noise':
        return await webhookHandler.createNoiseComplaint(data);
        
      case '/admin/portal/help':
        return await webhookHandler.createPortalHelpRequest(data);
        
      case '/admin/docs/generate':
        return await webhookHandler.generateDocument(data);
        
      case '/handoff/create':
        return await webhookHandler.createHandoffRequest(data);
        
      default:
        // Generic webhook execution
        return await webhookHandler.executeWebhook(webhookAction);
    }
  } catch (error) {
    console.error('Webhook execution error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown webhook error' 
    };
  }
}

// Interpolate message with webhook response data
function interpolateMessage(message: string, data: any): string {
  let interpolated = message;
  
  // Replace common placeholders
  if (data.workOrderId || data.id) {
    interpolated = interpolated.replace(/\{\{ticket\}\}/g, data.workOrderId || data.id);
  }
  
  if (data.balance !== undefined) {
    interpolated = interpolated.replace(/\{\{amount\}\}/g, `$${data.balance.toFixed(2)}`);
  }
  
  if (data.asOfDate) {
    const date = new Date(data.asOfDate).toLocaleDateString();
    interpolated = interpolated.replace(/\{\{date\}\}/g, date);
  }
  
  return interpolated;
}

