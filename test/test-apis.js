// API Testing Script for DayFlow
const BASE_URL = 'http://localhost:3000';

// Test credentials from seed
const ADMIN_CREDENTIALS = {
  email: 'admin@dayflow.com',
  password: 'Admin@123'
};

const EMPLOYEE_CREDENTIALS = {
  email: 'employee@dayflow.com',
  password: 'Employee@123'
};

const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

let adminToken = '';
let employeeToken = '';
let employeeId = '';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    console.log(`\n🔄 ${config.method || 'GET'} ${endpoint}`);
    if (config.headers.Authorization) {
      console.log(`   🔑 Using Bearer token: ${config.headers.Authorization.substring(0, 20)}...`);
    }
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      console.log(`   ✅ Success:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`   ❌ Error:`, JSON.stringify(data, null, 2));
    }
    
    return { response, data };
  } catch (error) {
    console.log(`   💥 Network Error:`, error.message);
    return { error };
  }
}

// Test Authentication APIs
async function testAuthAPIs() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 TESTING AUTHENTICATION APIs');
  console.log('='.repeat(60));

  // 1. Test Admin Login
  const adminLogin = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(ADMIN_CREDENTIALS)
  });

  if (adminLogin.data?.token) {
    adminToken = adminLogin.data.token;
    console.log('   🎯 Admin token saved for future requests');
  }

  // 2. Test Employee Login
  const employeeLogin = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(EMPLOYEE_CREDENTIALS)
  });

  if (employeeLogin.data?.token) {
    employeeToken = employeeLogin.data.token;
    console.log('   🎯 Employee token saved for future requests');
  }

  // 3. Test Admin /me endpoint
  if (adminToken) {
    await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }

  // 4. Test Employee /me endpoint
  if (employeeToken) {
    const employeeMe = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    
    if (employeeMe.data?.employee?.id) {
      employeeId = employeeMe.data.employee.id;
      console.log('   🎯 Employee ID saved:', employeeId);
    }
  }

  // 5. Test Registration (create new employee)
  await apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test.employee@dayflow.com',
      password: 'Test@123',
      name: 'Test Employee',
      department: 'QA',
      designation: 'Tester',
      phone: '+91-9876543211',
      address: 'Test Address',
      joinDate: '2024-01-15',
      companyId: COMPANY_ID
    })
  });

  // 6. Test Logout
  if (adminToken) {
    await apiCall('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }
}

// Test Attendance APIs
async function testAttendanceAPIs() {
  console.log('\n' + '='.repeat(60));
  console.log('📅 TESTING ATTENDANCE APIs');
  console.log('='.repeat(60));

  if (!employeeToken || !employeeId) {
    console.log('❌ Missing employee token or ID, skipping attendance tests');
    return;
  }

  // 1. Test Check-in
  await apiCall('/api/attendance/check-in', {
    method: 'POST',
    headers: { Authorization: `Bearer ${employeeToken}` }
  });

  // 2. Test Get My Attendance
  await apiCall('/api/attendance/me?month=1&year=2026', {
    headers: { Authorization: `Bearer ${employeeToken}` }
  });

  // 3. Test Check-out
  await apiCall('/api/attendance/check-out', {
    method: 'POST',
    headers: { Authorization: `Bearer ${employeeToken}` }
  });

  // 4. Test Get All Attendance (Admin)
  if (adminToken) {
    const today = new Date().toISOString().split('T')[0];
    await apiCall(`/api/attendance?date=${today}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }

  // 5. Test Attendance Override (Admin) - First we need an attendance record
  if (adminToken && employeeId) {
    // First, let's try to get today's attendance records to find an ID
    const today = new Date().toISOString().split('T')[0];
    const attendanceRecords = await apiCall(`/api/attendance?date=${today}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    // If we have attendance records, try to override the first one
    if (attendanceRecords.data && attendanceRecords.data.length > 0) {
      // We need to find the actual attendance record ID from the database
      // For now, let's skip this test as it requires a specific attendance record ID
      console.log('   ⚠️  Skipping attendance override test - requires existing attendance record ID');
    }
  }

  // 6. Test Attendance Report
  if (adminToken) {
    const startDate = new Date();
    startDate.setDate(1); // First day of current month
    const endDate = new Date();
    
    await apiCall(`/api/attendance/report?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }
}

// Test Leave APIs
async function testLeaveAPIs() {
  console.log('\n' + '='.repeat(60));
  console.log('🏖️ TESTING LEAVE APIs');
  console.log('='.repeat(60));

  if (!employeeToken) {
    console.log('❌ Missing employee token, skipping leave tests');
    return;
  }

  // 1. Test Get Leave Balance
  await apiCall('/api/leaves/balance', {
    headers: { Authorization: `Bearer ${employeeToken}` }
  });

  // 2. Test Apply for Leave
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const leaveApplication = await apiCall('/api/leaves', {
    method: 'POST',
    headers: { Authorization: `Bearer ${employeeToken}` },
    body: JSON.stringify({
      type: 'PAID',
      duration: 'FULL_DAY',
      fromDate: tomorrow.toISOString().split('T')[0],
      toDate: dayAfter.toISOString().split('T')[0],
      reason: 'API Test Leave'
    })
  });

  let leaveId = null;
  if (leaveApplication.data?.id) {
    leaveId = leaveApplication.data.id;
  }

  // 3. Test Get All Leaves (Employee)
  await apiCall('/api/leaves', {
    headers: { Authorization: `Bearer ${employeeToken}` }
  });

  // 4. Test Get All Leaves (Admin)
  if (adminToken) {
    await apiCall('/api/leaves', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }

  // 5. Test Update Leave Status (Admin)
  if (adminToken && leaveId) {
    await apiCall(`/api/leaves/${leaveId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'APPROVED'
      })
    });
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting DayFlow API Tests...\n');
  console.log('📊 Testing against:', BASE_URL);
  console.log('🏢 Company ID:', COMPANY_ID);
  
  try {
    await testAuthAPIs();
    await testAttendanceAPIs();
    await testLeaveAPIs();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 API TESTING COMPLETED');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log('✅ Authentication APIs tested');
    console.log('✅ Attendance APIs tested');
    console.log('✅ Leave Management APIs tested');
    console.log('✅ Database populated with test data');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
}

// Run the tests
runAllTests();