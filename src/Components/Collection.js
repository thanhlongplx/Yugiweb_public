import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Css/Collection.css";

const Collection = () => {
  const storedUsername = sessionStorage.getItem("userUsername");
  const [collection, setCollection] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [userCoin, setUserCoin] = useState(
    parseInt(sessionStorage.getItem("userCoin"), 10) || 0
  );

  useEffect(() => {
    if (!storedUsername) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserCollection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${storedUsername}`
        );
        setCollection(response.data.collection || []);
      } catch (err) {
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

  const calculateCardValue = (level, atk, def, name) => {
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
  };

  const handleDelete = async (card) => {
    const userUsername = sessionStorage.getItem("userUsername");
    if (!userUsername) {
      toast.error("You need to log in to delete a card from your collection.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/remove-from-collection",
        {
          cardName: card.name,
          username: userUsername,
          atk: card.atk !== undefined ? card.atk : null,
          def: card.def !== undefined ? card.def : null,
          level: card.level !== undefined ? card.level : null,
        }
      );

      if (response.status === 200) {
        toast.success(
          "The card has been sold from the collection! You will be refunded 80% of the card's value."
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
        toast.error(`Error: ${response.data.error}`);
      }
    } catch (error) {
      toast.error(
        "An error occurred while deleting a card from the collection."
      );
    }
  };

  const confirmDeleteCard = (card) => {
    if (window.confirm("Are you sure you want to sell this card?")) {
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

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <ToastContainer />
      
      <div className="card shadow border-0 mb-4">
        <div className="card-body text-center">
          <h1 className="mb-4 fw-bold">Your Card Collection</h1>
          
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
              <img
                width="50"
                src="/YugiCoin2.png"
                alt="YugiCoin Logo"
                className="img-fluid"
              />
            </div>
            <h2 className="mb-0 fw-bold text-warning">{totalValue}</h2>
          </div>
          
          <div className="badge bg-primary fs-5 mb-3">
            <i className="bi bi-collection me-2"></i>
            Total Cards: {collection.length}
          </div>
        </div>
      </div>
  
      {error && !loading ? (
        <div className="alert alert-danger text-center p-4 shadow-sm">
          <i className="bi bi-exclamation-circle-fill fs-1 mb-3"></i>
          <h4 className="alert-heading">{error}</h4>
          <p>Please login or check your collection again.</p>
          <button className="btn btn-outline-danger mt-2">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
        </div>
      ) : (
        <div className="row mb-5">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="col-lg-2 col-md-4 col-sm-6 mb-4">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ transition: "all 0.3s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <Link
                    to={`/chi-tiet/${convertToUrlFriendly(card.name)}/${
                      card.id
                    }.html`}
                    className="text-decoration-none"
                  >
                    <div className="position-relative overflow-hidden">
                      <img
                        src={card.card_images[0].image_url}
                        className="card-img-top"
                        alt={card.name}
                        loading="lazy"
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
                        <small className="text-truncate d-block">{card.name}</small>
                      </div>
                    </div>
                  </Link>
                  <div className="card-footer p-0 bg-white border-0">
                    <div className="d-flex">
                      <button
                        onClick={() => confirmDeleteCard(card)}
                        className="btn btn-danger flex-grow-1 rounded-0 rounded-bottom-start py-2"
                      >
                        <i className="bi bi-cash-coin me-1"></i>
                        Sell
                      </button>
                      <button
                        onClick={() => confirmDeleteCard(card)}
                        className="btn btn-primary flex-grow-1 rounded-0 rounded-bottom-end py-2"
                      >
                        <i className="bi bi-gift me-1"></i>
                        Give
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-warning text-center p-4 shadow-sm">
              <i className="bi bi-search fs-1 mb-3"></i>
              <h4 className="alert-heading">No matching cards found.</h4>
              <p>Add cards to your collection!</p>
              <Link to="/marketplace" className="btn btn-warning mt-2">
                <i className="bi bi-shop me-2"></i>
                Go to Marketplace
              </Link>
            </div>
          )}
        </div>
      )}
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
