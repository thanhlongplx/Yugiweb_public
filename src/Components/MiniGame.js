import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ProgressBar,
  Alert,
} from "react-bootstrap";

class MiniGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameType: "math",
      question: "",
      answer: "",
      correctAnswer: "",
      triviaQuestions: [],
      score: 0,
      streak: 0,
      attempts: 0,
      timer: 0,
      maxTime: 30,
      timerRunning: false,
      timeInterval: null,
      hint: "",
      showHint: false,
      difficulty: "easy",
      isLoading: false,
      animation: "",
      userName: sessionStorage.getItem("userUsername") || "Guest",
      coins: 0,
      gameActive: false,
    };
  }

  componentDidMount() {
    this.startNewGame();
    this.fetchUserCoins();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  fetchUserCoins = async () => {
    const username = sessionStorage.getItem("userUsername");
    if (username) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${username}`
        );
        if (response.data) {
          this.setState({ coins: response.data.coin || 0 });
        }
      } catch (error) {
        console.error("Error fetching user coins:", error);
      }
    }
  };

  startNewGame = () => {
    this.setState(
      {
        gameActive: true,
        score: 0,
        streak: 0,
        attempts: 0,
        showHint: false,
      },
      () => {
        this.generateQuestion();
        this.startTimer();
      }
    );
  };

  clearTimer = () => {
    if (this.state.timeInterval) {
      clearInterval(this.state.timeInterval);
    }
  };

  startTimer = () => {
    this.clearTimer();

    // Đặt thời gian dựa trên độ khó
    const maxTime = this.getMaxTimeByDifficulty();

    this.setState({
      timer: maxTime,
      maxTime,
      timerRunning: true,
      timeInterval: setInterval(() => {
        this.setState((prevState) => {
          if (prevState.timer <= 1) {
            this.clearTimer();
            // Nếu hết thời gian, đánh dấu là trả lời sai
            toast.warning("Hết thời gian! Hãy thử lại.");
            return {
              timer: 0,
              timerRunning: false,
              streak: 0,
            };
          }
          return { timer: prevState.timer - 1 };
        });
      }, 1000),
    });
  };

  getMaxTimeByDifficulty = () => {
    const { difficulty } = this.state;
    switch (difficulty) {
      case "hard":
        return 15;
      case "medium":
        return 20;
      case "easy":
      default:
        return 30;
    }
  };

  generateQuestion = () => {
    const { gameType, difficulty } = this.state;
    this.setState({ isLoading: true, showHint: false });

    setTimeout(() => {
      switch (gameType) {
        case "math":
          this.generateMathQuestion(difficulty);
          break;
        case "word":
          this.generateWordQuestion(difficulty);
          break;
        case "guessNumber":
          this.generateGuessNumberQuestion(difficulty);
          break;
        default:
          break;
      }
      this.setState({ isLoading: false });
    }, 500);
  };

  generateMathQuestion = (difficulty) => {
    const CalculateMethod = [
      "addition",
      "subtraction",
      "multiplication",
      "division",
    ];
    const randomMethod =
      CalculateMethod[Math.floor(Math.random() * CalculateMethod.length)];

    let num1, num2, range;

    // Điều chỉnh độ khó dựa trên mức đã chọn
    switch (difficulty) {
      case "hard":
        range = 100;
        break;
      case "medium":
        range = 50;
        break;
      case "easy":
      default:
        range = 20;
        break;
    }

    num1 = Math.floor(Math.random() * range);
    num2 = Math.floor(Math.random() * range);

    // Đảm bảo phép chia có kết quả đẹp
    if (randomMethod === "division") {
      if (num2 === 0) num2 = 1; // Tránh chia cho 0
      num1 = num2 * Math.floor(Math.random() * 10); // Đảm bảo chia hết
    }

    let question;
    let correctAnswer;
    let hint;

    switch (randomMethod) {
      case "addition":
        question = `${num1} + ${num2} = ?`;
        correctAnswer = num1 + num2;
        hint = `Tổng của ${num1} và ${num2}`;
        break;
      case "subtraction":
        // Đảm bảo kết quả không âm
        if (num1 < num2) [num1, num2] = [num2, num1];
        question = `${num1} - ${num2} = ?`;
        correctAnswer = num1 - num2;
        hint = `Hiệu của ${num1} và ${num2}`;
        break;
      case "multiplication":
        question = `${num1} × ${num2} = ?`;
        correctAnswer = num1 * num2;
        hint = `Tích của ${num1} và ${num2}`;
        break;
      case "division":
        question = `${num1} ÷ ${num2} = ?`;
        correctAnswer = num1 / num2;
        hint = `Thương của ${num1} và ${num2}`;
        break;
      default:
        break;
    }

    this.setState({
      question,
      correctAnswer: parseFloat(correctAnswer),
      answer: "",
      hint,
    });
  };

  generateWordQuestion = (difficulty) => {
    let words;

    // Điều chỉnh độ khó dựa trên độ dài từ
    switch (difficulty) {
      case "hard":
        words = [
          "strawberry",
          "pineapple",
          "watermelon",
          "blueberry",
          "blackberry",
          "mathematics",
          "innovation",
          "technology",
        ];
        break;
      case "medium":
        words = [
          "orange",
          "banana",
          "mango",
          "cherry",
          "lemon",
          "peach",
          "computer",
          "keyboard",
        ];
        break;
      case "easy":
      default:
        words = [
          "cat",
          "dog",
          "sun",
          "hat",
          "pen",
          "cup",
          "car",
          "tree",
          "cake",
        ];
        break;
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    this.setState({
      question: `Xếp từ: ${shuffled.split("").join(" ")}`,
      correctAnswer: randomWord,
      answer: "",
      hint: `Đây là một từ có ${randomWord.length} chữ cái, bắt đầu bằng chữ "${randomWord[0]}"`,
    });
  };

  generateGuessNumberQuestion = (difficulty) => {
    let max, hint;

    // Điều chỉnh phạm vi đoán dựa trên độ khó
    switch (difficulty) {
      case "hard":
        max = 200;
        break;
      case "medium":
        max = 100;
        break;
      case "easy":
      default:
        max = 50;
        break;
    }

    const randomNumber = Math.floor(Math.random() * max) + 1;

    hint = `Số cần đoán ${randomNumber % 2 === 0 ? "là số chẵn" : "là số lẻ"}`;
    if (randomNumber % 5 === 0) {
      hint += ` và chia hết cho 5`;
    } else if (randomNumber % 3 === 0) {
      hint += ` và chia hết cho 3`;
    }

    this.setState({
      question: `Đoán số từ 1 đến ${max}`,
      correctAnswer: randomNumber,
      answer: "",
      hint,
    });
  };

  handleInputChange = (event) => {
    this.setState({ answer: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { answer, correctAnswer, gameType, streak, attempts } = this.state;

    if (!this.state.timerRunning) {
      this.startTimer();
    }

    let isCorrect = false;
    let responseMessage = "";

    if (gameType === "math") {
      isCorrect = parseFloat(answer) === correctAnswer;
      responseMessage = isCorrect
        ? `Đúng! ${answer} là kết quả chính xác.`
        : `Sai rồi! Đáp án đúng là ${correctAnswer}.`;
    } else if (gameType === "word") {
      isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
      responseMessage = isCorrect
        ? `Đúng! "${correctAnswer}" là từ cần tìm.`
        : `Sai rồi! Từ đúng là "${correctAnswer}".`;
    } else if (gameType === "guessNumber") {
      const guessedNumber = parseInt(answer);
      if (guessedNumber === correctAnswer) {
        isCorrect = true;
        responseMessage = `Tuyệt vời! ${correctAnswer} là số chính xác.`;
      } else {
        responseMessage =
          guessedNumber < correctAnswer
            ? `Số bạn đoán nhỏ hơn số cần tìm.`
            : `Số bạn đoán lớn hơn số cần tìm.`;
      }
    }

    const newAttempts = attempts + 1;
    let newStreak = streak;
    let coinReward = 0;

    if (isCorrect) {
      // Tính toán phần thưởng
      newStreak = streak + 1;

      // Phần thưởng dựa trên độ khó và chuỗi trả lời đúng
      const { difficulty } = this.state;
      const difficultyMultiplier =
        difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1;
      const streakBonus = Math.min(Math.floor(newStreak / 3), 5); // Tối đa x5 cho chuỗi

      coinReward = 100 * difficultyMultiplier + streakBonus * 50;

      this.setState({
        score: this.state.score + 100 * difficultyMultiplier,
        streak: newStreak,
        attempts: newAttempts,
        animation: "correct-answer",
      });

      toast.success(`${responseMessage} Nhận ${coinReward} xu!`);

      // Cập nhật coin trên backend
      const username = sessionStorage.getItem("userUsername");
      if (username) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/user/update-coin-v2/${username}`,
            { coin: coinReward }
          );

          if (response.data) {
            this.setState((prevState) => ({
              coins: prevState.coins + coinReward,
            }));
          }
        } catch (error) {
          console.error("Error updating coins:", error);
          toast.error("Không thể cập nhật số xu. Vui lòng thử lại sau.");
        }
      }

      // Clear timer and generate new question
      this.clearTimer();
      setTimeout(() => {
        this.setState({ animation: "" });
        this.generateQuestion();
        this.startTimer();
      }, 1500);
    } else {
      this.setState({
        streak: 0,
        attempts: newAttempts,
        animation: "wrong-answer",
      });

      if (gameType === "guessNumber") {
        toast.warning(responseMessage);
      } else {
        toast.error(responseMessage);

        // Nếu không phải đoán số, tạo câu hỏi mới sau khi trả lời sai
        setTimeout(() => {
          this.setState({ animation: "" });
          this.generateQuestion();
          this.startTimer();
        }, 2000);
      }
    }
  };

  handleGameTypeChange = (event) => {
    this.setState({ gameType: event.target.value }, () => {
      this.clearTimer();
      this.startNewGame();
    });
  };

  handleDifficultyChange = (event) => {
    this.setState({ difficulty: event.target.value }, () => {
      this.clearTimer();
      this.startNewGame();
    });
  };

  toggleHint = () => {
    this.setState((prevState) => ({ showHint: !prevState.showHint }));
  };

  getTimerVariant = () => {
    const { timer, maxTime } = this.state;
    const percentage = (timer / maxTime) * 100;

    if (percentage > 60) return "success";
    if (percentage > 30) return "warning";
    return "danger";
  };

  render() {
    const {
      question,
      answer,
      gameType,
      difficulty,
      score,
      streak,
      timer,
      maxTime,
      isLoading,
      showHint,
      hint,
      animation,
      userName,
      coins,
      gameActive,
    } = this.state;

    const timerPercentage = (timer / maxTime) * 100;

    return (
      <Container className="py-4 " style={{ marginBottom: "100px" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className={`shadow ${animation}`}>
              <Card.Header className="bg-primary text-white text-center py-3">
                <h2 className="mb-0">
                  <i className="bi bi-controller me-2"></i>
                  Mini Game
                </h2>
              </Card.Header>

              <Card.Body className="p-4">
                {/* User Info and Score Panel */}
                <Row className="mb-4 align-items-center">
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded-circle me-2">
                        <i className="bi bi-person-circle fs-3"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">{userName}</h5>
                        <div className="text-warning">
                          <i className="bi bi-coin me-1"></i>
                          <span>{coins} xu</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex justify-content-md-end mt-3 mt-md-0">
                      <div className="me-3 text-center">
                        <Badge bg="primary" pill className="px-3 py-2">
                          <i className="bi bi-trophy me-1"></i>
                          <span className="fs-5">{score}</span>
                          <span className="ms-1 small">điểm</span>
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          bg={streak > 2 ? "danger" : "secondary"}
                          pill
                          className="px-3 py-2"
                        >
                          <i className="bi bi-lightning me-1"></i>
                          <span className="fs-5">{streak}</span>
                          <span className="ms-1 small">String</span>
                        </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Game Controls */}
                <Row className="mb-4">
                  <Col xs={12} md={6} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label>Type of Game</Form.Label>
                      <Form.Select
                        onChange={this.handleGameTypeChange}
                        value={gameType}
                      >
                        <option value="math">🧮 Calculate</option>
                        <option value="word">🔤 Words sort</option>
                        <option value="guessNumber">🎯 Number guess</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Difficulty</Form.Label>
                      <Form.Select
                        onChange={this.handleDifficultyChange}
                        value={difficulty}
                      >
                        <option value="easy">🟢 Essy</option>
                        <option value="medium">🟠 Medium</option>
                        <option value="hard">🔴 Hard</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Timer */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Time</span>
                    <span>{timer} seconds</span>
                  </div>
                  <ProgressBar
                    now={timerPercentage}
                    variant={this.getTimerVariant()}
                    animated={timer > 0}
                  />
                </div>

                {/* Game Question */}
                <Card className="bg-light mb-4">
                  <Card.Body className="text-center py-4">
                    {isLoading ? (
                      <div className="text-center p-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading new question...</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="display-6 mb-0">{question}</h3>
                        {showHint && hint && (
                          <Alert variant="info" className="mt-3 mb-0">
                            <i className="bi bi-lightbulb me-2"></i>
                            {hint}
                          </Alert>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>

                {/* Answer Form */}
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Type your answer here"
                      value={answer}
                      onChange={this.handleInputChange}
                      disabled={isLoading}
                      autoFocus
                      className="py-3"
                    />
                  </Form.Group>

                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <Button
                      variant="outline-info"
                      type="button"
                      onClick={this.toggleHint}
                      className="mb-2 mb-sm-0"
                      disabled={!hint || isLoading}
                    >
                      <i className="bi bi-lightbulb me-2"></i>
                      {showHint ? "Hide " : "Show "}
                    </Button>

                    <div>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={this.startNewGame}
                        className="me-2"
                        disabled={isLoading}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        New
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        size="lg"
                        disabled={!answer.trim() || isLoading}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        OK
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>

              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-center">
                  <Badge bg="secondary" className="px-3 py-2">
                    Get coin now!
                  </Badge>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        <ToastContainer position="top-right" autoClose={3000} />

        <style jsx>{`
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

          .correct-answer {
            animation: correctPulse 1.5s;
          }

          .wrong-answer {
            animation: wrongShake 0.5s;
          }

          @keyframes correctPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(40, 167, 69, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
            }
          }

          @keyframes wrongShake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-5px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(5px);
            }
          }
        `}</style>
      </Container>
    );
  }
}

export default MiniGame;
