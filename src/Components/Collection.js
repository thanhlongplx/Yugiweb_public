import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Css/Collection.css";

const Collection = () => {
  const storedUsername = sessionStorage.getItem("userUsername"); // Thay đổi từ userEmail thành userUsername
  const [collection, setCollection] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [userCoin, setUserCoin] = useState(
    parseInt(sessionStorage.getItem("userCoin"), 10) || 0
  );

  useEffect(() => {
    console.log("Stored Username:", storedUsername); // Kiểm tra giá trị username
    if (!storedUsername) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserCollection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${storedUsername}`
        ); // Đảm bảo sử dụng username
        setCollection(response.data.collection || []);
      } catch (err) {
        console.error("Error fetching user collection:", err); // Log chi tiết lỗi
        setError("Error fetching user collection");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCollection();
  }, [storedUsername]);

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

        setCards(userCards);
      } catch (err) {
        setError("Error fetching cards");
      }
    };

    fetchCards();
  }, [collection]);

  useEffect(() => {
    const total = calculateTotalValue(collection);
    setTotalValue(total);
  }, [cards, collection]);

  // Hàm tính giá trị thẻ bài
  function calculateCardValue(level, atk, def, name) {
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

    if (specialCards.includes(name)) {
      return 15000;
    }

    if (!level) {
      return 1500;
    }

    let baseValue;
    if (level > 9) {
      baseValue = 3000;
    } else if (level > 7) {
      baseValue = 2000;
    } else if (level > 4) {
      baseValue = 1000;
    } else {
      baseValue = 500;
    }

    let atkValue = atk >= 4000 ? atk * 0.8 : atk * 0.4;
    let defValue = def > 4000 ? def * 0.5 : def * 0.2;

    return baseValue + atkValue + defValue;
  }

  const handleDelete = async (card) => {
    const userUsername = sessionStorage.getItem("userUsername"); // Sử dụng username
    if (!userUsername) {
      alert("Bạn cần đăng nhập để xóa thẻ bài khỏi bộ sưu tập.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/remove-from-collection",
        
        {
          cardName: card.name,
          username: userUsername, // Sử dụng username
          atk: card.atk !== undefined ? card.atk : null,
          def: card.def !== undefined ? card.def : null,
          level: card.level !== undefined ? card.level : null,
        }
      );
      

      if (response.status === 200) {
        alert(
          "Thẻ bài đã được xóa khỏi bộ sưu tập! Bạn được hoàn lại 80% giá trị thẻ bài."
        );

        const coinRecover = calculateCardValue(
          card.level,
          card.atk,
          card.def,
          card.name
        );
        const currentCoin = parseInt(sessionStorage.getItem("userCoin"), 10);
        const newCoin = currentCoin + coinRecover * 0.8;
        sessionStorage.setItem("userCoin", newCoin);

        setUserCoin(newCoin);
        setCollection((prevCollection) =>
          prevCollection.filter((name) => name !== card.name)
        );
        setCards((prevCards) => prevCards.filter((c) => c.name !== card.name));
      } else {
        alert(`Lỗi: ${response.data.error}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa thẻ bài khỏi bộ sưu tập.");
    }
  };

  const confirmDeleteCard = (card) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa thẻ bài này khỏi bộ sưu tập không?"
      )
    ) {
      handleDelete(card);
    }
  };

  const calculateTotalValue = (collection) => {
    return cards.reduce((acc, card) => {
      if (collection.includes(card.name)) {
        const level = card.level || 0;
        const atk = card.atk || 0;
        const def = card.def || 0;
        return acc + calculateCardValue(level, atk, def, card.name);
      }
      return acc;
    }, 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="text-center">Your Card Collection</h1>
      <h2>
        <img
          width="50"
          src="/YugiCoin2.png"
          alt="YugiCoin Logo"
          className="me-2"
        />
        {totalValue}
      </h2>
      <h3>Total Cards: {collection.length}</h3>
      <div className="row">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className="col-lg-2 col-md-4 col-sm-6"
              style={{ height: "150px" }}
            >
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
                <button
                  onClick={() => confirmDeleteCard(card)}
                  className="delete-btn"
                >
                  Sell
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
