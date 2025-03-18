import React, { Component } from "react";
import "../CSS/App.css"; // Đảm bảo CSS đã được nhập
import Nav from "./Css/Nav.css";import { useParams, Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <title>Home - Yu-Gi-Oh!</title>
       

        {/* New Section Below Header */}
        <section className="py-5 bg-light">
          <div className="container px-5">
            <h2 className="text-center mb-4">
              Explore the Characters and Cards
            </h2>
            <div className="row gx-5">
              <div className="col-lg-4">
                <div className="card mb-4">
                  <img
                    className="card-img-top"
                    src="https://cdn.trangcongnghe.vn/uploads/posts/2016-10/ban-co-biet-ve-gia-cua-nhung-la-bai-yugi-oh-dat-nhat-the-gioi-phan-1_2.jpeg"
                    alt="Yugi Muto"
                  />
                  
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card mb-4">
                  <img
                    className="card-img-top"
                    src="https://photo.znews.vn/w860/Uploaded/piqbzcvo/2022_07_07/8.png"
                    alt="Seto Kaiba"
                  />
                  
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card mb-4">
                  <img
                    className="card-img-top"
                    src="https://www.konami.com/games_cms/promo/na/uploads/4041-us_w-cr_500.png"
                    alt="Joey Wheeler"
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
