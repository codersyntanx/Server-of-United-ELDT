const nodemailer = require('nodemailer');

const sendloginpassword = async ( Email, Password) => {
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
      subject: `Registration with United ELDT`,
      html: `
      <!DOCTYPE html>
      <html lang="en-US">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>New Account Email Template</title>
          <meta name="description" content="New Account Email Template." />
          <style type="text/css">
            a:hover {
              text-decoration: underline !important;
            }
      
            .body {
              margin: 0px;
              background-color: #f2f3f8;
            }
      
            .table1 {
              background-color: #f2f3f8;
              max-width: 670px;
              margin: 0 auto;
            }
            body {
              @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
              font-family: "Open Sans", sans-serif;
            }
            .tb2 {
              max-width: 670px;
              background: #fff;
              border-radius: 3px;
              text-align: center;
              -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
              -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
              box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
            }
            .h1 {
              color: #1e1e2d;
              font-weight: 500;
              margin: 0;
              font-size: 32px;
              font-family: "Rubik", sans-serif;
            }
            .p1 {
              font-size: 15px;
              color: #455056;
              margin: 8px 0 0;
              line-height: 24px;
            }
            .p2 {
              color: #455056;
              font-size: 18px;
              line-height: 20px;
              margin: 0;
              font-weight: 500;
            }
            .p3 {
              font-size: 14px;
              color: rgba(69, 80, 86, 0.7411764705882353);
              line-height: 18px;
              margin: 0 0 0;
            }
            .s1 {
              display: inline-block;
              vertical-align: middle;
              margin: 29px 0 26px;
              border-bottom: 1px solid #cecece;
              width: 100px;
            }
            .st1 {
              display: block;
              font-size: 13px;
              margin: 0 0 4px;
              color: rgba(0, 0, 0, 0.64);
              font-weight: normal;
            }
            .st2 {
              display: block;
              font-size: 13px;
              margin: 24px 0 4px 0;
              font-weight: normal;
              color: rgba(0, 0, 0, 0.64);
            }
            .logo {
              background: #fbb723;
              text-decoration: none !important;
              color:Black;
              display: inline-block;
              font-weight: 500;
              margin-top: 24px;
              color: #fff;
              text-transform: uppercase;
              font-size: 14px;
              padding: 10px 24px;
              display: inline-block;
              border-radius: 50px;
            }
            a{
              color:black;
            }
            .logo:hover {
              background: #black;
              text-decoration: none !important;
              color:white !important;
              display: inline-block;
              font-weight: 500;
              margin-top: 24px;
              color: #fff;
              text-transform: uppercase;
              font-size: 14px;
              padding: 10px 24px;
              display: inline-block;
              border-radius: 50px;
            }
          </style>
        </head>
      
        <body
          marginheight="0"
          topmargin="0"
          marginwidth="0"
          class="body"
          leftmargin="0"
        >
          <table
            cellspacing="0"
            border="0"
            cellpadding="0"
            width="100%"
            bgcolor="#f2f3f8"
          >
            <tr>
              <td>
                <table
                  width="100%"
                  border="0"
                  class="table1"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td style="height: 80px"> </td>
                  </tr>
                  <tr>
                    <td style="text-align: center">
                      <a href="https://www.unitedeldt.com" title="logo" target="_blank">
                        <img
                          width="300"
                          src="https://www.unitedeldt.com/static/media/logo%201.6d922c0810f9d53e0ffc14fd493ae1bf.svg"
                          title="logo"
                          alt="logo"
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 20px"> </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        width="95%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        class="tb2"
                      >
                        <tr>
                          <td style="height: 40px"> </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 35px">
                            <h1 class="h1">Log in</h1>
                            <p class="p1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere perspiciatis id adipisci eius sequi? Vitae, modi sint expedita debitis et, commodi reiciendis praesentium quia nostrum rerum consequatur unde beatae? Nobis!<br /><strong
                                >Please change the password immediately after
                                login</strong>.
                            </p>
                            <span class="s1"></span>
                            <p class="p2">
                              <strong class="st1">Username</strong>${Email}
                              <strong class="st2">Password</strong>${Password}
                            </p>
      
                              <a href="https://www.unitedeldt.com/login" class="logo">
                                  Login to your Account
                              </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 40px"> </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 20px"> </td>
                  </tr>
                  <tr>
                    <td style="text-align: center">
                      <p class="p3">© <strong><script>
                          const d = new Date();
                          let year = d.getFullYear();
                          document.write(year);
                          </script>
                          United ELDT</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 80px"> </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--/100% body table-->
        </body>
      </html>
      
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
