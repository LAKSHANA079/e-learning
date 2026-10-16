
import { useLearningContext } from "../context/learningcontext";

export default function LearningDashboard({ courses = [] }) {
  const {
    enrolled = [],
    progress = {},
    overallProgress = 0,
    quizCompleted = false,
    assignmentDone = false,
    certificateEligible = false
  } = useLearningContext();

  const enrolledCourses = courses.filter((course) =>
    enrolled.includes(course.id)
  );

  return (
    <section id="learning" className="learning-dashboard">
      <div className="dashboard-heading">
        <p className="eyebrow">YOUR LEARNING JOURNEY</p>
        <h2>Learning Dashboard</h2>
        <p>Track your progress and continue learning.</p>
      </div>

      <div className="learning-progress-card">
        <h3>Overall Progress</h3>
        <div className="progress-label">
          <span>Your progress</span>
          <strong>{overallProgress}%</strong>
        </div>
        <progress value={overallProgress} max="100" />
      </div>

      <h3 className="learning-section-title">My Enrolled Courses</h3>

      {enrolledCourses.length === 0 ? (
        <div className="learning-empty">
          <span>📚</span>
          <h3>No courses enrolled yet</h3>
          <p>Explore Courses and enroll to start learning.</p>
        </div>
      ) : (
        <div className="enrolled-course-grid">
          {enrolledCourses.map((course) => (
            <article className="enrolled-course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>Course Progress</p>
              <progress value={progress[course.id] || 0} max="100" />
              <strong>{progress[course.id] || 0}%</strong>
            </article>
          ))}
        </div>
      )}

      <h3 className="learning-section-title">Learning Activities</h3>

      <div className="learning-cards">
        <article className="learning-card">
          <div className="learning-card-icon">📝</div>
          <h3>Quiz</h3>
          <p>Test your knowledge and review what you learned.</p>
          <span className={quizCompleted ? "activity-done" : "activity-pending"}>
            {quizCompleted ? "✓ Completed" : "Ready to start"}
          </span>
        </article>

        <article className="learning-card">
          <div className="learning-card-icon">📚</div>
          <h3>Assignment</h3>
          <p>Practice your skills with a learning task.</p>
          <span className={assignmentDone ? "activity-done" : "activity-pending"}>
            {assignmentDone ? "✓ Completed" : "Ready to start"}
          </span>
        </article>

        <article className="learning-card">
          <div className="learning-card-icon">🏆</div>
          <h3>Certificate</h3>
          <p>Check whether you have completed the required activities.</p>
          <span className={certificateEligible ? "activity-done" : "activity-pending"}>
            {certificateEligible ? "✓ Eligible" : "Not yet eligible"}
          </span>
        </article>
      </div>
    </section>
  );
}
