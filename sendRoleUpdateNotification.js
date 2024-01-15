const nodemailer = require('nodemailer');

const sendRoleUpdateNotification = async (Name, Email, Phone, Message) => {
  try {
    if (!Email || !Email.trim()) {  // Fixed typo in the variable name
      throw new Error('Invalid or empty email address');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sbolanos@bceins.com',
        pass: 'auun qfuw fmdu mseo',
      },
      debug: true,
    });
    const info = await transporter.sendMail({
      from: '"Bolanos" <sbolanos@bceins.com>',
      to: `${Email}, ${"sbolanos@bceins.com"}`,
      subject: `Registration with Bolanos`,
      html: `
        <p>Name:${Name}</p>
        <p>Email:${Email}</p>
        <p>Contact Number:${Phone}</p>
        <p>Mesage:${Message}</p>
      `,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendRoleUpdateNotification,
};
