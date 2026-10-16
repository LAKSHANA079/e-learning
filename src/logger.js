// Comprehensive Console Logger for Web Lab Demonstration
const badgeStyle = (bgColor, textColor = "#ffffff") =>
  `background: ${bgColor}; color: ${textColor}; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 11px;`;

const textStyle = "color: #0f172a; font-weight: 600; font-size: 11px;";

export const logger = {
  click: (elementName, details = "") => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c🖱️ USER CLICK%c [${time}] Clicked: "${elementName}"`,
      badgeStyle("#8b5cf6"),
      textStyle,
      details ? details : ""
    );
  },

  nav: (pageName) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c🧭 NAVIGATION%c [${time}] Switched View to: "${pageName}"`,
      badgeStyle("#06b6d4"),
      textStyle
    );
  },

  apiReq: (method, url, data = null) => {
    const time = new Date().toLocaleTimeString();
    const upperMethod = method.toUpperCase();
    const methodColors = {
      GET: "#2563eb",
      POST: "#10b981",
      PATCH: "#f59e0b",
      PUT: "#d97706",
      DELETE: "#ef4444"
    };
    const color = methodColors[upperMethod] || "#6366f1";
    const token = localStorage.getItem("elearning_auth_token") || localStorage.getItem("token");

    console.log(
      `%c⚡ REST API ${upperMethod}%c [${time}] ${url} %c${token ? "🔑 Bearer Token Attached" : "⚠️ No Token"}`,
      badgeStyle(color),
      textStyle,
      "color: #059669; font-weight: bold; font-size: 10px;"
    );
    if (data) console.log(`   ↳ Payload:`, data);
  },

  apiRes: (method, url, status = 200, responseData = null) => {
    const time = new Date().toLocaleTimeString();
    const upperMethod = method.toUpperCase();
    const statusColor = status >= 400 ? "#ef4444" : "#059669";

    console.log(
      `%c✅ ${status} OK (${upperMethod})%c [${time}] ${url}`,
      badgeStyle(statusColor),
      textStyle
    );
    if (responseData) console.log(`   ↳ Response:`, responseData);
  },

  storeAction: (actionName, payload = null) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c🧠 ZUSTAND ACTION%c [${time}] Action: ${actionName}`,
      badgeStyle("#2563eb"),
      textStyle,
      payload ? payload : ""
    );
  },

  auth: (eventName, userEmail, token = null) => {
    const time = new Date().toLocaleTimeString();
    console.group(
      `%c🔑 AUTH EVENT%c [${time}] ${eventName}: ${userEmail}`,
      badgeStyle("#f59e0b", "#78350f"),
      textStyle
    );
    if (token) console.log("Authorization Bearer Token:", token);
    console.groupEnd();
  },

  enroll: (courseName, courseId) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c📚 ENROLLMENT%c [${time}] Enrolled in Course #${courseId}: "${courseName}"`,
      badgeStyle("#3b82f6"),
      textStyle
    );
  },

  lesson: (courseName, moduleIdx, moduleTitle) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c📖 LESSON DONE%c [${time}] ${courseName} - Module ${moduleIdx}: "${moduleTitle}" marked 100% complete`,
      badgeStyle("#10b981"),
      textStyle
    );
  },

  quiz: (quizTitle, score, total) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `%c✍️ QUIZ EVAL%c [${time}] "${quizTitle}" Evaluated: ${score}/${total} (${Math.round((score / total) * 100)}%)`,
      badgeStyle("#ea580c"),
      textStyle
    );
  },

  cert: (studentName, courseName, certId) => {
    const time = new Date().toLocaleTimeString();
    console.group(
      `%c🏆 CERTIFICATE%c [${time}] Certificate Issued & Downloaded for "${courseName}"`,
      badgeStyle("#d97706"),
      textStyle
    );
    console.log("Candidate Name:", studentName);
    console.log("Certificate ID:", certId);
    console.log("Format: High-Resolution Canvas PNG (1600x1100)");
    console.groupEnd();
  }
};
