import { useState } from "react";
import { logger } from "../logger";

export default function CourseClassroomModal({
  course,
  currentUser,
  completedLessonIds,
  onCompleteLesson,
  onClose,
  onViewCert
}) {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!course) return null;

  const currentLesson = course.lessons[activeLessonIdx];
  const isLessonDone = completedLessonIds.includes(currentLesson.id);
  const totalLessons = course.lessons.length;
  const completedCount = completedLessonIds.length;
  const currentPercent = Math.round((completedCount / totalLessons) * 100);
  const isCourse100Percent = completedCount === totalLessons;

  async function handleMarkLessonDone() {
    logger.click("Mark Lesson Completed Button", `Module ${activeLessonIdx + 1}: ${currentLesson.title}`);
    await onCompleteLesson(course.id, currentLesson.id);
    setQuizSubmitted(false);
    setSelectedQuizChoice(null);

    if (!completedLessonIds.includes(currentLesson.id) && completedCount + 1 === totalLessons) {
      setShowCelebration(true);
    } else if (activeLessonIdx < totalLessons - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="classroom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="classroom-header">
          <div className="classroom-title-area">
            <span className="classroom-badge">{course.category}</span>
            <h2>{course.icon} {course.name} - Learning Studio</h2>
            <p>Student: <strong>{currentUser.name}</strong> • Progress Synced via PATCH API</p>
          </div>
          <button
            className="modal-close"
            onClick={() => {
              logger.click("Close Classroom Modal");
              onClose();
            }}
            title="Close Classroom"
          >
            ✕
          </button>
        </div>

        <div className="classroom-progress-bar-wrap">
          <div className="classroom-progress-stats">
            <span>Overall Course Completion:</span>
            <strong>{currentPercent}% ({completedCount} of {totalLessons} Modules)</strong>
          </div>
          <div className="progress-track large-track">
            <div
              className={`progress-fill ${isCourse100Percent ? "fill-complete" : ""}`}
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>

        {showCelebration && (
          <div className="celebration-banner">
            <div className="celebration-icon">🎉 🏆 🎓</div>
            <h3>Congratulations, {currentUser.name}!</h3>
            <p>
              You have completed all {totalLessons} modules for <strong>{course.name}</strong>! Your official certificate is unlocked.
            </p>
            <div className="celebration-actions">
              <button
                className="gold-btn"
                onClick={() => {
                  logger.click("Celebration Banner View Certificate Button", course.name);
                  onClose();
                  onViewCert(course);
                }}
              >
                🏆 View & Download Official Certificate
              </button>
              <button
                className="outline-btn"
                onClick={() => {
                  logger.click("Celebration Continue Reviewing Button");
                  setShowCelebration(false);
                }}
              >
                Continue Reviewing
              </button>
            </div>
          </div>
        )}

        <div className="classroom-body">
          <aside className="classroom-curriculum">
            <h4>Course Curriculum ({totalLessons} Lessons)</h4>
            <div className="curriculum-list">
              {course.lessons.map((lesson, idx) => {
                const done = completedLessonIds.includes(lesson.id);
                const active = idx === activeLessonIdx;

                return (
                  <button
                    key={lesson.id}
                    className={`curriculum-item ${active ? "active" : ""} ${done ? "completed" : ""}`}
                    onClick={() => {
                      logger.click("Classroom Select Module", `Module ${idx + 1}: ${lesson.title}`);
                      setActiveLessonIdx(idx);
                      setSelectedQuizChoice(null);
                      setQuizSubmitted(false);
                    }}
                  >
                    <div className="curr-status-icon">{done ? "✅" : active ? "▶" : "⚪"}</div>
                    <div className="curr-text">
                      <span className="curr-idx">Module {idx + 1} ({lesson.duration})</span>
                      <strong className="curr-title">{lesson.title}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="classroom-lesson-view">
            <div className="lesson-header-row">
              <div>
                <span className="lesson-eyebrow">MODULE {activeLessonIdx + 1} OF {totalLessons}</span>
                <h3 className="lesson-title">{currentLesson.title}</h3>
                <span className="lesson-time">⏱ Estimated study time: {currentLesson.duration}</span>
              </div>
              <div className="lesson-completion-tag">
                {isLessonDone ? <span className="badge-done">✓ Completed</span> : <span className="badge-pending">⏳ In Progress</span>}
              </div>
            </div>

            <section className="lesson-section">
              <h4>📖 Lesson Overview & Concepts</h4>
              <p className="lesson-overview-text">{currentLesson.overview}</p>
              <ul className="concepts-bullet-list">
                {currentLesson.concepts.map((concept, i) => (
                  <li key={i}>{concept}</li>
                ))}
              </ul>
            </section>

            {currentLesson.codeSnippet && (
              <section className="lesson-section">
                <h4>💻 Interactive Code & Implementation Guide</h4>
                <div className="code-box">
                  <pre>
                    <code>{currentLesson.codeSnippet}</code>
                  </pre>
                </div>
              </section>
            )}

            {currentLesson.quizQuestion && (
              <section className="lesson-section quiz-box">
                <h4>✍️ Quick Knowledge Check</h4>
                <p className="quiz-q-title"><strong>Question:</strong> {currentLesson.quizQuestion}</p>
                <div className="classroom-quiz-options">
                  {currentLesson.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`classroom-quiz-label ${quizSubmitted && optIdx === currentLesson.correctAnswer ? "correct" : ""
                        } ${quizSubmitted && selectedQuizChoice === optIdx && optIdx !== currentLesson.correctAnswer
                          ? "wrong"
                          : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name={`lesson-quiz-${currentLesson.id}`}
                        checked={selectedQuizChoice === optIdx}
                        disabled={quizSubmitted}
                        onChange={() => {
                          logger.click("Knowledge Check Select Option", opt);
                          setSelectedQuizChoice(optIdx);
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    className="outline-btn"
                    disabled={selectedQuizChoice === null}
                    onClick={() => {
                      logger.click("Knowledge Check Submit Answer");
                      setQuizSubmitted(true);
                    }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="quiz-feedback-msg">
                    {selectedQuizChoice === currentLesson.correctAnswer ? (
                      <span className="feedback-pass">✓ Excellent! Correct answer!</span>
                    ) : (
                      <span className="feedback-fail">
                        ⚠️ Not quite. The correct answer is: {currentLesson.options[currentLesson.correctAnswer]}
                      </span>
                    )}
                  </div>
                )}
              </section>
            )}

            <div className="lesson-footer-nav">
              <button
                className="outline-btn"
                disabled={activeLessonIdx === 0}
                onClick={() => {
                  logger.click("Classroom Previous Module Button");
                  setActiveLessonIdx(activeLessonIdx - 1);
                  setSelectedQuizChoice(null);
                  setQuizSubmitted(false);
                }}
              >
                ← Previous Module
              </button>

              {!isLessonDone ? (
                <button className="primary-btn complete-lesson-btn" onClick={handleMarkLessonDone}>
                  ✓ Mark Lesson Completed (PATCH) →
                </button>
              ) : (
                <div className="lesson-nav-actions">
                  <span className="lesson-finished-label">✓ Module Finished</span>
                  {activeLessonIdx < totalLessons - 1 ? (
                    <button
                      className="primary-btn"
                      onClick={() => {
                        logger.click("Classroom Next Module Button");
                        setActiveLessonIdx(activeLessonIdx + 1);
                        setSelectedQuizChoice(null);
                        setQuizSubmitted(false);
                      }}
                    >
                      Next Module →
                    </button>
                  ) : (
                    <button
                      className="gold-btn"
                      onClick={() => {
                        logger.click("Classroom View Earned Certificate Button");
                        onClose();
                        onViewCert(course);
                      }}
                    >
                      🏆 View Earned Certificate
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
