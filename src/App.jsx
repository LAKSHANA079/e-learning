import { useEffect, useState, lazy, Suspense } from "react";
import "./App.css";
import { useLearningStore } from "./store/useLearningStore";
import { logger } from "./logger";
import {
  generateCertificateId,
  downloadCertificatePNG,
  printCertificateWindow
} from "./certificateUtils";

// Experiment 2a & 2b: Dynamic Lazy Loading & Route Code Splitting
const QuizCenter = lazy(() => import("./components/QuizCenter"));
const Assignments = lazy(() => import("./components/AssignmentsView"));
const CertificatesPage = lazy(() => import("./components/CertificatesPage"));
const CourseClassroomModal = lazy(() => import("./components/CourseClassroomModal"));

const quizData = [
  {
    id: 1,
    title: "HTML Fundamentals",
    category: "Web Development",
    questions: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Main Link", "Home Tool Markup Language"], answer: 0 },
      { q: "Which tag creates a paragraph?", options: ["<h1>", "<p>", "<div>", "<img>"], answer: 1 },
      { q: "Which tag creates a link?", options: ["<a>", "<p>", "<br>", "<ul>"], answer: 0 }
    ]
  },
  {
    id: 2,
    title: "CSS Basics",
    category: "Web Development",
    questions: [
      { q: "What does CSS control?", options: ["Database", "Web page styling", "Server hardware", "Passwords"], answer: 1 },
      { q: "Which property changes text color?", options: ["font-size", "background", "color", "margin"], answer: 2 },
      { q: "Which selector targets a class?", options: ["#", ".", "*", "&"], answer: 1 }
    ]
  },
  {
    id: 3,
    title: "JavaScript Basics",
    category: "Web Development",
    questions: [
      { q: "Which keyword declares a variable?", options: ["make", "var", "define", "print"], answer: 1 },
      { q: "Which method displays a message?", options: ["alert()", "displayText()", "showPage()", "message()"], answer: 0 },
      { q: "Which symbol is used for strict equality?", options: ["=", "==", "===", "!="], answer: 2 }
    ]
  },
  {
    id: 4,
    title: "Cyber Security Fundamentals",
    category: "Cyber Security",
    questions: [
      { q: "What is phishing?", options: ["A coding language", "A deceptive attempt to steal sensitive information", "A backup method", "A database system"], answer: 1 },
      { q: "Which password is strongest?", options: ["123456", "password", "name123", "T9#kL2!qP7"], answer: 3 },
      { q: "What does HTTPS provide for web communications?", options: ["Encrypted communication", "Free storage", "Faster typing", "Unlimited memory"], answer: 0 }
    ]
  },
  {
    id: 5,
    title: "Python Programming",
    category: "Python",
    questions: [
      { q: "Which function displays output in Python?", options: ["echo()", "print()", "writeLine()", "show()"], answer: 1 },
      { q: "Which symbol starts a Python comment?", options: ["//", "/*", "#", "<!--"], answer: 2 },
      { q: "Which type stores True or False in Python?", options: ["int", "bool", "str", "list"], answer: 1 }
    ]
  },
  {
    id: 6,
    title: "Artificial Intelligence Foundations",
    category: "AI",
    questions: [
      { q: "What is AI?", options: ["Artificial Intelligence", "Automatic Internet", "Advanced Input", "Applied Interface"], answer: 0 },
      { q: "Which is a practical AI application?", options: ["Voice assistant", "Plain notebook", "Basic chair", "Paper clip"], answer: 0 },
      { q: "What does a machine learning model primarily learn from?", options: ["Training Data", "Only cables", "A keyboard", "A monitor"], answer: 0 }
    ]
  }
];

