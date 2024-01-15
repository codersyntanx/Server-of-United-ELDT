const nodemailer = require('nodemailer');

const sendloginpassword = async ( Email, Password) => {
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
      to: Email,
      subject: `Registration with Bolanos`,
      html: `
        <p>Email:${Email}</p>
        <p>Password:${Password}</p>
      `,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendloginpassword,
};
