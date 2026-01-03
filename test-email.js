// Email Test Script for DayFlow
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter using the same configuration as your app
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function testEmail() {
  console.log('📧 Testing Nodemailer Configuration...\n');
  
  // Display configuration (without showing password)
  console.log('📋 Email Configuration:');
  console.log(`   Service: Gmail`);
  console.log(`   User: ${process.env.EMAIL_USER}`);
  console.log(`   Password: ${process.env.EMAIL_APP_PASSWORD ? '***configured***' : '❌ NOT SET'}`);
  console.log('');

  try {
    // Test 1: Verify transporter configuration
    console.log('🔍 Step 1: Verifying transporter configuration...');
    await mailer.verify();
    console.log('✅ Transporter configuration is valid!\n');

    // Test 2: Send a test email
    console.log('📤 Step 2: Sending test email...');
    
    const testEmailOptions = {
      from: `"DayFlow Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: '🧪 DayFlow Email Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📧 DayFlow Email Test</h2>
          <p>Hello! This is a test email from your DayFlow application.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">✅ Email System Status</h3>
            <ul>
              <li><strong>Nodemailer:</strong> Working correctly</li>
              <li><strong>Gmail Service:</strong> Connected successfully</li>
              <li><strong>Authentication:</strong> Valid credentials</li>
              <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          <p style="color: #6b7280;">
            If you received this email, your DayFlow email system is configured correctly and ready to send:
          </p>
          <ul style="color: #6b7280;">
            <li>Attendance reports</li>
            <li>Leave notifications</li>
            <li>System alerts</li>
          </ul>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af;">
            This email was sent automatically by DayFlow Email Test Script<br>
            Time: ${new Date().toISOString()}
          </p>
        </div>
      `,
      text: `
DayFlow Email Test

Hello! This is a test email from your DayFlow application.

✅ Email System Status:
- Nodemailer: Working correctly
- Gmail Service: Connected successfully  
- Authentication: Valid credentials
- Test Time: ${new Date().toLocaleString()}

If you received this email, your DayFlow email system is configured correctly and ready to send attendance reports, leave notifications, and system alerts.

---
This email was sent automatically by DayFlow Email Test Script
Time: ${new Date().toISOString()}
      `
    };

    const info = await mailer.sendMail(testEmailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${testEmailOptions.to}`);
    console.log(`   Subject: ${testEmailOptions.subject}`);
    console.log('');
    
    // Test 3: Additional verification
    console.log('📊 Step 3: Email delivery information:');
    if (info.accepted && info.accepted.length > 0) {
      console.log(`✅ Accepted recipients: ${info.accepted.join(', ')}`);
    }
    if (info.rejected && info.rejected.length > 0) {
      console.log(`❌ Rejected recipients: ${info.rejected.join(', ')}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 EMAIL TEST COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📬 Please check your email inbox:');
    console.log(`   Email: ${process.env.EMAIL_USER}`);
    console.log('   Subject: 🧪 DayFlow Email Test - [timestamp]');
    console.log('');
    console.log('💡 If you received the email, confirm by typing "yes"');
    console.log('   If you did not receive it, check your spam folder');
    console.log('   and confirm by typing "no"');
    
  } catch (error) {
    console.error('\n❌ EMAIL TEST FAILED!');
    console.error('Error details:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication Error:');
      console.error('   - Check if EMAIL_USER is correct');
      console.error('   - Verify EMAIL_APP_PASSWORD is a valid App Password');
      console.error('   - Ensure 2-Factor Authentication is enabled on Gmail');
      console.error('   - Make sure "Less secure app access" is disabled');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Connection Error:');
      console.error('   - Check your internet connection');
      console.error('   - Verify Gmail SMTP is accessible');
    }
    
    console.error('\n📚 Troubleshooting Guide:');
    console.error('   1. Go to Google Account settings');
    console.error('   2. Enable 2-Factor Authentication');
    console.error('   3. Generate an App Password for "Mail"');
    console.error('   4. Use the App Password in EMAIL_APP_PASSWORD');
  }
}

// Run the test
testEmail();