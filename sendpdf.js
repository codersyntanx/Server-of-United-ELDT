const nodemailer = require('nodemailer');

const sendpdf = async (Email, pdf) => {
  try {
    if (!Email || !Email.trim() || !pdf) {
      throw new Error('Invalid or empty email address or missing PDF file');
    }

    // Configure your transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nomigill573@gmail.com',
        pass: 'ryyoiujchlegyhsp',
      },
      debug: true,
    });

    // Configure your mail options
    const mailOptions = {
      from: '"Bolanos" <sbolanos@bceins.com>',
      to: Email,
      subject: 'Sending Email from United',
      html: '<p>Contract</p>',
      attachments: [
        {
          filename: 'contract.pdf',
          content: pdf.buffer, // Use the buffer from the uploaded file
          encoding: 'base64',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendpdf,
};
