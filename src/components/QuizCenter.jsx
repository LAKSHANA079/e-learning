import { useState } from "react";
import { quizData } from "../quizData";
import { logger } from "../logger";

export default function QuizCenter({ onResult }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function chooseQuiz(quiz) {
    logger.click("Quiz Center Select Quiz", quiz.title);
    setSelectedQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
  }

  function submitQuiz() {
    if (Object.keys(answers).length !== selectedQuiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const score = selectedQuiz.questions.filter((q, i) => answers[i] === q.answer).length;
    logger.click("Quiz Center Submit Evaluation Button", `${score}/${selectedQuiz.questions.length}`);
    onResult({
      quizId: selectedQuiz.id,
      title: selectedQuiz.title,
      score,
      total: selectedQuiz.questions.length,
      date: new Date().toLocaleDateString()
    });
    setSubmitted(true);
  }

  if (selectedQuiz) {
    const score = selectedQuiz.questions.filter((q, i) => answers[i] === q.answer).length;

    return (
      <section className="panel">
        <button
          className="text-btn"
          onClick={() => {
            logger.click("Back to All Quizzes Button");
            chooseQuiz(null);
          }}
        >
          ← Back to All Quizzes
        </button>
        <div className="page-heading">
          <span className="eyebrow">{selectedQuiz.category}</span>
          <h1>{selectedQuiz.title}</h1>
          <p>{selectedQuiz.questions.length} questions · Multiple Choice Evaluation</p>
        </div>
        {selectedQuiz.questions.map((q, i) => (
          <div className="question-card" key={i}>
            <h3>{i + 1}. {q.q}</h3>
            {q.options.map((option, j) => (
              <label className="answer-option" key={j}>
                <input
                  type="radio"
                  name={`question-${i}`}
                  checked={answers[i] === j}
                  disabled={submitted}
                  onChange={() => {
                    logger.click("Quiz Question Option Selected", `Q${i + 1}: ${option}`);
                    setAnswers({ ...answers, [i]: j });
                  }}
                />
                {option}
                {submitted && j === q.answer && <span className="answer-correct"> ✓ (Correct)</span>}
              </label>
            ))}
            {submitted && answers[i] !== q.answer && (
              <p className="wrong-answer">Correct answer: {q.options[q.answer]}</p>
            )}
          </div>
        ))}
        {submitted ? (
          <div className="result-banner">
            <h2>Your Score: {score} / {selectedQuiz.questions.length}</h2>
            <p>
              {Math.round((score / selectedQuiz.questions.length) * 100)}% —{" "}
              {score === selectedQuiz.questions.length ? "Excellent mastery!" : "Good effort! Keep learning."}
            </p>
            <button
              className="primary-btn"
              onClick={() => {
                logger.click("Back to Quiz Center After Result Button");
                chooseQuiz(null);
              }}
            >
              Back to Quiz Center
            </button>
          </div>
        ) : (
          <button className="primary-btn" onClick={submitQuiz}>Submit Quiz Evaluation (POST)</button>
        )}
      </section>
    );
  }

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EXPERIMENT 3d: QUIZ DATA VIA POST</span>
        <h1>Quiz Center</h1>
        <p>Complete subject evaluations and post results directly to your learning history.</p>
      </div>
      <div className="quiz-grid">
        {quizData.map((quiz, i) => (
          <article className="quiz-card" key={quiz.id}>
            <div className="quiz-card-icon">{["🌐", "🎨", "⚡", "🔐", "🐍", "🤖"][i % 6]}</div>
            <span className="category-tag">{quiz.category}</span>
            <h3>{quiz.title}</h3>
            <p>{quiz.questions.length} questions · Evaluated testing</p>
            <button
              className="primary-btn full-btn"
              onClick={() => {
                logger.click("Start Quiz Evaluation Button", quiz.title);
                chooseQuiz(quiz);
              }}
            >
              Start Quiz Evaluation →
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
