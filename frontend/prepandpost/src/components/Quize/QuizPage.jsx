import React, { useState, useEffect, useCallback } from "react";
import { Timer, AlertTriangle, Eye, Monitor, X, Bookmark } from "lucide-react";
import { Helmet } from "react-helmet";

// Mock data - replace with actual API call in production
const generateQuizData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: `Question ${
      i + 1
    }: Lorem ipsum dolor sit amet, consectetur adipiscing elit?`,
    options: [
      `Option A for question ${i + 1}`,
      `Option B for question ${i + 1}`,
      `Option C for question ${i + 1}`,
      `Option D for question ${i + 1}`,
    ],
    correctAnswer: Math.floor(Math.random() * 4),
  }));
};

const quizData = generateQuizData(50);

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [bookmarked, setBookmarked] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [facesDetected, setFacesDetected] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setTabSwitchCount((prev) => prev + 1);
      setWarningMessage("You switched tabs. This activity will be recorded.");
      setShowWarning(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulating face detection
    const faceDetectionInterval = setInterval(() => {
      const detectedFaces = Math.floor(Math.random() * 3) + 1;
      setFacesDetected(detectedFaces);
      if (detectedFaces !== 1) {
        setWarningMessage(
          `${detectedFaces} faces detected. Please ensure only you are visible.`
        );
        setShowWarning(true);
      }
    }, 10000);

    return () => clearInterval(faceDetectionInterval);
  }, []);

  const handleAnswer = (questionId, answerIndex) => {
    setUserAnswers({ ...userAnswers, [questionId]: answerIndex });
  };

  const handleNavigation = (direction) => {
    setCurrentQuestion((prev) => {
      const newQuestion = prev + direction;
      return Math.max(0, Math.min(newQuestion, quizData.length - 1));
    });
  };

  const handleBookmark = () => {
    const currentQuestionId = quizData[currentQuestion].id;
    setBookmarked((prev) =>
      prev.includes(currentQuestionId)
        ? prev.filter((id) => id !== currentQuestionId)
        : [...prev, currentQuestionId]
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* <Helmet>
        <title>Interactive Quiz Application | Test Your Knowledge</title>
        <meta
          name="description"
          content="Challenge yourself with our interactive quiz application. Test your knowledge across various topics with 50 engaging questions."
        />
        <meta
          name="keywords"
          content="quiz, interactive, knowledge test, online exam, education"
        />
      </Helmet> */}
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <header className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Interactive Quiz Challenge</h1>
            <p className="mt-2 text-blue-100">
              Test your knowledge with 50 challenging questions!
            </p>
          </header>

          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-100 px-4 py-2 rounded-md">
                  <Timer size={24} />
                  <span className="text-xl font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-4 py-2 rounded-md">
                  <Eye size={24} />
                  <span className="text-xl font-semibold">{facesDetected}</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600 bg-red-100 px-4 py-2 rounded-md">
                  <Monitor size={24} />
                  <span className="text-xl font-semibold">
                    {tabSwitchCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex mb-6">
              <div className="w-3/4 pr-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 font-sans">
                    {quizData[currentQuestion].question}
                  </h2>
                  <div className="space-y-4">
                    {quizData[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full p-4 text-left rounded-md transition-colors font-sans text-lg ${
                          userAnswers[quizData[currentQuestion].id] === index
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
                        }`}
                        onClick={() =>
                          handleAnswer(quizData[currentQuestion].id, index)
                        }
                      >
                        {["A", "B", "C", "D"][index]}. {option}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      className={`flex items-center px-4 py-2 rounded-md transition-colors font-sans text-lg ${
                        bookmarked.includes(quizData[currentQuestion].id)
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={handleBookmark}
                    >
                      <Bookmark size={20} className="mr-2" />
                      {bookmarked.includes(quizData[currentQuestion].id)
                        ? "Bookmarked"
                        : "Bookmark"}
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-sans text-lg"
                      onClick={() => handleNavigation(1)}
                      disabled={currentQuestion === quizData.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-1/4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 font-sans">
                    Question Numbers
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {quizData.map((q, index) => (
                      <button
                        key={q.id}
                        className={`w-10 h-10 rounded-md font-semibold text-sm transition-colors font-sans ${
                          currentQuestion === index
                            ? "bg-blue-600 text-white"
                            : userAnswers[q.id] !== undefined
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-sans text-lg"
                onClick={() => handleNavigation(-1)}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-sans text-lg"
                onClick={() =>
                  handleAnswer(
                    quizData[currentQuestion].id,
                    userAnswers[quizData[currentQuestion].id]
                  )
                }
              >
                Save
              </button>
            </div>
          </main>

          {/* Footer remains unchanged */}
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Warning</h3>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-700">{warningMessage}</p>
            <button
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => setShowWarning(false)}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizPage;
