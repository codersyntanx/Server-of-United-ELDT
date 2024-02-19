const nodemailer = require('nodemailer');

const Contactusemail = async (Name, Email, Phone, Message ,Subject) => {
  try {
    if (!Email || !Email.trim()) {  
      throw new Error('Invalid or empty email address');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'support@unitedeldt.com',
        pass: 'pmtq ljxh ffta uxxo',
      },
      debug: true,
    });
    const info = await transporter.sendMail({
      from: '"United ELDT" <support@unitedeldt.com>',
      to: Email,
      subject: Subject,
      html: `
      <p>Thank you for contacting us. You will be responded to within the next 24 business hours.</p>
      `,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  Contactusemail,
};
