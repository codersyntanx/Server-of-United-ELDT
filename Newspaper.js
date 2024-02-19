const nodemailer = require('nodemailer');

const Newpaper = async (Email) => {
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
      subject: "United ELDT NewsLetter",
      html: `
      <Strong>Thank you for subscribing our Newsletter. </Strong>
      <p>We welcome you to the United ELDT family.</p>
      `,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  Newpaper,
};
