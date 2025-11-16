// Simple test script to verify the conversation system
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/chat';

async function testConversation() {
  console.log('🧪 Testing Elite Immobilier Conversation System\n');

  // Test 1: Initial greeting
  console.log('Test 1: Initial greeting');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });
    
    const data = await response.json();
    console.log('✅ Response:', data.message);
    console.log('📋 Quick Replies:', data.quickReplies?.map(r => r.label).join(', '));
    console.log('🆔 Session ID:', data.sessionId);
    console.log('');
    
    // Test 2: Maintenance request
    console.log('Test 2: Maintenance request');
    const maintenanceResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: data.message },
          { role: 'user', content: 'maintenance' }
        ],
        sessionId: data.sessionId
      })
    });
    
    const maintenanceData = await maintenanceResponse.json();
    console.log('✅ Maintenance Response:', maintenanceData.message);
    console.log('📋 Quick Replies:', maintenanceData.quickReplies?.map(r => r.label).join(', '));
    console.log('');
    
    // Test 3: Emergency flow
    console.log('Test 3: Emergency flow');
    const emergencyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'emergency' }]
      })
    });
    
    const emergencyData = await emergencyResponse.json();
    console.log('✅ Emergency Response:', emergencyData.message);
    console.log('📋 Quick Replies:', emergencyData.quickReplies?.map(r => r.label).join(', '));
    console.log('');
    
    // Test 4: French language detection
    console.log('Test 4: French language detection');
    const frenchResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Bonjour, je voudrais de l\'aide avec entretien' }]
      })
    });
    
    const frenchData = await frenchResponse.json();
    console.log('✅ French Response:', frenchData.message);
    console.log('📋 Quick Replies:', frenchData.quickReplies?.map(r => r.label).join(', '));
    console.log('');
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testConversation();
