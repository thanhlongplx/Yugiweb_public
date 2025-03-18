import React from "react";
import { Link } from "react-router-dom";
import "./Css/Nav.css"; // Đảm bảo rằng đường dẫn này là chính xác

class NewsItem extends React.Component {
  // Hàm chuyển đổi tên bài viết thành URL-friendly
  chuyenDoi = (str) => {
    str = str
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
    return str;
  };

  render() {
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div className="cardItem h-100">
          <Link
            to={`/chi-tiet/${this.chuyenDoi(this.props.ten)}/${
              this.props.tinId
            }.html`}
          >
            <img
              src={this.props.hinhAnh}
              className="card-img-top img-fluid"
              alt={this.props.ten}
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default NewsItem;
