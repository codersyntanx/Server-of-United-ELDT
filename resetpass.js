const nodemailer = require('nodemailer');

const sendpassword = async ( Email, Password) => {
  try {
    if (!Email || !Email.trim()) {  // Fixed typo in the variable name
      throw new Error('Invalid or empty email address');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mirza@unitedcdlschool.com',
        pass: 'agws mnuk lqyp amfq',
      },
      debug: true,
    });
    const info = await transporter.sendMail({
      from: '"Bolanos" <mirza@unitedcdlschool.com>',
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
