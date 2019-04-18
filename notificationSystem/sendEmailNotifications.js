// using SendGrid's v3 Node.js Library
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const Notifications = require('../database/Helpers/notifications-model');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 4/3/19, Leigh-Ann: This function may need reworking based on edits to sendTextNotifications
async function sendEmailNotifications(notification) {
  // email validation to prevent sending empty email to sendgrid
  if (notification.email === "") {
    await Notifications.markNotificationAsSent(notification.notificationID, {
      emailOn: 0,
      emailSent: 1
    });
    console.log('Empty email address found, mark as inactive')
  }
  // if validated, run logic for emails ready to be sent
  else if (notification.emailSent === 0 && notification.emailOn === 1) {
    console.log(notification.email, "email active, continue running send function")
    try {

      // use notification.userID to get user's current notification account and their account type's max count
      const userCountData = await Notifications.getUserNotificationCountData(
        notification.userID
      );

      if (userCountData.notificationCount === userCountData.maxNotificationCount) {
        console.log('User has reached maximum notification this month')
      }

      // compare User.notificationCount to accountType.maxNotificationCount
      else if (userCountData.notificationCount < userCountData.maxNotificationCount) {
        // if less than, continue sending messages and increase notification count by 1
        let newValue = userCountData.notificationCount + 1;

        // Create options to send the email
        const options = {
          to: `${notification.email}`,
          from: 'trainingbotlabs11@gmail.com',
          subject: `${notification.postName} - A Reminder from Training Bot `,
          html: `
      <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Training Bot</title>
      <style>
        /* -------------------------------------
          INLINED WITH htmlemail.io/inline
      ------------------------------------- */
        /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table[class='body'] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          table[class='body'] p,
          table[class='body'] ul,
          table[class='body'] ol,
          table[class='body'] td,
          table[class='body'] span,
          table[class='body'] a {
            font-size: 16px !important;
          }
          table[class='body'] .wrapper,
          table[class='body'] .article {
            padding: 10px !important;
          }
          table[class='body'] .content {
            padding: 0 !important;
          }
          table[class='body'] .container {
            padding: 0 !important;
            width: 100% !important;
          }
          table[class='body'] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          table[class='body'] .btn table {
            width: 100% !important;
          }
          table[class='body'] .btn a {
            width: 100% !important;
          }
          table[class='body'] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
        /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
        }
      </style>
      </head>
      <body
      class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
      >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="body"
        style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"
      >
        <tr>
          <td
            style="font-family: sans-serif; font-size: 14px; vertical-align: top;"
          >
            &nbsp;
          </td>
          <td
            class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"
          >
            <div
              class="content"
              style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"
            >
              <!-- START CENTERED WHITE CONTAINER -->
              <span
                class="preheader"
                style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"
                >This is preheader text. Some clients will show this text as a
                preview.</span
              >
              <table
                class="main"
                style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"
              >
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td
                    class="wrapper"
                    style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                    >
                      <tr>
                        <td
                          style="font-family: sans-serif; font-size: 14px; vertical-align: top;"
                        >
                          <h2>Hello, 
                          ${notification.firstName} 
                          </h2>
                          <p
                            style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"
                          >
                          Here's a quick reminder for you from your team lead.
                          </p>
                          <hr>
                          <h2>
                          ${notification.postName}
                          </h2>
                          <p>
                          ${notification.postDetails}
                          </p>
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="btn btn-primary"
                            style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="left"
                                  style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"
                                >
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"
                                  >
                                    <tbody>
                                      <p>Read more: 
                                      <a>${notification.link}</a>
                                      </p>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
      
                <!-- END MAIN CONTENT AREA -->
              </table>
      
              <!-- START FOOTER -->
              <div
                class="footer"
                style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"
              >
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                >
                  <tr>
                    <td
                      class="content-block"
                      style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"
                    >
                      <span
                        class="apple-link"
                        style="color: #999999; font-size: 12px; text-align: center;"
                        >Training Bot, 123 Update This Address, San Francisco CA 94102</span
                      >
                      <br />
                      You are receiving these notifications from your team lead through Training Bot.
                    </td>
                  </tr>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
      
              <!-- END CENTERED WHITE CONTAINER -->
            </div>
          </td>
          <td
            style="font-family: sans-serif; font-size: 14px; vertical-align: top;"
          >
            &nbsp;
          </td>
        </tr>
      </table>
      </body>
      `
        };

        // may need email validation before sending data to sendgrid
        // Send the email!
        sgMail.send(options);
        // send updated notificationCount to the database
        await Notifications.increaseUserNotificationCount(
          notification.userID,
          newValue
        );
        await Notifications.markNotificationAsSent(notification.notificationID, {
          emailSent: 1
        });
      } else {
        console.log("Maximum notification count has been reached for this user")
      }
    } catch (error) {
      console.log('email notification system error', error)
    }
  } else {
    console.log("email marked as inactive or already marked as sent")
  }
}

module.exports = sendEmailNotifications;
