import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};


// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     // Validate input
//     if (!to || !subject || !html) {
//       throw new Error("Missing required email parameters");
//     }

//     // Create reusable transporter object
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       // For production, consider these settings:
//       // pool: true,
//       // maxConnections: 1,
//       // rateLimit: true
//     });

//     // Verify connection configuration
//     await transporter.verify();

//     // Send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//       // Enable if you want to track opens
//       // headers: { 'X-Mailgun-Track': 'yes' }
//     });

//     console.log("Message sent: %s", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("Error sending email:", err);
//     throw new Error("Failed to send email");
//   }
// };