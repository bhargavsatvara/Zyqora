const Cart = require('../models/cart');
const User = require('../models/user');
const transporter = require('../utils/mailer');
const { cartAbandonmentEmail } = require('../utils/emailTemplates');

class CartAbandonmentService {
  /**
   * Find all abandoned carts that need email notifications
   */
  static async findAbandonedCarts() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Find carts with items older than 24 hours that haven't been sent emails recently
      const abandonedCarts = await Cart.find({
        'items.added_at': { $lt: twentyFourHoursAgo },
        $or: [
          { last_abandonment_email_sent: { $lt: twentyFourHoursAgo } },
          { last_abandonment_email_sent: null }
        ],
        abandonment_email_count: { $lt: 3 } // Max 3 emails per cart
      }).populate('items.product_id');

      return abandonedCarts;
    } catch (error) {
      console.error('Error finding abandoned carts:', error);
      return [];
    }
  }

  /**
   * Send abandonment email for a specific cart
   */
  static async sendAbandonmentEmail(cart) {
    try {
      // Skip if cart is empty or user is guest
      if (!cart.items || cart.items.length === 0 || cart.user_id === 'guest') {
        return false;
      }

      // Get user information
      let user = null;
      try {
        user = await User.findById(cart.user_id);
      } catch (error) {
        console.log('User not found for cart:', cart.user_id);
        return false;
      }

      if (!user || !user.email) {
        console.log('No user or email found for cart:', cart.user_id);
        return false;
      }

      // Get abandoned items (items older than 24 hours)
      const abandonedItems = cart.getAbandonedItems(24);
      
      if (abandonedItems.length === 0) {
        return false;
      }

      // Prepare cart items for email
      const cartItemsForEmail = abandonedItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || (item.product_id && item.product_id.image) || null
      }));

      // Generate cart URL
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const cartUrl = `${frontendUrl}/shop-cart`;

      // Get user display name
      const userName = user.full_name || user.first_name || user.email.split('@')[0];

      // Generate email HTML
      const emailHtml = cartAbandonmentEmail(userName, cartItemsForEmail, cartUrl);

      // Send email
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Complete Your Purchase - Items Waiting in Your Cart',
        html: emailHtml,
        attachments: [
          {
            filename: 'zyqora-logo.png',
            path: './assets/images/logo.png', // Make sure this path exists
            cid: 'zyqoraLogo'
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      // Update cart with email sent information
      await Cart.findByIdAndUpdate(cart._id, {
        last_abandonment_email_sent: new Date(),
        $inc: { abandonment_email_count: 1 }
      });

      console.log(`Cart abandonment email sent to ${user.email} for cart ${cart._id}`);
      return true;

    } catch (error) {
      console.error('Error sending cart abandonment email:', error);
      return false;
    }
  }

  /**
   * Process all abandoned carts and send emails
   */
  static async processAbandonedCarts() {
    try {
      console.log('Starting cart abandonment email processing...');
      
      const abandonedCarts = await this.findAbandonedCarts();
      console.log(`Found ${abandonedCarts.length} abandoned carts`);

      let emailsSent = 0;
      for (const cart of abandonedCarts) {
        const emailSent = await this.sendAbandonmentEmail(cart);
        if (emailSent) {
          emailsSent++;
        }
        
        // Add a small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`Cart abandonment processing complete. ${emailsSent} emails sent.`);
      return emailsSent;

    } catch (error) {
      console.error('Error processing abandoned carts:', error);
      return 0;
    }
  }

  /**
   * Reset abandonment email count for a cart (when user completes purchase)
   */
  static async resetAbandonmentCount(cartId) {
    try {
      await Cart.findByIdAndUpdate(cartId, {
        abandonment_email_count: 0,
        last_abandonment_email_sent: null
      });
      console.log(`Reset abandonment count for cart ${cartId}`);
    } catch (error) {
      console.error('Error resetting abandonment count:', error);
    }
  }

  /**
   * Get cart abandonment statistics
   */
  static async getAbandonmentStats() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

      const stats = await Cart.aggregate([
        {
          $match: {
            'items.added_at': { $lt: twentyFourHoursAgo }
          }
        },
        {
          $group: {
            _id: null,
            totalAbandonedCarts: { $sum: 1 },
            totalEmailsSent: { $sum: '$abandonment_email_count' },
            averageEmailsPerCart: { $avg: '$abandonment_email_count' }
          }
        }
      ]);

      return stats[0] || {
        totalAbandonedCarts: 0,
        totalEmailsSent: 0,
        averageEmailsPerCart: 0
      };
    } catch (error) {
      console.error('Error getting abandonment stats:', error);
      return {
        totalAbandonedCarts: 0,
        totalEmailsSent: 0,
        averageEmailsPerCart: 0
      };
    }
  }
}

module.exports = CartAbandonmentService; 