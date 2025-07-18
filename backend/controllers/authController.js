const User = require('../models/user');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../utils/mailer');
const { successEmail, resetPasswordEmail } = require('../utils/emailTemplates');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // 0) Basic field check
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide name, email and password' });
  }

  // 1) Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()+={}[\]|\\:;"'<>,./~-]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }

  try {
    // 2) Prevent duplicate email
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3) Hash + save user
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await new User({ name, email, password: hashed }).save();

    // 4) Send welcome email
    try {
      await transporter.sendMail({
        from: `"Zyqora Team" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Welcome to Zyqora! 🎉',
        html: successEmail(name),
        attachments: [{
          filename: 'logo-icon-64.png',
          path: path.resolve(
            __dirname,
            '..',      // backend/controllers → backend
            '..',      // backend → project root
            'frontend', 'src', 'assets', 'images', 'logo.png'
          ),
          cid: 'zyqoraLogo'
        }]
      });
      console.log('✉️  Welcome email sent');
    } catch (mailErr) {
      console.error('⚠️  Email send error:', mailErr);
    }

    // 5) Generate JWT
    const loginToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token: loginToken, user });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { email, password, rememberMe } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Please enter a valid email address" });

    const user = await User.findOne({ email });
    console.log("user", user);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // longer expiry if remembering
    const expiresIn = rememberMe ? "30d" : "7d";
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No account found with that email.' });

    // 1) Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // 2) Verify connection configuration
    await transporter.verify();
    console.log('✅ SMTP configuration is valid');

    // 3) Generate token & link
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    const resetUrl = `${process.env.RESETPASSWORD_URL}/reset-password/${resetToken}`;

    // 4) Send mail
    const info = await transporter.sendMail({
      from: `"Zyqora Support" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: '🔒 Password Reset Request',
      html: resetPasswordEmail(user.name || user.email, resetUrl)
    });

    console.log('📧 Message sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    // (only prints a URL when using an Ethereal or similar test account)

    return res.json({ message: 'If that email is in our system, you’ll receive a reset link shortly.' });
  } catch (err) {
    console.error('💥 ForgotPassword error:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify & decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token.' });

    // Hash & save new password
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('ResetPassword error:', err);
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'someSuperSecretKey');
    console.log('✅ Token payload:', decoded);
  } catch (jwtErr) {
    console.error('🔐 JWT verify error:', jwtErr);
    const msg =
      jwtErr.name === 'TokenExpiredError'
        ? 'Token has expired – please request a new verification email'
        : `Token is invalid: ${jwtErr.message}`;
    return res.status(400).json({ message: msg });
  }

};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword, settings } = req.body;
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (settings) user.settings = { ...user.settings, ...settings };

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Validate new password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()+={}[\]|\\:;"'<>,./~-]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success response
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};