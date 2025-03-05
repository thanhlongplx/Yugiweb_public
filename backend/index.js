const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost:27017/", {
    dbName: "Yugi-Web",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Yugi-Web database");
  })
  .catch((err) => console.log(err));

// Định nghĩa schema cho người dùng
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passWord: { type: String, required: true },
  date: { type: Date, default: Date.now },
  collection: { type: [String], default: [] },
  coin: { type: Number, default: 0 },
  role: { type: String, default: "customer" },
});

const User = mongoose.model("users", UserSchema);

// Khởi tạo Express
const app = express();
app.use(express.json());
app.use(cors());

// Kiểm tra backend hoạt động
app.get("/", (req, res) => {
  res.send("App is Working");
});

// 📌 API lấy bộ sưu tập của người dùng
app.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({ collection: user.collection || [] });
  } catch (err) {
    console.error("❌ Error fetching user collection:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//Dang nhap
app.post("/login", async (req, res) => {
  const { email, passWord } = req.body;

  if (!email || !passWord) {
    return res.status(400).send({ error: "Email và mật khẩu là bắt buộc." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ error: "Email hoặc mật khẩu không hợp lệ." });
  }

  const isMatch = await bcrypt.compare(passWord, user.passWord);
  if (!isMatch) {
    return res.status(400).send({ error: "Email hoặc mật khẩu không hợp lệ." });
  }

  // Gửi phản hồi với thông tin người dùng
  res.send({
    message: "Đăng nhập thành công",
    userEmail: user.email,
    userCoin: user.coin, // Lấy số coin từ thông tin người dùng
  });
});

// Đăng ký người dùng
app.post("/register", async (req, res) => {
  const { name, email, passWord } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ error: "Email đã được sử dụng." });
  }

  const hashedPassword = await bcrypt.hash(passWord, 10);
  const newUser = new User({ name, email, passWord: hashedPassword, coin: 0 });

  try {
    await newUser.save();
    res.send({ message: "Đăng ký thành công!", coin: newUser.coin });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Thêm thẻ bài vào bộ sưu tập của người dùng
app.post("/user/add-to-collection", async (req, res) => {
  const { cardName, email, level, atk, def } = req.body; // Thêm các thông số cần thiết

  if (!cardName || !email ) {
    
    
    return res.status(400).send({ error: "Thiếu thông tin cần thiết." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Người dùng không tồn tại." });
    }

    const normalizedCardName = cardName.trim().toLowerCase();
    const normalizedCollection = user.collection.map((card) =>
      card.trim().toLowerCase()
    );

    if (normalizedCollection.includes(normalizedCardName)) {
      return res
        .status(400)
        .send({ error: "Thẻ bài đã tồn tại trong bộ sưu tập." });
    }

    // Tính giá trị thẻ bài
    const cardValue = calculateCardValue(level, atk, def); // Giả sử hàm này tồn tại

    // Kiểm tra xem người dùng có đủ coin không
    if (user.coin < cardValue) {
      return res.status(400).send({ error: "Không đủ coin để thêm thẻ bài." });
    }

    // Thêm thẻ bài vào bộ sưu tập và trừ coin
    user.collection.push(cardName);
    user.coin -= cardValue; // Trừ coin
    await user.save();

    res.send({
      message: "Thẻ bài đã được thêm vào bộ sưu tập.",
      userCoin: user.coin,
    });
  } catch (error) {
    console.error("Error adding card to collection:", error);
    res.status(500).send({ error: "Đã xảy ra lỗi khi thêm thẻ bài." });
  }
});

// Hàm tính giá trị thẻ bài (ví dụ)
function calculateCardValue(level, atk, def) {
  if (!level) {
    return 1500;
  }

  let baseValue;
  if (level > 7) {
    baseValue = 2000; // Level lớn hơn 7
  } else if (level > 4) {
    baseValue = 1000; // Level lớn hơn 4
  } else {
    baseValue = 500; // Các trường hợp còn lại
  }

  const atkValue = atk * 0.5;
  const defValue = def * 0.3;

  return baseValue + atkValue + defValue;
}

// Khai báo router
const router = express.Router();

// Endpoint xóa thẻ bài khỏi bộ sưu tập
router.post("/remove-from-collection", async (req, res) => {
  const { cardName, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.collection = user.collection.filter((name) => name !== cardName);
    await user.save();

    res.status(200).json({ message: "Card removed from collection" });
  } catch (error) {
    console.error("Error removing card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Kết nối router với app
app.use("/user", router);

// Lắng nghe trên cổng 5000
app.listen(5000, () => {
  console.log("App listening at port 5000");
});
