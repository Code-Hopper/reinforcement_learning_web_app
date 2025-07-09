import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchDataForLeaderBoard,
  fetchDailyQuiz,
  storeAnswers
} from '../../../../../api/backendApi';
import { GrRefresh } from "react-icons/gr";
import { useUser } from '../../../../../context/userContext';

const Stats = () => {
  const { user, addPoints } = useUser(); // ✅ make sure it's addPoints not addPoint
  const navigate = useNavigate();

  const [leaderBoard, setLeaderBoard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizError, setQuizError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const fetchLeaderBoard = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) throw new Error("No token found");
      const result = await fetchDataForLeaderBoard(token);
      if (!result.success) throw new Error("Unable to fetch leaderboard");
      setLeaderBoard(result.leaderboard);
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      navigate("/");
    }
  };

  const handleDailyQuiz = async () => {
    const token = localStorage.getItem("token");
    setLoadingQuiz(true);

    try {
      const result = await fetchDailyQuiz(token);
      if (!result.questions || result.questions.length === 0) {
        setQuizError("No quiz available. Learn some topics first.");
        return;
      }

      setQuiz({
        topic: result.topic,
        questions: result.questions
      });
      setUserAnswers({});
      setQuizError("");
      setShowResult(false);
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setQuizError("Failed to fetch quiz. Try again later.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleOptionSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const handleSubmitQuiz = async () => {
    const token = localStorage.getItem("token");
    const { questions, topic } = quiz;

    const formattedAnswers = questions.map((q, idx) => {
      const selectedLetter = userAnswers[idx] || "";
      const selectedOption = q.options.find(opt => opt.startsWith(selectedLetter)) || "";
      const correctOption = q.options.find(opt => opt.startsWith(q.answer)) || "";

      return {
        question: q.question,
        selectedLetter,
        selectedOption,
        correctLetter: q.answer,
        correctOption,
        isCorrect: selectedLetter === q.answer
      };
    });

    try {
      const result = await storeAnswers(token, {
        topic,
        answers: formattedAnswers
      });

      setResultData(result);
      setShowResult(true);

      // ✅ Add earned points to context and DB
      if (result.creditPoints) {
        addPoints(result.creditPoints);
      }

    } catch (err) {
      console.error("Error submitting quiz:", err);
      setQuizError("Failed to submit answers.");
    }
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return (
    <div className="stats">
      {/* Leaderboard */}
      <section className="leader-board bg-white p-6 rounded-lg">
        <div className='flex gap-3 items-center py-5'>
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          <button
            onClick={fetchLeaderBoard}
            className='bg-accentColor text-white px-3 py-2 flex items-center gap-3'>
            <span>Update Board</span>
            <GrRefresh />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-primaryColor text-white text-left text-xs font-semibold uppercase border-b">User</th>
                <th className="px-6 py-3 bg-primaryColor text-white text-left text-xs font-semibold uppercase border-b">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderBoard.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{entry.fullName}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quiz */}
      <section className='my-5'>
        <div className='flex gap-5'>
          <div className='flex-1 bg-white rounded-lg p-6 flex flex-col gap-2'>
            <span className='font-bold text-accentColor'>Start Learning</span>
            <p className='font-semibold'>Get Ranked Up. Answer daily quiz to get points.</p>
            {loadingQuiz ? (
              <button disabled className='bg-gray-400 text-white font-bold px-4 py-2 cursor-not-allowed'>
                Loading Quiz...
              </button>
            ) : (
              <button onClick={handleDailyQuiz} className='bg-accentColor text-white font-bold px-4 py-2'>
                Take Daily Quiz
              </button>
            )}
            {quizError && <p className="text-red-500 text-sm mt-2">{quizError}</p>}
            {quiz && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
                  <button onClick={() => setQuiz(null)} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
                  <h2 className="text-xl font-bold mb-3">📝 Daily Quiz - {quiz.topic}</h2>
                  {quiz.questions.map((q, idx) => (
                    <div key={idx} className="mb-4">
                      <p className="font-medium">{idx + 1}. {q.question}</p>
                      <ul className="ml-4 mt-1 flex gap-5 flex-wrap">
                        {q.options.map((opt, i) => {
                          const letter = opt.charAt(0);
                          const selected = userAnswers[idx];
                          const correct = q.answer === letter;
                          const isSelected = selected === letter;

                          let className = "cursor-pointer text-sm px-2 py-1 rounded inline-block";
                          if (showResult) {
                            className += correct
                              ? " bg-green-200"
                              : isSelected
                                ? " bg-red-200"
                                : " bg-gray-100";
                          } else {
                            className += isSelected ? " bg-blue-200" : " hover:bg-gray-200";
                          }

                          return (
                            <li key={i}>
                              <span
                                className={className}
                                onClick={() => !showResult && handleOptionSelect(idx, letter)}
                              >
                                {opt}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  {!showResult && (
                    <button
                      onClick={handleSubmitQuiz}
                      className="bg-emerald-600 text-white px-4 py-2 rounded mt-4"
                    >
                      Submit Quiz
                    </button>
                  )}
                  {showResult && resultData && (
                    <div className='mt-5'>
                      <h3 className="text-lg font-bold text-green-700">✅ Result:</h3>
                      <p>Total Questions: {resultData.totalQuestions}</p>
                      <p>Correct: {resultData.correctAnswers}</p>
                      <p>Credit Points Earned: <span className="text-emerald-700 font-semibold">{resultData.creditPoints}</span></p>
                      <p>Skill Level: <span className='font-bold'>{resultData.skillLevel}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className='flex-1 bg-white rounded-lg p-6'>
            <h1 className='font-bold text-2xl'>Feedback</h1>
            <p className='text-gray-500'>Start learning to get personalized feedback</p>
          </div>
        </div>
      </section>

      {/* Tags Learned */}
      <section className='my-5'>
        <div className='p-5 bg-white'>
          <h1 className='font-bold'>Topics Learned</h1>
          <div className='my-2 flex gap-3 items-center flex-wrap'>
            {user?.tagsLearned?.length > 0 ? (
              user.tagsLearned.map((tag, idx) => (
                <h1 key={idx} className='font-bold bg-secondaryColor text-white p-2 rounded-lg w-fit'>{tag}</h1>
              ))
            ) : (
              <p className="text-gray-500">No topics learned yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Stats;