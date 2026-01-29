const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return false;
  }
};

// Send thank you email
const sendThankYouEmail = async (contactData) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return false;
  }

  const mailOptions = {
    from: `"Gatistwam" <${process.env.SMTP_USER}>`,
    to: contactData.email,
    subject: 'Thank you for contacting Gatistwam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Contacting Us!</h2>
        <p>Dear ${contactData.name},</p>
        <p>Thank you for reaching out to Gatistwam. We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a summary of your message:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong> ${contactData.message}</p>
        </div>
        <p>If you have any additional questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Gatistwam Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Thank you email sent successfully to:', contactData.email);
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return false;
  }
};

// Send reply email
const sendReplyEmail = async (contactData, replyMessage) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return false;
  }

  const mailOptions = {
    from: `"Gatistwam" <${process.env.SMTP_USER}>`,
    to: contactData.email,
    subject: 'Reply from Gatistwam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${contactData.name},</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${replyMessage}
        </div>
        <p style="color: #666;">Best regards,<br>Gatistwam Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reply email sent successfully to:', contactData.email);
    return true;
  } catch (error) {
    console.error('Error sending reply email:', error);
    return false;
  }
};

// Send notification email to admin
const sendAdminNotificationEmail = async (contactData) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"Gatistwam System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Lead: ${contactData.subject} - ${contactData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #0066cc; margin: 15px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #555;">Message:</h3>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully to:', adminEmail);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

module.exports = {
  sendThankYouEmail,
  sendReplyEmail,
  sendAdminNotificationEmail,
  verifyTransporter
}; 