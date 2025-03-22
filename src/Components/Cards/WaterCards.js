import React, { useEffect, useState } from "react";
import News_item from "../News_item"; // Import News_item
import { NavLink } from "react-router-dom";
import Nav from "../Css/Nav.css";

const WaterCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20); // Số thẻ hiển thị mặc định

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?level=4&attribute=water&sort=atk"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCards(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Lọc thẻ dựa trên từ khóa tìm kiếm
  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20); // Tăng số thẻ hiển thị thêm 30
  };

  return (
    <div className="bg-dark">
      {/* Header Section */}

      <div className="container py-5">
        {/* Tìm kiếm */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm thẻ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Danh mục dưới header */}

        <div className="row">
          {filteredCards.slice(0, visibleCount).map((card) => (
            <News_item
              key={card.id}
              hinhAnh={card.card_images[0].image_url} // Lấy ảnh đầu tiên
              ten={card.name}
              trichDan={card.desc}
              tinId={card.id} // Pass ID to News_item
              atk={card.atk}
              def={card.def}
            />
          ))}
        </div>
        {/* Nút Xem thêm */}
      </div>
      {visibleCount < filteredCards.length && (
        <div
          className="text-center"
          style={{ position: "fixed", right: "20px", bottom: "10%" }}
        >
          <button className="btn btn-primary" onClick={handleLoadMore}>
            More...
          </button>
        </div>
      )}
    </div>
  );
};

export default WaterCards;
