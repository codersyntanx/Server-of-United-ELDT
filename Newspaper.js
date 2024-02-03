const nodemailer = require('nodemailer');

const Newpaper = async (Email) => {
  try {
    if (!Email || !Email.trim()) {  
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
      subject: "NewPaper",
      html: `
        <p>Email:${Email}</p>
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
