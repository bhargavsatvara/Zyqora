const cron = require('node-cron');
const CartAbandonmentService = require('../services/cartAbandonmentService');

class CartAbandonmentScheduler {
  constructor() {
    this.isRunning = false;
    this.job = null;
  }

  /**
   * Start the cart abandonment scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Cart abandonment scheduler is already running');
      return;
    }

    // Schedule job to run every 6 hours (at 2 AM, 8 AM, 2 PM, 8 PM)
    this.job = cron.schedule('0 2,8,14,20 * * *', async () => {
      console.log('🕐 Running scheduled cart abandonment check...');
      await this.runAbandonmentCheck();
    }, {
      scheduled: false,
      timezone: "UTC"
    });

    // Also run every 12 hours as a fallback
    const fallbackJob = cron.schedule('0 */12 * * *', async () => {
      console.log('🕐 Running fallback cart abandonment check...');
      await this.runAbandonmentCheck();
    }, {
      scheduled: false,
      timezone: "UTC"
    });

    this.job.start();
    fallbackJob.start();
    this.isRunning = true;

    console.log('✅ Cart abandonment scheduler started');
    console.log('📧 Will check for abandoned carts every 6 hours (2 AM, 8 AM, 2 PM, 8 PM UTC)');
  }

  /**
   * Stop the cart abandonment scheduler
   */
  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log('⏹️ Cart abandonment scheduler stopped');
    }
  }

  /**
   * Run the abandonment check manually
   */
  async runAbandonmentCheck() {
    try {
      if (this.isProcessing) {
        console.log('⚠️ Cart abandonment check already in progress, skipping...');
        return;
      }

      this.isProcessing = true;
      console.log('🔍 Starting cart abandonment email processing...');

      const emailsSent = await CartAbandonmentService.processAbandonedCarts();
      
      if (emailsSent > 0) {
        console.log(`📧 Successfully sent ${emailsSent} cart abandonment emails`);
      } else {
        console.log('📭 No cart abandonment emails sent');
      }

      // Log statistics
      const stats = await CartAbandonmentService.getAbandonmentStats();
      console.log('📊 Cart abandonment statistics:', stats);

    } catch (error) {
      console.error('❌ Error in cart abandonment check:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      isProcessing: this.isProcessing || false,
      nextRun: this.job ? this.job.nextDate().toISOString() : null
    };
  }

  /**
   * Test the abandonment service (for development)
   */
  async testAbandonmentService() {
    console.log('🧪 Testing cart abandonment service...');
    
    try {
      const abandonedCarts = await CartAbandonmentService.findAbandonedCarts();
      console.log(`Found ${abandonedCarts.length} abandoned carts`);
      
      const stats = await CartAbandonmentService.getAbandonmentStats();
      console.log('Abandonment stats:', stats);
      
      return { abandonedCarts, stats };
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const cartAbandonmentScheduler = new CartAbandonmentScheduler();

module.exports = cartAbandonmentScheduler; 