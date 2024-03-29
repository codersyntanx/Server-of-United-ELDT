const nodemailer = require('nodemailer');

const sendpassword = async ( Email, Password) => {
  try {
    if (!Email || !Email.trim()) {  // Fixed typo in the variable name
      throw new Error('Invalid or empty email address');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'login@unitedeldt.com',
        pass: 'kqdh tfza wzzg jldm',
      },
      debug: true,
    });
    const info = await transporter.sendMail({
      from: '"United ELDT" <login@unitedeldt.com>',
      to: Email,
      subject: `Password Recovery`,
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
  sendpassword,
};
