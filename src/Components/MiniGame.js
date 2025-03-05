import React, { Component } from "react";
import "./Css/MiniGame.css"; // Để bạn có thể thêm các kiểu tùy chỉnh

class MiniGame extends Component {
  render() {
    return (
      <div className="minigame-container">
        <h1 className="title">Mini Game Yu-Gi-Oh</h1>
        <div className="game-area">
          <div className="field">
            {/* Khung cảnh trò chơi */}

            <div className="opponent-zone">
              <h2>Opponent Zone</h2>
              {/* Khu vực thẻ của đối thủ */}
              <div className="card-slot"></div>
              <div className="card-slot"></div>
              <div className="card-slot"></div>
            </div>
            <div className="player-zone">
              <h2>Player Zone</h2>
              {/* Khu vực thẻ của người chơi */}
              <div className="card-slot"></div>
              <div className="card-slot"></div>
              <div className="card-slot"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MiniGame;
