const mongoose = require('mongoose')

const SocialPlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Bắt buộc phải có tên của nền tảng (ví dụ: Facebook, Twitter)
    unique: true, // Đảm bảo tên của nền tảng là duy nhất
  },
  url: {
    type: String,
    required: true, // URL đến trang mạng xã hội (ví dụ: https://facebook.com)
  },
  logo: {
    type: String, // URL hoặc đường dẫn đến logo của nền tảng (nếu cần)
  },
})

module.exports = mongoose.model('SocialPlatform', SocialPlatformSchema)
