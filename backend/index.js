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
  username: { type: String, required: true, unique: true }, // Tên người dùng
  email: { type: String, required: false }, // Thêm trường email
  passWord: { type: String, required: true }, // Mật khẩu
  date: { type: Date, default: Date.now }, // Ngày tạo
  collection: { type: [String], default: [] }, // Bộ sưu tập
  coin: { type: Number, default: 10000 }, // Số tiền
  role: { type: String, default: "customer" }, // Vai trò
});

const User = mongoose.model("users", UserSchema);

// Khởi tạo Express
const app = express();
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ frontend của bạn
    credentials: true,
  })
);
// Đặt header chính sách bảo mật
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "same-origin");
  next();
});

// Kiểm tra backend hoạt động
app.get("/", (req, res) => {
  res.send("App is Working");
});

// API to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/login-google", async (req, res) => {
  const { email, name } = req.body;

  try {
    console.log("Received request body:", req.body);

    // Kiểm tra xem email có hợp lệ không
    if (!email) {
      return res.status(400).send({ error: "Email là bắt buộc." });
    }

    // Tìm người dùng dựa trên email
    let user = await User.findOne({ email });

    if (!user) {
      // Nếu người dùng không tồn tại, tạo mới
      const generatedPassword = "defaultPassword"; // Tạo mật khẩu ngẫu nhiên
      const hashedPassword = await bcrypt.hash(generatedPassword, 10); // Băm mật khẩu

      // Tạo người dùng mới
      user = new User({
        name: name || email, // Nếu không có tên, sử dụng email
        username: email, // Sử dụng email làm username
        email, // Lưu email
        passWord: hashedPassword, // Lưu mật khẩu đã được băm
        coin: 10000, // Số tiền khởi điểm
        role: "customer", // Vai trò mặc định
      });

      await user.save(); // Lưu người dùng vào cơ sở dữ liệu
      console.log("New user created:", user);
    }

    // Gửi phản hồi thành công
    res.send({
      message: "Đăng nhập thành công",
      userUsername: user.username, // Trả về username
      userCoin: user.coin, // Trả về số tiền
      userRole: user.role, // Trả về vai trò
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).send({ error: "Đã xảy ra lỗi khi đăng nhập." });
  }
});
app.post("/login-facebook", async (req, res) => {
  const { email, name } = req.body;

  try {
    console.log("Received request body:", req.body);
    let user = await User.findOne({ email });

    if (!user) {
      // Tạo một mật khẩu ngẫu nhiên
      const generatedPassword = "defaultPassword"; // Hoặc tạo một mật khẩu ngẫu nhiên

      // Băm mật khẩu
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Nếu người dùng không tồn tại, tạo mới
      user = new User({
        name: name || email,
        email,
        passWord: hashedPassword, // Lưu mật khẩu đã được băm
        coin: 10000,
        role: "customer",
      });
      await user.save();
      console.log("New user created:", user);
    }

    // Gửi phản hồi thành công
    res.send({
      message: "Đăng nhập thành công",
      userEmail: user.email,
      userCoin: user.coin,
      userRole: user.role,
    });
  } catch (error) {
    console.error("Error during Facebook login:", error);
    res.status(500).send({ error: "Đã xảy ra lỗi khi đăng nhập." });
  }
});

