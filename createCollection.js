const mongoose = require('mongoose');

const connectToDB = async () => {
  const uri = 'mongodb://localhost:27017/TheBai'; // Kết nối không cần username và password
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Kết nối đến MongoDB thành công!");

    // Tạo schema cho collection Users
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      age: Number,
    });

    // Tạo model cho collection Users
    const User = mongoose.model('Users', userSchema);

    // Tạo collection nếu chưa tồn tại
    await User.init();
    console.log("Collection 'Users' đã được tạo!");

  } catch (error) {
    console.error("Lỗi kết nối đến MongoDB:", error);
  } finally {
    mongoose.connection.close(); // Đóng kết nối
  }
};

connectToDB();