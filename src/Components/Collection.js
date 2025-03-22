import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Modal,
  Button,
  Spinner,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showGiveModal, setShowGiveModal] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    return Math.round(baseValue + atkValue + defValue);
  };

  const handleSellCard = async () => {
    const card = selectedCard;
    if (!card) return;

    const userUsername = sessionStorage.getItem("userUsername");
    if (!userUsername) {
      toast.error("You need to log in to sell a card from your collection.");
      return;
    }

    try {
      setIsRefreshing(true);
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
        const coinRecover = calculateCardValue(
          card.level,
          card.atk,
          card.def,
          card.name
        );
        const recoveredAmount = Math.round(coinRecover * 0.8);
        const currentCoin = parseInt(sessionStorage.getItem("userCoin"), 10);
        const newCoin = currentCoin + recoveredAmount;
        sessionStorage.setItem("userCoin", newCoin);

        setUserCoin(newCoin);
        setCollection((prevCollection) =>
          prevCollection.filter((name) => name !== card.name)
        );
        setCards((prevCards) => prevCards.filter((c) => c.name !== card.name));

        toast.success(
          `Card sold successfully! You received ${recoveredAmount} coins.`
        );
        setShowSellModal(false);
      } else {
        toast.error(`Error: ${response.data.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while selling the card.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGiveCard = async () => {
    if (!recipientUsername) {
      toast.error("Please enter a recipient username.");
      return;
    }

    const card = selectedCard;
    if (!card) return;

    try {
      setIsRefreshing(true);

      // Bước 1: Thêm thẻ vào bộ sưu tập của người nhận
      const addResponse = await axios.post(
        "http://localhost:5000/user/add-to-collection-not-pay",
        {
          cardName: card.name,
          username: recipientUsername,
          usernameGive: storedUsername,
          atk: card.atk !== undefined ? card.atk : null,
          def: card.def !== undefined ? card.def : null,
          level: card.level !== undefined ? card.level : null,
        }
      );

      if (addResponse.status === 200) {
        // Bước 2: Xóa thẻ khỏi bộ sưu tập của người dùng hiện tại
        const removeResponse = await axios.post(
          "http://localhost:5000/user/remove-from-collection",
          {
            cardName: card.name,
            username: storedUsername,

            atk: card.atk !== undefined ? card.atk : null,
            def: card.def !== undefined ? card.def : null,
            level: card.level !== undefined ? card.level : null,
          }
        );

        if (removeResponse.status === 200) {
          // Cập nhật state của người dùng hiện tại sau khi cho thẻ
          setCollection((prevCollection) =>
            prevCollection.filter((name) => name !== card.name)
          );
          setCards((prevCards) =>
            prevCards.filter((c) => c.name !== card.name)
          );

          toast.success(`Card given to ${recipientUsername} successfully!`);
          setShowGiveModal(false);
          setRecipientUsername("");
        } else {
          toast.error(`Error: ${removeResponse.data.error}`);
        }
      } else {
        toast.error(`Error: ${addResponse.data.error}`);
      }
    } catch (error) {
      // Kiểm tra xem có thông điệp lỗi từ backend không
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error || error.message
          : "Đã xảy ra lỗi không xác định.";

      toast.error(errorMessage);
    } finally {
      setIsRefreshing(false);
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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const sortCards = (cardsToSort) => {
    switch (sortBy) {
      case "value":
        return [...cardsToSort].sort((a, b) => {
          const valueA = calculateCardValue(a.level, a.atk, a.def, a.name);
          const valueB = calculateCardValue(b.level, b.atk, b.def, b.name);
          return valueB - valueA;
        });
      case "level":
        return [...cardsToSort].sort((a, b) => (b.level || 0) - (a.level || 0));
      case "atk":
        return [...cardsToSort].sort((a, b) => (b.atk || 0) - (a.atk || 0));
      case "def":
        return [...cardsToSort].sort((a, b) => (b.def || 0) - (a.def || 0));
      case "name":
      default:
        return [...cardsToSort].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const filterCards = (cardsToFilter) => {
    let filtered = [...cardsToFilter];

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((card) => {
        if (filterType === "monster" && card.type?.includes("Monster")) {
          return true;
        }
        if (filterType === "spell" && card.type?.includes("Spell")) {
          return true;
        }
        if (filterType === "trap" && card.type?.includes("Trap")) {
          return true;
        }
        return false;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(query) ||
          (card.desc && card.desc.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const displayCards = sortCards(filterCards(cards));

  // Get card rarity based on level/value
  const getCardRarity = (card) => {
    const value = calculateCardValue(card.level, card.atk, card.def, card.name);

    if (value >= 10000) return "legendary";
    if (value >= 5000) return "ultra-rare";
    if (value >= 3000) return "rare";
    if (value >= 1000) return "uncommon";
    return "common";
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="text-center text-light">
          <Spinner
            animation="border"
            variant="light"
            style={{ width: "3rem", height: "3rem" }}
          />
          <h4 className="mt-3">Loading your collection...</h4>
          <p className="text-muted">Please wait while we fetch your cards</p>
        </div>
      </div>
    );

  return (
    <div className="bg-dark">
      <div className="container py-5">
        <ToastContainer position="top-right" theme="dark" />

        {/* Header Card */}
        <div className="card border-0 shadow-lg mb-5 bg-dark text-light">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-7">
                <h1 className="display-4 fw-bold mb-2">Your Card Collection</h1>
                <p className="lead mb-0">
                  Browse, manage, and trade your valuable Yu-Gi-Oh! cards
                </p>
              </div>
              <div className="col-md-5">
                <div className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                  <div className="p-3 rounded-circle bg-warning bg-opacity-25 me-3">
                    <img
                      width="60"
                      src="/YugiCoin2.png"
                      alt="YugiCoin Logo"
                      className="img-fluid"
                    />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Total Collection Value</h6>
                    <h2 className="mb-0 fw-bold text-warning">
                      {totalValue.toLocaleString()} <small>coins</small>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer bg-dark border-top border-secondary p-3">
            <div className="row">
              <div className="col-md-4 mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  <i className="bi bi-collection-fill fs-4 text-primary me-2"></i>
                  <div>
                    <small className="text-muted">Total Cards</small>
                    <h5 className="mb-0">{collection.length}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  <i className="bi bi-cash-coin fs-4 text-success me-2"></i>
                  <div>
                    <small className="text-muted">Your Balance</small>
                    <h5 className="mb-0">{userCoin.toLocaleString()} coins</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-trophy-fill fs-4 text-warning me-2"></i>
                  <div>
                    <small className="text-muted">Rarest Card</small>
                    <h5 className="mb-0">
                      {cards.length > 0
                        ? sortCards([...cards])
                            .sort((a, b) => {
                              const valueA = calculateCardValue(
                                a.level,
                                a.atk,
                                a.def,
                                a.name
                              );
                              const valueB = calculateCardValue(
                                b.level,
                                b.atk,
                                b.def,
                                b.name
                              );
                              return valueB - valueA;
                            })[0]
                            ?.name?.split(" ")
                            .slice(0, 2)
                            .join(" ") + "..."
                        : "None"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && !loading ? (
          <div className="alert alert-danger text-center p-5 shadow-lg">
            <i className="bi bi-exclamation-circle-fill fs-1 mb-3 d-block"></i>
            <h3 className="alert-heading mb-3">{error}</h3>
            <p className="mb-4">Please login or check your collection again.</p>
            <button className="btn btn-danger" onClick={handleRetry}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Filter and Sort Controls */}
            <div className="card bg-dark text-light border-secondary mb-4">
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <InputGroup>
                      <InputGroup.Text className="bg-dark text-light border-secondary">
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or description..."
                        className="bg-dark text-light border-secondary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-md-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-dark text-light border-secondary">
                        <i className="bi bi-filter"></i>
                      </InputGroup.Text>
                      <Form.Select
                        className="bg-dark text-light border-secondary"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="monster">Monsters</option>
                        <option value="spell">Spell Cards</option>
                        <option value="trap">Trap Cards</option>
                      </Form.Select>
                    </InputGroup>
                  </div>
                  <div className="col-md-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-dark text-light border-secondary">
                        <i className="bi bi-sort-down"></i>
                      </InputGroup.Text>
                      <Form.Select
                        className="bg-dark text-light border-secondary"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="value">Value</option>
                        <option value="level">Level</option>
                        <option value="atk">Attack</option>
                        <option value="def">Defense</option>
                      </Form.Select>
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Display */}
            <div className="row">
              {displayCards.length > 0 ? (
                displayCards.map((card) => (
                  <div key={card.id} className="col-lg-3 col-md-4 col-ms-6 ">
                    <div
                      className={`card border-0 shadow card-${getCardRarity(
                        card
                      )}`}
                      style={{ transition: "all 0.3s ease" }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-10px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 5px 15px rgba(0,0,0,0.2)";
                      }}
                    >
                      <div className="position-relative">
                        <Link
                          to={`/chi-tiet/${convertToUrlFriendly(card.name)}/${
                            card.id
                          }.html`}
                          className="text-decoration-none"
                        >
                          <img
                            src={card.card_images[0].image_url}
                            className="card-img-top"
                            alt={card.name}
                            loading="lazy"
                          />
                          <div className="position-absolute top-0 start-0 p-2">
                            <Badge
                              bg={
                                getCardRarity(card) === "legendary"
                                  ? "danger"
                                  : getCardRarity(card) === "ultra-rare"
                                  ? "warning"
                                  : getCardRarity(card) === "rare"
                                  ? "primary"
                                  : getCardRarity(card) === "uncommon"
                                  ? "info"
                                  : "secondary"
                              }
                              className="opacity-75"
                            >
                              {getCardRarity(card) === "legendary"
                                ? "★★★★★"
                                : getCardRarity(card) === "ultra-rare"
                                ? "★★★★"
                                : getCardRarity(card) === "rare"
                                ? "★★★"
                                : getCardRarity(card) === "uncommon"
                                ? "★★"
                                : "★"}
                            </Badge>
                          </div>
                          <div className="position-absolute bottom-0 end-0 p-2">
                            <Badge bg="dark" className="opacity-75">
                              {calculateCardValue(
                                card.level,
                                card.atk,
                                card.def,
                                card.name
                              ).toLocaleString()}{" "}
                              coins
                            </Badge>
                          </div>
                        </Link>
                      </div>
                      <div className="card text-center bg-dark text-light">
                        <h6
                          className="card-title mb-0 text-truncate"
                          title={card.name}
                        >
                          {card.name}
                        </h6>
                        <p className="card-text small  text-muted">
                          {card.type}
                        </p>
                      </div>
                      <div className="card-footer  bg-dark border-0">
                        <div className="d-flex">
                          <button
                            onClick={() => {
                              setSelectedCard(card);
                              setShowSellModal(true);
                            }}
                            className="btn btn-danger flex-grow-1 rounded-0 rounded-bottom-start py-2"
                          >
                            <i className="bi bi-cash-coin me-1"></i>
                            Sell
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCard(card);
                              setShowGiveModal(true);
                            }}
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
                <div className="col-12">
                  <div className="alert alert-warning text-center p-5 shadow-sm">
                    <i className="bi bi-search fs-1 mb-3 d-block"></i>
                    <h4 className="alert-heading mb-3">No cards found</h4>
                    <p className="mb-4">
                      {searchQuery || filterType !== "all"
                        ? "No cards match your search criteria. Try adjusting your filters."
                        : "Your collection is empty. Start adding cards!"}
                    </p>
                    <Link to="/AllCards.html" className="btn btn-warning">
                      <i className="bi bi-shop me-2"></i>
                      Browse Marketplace
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Sell Modal */}
      <Modal
        show={showSellModal}
        onHide={() => setShowSellModal(false)}
        centered
        backdrop="static"
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sell Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard && (
            <div className="text-center">
              <img
                src={selectedCard.card_images[0].image_url}
                alt={selectedCard.name}
                className="img-fluid mb-3"
                style={{ maxHeight: "200px" }}
              />
              <h5>{selectedCard.name}</h5>
              <p className="text-muted">{selectedCard.type}</p>
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                You will receive{" "}
                <strong>
                  {Math.round(
                    calculateCardValue(
                      selectedCard.level,
                      selectedCard.atk,
                      selectedCard.def,
                      selectedCard.name
                    ) * 0.8
                  ).toLocaleString()}{" "}
                  coins
                </strong>{" "}
                (80% of value)
              </div>
              <p>Are you sure you want to sell this card?</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSellModal(false)}
            disabled={isRefreshing}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSellCard}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              <>
                <i className="bi bi-cash-coin me-2"></i>
                Confirm Sale
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Give Modal */}
      <Modal
        show={showGiveModal}
        onHide={() => setShowGiveModal(false)}
        centered
        backdrop="static"
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Give Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard && (
            <div className="text-center">
              <img
                src={selectedCard.card_images[0].image_url}
                alt={selectedCard.name}
                className="img-fluid mb-3"
                style={{ maxHeight: "200px" }}
              />
              <h5>{selectedCard.name}</h5>
              <p className="text-muted">{selectedCard.type}</p>

              <Form.Group className="mb-3">
                <Form.Label>Recipient Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                />
                <Form.Text className="text-muted">
                  The card will be transferred to this user's collection.
                </Form.Text>
              </Form.Group>

              <div className="alert alert-info">
                <i className="bi bi-info-circle-fill me-2"></i>
                Once given, you cannot get this card back.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Link to="/FriendList.html" className="btn btn-success ms-auto">
            {" "}
            My Friends List
          </Link>
          <Button
            variant="secondary"
            onClick={() => setShowGiveModal(false)}
            disabled={isRefreshing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGiveCard}
            disabled={isRefreshing || !recipientUsername}
          >
            {isRefreshing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              <>
                <i className="bi bi-gift me-2"></i>
                Give Card
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add some CSS for card rarity styling */}
      <style jsx>{`
        .card-legendary {
          border: 2px solid #ff4500 !important;
          box-shadow: 0 0 15px rgba(255, 69, 0, 0.5) !important;
        }

        .card-ultra-rare {
          border: 2px solid #ffd700 !important;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5) !important;
        }

        .card-rare {
          border: 2px solid #0d6efd !important;
          box-shadow: 0 0 15px rgba(13, 110, 253, 0.5) !important;
        }

        .card-uncommon {
          border: 2px solid #17a2b8 !important;
          box-shadow: 0 0 10px rgba(23, 162, 184, 0.4) !important;
        }

        .card-common {
          border: 2px solid #6c757d !important;
          box-shadow: 0 0 10px rgba(108, 117, 125, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default Collection;
