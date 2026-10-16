import axios from "axios";
import { courseData } from "../courseData";
import { logger } from "../logger";

// Base Axios instance
export const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Cache map for in-memory caching with TTL (Experiment 2 requirement)
const apiCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Experiment 4: Attach the Bearer Token to all protected learning API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("elearning_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.apiReq(config.method, config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and unauthorized access
api.interceptors.response.use(
  (response) => {
    logger.apiRes(response.config.method, response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("[API Response Error]", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Helper to simulate realistic async network delay
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to verify Bearer Token for protected endpoints
function verifyTokenHeader() {
  const token = localStorage.getItem("elearning_auth_token");
  if (!token) {
    const err = new Error("401 Unauthorized: Valid Bearer Token required to perform this protected operation.");
    err.status = 401;
    throw err;
  }
  return token;
}

// ----------------- EXPERIMENT 1, 3 & 4 REST API METHODS -----------------
export const learningApi = {
  // Experiment 4a: Student Login with Authentication API
  async login(email, password) {
    logger.apiReq("POST", "/api/auth/login", { email });
    await delay(250);
    const users = JSON.parse(localStorage.getItem("elearning-users") || "[]");
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      const err = new Error("Invalid email or password.");
      err.status = 400;
      throw err;
    }

    const token = `jwt_token_${btoa(user.email)}_${Date.now()}`;
    localStorage.setItem("elearning_auth_token", token);
    const res = {
      success: true,
      user: { name: user.name, email: user.email, joinedDate: user.joinedDate },
      token
    };
    logger.apiRes("POST", "/api/auth/login", 200, res);
    logger.auth("LOGIN SUCCESS", user.email, token);
    return res;
  },

  // Experiment 4a: Student Signup / Registration API
  async signup(name, email, password) {
    logger.apiReq("POST", "/api/auth/signup", { name, email });
    await delay(300);
    const users = JSON.parse(localStorage.getItem("elearning-users") || "[]");
    const trimmedEmail = email.toLowerCase().trim();

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      const err = new Error("Account already exists with this email. Please log in.");
      err.status = 409;
      throw err;
    }

    const newUser = {
      name: name.trim(),
      email: trimmedEmail,
      password,
      joinedDate: new Date().toLocaleDateString()
    };

    users.push(newUser);
    localStorage.setItem("elearning-users", JSON.stringify(users));

    const token = `jwt_token_${btoa(trimmedEmail)}_${Date.now()}`;
    localStorage.setItem("elearning_auth_token", token);
    const res = {
      success: true,
      user: { name: newUser.name, email: newUser.email, joinedDate: newUser.joinedDate },
      token
    };
    logger.apiRes("POST", "/api/auth/signup", 201, res);
    logger.auth("SIGNUP SUCCESS", newUser.email, token);
    return res;
  },

  // Experiment 1a, b: GET /api/courses (with caching & search/filter)
  async getCourses(search = "", category = "All") {
    logger.apiReq("GET", `/api/courses?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
    await delay(150);
    const cacheKey = `courses_${search}_${category}`;
    const cached = apiCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("%c⚡ [CACHE HIT] courses loaded from memory cache", "color: #10b981; font-weight: bold;");
      logger.apiRes("GET", `/api/courses (FROM CACHE)`, 200, { count: cached.data.length });
      return cached.data;
    }

    const filtered = courseData.filter((c) => {
      const matchesSearch =
        search === "" ||
        (c.name + " " + c.category + " " + c.description).toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesSearch && matchesCategory;
    });

    apiCache.set(cacheKey, { timestamp: Date.now(), data: filtered });
    logger.apiRes("GET", `/api/courses`, 200, { count: filtered.length, category });
    return filtered;
  },

  // Experiment 1c, d: GET /api/courses/:id
  async getCourseById(courseId) {
    logger.apiReq("GET", `/api/courses/${courseId}`);
    await delay(120);
    const course = courseData.find((c) => c.id === Number(courseId));
    if (!course) {
      const err = new Error(`Course #${courseId} not found.`);
      err.status = 404;
      throw err;
    }
    logger.apiRes("GET", `/api/courses/${courseId}`, 200, { name: course.name });
    return course;
  },

  // Experiment 3b: POST /api/enroll (Protected by Token)
  async enrollCourse(email, courseId) {
    verifyTokenHeader();
    logger.apiReq("POST", `/api/enroll`, { email, courseId });
    await delay(200);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw
      ? JSON.parse(raw)
      : { enrolled: [], progress: {}, completedLessons: {}, certificates: {}, quizResults: [], assignments: [] };

    if (!data.enrolled.includes(courseId)) {
      data.enrolled.push(courseId);
      data.progress[courseId] = 0;
      data.completedLessons[courseId] = [];
      localStorage.setItem(userKey, JSON.stringify(data));
    }

    const res = { success: true, enrolled: data.enrolled, progress: data.progress };
    logger.apiRes("POST", `/api/enroll`, 201, res);
    return res;
  },

  // Experiment 3c: PUT/PATCH /api/progress/:courseId (Update learning progress)
  async updateProgress(email, courseId, lessonId) {
    verifyTokenHeader();
    logger.apiReq("PATCH", `/api/progress/${courseId}`, { email, lessonId });
    await delay(180);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw
      ? JSON.parse(raw)
      : { enrolled: [], progress: {}, completedLessons: {}, certificates: {}, quizResults: [], assignments: [] };

    const currentLessons = data.completedLessons[courseId] || [];
    if (!currentLessons.includes(lessonId)) {
      currentLessons.push(lessonId);
    }
    data.completedLessons[courseId] = currentLessons;

    const course = courseData.find((c) => c.id === Number(courseId));
    const totalLessons = course ? course.lessons.length : 5;
    const newPercent = Math.round((currentLessons.length / totalLessons) * 100);
    data.progress[courseId] = newPercent;

    if (newPercent === 100 && !data.certificates[courseId]) {
      data.certificates[courseId] = {
        issueDate: new Date().toLocaleDateString(),
        certificateId: `EDU-2026-C${courseId}-${Math.floor(10000 + Math.random() * 90000)}`
      };
    }

    localStorage.setItem(userKey, JSON.stringify(data));
    const res = {
      success: true,
      courseId,
      progress: newPercent,
      completedLessons: currentLessons,
      certificates: data.certificates
    };
    logger.apiRes("PATCH", `/api/progress/${courseId}`, 200, res);
    return res;
  },

  // Experiment 3d: POST /api/quizzes/submit
  async submitQuiz(email, quizResult) {
    verifyTokenHeader();
    logger.apiReq("POST", `/api/quizzes/submit`, { email, quizResult });
    await delay(180);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw ? JSON.parse(raw) : { quizResults: [] };

    data.quizResults = data.quizResults || [];
    data.quizResults.push(quizResult);
    localStorage.setItem(userKey, JSON.stringify(data));

    const res = { success: true, quizResults: data.quizResults };
    logger.apiRes("POST", `/api/quizzes/submit`, 201, res);
    return res;
  },

  // Experiment 3d: POST /api/assignments/submit
  async submitAssignment(email, assignment) {
    verifyTokenHeader();
    logger.apiReq("POST", `/api/assignments/submit`, { email, assignment });
    await delay(200);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw ? JSON.parse(raw) : { assignments: [] };

    data.assignments = data.assignments || [];
    data.assignments.push({
      ...assignment,
      submittedAt: new Date().toLocaleDateString(),
      status: "Submitted & Evaluated"
    });
    localStorage.setItem(userKey, JSON.stringify(data));

    const res = { success: true, assignments: data.assignments };
    logger.apiRes("POST", `/api/assignments/submit`, 201, res);
    return res;
  },

  // Experiment 3e: GET /api/learning-history
  async getLearningHistory(email) {
    verifyTokenHeader();
    logger.apiReq("GET", `/api/learning-history?email=${encodeURIComponent(email)}`);
    await delay(150);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const res = raw
      ? JSON.parse(raw)
      : { enrolled: [], progress: {}, completedLessons: {}, certificates: {}, quizResults: [], assignments: [] };
    logger.apiRes("GET", `/api/learning-history`, 200, {
      enrolledCount: res.enrolled?.length || 0,
      quizzesCount: res.quizResults?.length || 0
    });
    return res;
  },

  // Experiment 3f: DELETE /api/enroll/:courseId (Drop Course / Unenroll - Protected by Bearer Token)
  async unenrollCourse(email, courseId) {
    verifyTokenHeader();
    logger.apiReq("DELETE", `/api/enroll/${courseId}`, { email, courseId });
    await delay(200);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw
      ? JSON.parse(raw)
      : { enrolled: [], progress: {}, completedLessons: {}, certificates: {}, quizResults: [], assignments: [] };

    data.enrolled = (data.enrolled || []).filter((id) => Number(id) !== Number(courseId));
    if (data.progress) delete data.progress[courseId];
    if (data.completedLessons) delete data.completedLessons[courseId];
    if (data.certificates) delete data.certificates[courseId];

    localStorage.setItem(userKey, JSON.stringify(data));

    const res = {
      success: true,
      message: `Course #${courseId} dropped successfully.`,
      enrolled: data.enrolled,
      progress: data.progress || {}
    };
    logger.apiRes("DELETE", `/api/enroll/${courseId}`, 200, res);
    return res;
  },

  // Experiment 3g: DELETE /api/assignments/:title (Delete practical assignment)
  async deleteAssignment(email, assignmentTitle) {
    verifyTokenHeader();
    logger.apiReq("DELETE", `/api/assignments/${encodeURIComponent(assignmentTitle)}`, { email });
    await delay(180);

    const userKey = `elearning-user-data_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(userKey);
    const data = raw ? JSON.parse(raw) : { assignments: [] };

    data.assignments = (data.assignments || []).filter((a) => a.title !== assignmentTitle);
    localStorage.setItem(userKey, JSON.stringify(data));

    const res = { success: true, message: `Assignment "${assignmentTitle}" deleted.`, assignments: data.assignments };
    logger.apiRes("DELETE", `/api/assignments/${encodeURIComponent(assignmentTitle)}`, 200, res);
    return res;
  }
};
