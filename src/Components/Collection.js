import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Css/Collection.css"
const Collection = () => {
  const storedEmail = sessionStorage.getItem("userEmail");
  const [collection, setCollection] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0); // Biến lưu tổng giá trị bộ sưu tập

  useEffect(() => {
    if (!storedEmail) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserCollection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${storedEmail}`
        );
        console.log("✅ User Collection:", response.data.collection);
        setCollection(response.data.collection || []);
      } catch (err) {
        console.error("❌ Error fetching user collection:", err);
        setError("Error fetching user collection");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCollection();
  }, [storedEmail]);

  useEffect(() => {
    if (collection.length === 0) return;

    const fetchCards = async () => {
      try {
        const response = await axios.get(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php"
        );
        const allCards = response.data.data;

        const userCards = allCards.filter((card) =>
          collection.includes(card.name)
        );

        console.log("✅ Filtered User Cards:", userCards);
        setCards(userCards);

        // Tính tổng giá trị của bộ sưu tập
        const total = userCards.reduce((acc, card) => {
          const level = card.level || 0; // Lấy level, nếu không có thì mặc định là 0
          const atk = card.atk || 0; // Lấy sức tấn công, nếu không có thì mặc định là 0
          const def = card.def || 0; // Lấy sức phòng thủ, nếu không có thì mặc định là 0
          return acc + calculateCardValue(level, atk, def);
        }, 0);

        setTotalValue(total); // Lưu tổng giá trị vào state
      } catch (err) {
        console.error("❌ Error fetching cards:", err);
        setError("Error fetching cards");
      }
    };

    fetchCards();
  }, [collection]);

  const calculateCardValue = (level, atk, def) => {
    // Công thức tính giá trị
    if (level) {
      const baseValue = level >= 4 ? 100 : 50;
      const atkValue = atk * 0.5;
      const defValue = def * 0.3;
      return baseValue + atkValue + defValue;
    } else {
      return 1500;
    }
  };

  const handleDelete = async (cardName) => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Bạn cần đăng nhập để xóa thẻ bài khỏi bộ sưu tập.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/remove-from-collection",
        {
          cardName: cardName,
          email: userEmail,
        }
      );

      if (response.status === 200) {
        alert("Thẻ bài đã được xóa khỏi bộ sưu tập!");
        setCollection((prevCollection) =>
          prevCollection.filter((name) => name !== cardName)
        );
      } else {
        alert(`Lỗi: ${response.data.error}`);
      }
    } catch (error) {
      console.error("❌ Error removing card:", error);
      alert("Đã xảy ra lỗi khi xóa thẻ bài khỏi bộ sưu tập.");
    }
  };

  const confirmDeleteCard = (cardName) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa thẻ bài này khỏi bộ sưu tập không?"
      )
    ) {
      handleDelete(cardName);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-center">Your Card Collection</h1>
      <h2>
        <img
          width="50"
          src="/YugiCoin.png"
          alt="YugiCoin Logo"
          className="me-2"
        />
        {totalValue} <span className="circle">YC</span>
      </h2>{" "}
      {/* Hiển thị tổng giá trị */}
      <div className="row">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="col-lg-2">
              <div className="card" style={{ position: "relative" }}>
                <Link
                  to={`/chi-tiet/${convertToUrlFriendly(card.name)}/${
                    card.id
                  }.html`}
                >
                  <img
                    src={card.card_images[0].image_url}
                    className="img-fluid"
                    alt={card.name}
                  />
                </Link>
                <h5 className="text-center mt-2">{card.name}</h5>
                <button
                  onClick={() => confirmDeleteCard(card.name)}
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No matching cards found.</p>
        )}
      </div>
    </div>
  );
};

// Hàm chuyển đổi tên thẻ thành URL-friendly
const convertToUrlFriendly = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^0-9a-z\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default Collection;