// API to update user information
app.put("/user/update/:username", async (req, res) => {
  const { username } = req.params;
  const { name, role } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { name, role }, // Cập nhật tên và vai trò
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// Endpoint cập nhật số coin
app.put("/user/update-coin/:email", async (req, res) => {
  const { coin } = req.body;
  const email = req.params.email;

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Cập nhật số coin
    user.coin = coin;

    // Lưu lại người dùng
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Trả về thông tin người dùng bao gồm tên, email và bộ sưu tập
    res.send({
      name: user.username, // Thêm trường tên
      email: user.email, // Thêm trường email
      coin: user.coin, // Thêm trường coin
      collection: user.collection || [], // Bộ sưu tập
    });
  } catch (err) {
    console.error("❌ Error fetching user collection:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//Dang nhap
app.post("/login", async (req, res) => {
  const { username, passWord } = req.body;

  if (!username || !passWord) {
    return res.status(400).send({ error: "Username và mật khẩu là bắt buộc." });
  }

  // Tìm người dùng theo username
  const user = await User.findOne({ username }); // Thay đổi từ email sang username

  if (!user) {
    return res
      .status(400)
      .send({ error: "Username hoặc mật khẩu không hợp lệ." });
  }

  // So sánh mật khẩu
  const isMatch = await bcrypt.compare(passWord, user.passWord);
  if (!isMatch) {
    return res
      .status(400)
      .send({ error: "Username hoặc mật khẩu không hợp lệ." });
  }

  // Gửi phản hồi với thông tin người dùng
  res.send({
    message: "Đăng nhập thành công",
    userUsername: user.username, // Sửa lại để trả về username
    userCoin: user.coin,
    userRole: user.role,
  });
});
// Đăng ký người dùng
app.post("/register", async (req, res) => {
  const { name, username, passWord } = req.body;

  // Kiểm tra tính duy nhất của username
  const existingUserByUsername = await User.findOne({ username });

  if (existingUserByUsername) {
    return res.status(400).send({ error: "Username đã được sử dụng." });
  }

  // Băm mật khẩu
  const hashedPassword = await bcrypt.hash(passWord, 10);

  // Tạo người dùng mới mà không cần email
  const newUser = new User({
    name,
    email:'',
    username,
    passWord: hashedPassword,
    coin: 10000,
  });

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
  const { cardName, username, level, atk, def } = req.body; // Thêm các thông số cần thiết

  if (!cardName || !username) {
    return res.status(400).send({ error: "Thiếu thông tin cần thiết." });
  }

  try {
    const user = await User.findOne({ username });

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
    const cardValue = calculateCardValue(level, atk, def, cardName); // Giả sử hàm này tồn tại

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
function calculateCardValue(level, atk, def, name) {
  // Kiểm tra nếu tên là một trong những thẻ đặc biệt
  const specialCards = [
    "Slifer the Sky Dragon",
    "Obelisk the Tormentor",
    "The Winged Dragon of Ra",
    "The Winged Dragon of Ra - Immortal Phoenix",
    "Raviel, Lord of Phantasms",
    "Raviel, Lord of Phantasms - Shimmering Scraper",
    "Uria, Lord of Searing Flames",
    "Hamon, Lord of Striking Thunder",
    "Armityle the Chaos Phantasm",
    "Armityle the Chaos Phantasm - Phantom of Fury",
    "Holactie the Creator of Light",
  ];

  // Nếu là thẻ đặc biệt, trả về giá trị cố định
  if (specialCards.includes(name)) {
    return 15000;
  }

  // Giá trị mặc định nếu không có level
  if (!level) {
    return 1500;
  }

  // Xác định giá trị cơ bản dựa trên level
  let baseValue;
  if (level > 9) {
    baseValue = 3000; // Level greater than 9
  } else if (level > 7) {
    baseValue = 2000; // Level greater than 7
  } else if (level > 4) {
    baseValue = 1000; // Level greater than 4
  } else {
    baseValue = 500; // Remaining cases
  }

  // Tính giá trị atk
  let atkValue = atk >= 4000 ? atk * 0.8 : atk * 0.4;

  // Tính giá trị def
  let defValue = def > 4000 ? def * 0.5 : def * 0.2;

  // Trả về tổng giá trị của thẻ
  return baseValue + atkValue + defValue;
}

// Khai báo router
const router = express.Router();

// const handleDeleteUser = async (email) => {
//   if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
//     try {
//       const response = await fetch(`http://localhost:5000/user/delete/${email}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete user");
//       }

//       setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
//     } catch (err) {
//       setError(err.message);
//     }
//   }
// };
// API để xóa người dùng
app.delete("/user/delete/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// Endpoint xóa thẻ bài khỏi bộ sưu tập
router.post("/remove-from-collection", async (req, res) => {
  const { cardName, username, level, atk, def } = req.body;
  const coinRecover = calculateCardValue(level, atk, def);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kiểm tra xem thẻ bài có trong bộ sưu tập không
    if (!user.collection.includes(cardName)) {
      return res.status(400).json({ error: "Card not found in collection" });
    }

    // Xóa thẻ bài khỏi bộ sưu tập
    user.collection = user.collection.filter((name) => name !== cardName);
    user.coin += coinRecover * 0.8;

    await user.save();

    // Trả về người dùng đã cập nhật
    res.status(200).json(user);
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
