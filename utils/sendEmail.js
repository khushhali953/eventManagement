const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use host/port for other providers
  auth: {
    user: process.env.EMAIL_USER,   // your sending email address
    pass: process.env.EMAIL_PASS    // app password (not your real password)
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Eventify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html              
    });
    console.log("✅ Email sent successfully:", to);
        console.log("Response:", info.response);

  } catch (err) {
    console.error("Email send failed:", err.message);
  }
  console.log("EMAIL_USER loaded as:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded as:", process.env.EMAIL_PASS);
};

module.exports = sendEmail;