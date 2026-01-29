const Contact = require('../models/Contact');
const { sendThankYouEmail, sendAdminNotificationEmail } = require('../utils/emailService');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    console.log('Received contact form data:', req.body);

    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message
    });

    console.log('Contact form saved successfully:', contact);

    // Send response IMMEDIATELY so the user doesn't wait
    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for contacting us. We will get back to you soon.'
    });

    // Send emails in background
    // We do NOT await these so the response is fast
    Promise.all([
      sendThankYouEmail(contact).catch(err => console.error('Failed to send thank you email:', err)),
      sendAdminNotificationEmail(contact).catch(err => console.error('Failed to send admin email:', err))
    ]);
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving contact form'
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Public
exports.getContacts = async (req, res) => {
  try {
    console.log('Fetching all contacts');
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log(`Found ${contacts.length} contacts`);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Public
exports.getContact = async (req, res) => {
  try {
    console.log('Fetching contact with ID:', req.params.id);
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      console.log('Contact not found');
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    console.log('Contact found:', contact);
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Public
exports.updateContactStatus = async (req, res) => {
  try {
    console.log('Updating contact status:', req.params.id, req.body);
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      console.log('Contact not found for update');
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    console.log('Contact updated successfully:', contact);
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 