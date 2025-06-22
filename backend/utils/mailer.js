const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,            // smtp.gmail.com
  port:     Number(process.env.SMTP_PORT),    // 465
  secure:   process.env.SMTP_SECURE === 'true', // true for port 465
  auth: {
    user: process.env.SMTP_USER,   // your.email@gmail.com
    pass: process.env.SMTP_PASS    // your 16-char app password
  }
});

// Verify connection configuration
transporter.verify(err => {
  if (err) console.error('❌ Mailer config error:', err);
  else     console.log('✉️  Gmail SMTP is ready to send messages');
});

module.exports = transporter;