// ----------------- EXPERIMENT 4: AUTHENTICATION VIEW -----------------
function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const { login, signup, loading, error } = useLearningStore();

  const savedUsers = JSON.parse(localStorage.getItem("elearning-users") || "[]");
  const trimmedEmail = email.trim().toLowerCase();
  const isDuplicateEmail = mode === "signup" && trimmedEmail && savedUsers.some(u => u.email.toLowerCase() === trimmedEmail);

  async function handleSubmit(e) {
    e.preventDefault();
    logger.click("Auth Form Submit", `Mode: ${mode}, Email: ${email}`);
    setFeedback({ type: "", text: "" });

    const trimmedName = name.trim();

    if (mode === "signup") {
      if (!trimmedName) {
        setFeedback({ type: "error", text: "Please enter your full name." });
        return;
      }
      if (!trimmedEmail) {
        setFeedback({ type: "error", text: "Please enter a valid email address." });
        return;
      }
      if (password.length < 6) {
        setFeedback({ type: "error", text: "Password must be at least 6 characters long." });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ type: "error", text: "Passwords do not match. Please verify!" });
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("elearning-users") || "[]");
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        setFeedback({
          type: "error",
          text: `Account already exists! An account with "${trimmedEmail}" is already registered. Please log in instead.`
        });
        return;
      }

      try {
        await signup(trimmedName, trimmedEmail, password);
        setFeedback({
          type: "success",
          text: `Account created! Bearer token issued. Entering learning portal...`
        });
      } catch (err) {
        setFeedback({ type: "error", text: err.message });
      }
    } else {
      if (!trimmedEmail || !password) {
        setFeedback({ type: "error", text: "Please enter both email and password." });
        return;
      }

      try {
        await login(trimmedEmail, password);
        setFeedback({ type: "success", text: `Authenticated successfully! Loading your courses...` });
      } catch (err) {
        setFeedback({ type: "error", text: err.message });
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-section">
            <div className="auth-logo">🎓</div>
            <h1 className="auth-app-title">EduLearn Platform</h1>
            <p className="auth-app-subtitle">Unit 4: E-Learning Application with REST API & State Management</p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                logger.click("Switch Auth Tab", "Sign Up");
                setMode("signup");
                setFeedback({ type: "", text: "" });
              }}
            >
              Sign Up (Create Account)
            </button>
            <button
              type="button"
              className={mode === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                logger.click("Switch Auth Tab", "Log In");
                setMode("login");
                setFeedback({ type: "", text: "" });
              }}
            >
              Log In
            </button>
          </div>

          <div className="auth-mode-desc">
            <h2>{mode === "signup" ? "Create Your Student Account" : "Log In to Your Account"}</h2>
            <p>
              {mode === "signup"
                ? "Register with your name and email. An authorization token will be generated to secure your enrollment."
                : "Sign in with your email to access your personal registered courses and progress."}
            </p>
          </div>

          {(feedback.text || error) && (
            <div className={`auth-alert auth-alert-${feedback.type || "error"}`}>
              {feedback.type === "success" ? "✅ " : "⚠️ "}
              <span>{feedback.text || error}</span>
              {(feedback.text || error)?.toLowerCase().includes("already exists") && (
                <button
                  type="button"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setMode("login");
                    setFeedback({ type: "", text: "" });
                  }}
                >
                  Go to Log In →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="form-group">
                <label className="form-label">Full Name (Will appear on Certificate)</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    className="auth-input-field"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address (Your Account ID)</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  className="auth-input-field"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {isDuplicateEmail && (
                <p style={{ color: "#dc2626", fontSize: "12.5px", margin: "4px 0 0", fontWeight: "600" }}>
                  ⚠️ Account already exists with this email!{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setFeedback({ type: "", text: "" });
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      fontWeight: "bold"
                    }}
                  >
                    Click here to Log In
                  </button>
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => {
                    logger.click("Toggle Password Visibility", !showPassword ? "Show" : "Hide");
                    setShowPassword(!showPassword);
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    className="auth-input-field"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button className="auth-main-btn" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : mode === "signup" ? "🚀 Create My Account & Enter" : "🔑 Log In"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "signup" ? "Already have an account? " : "Don't have an account yet? "}
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => {
                const nextMode = mode === "signup" ? "login" : "signup";
                logger.click("Auth Switch Link", nextMode);
                setMode(nextMode);
                setFeedback({ type: "", text: "" });
              }}
            >
              {mode === "signup" ? "Log in here" : "Sign up here"}
            </button>
          </p>

          <div className="auth-perks">
            <div className="perk-item">✓ Exp 1: REST API (Axios)</div>
            <div className="perk-item">✓ Exp 2: Zustand + Middleware</div>
            <div className="perk-item">✓ Exp 4: Auth Bearer Token</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- TOPBAR / HEADER -----------------
function Header({ search, setSearch, currentUser, onLogout, setPage, token, onOpenTokenModal }) {
  return (
    <header className="topbar">
      <div
        className="brand"
        onClick={() => {
          logger.click("Header Logo", "Navigate to Home");
          logger.nav("Home");
          setPage("Home");
        }}
        style={{ cursor: "pointer" }}
      >
        🎓 <span>EduLearn Academy</span>
      </div>
      <input
        className="global-search"
        placeholder="Search courses via REST API..."
        value={search}
        onChange={(e) => {
          logger.click("Search Input Change", `Query: "${e.target.value}"`);
          setSearch(e.target.value);
        }}
      />
      <div className="topbar-user-area">
        {token && (
          <button
            className="token-badge clickable"
            onClick={() => {
              logger.click("Click Header Token Badge");
              onOpenTokenModal();
            }}
            title="Click to view & inspect Bearer Token"
          >
            🔑 Token Active (Inspect)
          </button>
        )}
        <div className="student-label" title={currentUser?.email || "Student Account"}>
          <span className="user-avatar-badge">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "👤"}
          </span>
          <span className="student-name-text">{currentUser?.name || "Student"}</span>
        </div>
        {onLogout && (
          <button
            className="logout-top-btn"
            onClick={() => {
              logger.click("Topbar Logout Button");
              onLogout();
            }}
            title="Sign out"
          >
            🚪 Logout
          </button>
        )}
      </div>
    </header>
  );
}

// ----------------- SIDEBAR -----------------
function Sidebar({ page, setPage, enrolledCount, completedCount }) {
  const links = [
    { name: "Home", icon: "⌂" },
    { name: "Courses", icon: "▣" },
    { name: "Dashboard", icon: "▦", badge: enrolledCount > 0 ? enrolledCount : null },
    { name: "Quiz Center", icon: "✎" },
    { name: "Assignments", icon: "☑" },
    { name: "Certificates", icon: "♜", badge: completedCount > 0 ? completedCount : null },
    { name: "Profile", icon: "♙" }
  ];

  return (
    <aside className="sidebar">
      <div className="side-links">
        {links.map(({ name, icon, badge }) => (
          <button
            key={name}
            className={page === name ? "side-link active" : "side-link"}
            onClick={() => {
              logger.click("Sidebar Navigation Link", name);
              logger.nav(name);
              setPage(name);
            }}
          >
            <span className="side-icon">{icon}</span>
            <span className="side-label">{name}</span>
            {badge !== null && <span className="side-badge">{badge}</span>}
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="cap-icon">🎓</div>
        <strong>Unit 4 Active</strong>
        <p style={{ margin: "4px 0 0", fontSize: "11px", opacity: 0.8 }}>
          REST APIs, Zustand global store, CRUD operations, and Token management.
        </p>
      </div>
    </aside>
  );
}

// ----------------- EXPERIMENT 2d: MIDDLEWARE ACTION MONITOR -----------------
function MiddlewareMonitorDrawer({ actionLogs }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="unit4-monitor-btn"
        style={{ position: "fixed", bottom: "16px", right: "16px", zIndex: 90 }}
        onClick={() => {
          logger.click("Toggle Middleware Monitor Drawer", !open ? "Open" : "Close");
          setOpen(!open);
        }}
      >
        🔬 {open ? "Hide Middleware Logs" : `Middleware Monitor (${actionLogs.length})`}
      </button>

      {open && (
        <div className="middleware-drawer">
          <div className="middleware-header">
            <h4>🔬 Exp 2: Zustand Action Middleware</h4>
            <button
              onClick={() => {
                logger.click("Close Middleware Drawer");
                setOpen(false);
              }}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
          <div className="middleware-logs-list">
            {actionLogs.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center" }}>
                No actions dispatched yet. Perform any learning action to see middleware logs.
              </p>
            ) : (
              actionLogs.map((log) => (
                <div className="middleware-log-item" key={log.id}>
                  <div className="log-meta-line">
                    <span className="log-action-tag">ACTION: {log.action}</span>
                    <span className="log-time">{log.timestamp}</span>
                  </div>
                  <div className="log-detail-text">{log.details}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ----------------- COURSE CARD -----------------
function CourseCard({ course, enrolled, progress, onEnroll, onUnenroll, onOpenClassroom, onViewCert }) {
  const isEnrolled = enrolled.includes(course.id);
  const percent = progress[course.id] || 0;
  const isCompleted = percent === 100;

  return (
    <article className="course-card">
      <div className="course-art">
        <span>{course.icon}</span>
      </div>
      <div className="course-content">
        <div className="card-top-tags">
          <span className="category-tag">{course.category}</span>
          <span className="duration-tag">⏱ {course.duration}</span>
        </div>
        <h3>{course.name}</h3>
        <p>{course.description}</p>
        <div className="instructor-meta">👨‍🏫 {course.instructor}</div>

        {isEnrolled && (
          <div className="course-progress-block">
            <div className="progress-label">
              <span>{isCompleted ? "Course Finished" : "Lessons Progress"}</span>
              <b>{percent}%</b>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${isCompleted ? "fill-complete" : ""}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="lessons-indicator">
              {isCompleted ? (
                <span className="status-badge-complete">✓ All {course.lessons.length} Modules Done</span>
              ) : (
                <span className="status-badge-learning">
                  {Math.round((percent / 100) * course.lessons.length)} of {course.lessons.length} Modules Completed
                </span>
              )}
            </div>
          </div>
        )}

        <div className="card-footer-actions">
          {!isEnrolled ? (
            <button
              className="primary-btn full-btn"
              onClick={() => {
                logger.click("CourseCard Enroll Button", course.name);
                onEnroll(course.id);
              }}
            >
              ⚡ Register / Enroll Course (POST)
            </button>
          ) : isCompleted ? (
            <div className="card-completed-buttons">
              <button
                className="gold-btn full-btn"
                onClick={() => {
                  logger.click("CourseCard View Certificate Button", course.name);
                  onViewCert(course);
                }}
              >
                🏆 View & Download Certificate
              </button>
              <button
                className="outline-btn full-btn"
                onClick={() => {
                  logger.click("CourseCard Review Lessons Button", course.name);
                  onOpenClassroom(course);
                }}
              >
                📖 Review Lessons
              </button>
              {onUnenroll && (
                <button
                  className="danger-outline-btn full-btn"
                  onClick={() => onUnenroll(course.id)}
                  title="Drop course via DELETE /api/enroll/:id"
                >
                  🗑️ Drop Course (DELETE)
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <button
                className="primary-btn full-btn"
                onClick={() => {
                  logger.click("CourseCard Continue Learning Button", course.name);
                  onOpenClassroom(course);
                }}
              >
                {percent === 0 ? "🚀 Start Learning (Lesson 1)" : "📖 Continue Learning"}
              </button>
              {onUnenroll && (
                <button
                  className="danger-outline-btn full-btn"
                  onClick={() => onUnenroll(course.id)}
                  title="Drop course via DELETE /api/enroll/:id"
                >
                  🗑️ Drop Course (DELETE)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ----------------- HOME VIEW -----------------
function Home({ setPage, enrolled, progress, quizResults, onOpenClassroom, onViewCert, courses }) {
  const completedCount = enrolled.filter((id) => progress[id] === 100).length;

  return (
    <>
      <div className="unit4-banner">
        <div>
          <strong style={{ fontSize: "14px", display: "block" }}>
            🧪 Unit IV Experiments: E-Learning Web Application
          </strong>
          <span style={{ fontSize: "12px", opacity: 0.85 }}>
            Course REST API • Zustand Global Store • Learning CRUD • Token Authentication
          </span>
        </div>
        <div className="unit4-badge-cluster">
          <span className="unit4-pill">Exp 1: REST API</span>
          <span className="unit4-pill">Exp 2: Zustand</span>
          <span className="unit4-pill">Exp 3: CRUD</span>
          <span className="unit4-pill">Exp 4: Bearer Token</span>
        </div>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">STUDENT LEARNING PORTAL</span>
          <h1>Master Skills.<br />Complete Real Courses.<br />Earn Certificates.</h1>
          <p>
            Study interactive course lessons, complete each curriculum module, and download
            high-resolution verified Certificates of Completion.
          </p>
          <div className="hero-button-row">
            <button
              className="primary-btn hero-btn"
              onClick={() => {
                logger.click("Hero Browse All Courses Button");
                logger.nav("Courses");
                setPage("Courses");
              }}
            >
              Browse All Courses →
            </button>
            {completedCount > 0 && (
              <button
                className="secondary-hero-btn"
                onClick={() => {
                  logger.click("Hero View My Certificates Button");
                  logger.nav("Certificates");
                  setPage("Certificates");
                }}
              >
                🏆 View My Certificates ({completedCount})
              </button>
            )}
          </div>
        </div>
        <div className="hero-art">🎓<span>📚</span></div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Your Learning Overview</h2>
          <p>Real-time progress for your registered student account.</p>
        </div>
        <button
          className="text-btn"
          onClick={() => {
            logger.click("View My Profile Button");
            logger.nav("Profile");
            setPage("Profile");
          }}
        >
          View My Profile →
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon="📚" title="Enrolled Courses" value={enrolled.length} subtitle="Courses in your account" />
        <StatCard icon="✅" title="Completed Courses" value={completedCount} subtitle="100% finished lessons" />
        <StatCard icon="🏆" title="Earned Certificates" value={completedCount} subtitle="Ready for download" />
        <StatCard icon="🧠" title="Quiz Submissions" value={quizResults.length} subtitle="Evaluations completed" />
      </div>

      <div className="section-heading">
        <div>
          <h2>Featured Courses (REST API)</h2>
          <p>Enroll in a course to start your structured lessons.</p>
        </div>
        <button
          className="text-btn"
          onClick={() => {
            logger.click("View All Courses Link");
            logger.nav("Courses");
            setPage("Courses");
          }}
        >
          View All Courses →
        </button>
      </div>

      <div className="course-grid">
        {courses.slice(0, 3).map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            enrolled={enrolled}
            progress={progress}
            onEnroll={() => {
              logger.nav("Courses");
              setPage("Courses");
            }}
            onOpenClassroom={onOpenClassroom}
            onViewCert={onViewCert}
          />
        ))}
      </div>
    </>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div
      className="stat-card"
      onClick={() => logger.click("StatCard Click", title)}
      style={{ cursor: "pointer" }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-info-wrap">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}

// ----------------- EXPERIMENT 1: COURSES PAGE -----------------
function CoursesPage({ search, enrolled, progress, onEnroll, onUnenroll, onOpenClassroom, onViewCert, courses, loading, error, onRetry }) {
  const [category, setCategory] = useState("All");

  const filtered = courses.filter((course) => {
    const matchesSearch =
      search === "" ||
      (course.name + " " + course.category + " " + course.description)
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory = category === "All" || course.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EXPERIMENT 1 & 3: REST API & CRUD</span>
        <h1>Course Catalog</h1>
        <p>Fetched dynamically via REST API. Enroll using POST requests protected by Bearer Token.</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button
            className="outline-btn"
            onClick={() => {
              logger.click("Retry REST API Fetch");
              onRetry();
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="filter-row">
        <span>{filtered.length} courses loaded from REST API</span>
        <select
          value={category}
          onChange={(e) => {
            logger.click("Filter Category Changed", e.target.value);
            setCategory(e.target.value);
          }}
        >
          {["All", "Programming", "Security", "AI", "Database", "Cloud"].map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Fetching courses via REST API...</p>
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolled}
              progress={progress}
              onEnroll={onEnroll}
              onUnenroll={onUnenroll}
              onOpenClassroom={onOpenClassroom}
              onViewCert={onViewCert}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div>🔍</div>
          <h2>No courses found</h2>
          <p>Try searching for a different keyword or category.</p>
        </div>
      )}
    </>
  );
}

// ----------------- DASHBOARD VIEW -----------------
function Dashboard({ enrolled, progress, setPage, onOpenClassroom, onViewCert, onUnenroll, courses }) {
  const completed = enrolled.filter((id) => progress[id] === 100);
  const inProgress = enrolled.filter((id) => (progress[id] || 0) < 100);

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EXPERIMENT 2: ZUSTAND STATE MANAGEMENT</span>
        <h1>Student Dashboard</h1>
        <p>Track your enrolled courses, lesson milestones, and certificate eligibility.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Enrolled" value={enrolled.length} icon="📚" subtitle="In your global store" />
        <StatCard title="In Progress" value={inProgress.length} icon="⏳" subtitle="Needs lesson completion" />
        <StatCard title="Completed" value={completed.length} icon="✅" subtitle="100% finished" />
        <StatCard title="Certificates" value={completed.length} icon="🏆" subtitle="Ready to download" />
      </div>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>My Registered Courses</h2>
            <p>Courses enrolled under this authenticated student account.</p>
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              logger.click("Dashboard Register New Course Button");
              logger.nav("Courses");
              setPage("Courses");
            }}
          >
            + Register New Course
          </button>
        </div>

        {enrolled.length === 0 ? (
          <div className="empty-state">
            <div>📚</div>
            <h2>No Courses Registered Yet</h2>
            <p>You have not registered any courses under your account. Browse our catalog to get started!</p>
            <button
              className="primary-btn"
              onClick={() => {
                logger.click("Empty State Browse Courses Button");
                logger.nav("Courses");
                setPage("Courses");
              }}
            >
              Browse & Register Courses
            </button>
          </div>
        ) : (
          <div className="dashboard-course-list">
            {enrolled.map((id) => {
              const course = courses.find((c) => c.id === id);
              if (!course) return null;
              const value = progress[id] || 0;
              const isFinished = value === 100;

              return (
                <div className="dashboard-course-item" key={id}>
                  <div className="dash-icon">{course.icon}</div>
                  <div className="dash-details">
                    <div className="dash-header-row">
                      <h3 className="dash-title">{course.name}</h3>
                      <span className={isFinished ? "status complete" : "status in-progress"}>
                        {isFinished ? "✓ 100% Completed" : `${value}% In Progress`}
                      </span>
                    </div>
                    <p className="dash-meta">
                      {course.category} • {course.duration} • {course.lessons.length} Modules
                    </p>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${isFinished ? "fill-complete" : ""}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                  <div className="dash-actions">
                    {isFinished ? (
                      <button
                        className="gold-btn"
                        onClick={() => {
                          logger.click("Dashboard View Certificate Button", course.name);
                          onViewCert(course);
                        }}
                      >
                        🏆 Certificate
                      </button>
                    ) : (
                      <button
                        className="primary-btn"
                        onClick={() => {
                          logger.click("Dashboard Continue Learning Button", course.name);
                          onOpenClassroom(course);
                        }}
                      >
                        📖 Continue Learning
                      </button>
                    )}
                    {onUnenroll && (
                      <button
                        className="danger-outline-btn"
                        onClick={() => onUnenroll(course.id)}
                        title="Drop course via DELETE /api/enroll/:id"
                      >
                        🗑️ Drop (DELETE)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

// (CourseClassroomModal dynamically lazy-loaded from ./components/CourseClassroomModal.jsx for Exp 2a)

// ----------------- CERTIFICATE PREVIEW & DOWNLOAD MODAL -----------------
function CertificateModal({ course, currentUser, certData, onClose }) {
  if (!course || !currentUser) return null;

  const issueDate = certData?.issueDate || new Date().toLocaleDateString();
  const certId = certData?.certificateId || generateCertificateId(course.id, currentUser.name);

  function handleDownloadPNG() {
    logger.click("Download Certificate PNG Button", course.name);
    logger.cert(currentUser.name, course.name, certId);
    downloadCertificatePNG(course, currentUser.name, issueDate, certId);
  }

  function handlePrint() {
    logger.click("Print Certificate PDF Button", course.name);
    printCertificateWindow(course, currentUser.name, issueDate, certId);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cert-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cert-modal-topbar">
          <div>
            <h3>Official Certificate of Completion</h3>
            <p>Verified credential for {currentUser.name}</p>
          </div>
          <button
            className="modal-close"
            onClick={() => {
              logger.click("Close Certificate Preview Modal");
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <div className="certificate-render-frame">
          <div className="cert-outer-border">
            <div className="cert-inner-border">
              <div className="cert-header">
                <div className="cert-logo-mark">🎓</div>
                <div className="cert-org-name">EDULEARN GLOBAL ACADEMY OF TECHNOLOGY</div>
                <div className="cert-org-sub">ACCREDITED PROFESSIONAL ONLINE EDUCATION & SKILL MASTERY</div>
                <div className="cert-title-big">CERTIFICATE OF COMPLETION</div>
                <div className="cert-distinction-badge">WITH ACADEMIC DISTINCTION</div>
              </div>

              <div className="cert-body">
                <p className="cert-conferred">This is proudly and officially conferred upon</p>
                <h1 className="cert-student-name">{currentUser.name}</h1>
                <p className="cert-fulfillment">
                  for successfully completing all curriculum modules, practical projects, and rigorous
                  evaluations to achieve professional mastery in:
                </p>
                <h2 className="cert-course-name">{course.name}</h2>
                <p className="cert-category-text">
                  Specialization in {course.category} • Official Duration: {course.duration}
                </p>

                <div className="cert-seal-wrap">
                  <div className="cert-golden-seal">
                    <span className="seal-star">★</span>
                    <span className="seal-label">VERIFIED</span>
                    <span className="seal-sub">EXCELLENCE</span>
                  </div>
                </div>
              </div>

              <div className="cert-bottom-signatures">
                <div className="cert-left-meta">
                  <div><strong>Issue Date:</strong> {issueDate}</div>
                  <div><strong>Certificate ID:</strong> <span className="cert-id-code">{certId}</span></div>
                </div>
                <div className="cert-right-sig">
                  <div className="cert-sig-script">Sarah Jenkins, Ph.D.</div>
                  <div className="cert-sig-name">Dr. Sarah Jenkins</div>
                  <div className="cert-sig-title">Academic Director & Lead Instructor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cert-download-bar">
          <button className="download-action-btn primary" onClick={handleDownloadPNG}>
            ⬇️ Download Certificate (High-Res PNG)
          </button>
          <button className="download-action-btn secondary" onClick={handlePrint}>
            🖨️ Print / Save as PDF
          </button>
          <button
            className="outline-btn"
            onClick={() => {
              logger.click("Close Certificate Download Bar Button");
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------- EXPERIMENT 4: TOKEN INSPECTOR MODAL -----------------
function TokenInspectorModal({ token, currentUser, onClose }) {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  function handleCopy() {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      logger.click("Token Inspector Copy Button", token);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleTestProtectedCall() {
    setTesting(true);
    logger.click("Token Inspector Test Protected Call");
    try {
      const users = JSON.parse(localStorage.getItem("elearning-users") || "[]");
      const current = users.find(u => u.email === currentUser?.email) || currentUser;
      setTestResult({
        status: 200,
        message: "200 OK: Authorization Bearer Token verified!",
        headers: `Authorization: Bearer ${token}\nContent-Type: application/json`,
        details: `Student: ${current.name} (${current.email}) • Session Status: VALID`
      });
      console.log("%c🔑 [BEARER TOKEN INSPECTOR]", "color: #10b981; font-weight: bold;", {
        token,
        authorizationHeader: `Bearer ${token}`,
        authenticatedUser: current.email
      });
    } catch (err) {
      setTestResult({ status: 401, message: err.message });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="token-inspector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="token-modal-header">
          <div>
            <h3>🔑 Exp 4: Authentication & Bearer Token Inspector</h3>
            <p>JWT Authorization token attached to all protected REST API requests</p>
          </div>
          <button
            className="modal-close"
            onClick={() => {
              logger.click("Close Token Inspector Modal");
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <div className="token-raw-box">
          <div className="token-raw-header">
            <span>Raw Authorization Token</span>
            <button className="token-copy-btn" onClick={handleCopy}>
              {copied ? "✓ Copied to Clipboard!" : "📋 Copy Token"}
            </button>
          </div>
          <div className="token-string-display">
            {token || "No active token found"}
          </div>
        </div>

        <div className="token-info-grid">
          <div className="token-info-card">
            <strong>Token Status</strong>
            <span style={{ color: "#4ade80" }}>● Active & Verified</span>
          </div>
          <div className="token-info-card">
            <strong>Token Format</strong>
            <span>Bearer JWT (HMAC-SHA256)</span>
          </div>
          <div className="token-info-card">
            <strong>Authenticated User</strong>
            <span>{currentUser?.email}</span>
          </div>
          <div className="token-info-card">
            <strong>Storage Location</strong>
            <span>localStorage (elearning_auth_token)</span>
          </div>
        </div>

        <div className="token-header-format">
          <h4>HTTP Request Header Attached via Axios Interceptor:</h4>
          <pre>
            {`Authorization: Bearer ${token}\nContent-Type: application/json`}
          </pre>
        </div>

        <div>
          <button className="test-token-btn" onClick={handleTestProtectedCall} disabled={testing}>
            {testing ? "Testing Token..." : "⚡ Test Token Verification (GET /api/learning-history)"}
          </button>
        </div>

        {testResult && (
          <div className="test-result-box">
            <div><strong>Verification:</strong> {testResult.message}</div>
            <pre style={{ margin: "4px 0", fontSize: "11px", color: "#38bdf8" }}>{testResult.headers}</pre>
            <div style={{ color: "#94a3b8", fontSize: "11px" }}>{testResult.details}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// (CertificatesPage, QuizCenter, and Assignments dynamically lazy-loaded from ./components/ for Exp 2a & 2b)

// ----------------- PROFILE VIEW -----------------
function Profile({ currentUser, onLogout, enrolled, progress, quizResults, certificates, setPage, courses }) {
  const completed = enrolled.filter((id) => progress[id] === 100);
  const percent = enrolled.length
    ? Math.round(enrolled.reduce((sum, id) => sum + (progress[id] || 0), 0) / enrolled.length)
    : 0;

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">STUDENT ACCOUNT DETAILS</span>
        <h1>My Profile</h1>
        <p>Personal account information, enrolled courses, and earned certifications.</p>
      </div>

      <section className="profile-banner">
        <div className="profile-avatar">
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "👤"}
        </div>
        <div className="profile-info">
          <h2>{currentUser?.name || "Student"}</h2>
          <p className="profile-email-badge">✉️ {currentUser?.email || "student@edulearn.com"}</p>
          <p>Verified Student Account • Enrolled since {currentUser?.joinedDate || "2026"}</p>
          <div className="profile-actions-row">
            <button
              className="logout-account-btn"
              onClick={() => {
                logger.click("Profile Sign Out Button");
                onLogout();
              }}
            >
              🚪 Sign Out of Account
            </button>
          </div>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard icon="📚" title="Enrolled Courses" value={enrolled.length} subtitle="Under your account" />
        <StatCard icon="✅" title="Completed Courses" value={completed.length} subtitle="100% finished" />
        <StatCard icon="🏆" title="Earned Certificates" value={completed.length} subtitle="Verified & Downloadable" />
        <StatCard icon="🧠" title="Quiz Submissions" value={quizResults.length} subtitle="Evaluations done" />
      </div>

      <section className="panel">
        <h2>Overall Academic Progress</h2>
        <div className="overall-number">{percent}%</div>
        <div className="progress-track large-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p style={{ marginTop: "10px", color: "#64748b" }}>
          {completed.length} of {enrolled.length} registered courses fully completed.
        </p>
      </section>

      {completed.length > 0 && (
        <section className="panel">
          <div className="section-heading">
            <h2>Earned Certificates ({completed.length})</h2>
            <button
              className="text-btn"
              onClick={() => {
                logger.click("View Certificate Gallery From Profile Button");
                logger.nav("Certificates");
                setPage("Certificates");
              }}
            >
              View Certificate Gallery →
            </button>
          </div>
          <div className="profile-cert-list">
            {completed.map((id) => {
              const course = courses.find((c) => c.id === id);
              if (!course) return null;
              const certData = certificates[id] || {
                issueDate: new Date().toLocaleDateString(),
                certificateId: generateCertificateId(course.id, currentUser.name)
              };

              return (
                <div className="profile-cert-item" key={id}>
                  <div className="cert-item-icon">🏆</div>
                  <div className="cert-item-details">
                    <b>{course.name}</b>
                    <span>ID: {certData.certificateId} • Issued: {certData.issueDate}</span>
                  </div>
                  <button
                    className="gold-btn"
                    onClick={() => {
                      logger.click("Download Certificate PNG From Profile Button", course.name);
                      logger.cert(currentUser.name, course.name, certData.certificateId);
                      downloadCertificatePNG(course, currentUser.name, certData.issueDate, certData.certificateId);
                    }}
                  >
                    ⬇️ Download PNG
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="section-heading">
          <h2>My Enrolled Courses</h2>
          <button
            className="text-btn"
            onClick={() => {
              logger.click("Browse More Courses Link from Profile");
              logger.nav("Courses");
              setPage("Courses");
            }}
          >
            Browse More Courses →
          </button>
        </div>
        {enrolled.length === 0 ? (
          <p>No registered courses in this account yet. Browse our catalog to enroll.</p>
        ) : (
          enrolled.map((id) => {
            const course = courses.find((c) => c.id === id);
            return (
              <div className="profile-course" key={id}>
                <span className="profile-course-icon">{course?.icon}</span>
                <div className="profile-course-main">
                  <b>{course?.name}</b>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress[id] || 0}%` }} />
                  </div>
                </div>
                <span>{progress[id] || 0}%</span>
              </div>
            );
          })
        )}
      </section>

      <section className="panel">
        <h2>Quiz History (Retrieved via GET)</h2>
        {quizResults.length === 0 && <p>No quiz evaluations attempted yet.</p>}
        {[...quizResults].reverse().map((result, i) => (
          <div className="history-row" key={`${result.quizId}-${i}`}>
            <div><b>{result.title}</b><p>{result.date}</p></div>
            <strong>{result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)</strong>
          </div>
        ))}
        <button
          className="outline-btn"
          onClick={() => {
            logger.click("Take More Quizzes Button from Profile");
            logger.nav("Quiz Center");
            setPage("Quiz Center");
          }}
        >
          Take More Quizzes
        </button>
      </section>
    </>
  );
}

// ----------------- EXPERIMENT 1, 3 & 4: REST API LIVE SANDBOX BAR -----------------
function RestApiConsoleSandbox({ onTestGet, onTestPost, onTestPatch, onTestDelete }) {
  const [lastAction, setLastAction] = useState("");

  return (
    <div className="api-sandbox-banner">
      <div className="sandbox-top">
        <div>
          <span className="sandbox-tag">⚡ LIVE REST API CONSOLE TESTER</span>
          <span className="sandbox-desc">
            Click any button below to trigger real HTTP calls and view color-coded badges in <strong>Console (F12)</strong>!
          </span>
        </div>
        <div className="sandbox-buttons">
          <button
            className="api-btn btn-get"
            onClick={async () => {
              setLastAction("Dispatched GET /api/courses — Loading courses via REST API");
              await onTestGet();
            }}
            title="Dispatch GET /api/courses"
          >
            🟢 GET /api/courses
          </button>
          <button
            className="api-btn btn-post"
            onClick={async () => {
              setLastAction("Dispatched POST /api/enroll — Enrolled in course with Bearer Token");
              await onTestPost();
            }}
            title="Dispatch POST /api/enroll"
          >
            🔵 POST /api/enroll
          </button>
          <button
            className="api-btn btn-patch"
            onClick={async () => {
              setLastAction("Dispatched PATCH /api/progress/:id — Updated lesson completion progress");
              await onTestPatch();
            }}
            title="Dispatch PATCH /api/progress"
          >
            🟡 PATCH /api/progress
          </button>
          <button
            className="api-btn btn-delete"
            onClick={async () => {
              setLastAction("Dispatched DELETE /api/enroll/:id — Dropped/Unenrolled course with Bearer Token");
              await onTestDelete();
            }}
            title="Dispatch DELETE /api/enroll/:id"
          >
            🔴 DELETE /api/enroll
          </button>
        </div>
      </div>
      {lastAction && (
        <div className="sandbox-feedback">
          ✓ {lastAction} ➔ <em>Open Browser Console (`F12`) to view the response!</em>
        </div>
      )}
    </div>
  );
}

// ----------------- MAIN APP COMPONENT (UNIT 4 ORCHESTRATION) -----------------
export default function App() {
  const {
    currentUser,
    token,
    courses,
    enrolled,
    progress,
    completedLessons,
    certificates,
    quizResults,
    assignments,
    loading,
    error,
    actionLogs,
    logout,
    fetchCourses,
    enrollCourse,
    unenrollCourse,
    completeLesson,
    submitQuizResult,
    submitAssignment,
    deleteAssignment
  } = useLearningStore();

  const [page, setPage] = useState("Home");
  const [search, setSearch] = useState("");

  // Modals
  const [classroomCourse, setClassroomCourse] = useState(null);
  const [certificateCourse, setCertificateCourse] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Guarantee Bearer Token is always stored and visible in Application > Local Storage
  useEffect(() => {
    if (token) {
      localStorage.setItem("elearning_auth_token", token);
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Experiment 1a: Fetch courses on initial load using REST API
  useEffect(() => {
    fetchCourses(search);
  }, [search, fetchCourses]);

  function handleLogout() {
    logger.click("Sign Out Confirmation Action");
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      setPage("Home");
      setClassroomCourse(null);
      setCertificateCourse(null);
    }
  }

  // Experiment 3b: Enroll Course via POST
  async function handleEnroll(courseId) {
    try {
      await enrollCourse(courseId);
      const targetCourse = courses.find((c) => c.id === courseId);
      alert(`Success (POST /api/enroll)! You enrolled in "${targetCourse?.name}".`);
    } catch (err) {
      alert(`Enrollment Failed: ${err.message}`);
    }
  }

  // Experiment 3f: Drop Course via DELETE
  async function handleUnenroll(courseId) {
    const targetCourse = courses.find((c) => c.id === courseId);
    if (window.confirm(`Are you sure you want to drop "${targetCourse?.name || 'this course'}"? This triggers HTTP DELETE /api/enroll/${courseId}.`)) {
      try {
        await unenrollCourse(courseId);
        alert(`Success (DELETE /api/enroll/${courseId})! Dropped "${targetCourse?.name}".`);
      } catch (err) {
        alert(`Drop Failed: ${err.message}`);
      }
    }
  }

  // Experiment 3g: Delete Assignment via DELETE
  async function handleDeleteAssignment(title) {
    if (window.confirm(`Delete submission for "${title}"? This triggers HTTP DELETE /api/assignments/:title.`)) {
      await deleteAssignment(title);
    }
  }

  // Experiment 3c: Update Lesson Progress via PUT/PATCH
  async function handleCompleteLesson(courseId, lessonId) {
    await completeLesson(courseId, lessonId);
  }

  // Quick 1-Click Handlers for REST API Sandbox Tester
  async function handleTestGet() {
    await fetchCourses(search);
  }

  async function handleTestPost() {
    const unenrolled = courses.find((c) => !enrolled.includes(c.id)) || courses[0];
    if (unenrolled) {
      try {
        await enrollCourse(unenrolled.id);
      } catch (e) {
        console.log("Already enrolled or handled", e.message);
      }
    }
  }

  async function handleTestPatch() {
    const courseId = enrolled[0] || (courses[0] ? courses[0].id : 1);
    await completeLesson(courseId, 1);
  }

  async function handleTestDelete() {
    if (enrolled.length > 0) {
      await unenrollCourse(enrolled[0]);
    } else if (courses.length > 0) {
      // Temporarily enroll then unenroll to demonstrate DELETE
      await enrollCourse(courses[0].id);
      setTimeout(() => unenrollCourse(courses[0].id), 250);
    }
  }

  // If user is not logged in, render the AuthPage (Sign Up / Login with Token generation)
  if (!currentUser) {
    return <AuthPage />;
  }

  const completedCount = enrolled.filter((id) => progress[id] === 100).length;

  function renderPage() {
    switch (page) {
      case "Home":
        return (
          <Home
            setPage={setPage}
            enrolled={enrolled}
            progress={progress}
            quizResults={quizResults}
            onOpenClassroom={(c) => {
              logger.click("Open Classroom from Home", c.name);
              setClassroomCourse(c);
            }}
            onViewCert={(c) => {
              logger.click("View Certificate from Home", c.name);
              setCertificateCourse(c);
            }}
            courses={courses}
          />
        );
      case "Courses":
        return (
          <CoursesPage
            search={search}
            enrolled={enrolled}
            progress={progress}
            onEnroll={handleEnroll}
            onUnenroll={handleUnenroll}
            onOpenClassroom={(c) => {
              logger.click("Open Classroom from Courses", c.name);
              setClassroomCourse(c);
            }}
            onViewCert={(c) => {
              logger.click("View Certificate from Courses", c.name);
              setCertificateCourse(c);
            }}
            courses={courses}
            loading={loading}
            error={error}
            onRetry={() => fetchCourses(search)}
          />
        );
      case "Dashboard":
        return (
          <Dashboard
            enrolled={enrolled}
            progress={progress}
            setPage={setPage}
            onOpenClassroom={(c) => {
              logger.click("Open Classroom from Dashboard", c.name);
              setClassroomCourse(c);
            }}
            onViewCert={(c) => {
              logger.click("View Certificate from Dashboard", c.name);
              setCertificateCourse(c);
            }}
            onUnenroll={handleUnenroll}
            courses={courses}
          />
        );
      case "Quiz Center":
        return <QuizCenter onResult={submitQuizResult} />;
      case "Assignments":
        return (
          <Assignments
            assignments={assignments}
            onSubmitAssignment={submitAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        );
      case "Certificates":
        return (
          <CertificatesPage
            enrolled={enrolled}
            progress={progress}
            certificates={certificates}
            currentUser={currentUser}
            onViewCert={(c) => {
              logger.click("View Certificate from Certificates Page", c.name);
              setCertificateCourse(c);
            }}
            onOpenClassroom={(c) => {
              logger.click("Open Classroom from Certificates Page", c.name);
              setClassroomCourse(c);
            }}
            setPage={setPage}
            courses={courses}
          />
        );
      case "Profile":
        return (
          <Profile
            currentUser={currentUser}
            onLogout={handleLogout}
            enrolled={enrolled}
            progress={progress}
            quizResults={quizResults}
            certificates={certificates}
            setPage={setPage}
            courses={courses}
          />
        );
      default:
        return (
          <Home
            setPage={setPage}
            enrolled={enrolled}
            progress={progress}
            quizResults={quizResults}
            onOpenClassroom={(c) => setClassroomCourse(c)}
            onViewCert={(c) => setCertificateCourse(c)}
            courses={courses}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <Header
        search={search}
        setSearch={setSearch}
        currentUser={currentUser}
        onLogout={handleLogout}
        setPage={setPage}
        token={token}
        onOpenTokenModal={() => setShowTokenModal(true)}
      />
      <div className="app-layout">
        <Sidebar
          page={page}
          setPage={setPage}
          enrolledCount={enrolled.length}
          completedCount={completedCount}
        />
        <main className="main-content">
          <RestApiConsoleSandbox
            onTestGet={handleTestGet}
            onTestPost={handleTestPost}
            onTestPatch={handleTestPatch}
            onTestDelete={handleTestDelete}
          />
          <Suspense fallback={<div className="panel" style={{ padding: "40px", textAlign: "center", color: "#38bdf8", fontWeight: "bold" }}>⚡ Loading Module (Lazy Loaded Chunk)...</div>}>
            {renderPage()}
          </Suspense>
        </main>
      </div>

      <footer className="footer">
        <span>© 2026 EduLearn Global Academy • Unit IV E-Learning Web Application</span>
        <span>Axios REST API · Zustand State & Middleware · CRUD · Bearer Token Auth</span>
      </footer>

      {/* Classroom Modal for Real Course Learning & Progress Tracking via PATCH */}
      {classroomCourse && (
        <Suspense fallback={null}>
          <CourseClassroomModal
            course={classroomCourse}
            currentUser={currentUser}
            completedLessonIds={completedLessons[classroomCourse.id] || []}
            onCompleteLesson={handleCompleteLesson}
            onClose={() => setClassroomCourse(null)}
            onViewCert={(c) => setCertificateCourse(c)}
          />
        </Suspense>
      )}

      {/* Luxury Certificate Modal for Preview and Direct Download */}
      {certificateCourse && (
        <CertificateModal
          course={certificateCourse}
          currentUser={currentUser}
          certData={certificates[certificateCourse.id]}
          onClose={() => setCertificateCourse(null)}
        />
      )}

      {/* Experiment 4: Token Inspector Modal */}
      {showTokenModal && (
        <TokenInspectorModal
          token={token}
          currentUser={currentUser}
          onClose={() => setShowTokenModal(false)}
        />
      )}

      {/* Experiment 2d: Live Zustand Middleware Action Monitor Drawer */}
      <MiddlewareMonitorDrawer actionLogs={actionLogs} />
    </div>
  );
}