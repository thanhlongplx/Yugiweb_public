const mongoose = require("mongoose");

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost:27017/Yugi-Web", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Yugi-Web database");
    seedFeedbacks();
  })
  .catch((err) => console.log(err));

// Định nghĩa schema cho feedback
const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("feedbacks", FeedbackSchema);

// Hàm tạo dữ liệu mẫu
async function seedFeedbacks() {
  const feedbacks = [
    { userId: "60d0fe4f5311236168a109ca", content: "Great service!", rating: 5 },
    { userId: "60d0fe4f5311236168a109cb", content: "Could be better.", rating: 3 },
    { userId: "60d0fe4f5311236168a109cc", content: "Not satisfied.", rating: 1 },
  ];

  try {
    await Feedback.insertMany(feedbacks);
    console.log("Sample feedbacks created");
  } catch (err) {
    console.error("Error creating feedbacks:", err);
  } finally {
    mongoose.connection.close();
  }
}