const { Review } = require('../models');

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.id }).populate('user_id');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      user_id: req.user,
      product_id: req.params.id,
      rating,
      comment,
      created_at: new Date()
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user },
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user_id: req.user });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 