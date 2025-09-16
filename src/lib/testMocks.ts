// Test file to verify mock functionality
import { loadUserActivity, loadActivity } from './mockActivity';
import { shouldUseMock } from './mockConfig';

export async function testMockActivity() {
  console.log('Testing mock activity functionality...');
  
  // Test configuration
  console.log('Mock activity enabled:', shouldUseMock('useMockActivity'));
  
  try {
    // Test user activity loading
    console.log('Loading user activity...');
    const userActivity = await loadUserActivity(1, 20);
    console.log('User activity loaded:', userActivity);
    
    // Test general activity loading
    console.log('Loading general activity...');
    const activity = await loadActivity(20, 0, false, true);
    console.log('General activity loaded:', activity);
    
    console.log('✅ Mock activity tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Mock activity tests failed:', error);
    return false;
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testMockActivity();
}
