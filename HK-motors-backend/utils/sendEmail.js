const nodemailer = require("nodemailer");

const sendInvoiceEmail = async (to, invoiceHtml) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"HK Motors" <${process.env.EMAIL}>`,
      to,
      subject: "Your Invoice - HK Motors",
      html: invoiceHtml
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ Email Error:", error.message);
  }
};

module.exports = sendInvoiceEmail;