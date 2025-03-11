import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDetail = () => {
  const { username } = useParams(); // Lấy username từ URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`); // Gọi API với username
        if (!response.ok) {
          throw new Error("Unable to fetch user details");
        }
        const data = await response.json();
        console.log(data); // Kiểm tra dữ liệu trả về
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php"
        );
        if (!response.ok) {
          throw new Error("Unable to fetch card information");
        }
        const data = await response.json();
        setCards(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetail();
    fetchCards();
  }, [username]); // Thay đổi dependency từ email sang username

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data found.</div>; // Kiểm tra nếu user là null
  }

  const userCards = user.collection
    .map((cardName) => cards.find((card) => card.name === cardName))
    .filter(Boolean);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{user.name}'s Details</h2>
      <p>Username: {user.name}</p> {/* Thay thế email bằng username */}
      <p>Coins: {user.coin}</p>
      <h5>Collection:</h5>
      <div className="row">
        {userCards.length > 0 ? (
          userCards.map((card) => (
            <div className="col-lg-3" key={card.id}>
              <div className="card mb-4">
                <img
                  src={card.card_images[0].image_url}
                  className="card-img-top"
                  alt={card.name}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning">No cards in the collection.</div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;