import { useState } from "react";
import { logger } from "../logger";

export default function AssignmentsView({ assignments, onSubmitAssignment, onDeleteAssignment }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  const tasks = [
    { title: "Build a Responsive Landing Page with Flexbox", category: "Web Development", level: "Practical Lab" },
    { title: "Network Packet Analysis & Security Audit", category: "Cyber Security", level: "Security Lab" },
    { title: "Automated Data Processing Script in Python", category: "Python", level: "Practical Lab" },
    { title: "Fine-Tuning a Transformer Sentiment Classifier", category: "Artificial Intelligence", level: "Advanced Lab" },
    { title: "Database Normalization & Complex Joins Lab", category: "Database Management", level: "Database Lab" },
    { title: "Deploying a Dockerized App with Cloud Load Balancers", category: "Cloud Computing", level: "Cloud DevOps" }
  ];

  function handleSubmitTask(e) {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    logger.click("Submit Assignment Task Form", `${selectedTask.title}: ${submissionUrl}`);
    onSubmitAssignment({
      title: selectedTask.title,
      category: selectedTask.category,
      level: selectedTask.level,
      submissionUrl: submissionUrl.trim()
    });
    setSelectedTask(null);
    setSubmissionUrl("");
    alert("Assignment submitted successfully via POST API!");
  }

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EXPERIMENT 3d: ASSIGNMENT CRUD (POST)</span>
        <h1>Practical Assignments</h1>
        <p>Submit hands-on code tasks and architecture labs to your learning record.</p>
      </div>

      <div className="assignment-list">
        {tasks.map((task) => {
          const isDone = assignments.some((a) => a.title === task.title);

          return (
            <article className="assignment-card" key={task.title}>
              <div className="assignment-icon">📝</div>
              <div className="assignment-info">
                <h3>{task.title}</h3>
                <p>{task.category} · {task.level}</p>
                {isDone && <span style={{ color: "#059669", fontSize: "12px", fontWeight: "bold" }}>✓ Submitted</span>}
              </div>
              {isDone ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="status complete">Completed</span>
                  {onDeleteAssignment && (
                    <button
                      className="danger-outline-btn"
                      style={{ padding: "5px 10px", fontSize: "11px" }}
                      onClick={() => onDeleteAssignment(task.title)}
                      title="Delete assignment submission via HTTP DELETE"
                    >
                      🗑️ Delete (DELETE)
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => {
                    logger.click("Open Assignment Submission Modal", task.title);
                    setSelectedTask(task);
                  }}
                >
                  Submit Solution →
                </button>
              )}
            </article>
          );
        })}
      </div>

      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => {
                logger.click("Close Assignment Modal");
                setSelectedTask(null);
              }}
            >
              ✕
            </button>
            <div className="modal-icon">📤</div>
            <h3>Submit: {selectedTask.title}</h3>
            <p style={{ margin: "4px 0 16px", fontSize: "13px" }}>{selectedTask.category} • {selectedTask.level}</p>
            <form onSubmit={handleSubmitTask}>
              <div className="form-group">
                <label className="form-label">GitHub Repository or Solution Link</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  required
                  style={{ width: "100%", margin: "8px 0" }}
                />
              </div>
              <button className="primary-btn full-btn" type="submit">
                Submit Assignment (POST /api/assignments)
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
