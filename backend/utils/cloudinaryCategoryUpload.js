const cloudinary = require('./cloudinary');

async function uploadCategoryImage(filePath) {
  return cloudinary.uploader.upload(filePath, {
    folder: 'categories',
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  });
}

module.exports = uploadCategoryImage; 