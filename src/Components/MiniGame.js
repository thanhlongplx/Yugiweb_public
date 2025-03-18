import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

class MiniGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameType: "math", // Loại game hiện tại
      question: "",
      answer: "",
      correctAnswer: "",
      triviaQuestions: [], // Danh sách câu hỏi từ file JSON
    };
  }

  componentDidMount() {
    this.fetchTriviaQuestions(); // Fetch câu hỏi từ file JSON
  }

  fetchTriviaQuestions = async () => {
    try {
      const response = await fetch("/questions.json"); // Đường dẫn đến file JSON
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      this.setState({ triviaQuestions: data.questions }, this.generateQuestion); // Tạo câu hỏi ngay sau khi tải xong
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Không thể tải câu hỏi.");
    }
  };

  generateQuestion = () => {
    const { gameType, triviaQuestions } = this.state;

    switch (gameType) {
      case "math":
        this.generateMathQuestion();
        break;
      case "word":
        this.generateWordQuestion();
        break;
      case "trueFalse":
        this.generateTrueFalseQuestion();
        break;
      case "guessNumber":
        this.generateGuessNumberQuestion();
        break;
      default:
        break;
    }
  };

  generateMathQuestion = () => {
    const CalculateMethod = [
      "addition",
      "subtraction",
      "multiplication",
      "division",
    ];
    const randomMethod =
      CalculateMethod[Math.floor(Math.random() * CalculateMethod.length)];
    const num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);

    let question;
    let correctAnswer;

    switch (randomMethod) {
      case "addition":
        question = `Tính: ${num1} + ${num2}`;
        correctAnswer = num1 + num2;
        break;
      case "subtraction":
        question = `Tính: ${num1} - ${num2}`;
        correctAnswer = num1 - num2;
        break;
      case "multiplication":
        question = `Tính: ${num1} * ${num2}`;
        correctAnswer = num1 * num2;
        break;
      case "division":
        if (num2 === 0) num2 = 1; // Tránh chia cho 0
        question = `Tính: ${num1} / ${num2}`;
        correctAnswer = (num1 / num2).toFixed(1);
        break;
      default:
        break;
    }

    this.setState({
      question,
      correctAnswer: parseFloat(correctAnswer),
      answer: "",
    });
  };

  generateWordQuestion = () => {
    const words = ["apple", "banana", "orange", "grape"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    this.setState({
      question: `Sắp xếp lại chữ cái: ${shuffled}`,
      correctAnswer: randomWord,
      answer: "",
    });
  };

  generateTrueFalseQuestion = () => {
    const { triviaQuestions } = this.state;
    if (triviaQuestions.length > 0) {
      const randomQuestion =
        triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      this.setState({
        question: randomQuestion.question,
        correctAnswer: randomQuestion.correct_answer, // Sử dụng đáp án từ file JSON
        answer: "",
      });
    } else {
      toast.error("Không có câu hỏi đúng/sai.");
    }
  };

  generateGuessNumberQuestion = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // Số từ 1 đến 100

    this.setState({
      question: "Đoán số từ 1 đến 100",
      correctAnswer: randomNumber,
      answer: "",
    });
  };

  handleInputChange = (event) => {
    this.setState({ answer: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { answer, correctAnswer, gameType } = this.state;

    let isCorrect = false;
    if (gameType === "math") {
      isCorrect = parseFloat(answer) === correctAnswer;
    } else if (gameType === "word") {
      isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    } else if (gameType === "trueFalse") {
      isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase(); // So sánh đáp án
    } else if (gameType === "guessNumber") {
      isCorrect = parseInt(answer) === correctAnswer;
    }

    if (isCorrect) {
      toast.success("Đáp án đúng! Nhận phần thưởng!");

      // Cập nhật coin trên backend
      const username = sessionStorage.getItem("userUsername");
      if (!username) {
        toast.error("Username not found. Please log in again.");
        return;
      }
      await axios.post(
        `http://localhost:5000/api/user/update-coin-v2/${username}`,
        {
          coin: 100, // Tăng thêm 1 coin
        }
      );

      this.generateQuestion(); // Tạo câu hỏi mới
    } else {
      toast.error("Đáp án sai. Hãy thử lại!");
    }
  };

  handleGameTypeChange = (event) => {
    this.setState({ gameType: event.target.value }, () => {
      this.generateQuestion(); // Tạo câu hỏi mới khi thay đổi loại game
    });
  };

  render() {
    const { question, answer, gameType } = this.state;

    return (
      <div className="container " style={{ marginBottom: "100px" }}>
        <h2 className="text-center">Mini Game</h2>
        <div className="mb-4">
          <select
            className="form-control"
            onChange={this.handleGameTypeChange}
            value={gameType}
          >
            <option value="math">Tính Nhẩm</option>
            <option value="word">Sắp Xếp Chữ Cái</option>
            <option value="trueFalse">Đúng/Sai</option>
            <option value="guessNumber">Đoán Số</option>
          </select>
        </div>
        <form onSubmit={this.handleSubmit} className="text-center">
          <p className="font-weight-bold">{question}</p>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={answer}
              onChange={this.handleInputChange}
              placeholder="Nhập đáp án"
              required
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Nộp Đáp Án
          </button>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default MiniGame;
