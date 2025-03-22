import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import "./Css/Detail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

class Detail extends Component {
  state = {
    newsItem: null,
    relatedItems: [],
    loading: true,
    error: null,
    collection: [],
  };

  fetchCardDetails = async (id) => {
    try {
      const responses = await Promise.all([
        fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Blue-Eyes"
        ),
        fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?level=4&attribute=water&sort=atk"
        ),
        fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark"
        ),
        fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php"),
      ]);

      const data = await Promise.all(responses.map((res) => res.json()));

      const cardFromAPI1 = data[0].data.find((item) => item.id === id);
      const cardFromAPI2 = data[1].data.find((item) => item.id === id);
      const cardFromAPI3 = data[2].data.find((item) => item.id === id);
      const cardFromAPI4 = data[3].data.find((item) => item.id === id);

      const card = cardFromAPI1 || cardFromAPI2 || cardFromAPI3 || cardFromAPI4;
      if (!card) throw new Error("Card not found");

      this.setState({ newsItem: card, loading: false });

      const relatedItems = [
        ...data[0].data.filter(
          (item) => item.archetype === card.archetype && item.id !== card.id
        ),
        ...data[1].data.filter(
          (item) => item.attribute === "WATER" && item.id !== card.id
        ),
        ...data[2].data.filter(
          (item) => item.attribute === "DARK" && item.id !== card.id
        ),
        ...data[3].data.filter(
          (item) => item.attribute === "All" && item.id !== card.id
        ),
      ];
      this.setState({ relatedItems });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  fetchUserCollection = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    try {
      const response = await fetch(`http://localhost:5000/user/${userEmail}`);
      if (!response.ok) throw new Error("Failed to fetch collection");
      const data = await response.json();
      this.setState({ collection: data.collection || [] });
    } catch (error) {
      console.error("Error fetching user collection:", error);
    }
  };

  calculateCardValue(level, atk, def, name) {
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

  addToCollection = async () => {
    const { newsItem, collection } = this.state;
    // const userEmail = sessionStorage.getItem("userEmail");
    const userName = sessionStorage.getItem("userUsername");
    const userCoin = parseInt(sessionStorage.getItem("userCoin"), 10);

    if (!userName) {
      toast.error("You need to log in to add a card to your collection.");
      return;
    }

    const cardValue = this.calculateCardValue(
      newsItem.level,
      newsItem.atk,
      newsItem.def,
      newsItem.name
    );

    if (userCoin < cardValue) {
      toast.error(
        "You don't have enough coins to add this card to your collection."
      );
      return;
    }

    if (collection.includes(newsItem.name)) {
      toast.error("This card is already in your collection.");
      return;
    }

    if (!newsItem || !newsItem.name) {
      toast.error("Card data is invalid.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/user/add-to-collection",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardName: newsItem.name,
            username: userName,
            level: newsItem.level,
            atk: newsItem.atk,
            def: newsItem.def,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Card added to collection successfully!");

        // Cập nhật state với số coin mới
        this.setState((prevState) => ({
          userCoin: data.userCoin, // Cập nhật coin từ phản hồi
          collection: [...prevState.collection, newsItem.name],
        }));

        // Cập nhật sessionStorage nếu cần
        sessionStorage.setItem("userCoin", data.userCoin);
      } else {
        const errorData = await response.json();
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      toast.error(
        "An error occurred while adding the card to your collection."
      );
    }
  };

  componentDidMount() {
    this.fetchCardDetails(this.props.id);
    this.fetchUserCollection();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ loading: true, error: null }, () => {
        this.fetchCardDetails(this.props.id);
      });
    }
  }

  render() {
    const { newsItem, relatedItems, loading, error } = this.state;

    if (loading) {
      return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
      return <div className="text-center mt-5">Error: {error}</div>;
    }

    return (
      <div className="bg-dark ">
        <ToastContainer /> {/* Thêm ToastContainer vào render */}
        <main className="flex-shrink-0">
          <div className="container ">
            <div
              className="text-center"
              style={{
                border: "33px solid black",
                padding: "20px",
                borderRadius: "5px",
                backgroundImage:
                  "url('https://cdn.xtmobile.vn/vnt_upload/news/04_2024/26/hinh-nen-mac-dinh-iphone-16-pro-1.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="text-white">{newsItem.name}</h2>
              <img
                src={newsItem.card_images[0].image_url}
                className="img-fluid w-50 mb-4"
                alt={newsItem.name}
              />
              <p
                className="text-white font-weight-bold"
                style={{ fontSize: "1.25em", textAlign: "justify" }}
              >
                {newsItem.desc}
              </p>
              <p className="text-white">
                ATK: {newsItem.atk} DEF: {newsItem.def}
              </p>
              <button
                onClick={() => {
                  const cardValue = this.calculateCardValue(
                    newsItem.level,
                    newsItem.atk,
                    newsItem.def,
                    newsItem.name
                  );

                  const confirmMessage = `Are you sure to add this card into your collection? Price: ${cardValue} YugiCoin.`;

                  if (window.confirm(confirmMessage)) {
                    this.addToCollection();
                  }
                }}
                className="AddColbtn"
              >
                <div className="d-flex">
                  <h2 className="mb-0 me-2">
                    Price:{" "}
                    {this.calculateCardValue(
                      newsItem.level,
                      newsItem.atk,
                      newsItem.def,
                      newsItem.name
                    )}
                  </h2>
                  <img
                    width="50"
                    src="/YugiCoin2.png"
                    alt="YugiCoin Logo"
                    className="me-2"
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="container">
            <h1 className="text-center text-white">Similar Cards</h1>
            {relatedItems.length > 0 ? (
              <div className="row">
                {relatedItems.map((item) => (
                  <div
                    key={item.id}
                    className=" col-6 col-lg-2 col-md-4 "
                    style={{ height: "150px" }}
                  >
                    <div className="cardItem ">
                      <Link
                        to={`/chi-tiet/${Detail.chuyenDoi(item.name)}/${
                          item.id
                        }.html`}
                      >
                        <img
                          src={item.card_images[0].image_url}
                          className="img-fluid"
                          alt={item.name}
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">You don't have any similar cards.</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  static chuyenDoi(str) {
    return str
      .toLowerCase()
      .replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a")
      .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e")
      .replace(/(ì|í|ị|ỉ|ĩ)/g, "i")
      .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o")
      .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u")
      .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y")
      .replace(/(đ)/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/^-+/g, "")
      .replace(/-+$/g, "");
  }
}

const DetailWrapper = () => {
  const { slug, id } = useParams();
  const parsedId = parseInt(id, 10);
  return <Detail id={parsedId} />;
};

export default DetailWrapper;
