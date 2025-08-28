// Test notifications API directly in browser console
// Copy and paste this into your browser console (F12)

// Test the notifications API
async function testNotifications() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
    
    const response = await fetch(`/api/notifications?userId=${user.id}&isSuperAdmin=${user.is_super_admin}&limit=10`);
    const data = await response.json();
    
    console.log('API Response:', response.status, response.statusText);
    console.log('Notifications received:', data);
    console.log('Number of notifications:', data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('Error testing notifications:', error);
  }
}

// Run the test
testNotifications();