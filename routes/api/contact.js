const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus
} = require('../../controllers/contactController');
const Contact = require('../../models/Contact');
const { sendReplyEmail } = require('../../utils/emailService');
const { authenticateToken, isAdmin } = require('../../middleware/auth');

// Public routes
router.post('/', submitContact);

// Protected routes (require authentication)
router.use(authenticateToken);
router.use(isAdmin);

router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContactStatus);
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reply to a contact (protected)
router.post('/reply', async (req, res) => {
  try {
    const { contactId, email, message, name } = req.body;

    // Validate required fields
    if (!email || !message || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Update contact status to 'replied'
    if (contactId) {
      await Contact.findByIdAndUpdate(contactId, { status: 'replied' });
    }

    // Send reply email
    const emailSent = await sendReplyEmail({ email, name }, message);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reply email. Please check email configuration.'
      });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
});

module.exports = router; 