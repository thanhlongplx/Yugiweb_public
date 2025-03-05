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
        fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Blue-Eyes"),
        fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?level=4&attribute=water&sort=atk"),
        fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark"),
      ]);

      const data = await Promise.all(responses.map(res => res.json()));
      
      const cardFromAPI1 = data[0].data.find(item => item.id === id);
      const cardFromAPI2 = data[1].data.find(item => item.id === id);
      const cardFromAPI3 = data[2].data.find(item => item.id === id);

      const card = cardFromAPI1 || cardFromAPI2 || cardFromAPI3;
      if (!card) throw new Error("Card not found");

      this.setState({ newsItem: card, loading: false });

      const relatedItems = [
        ...data[0].data.filter(item => item.archetype === card.archetype && item.id !== card.id),
        ...data[1].data.filter(item => item.attribute === "WATER" && item.id !== card.id),
        ...data[2].data.filter(item => item.attribute === "DARK" && item.id !== card.id),
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

  calculateCardValue(level, atk, def) {
    if (level) {
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
    return 1500; // Nếu không có level
  }

  // Cập nhật hàm addToCollection
addToCollection = async () => {
  const { newsItem, collection } = this.state;
  const userEmail = sessionStorage.getItem("userEmail");
  const userCoin = parseInt(sessionStorage.getItem("userCoin"), 10);

  if (!userEmail) {
    toast.error("Bạn cần đăng nhập để thêm thẻ bài vào bộ sưu tập.");
    return;
  }

  const cardValue = this.calculateCardValue(newsItem.level, newsItem.atk, newsItem.def);
  
  if (userCoin < cardValue) {
    toast.error("Không có đủ YugiCoin cho hành động này!!!!");
    return;
  }

  if (collection.includes(newsItem.name)) {
    toast.error("Thẻ bài đã tồn tại trong bộ sưu tập.");
    return;
  }

  if (!newsItem || !newsItem.name) {
    toast.error("Thẻ bài này chưa đủ điều kiện để thêm vào bộ sưu tập!!!!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/add-to-collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardName: newsItem.name,
        email: userEmail,
        level: newsItem.level,
        atk: newsItem.atk,
        def: newsItem.def,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      toast.info("Thẻ bài đã được thêm vào bộ sưu tập!");
      
      // Cập nhật state với số coin mới
      this.setState(prevState => ({
        userCoin: data.userCoin, // Cập nhật coin từ phản hồi
        collection: [...prevState.collection, newsItem.name],
      }));
      
      // Cập nhật sessionStorage nếu cần
      sessionStorage.setItem("userCoin", data.userCoin);
    } else {
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error adding to collection:", error);
    toast.error("Đã xảy ra lỗi khi thêm thẻ bài vào bộ sưu tập.");
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
      <div>
        <ToastContainer /> {/* Thêm ToastContainer vào render */}
        <main className="flex-shrink-0">
          <div className="container my-4">
            <div className="text-center" style={{ border: "33px solid black", padding: "20px", borderRadius: "5px", backgroundImage: "url('https://cdn.xtmobile.vn/vnt_upload/news/04_2024/26/hinh-nen-mac-dinh-iphone-16-pro-1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <h2 className="text-white">{newsItem.name}</h2>
              <img src={newsItem.card_images[0].image_url} className="img-fluid rounded shadow mb-4" style={{ width: "50%" }} alt={newsItem.name} />
              <p className="text-white font-weight-bold" style={{ fontSize: "1.25em" }}>{newsItem.desc}</p>
              <p className="text-white">ATK: {newsItem.atk} DEF: {newsItem.def}</p>
              <button
  onClick={() => {
    const cardValue = this.calculateCardValue(newsItem.level, newsItem.atk, newsItem.def);
    const confirmMessage = `Bạn có chắc chắn muốn thêm thẻ bài này vào bộ sưu tập? Giá: ${cardValue} YugiCoin.`;
    
    if (window.confirm(confirmMessage)) {
      this.addToCollection();
    }
  }}
  className="AddColbtn"
>
  <div className="d-flex">
    <h2 className="mb-0 me-2">Price: {this.calculateCardValue(newsItem.level, newsItem.atk, newsItem.def)}</h2>
    <img width="50" src="/YugiCoin.png" alt="YugiCoin Logo" className="me-2" />
  </div>
</button>
            </div>
          </div>
          <div className="container">
            <h1 className="text-center">Thẻ bài tương tự</h1>
            {relatedItems.length > 0 ? (
              <div className="row">
                {relatedItems.map((item) => (
                  <div key={item.id} className="col col-lg-2" style={{ height: "150px" }}>
                    <div className="card">
                      <Link to={`/chi-tiet/${Detail.chuyenDoi(item.name)}/${item.id}.html`}>
                        <img src={item.card_images[0].image_url} className="img-fluid" alt={item.name} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">Không có thẻ bài tương tự nào.</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  static chuyenDoi(str) {
    return str.toLowerCase()
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