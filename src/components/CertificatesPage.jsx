import {
  generateCertificateId,
  downloadCertificatePNG,
  printCertificateWindow
} from "../certificateUtils";
import { logger } from "../logger";

export default function CertificatesPage({
  enrolled,
  progress,
  certificates,
  currentUser,
  onViewCert,
  onOpenClassroom,
  setPage,
  courses
}) {
  const completedCourses = enrolled
    .filter((id) => progress[id] === 100)
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);

  const inProgressCourses = enrolled
    .filter((id) => (progress[id] || 0) < 100)
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">ACCREDITED ACHIEVEMENTS</span>
        <h1>Official Certificates</h1>
        <p>Certificates are unlocked strictly upon completing 100% of all lessons in an enrolled course.</p>
      </div>

      {completedCourses.length > 0 ? (
        <div className="certificates-grid">
          {completedCourses.map((course) => {
            const certData = certificates[course.id] || {
              issueDate: new Date().toLocaleDateString(),
              certificateId: generateCertificateId(course.id, currentUser.name)
            };

            return (
              <article className="certificate-showcase-card" key={course.id}>
                <div className="cert-card-badge">🏆 VERIFIED CERTIFICATE</div>
                <div className="cert-card-icon">{course.icon}</div>
                <h2>{course.name}</h2>
                <p className="cert-recipient">Awarded to: <strong>{currentUser.name}</strong></p>
                <div className="cert-meta-info">
                  <span>📅 Issued: {certData.issueDate}</span>
                  <span>🔑 ID: {certData.certificateId}</span>
                </div>
                <div className="cert-actions-cluster">
                  <button
                    className="gold-btn full-btn"
                    onClick={() => {
                      logger.click("Download Certificate PNG Card Button", course.name);
                      logger.cert(currentUser.name, course.name, certData.certificateId);
                      downloadCertificatePNG(course, currentUser.name, certData.issueDate, certData.certificateId);
                    }}
                  >
                    ⬇️ Download Certificate (PNG)
                  </button>
                  <button
                    className="primary-btn full-btn"
                    onClick={() => {
                      logger.click("Preview Full Certificate Button", course.name);
                      onViewCert(course);
                    }}
                  >
                    👁️ Preview Full Certificate
                  </button>
                  <button
                    className="outline-btn full-btn"
                    onClick={() => {
                      logger.click("Print Certificate PDF Card Button", course.name);
                      printCertificateWindow(course, currentUser.name, certData.issueDate, certData.certificateId);
                    }}
                  >
                    🖨️ Print / Save as PDF
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div>🏆</div>
          <h2>No Certificates Earned Yet</h2>
          <p>
            Certificates are unlocked when you complete all lessons in a course. Complete each module in
            the Classroom to achieve 100% completion!
          </p>
          {enrolled.length === 0 ? (
            <button
              className="primary-btn"
              onClick={() => {
                logger.click("Browse Courses From Certificates Empty State");
                logger.nav("Courses");
                setPage("Courses");
              }}
            >
              Browse & Register a Course
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={() => {
                logger.click("Resume Learning From Certificates Empty State");
                logger.nav("Dashboard");
                setPage("Dashboard");
              }}
            >
              Go to Dashboard & Resume Learning
            </button>
          )}
        </div>
      )}

      {inProgressCourses.length > 0 && (
        <section className="panel" style={{ marginTop: "32px" }}>
          <div className="section-heading">
            <div>
              <h2>Certificates In Progress</h2>
              <p>Complete all modules in these registered courses to unlock their official certificates.</p>
            </div>
          </div>
          <div className="in-progress-cert-list">
            {inProgressCourses.map((course) => {
              const percent = progress[course.id] || 0;
              return (
                <div className="in-progress-cert-row" key={course.id}>
                  <div className="dash-icon">{course.icon}</div>
                  <div className="dash-details">
                    <b>{course.name}</b>
                    <div className="progress-track" style={{ margin: "6px 0" }}>
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {percent}% completed • {Math.round((percent / 100) * course.lessons.length)} of {course.lessons.length} lessons finished
                    </span>
                  </div>
                  <button
                    className="primary-btn"
                    onClick={() => {
                      logger.click("Continue Learning In Progress Cert Button", course.name);
                      onOpenClassroom(course);
                    }}
                  >
                    Continue Learning →
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
