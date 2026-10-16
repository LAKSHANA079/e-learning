import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { learningApi } from "../api/learningApi";
import { logger } from "../logger";

// Experiment 2d: Middleware to monitor and log learning actions
const actionLoggerMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      const prevState = get();
      set(...args);
      const nextState = get();
      logger.storeAction("STATE_TRANSITION", {
        enrolledCount: nextState.enrolled?.length,
        loading: nextState.loading
      });
    },
    get,
    api
  );

export const useLearningStore = create(
  actionLoggerMiddleware(
    persist(
      (set, get) => ({
        // State
        courses: [],
        enrolled: [],
        progress: {},
        completedLessons: {},
        certificates: {},
        quizResults: [],
        assignments: [],
        currentUser: null,
        token: null,
        loading: false,
        error: null,
        actionLogs: [],

        // Helper to record action in middleware monitor and in console
        logAction: (actionName, details) => {
          const newLog = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toLocaleTimeString(),
            action: actionName,
            details: typeof details === "string" ? details : JSON.stringify(details)
          };
          logger.storeAction(actionName, details);
          set((state) => ({
            actionLogs: [newLog, ...state.actionLogs.slice(0, 19)]
          }));
        },

        // Experiment 4: Auth actions
        login: async (email, password) => {
          logger.storeAction("AUTH_LOGIN_START", { email });
          set({ loading: true, error: null });
          try {
            const res = await learningApi.login(email, password);
            localStorage.setItem("elearning_auth_token", res.token);
            localStorage.setItem("token", res.token);
            set({
              currentUser: res.user,
              token: res.token,
              loading: false
            });
            get().logAction("AUTH_LOGIN_SUCCESS", `Student authenticated: ${res.user.email}`);
            await get().fetchUserData(res.user.email);
            return res;
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("AUTH_LOGIN_FAILED", err.message);
            throw err;
          }
        },

        signup: async (name, email, password) => {
          logger.storeAction("AUTH_SIGNUP_START", { name, email });
          set({ loading: true, error: null });
          try {
            const res = await learningApi.signup(name, email, password);
            localStorage.setItem("elearning_auth_token", res.token);
            localStorage.setItem("token", res.token);
            set({
              currentUser: res.user,
              token: res.token,
              enrolled: [],
              progress: {},
              completedLessons: {},
              certificates: {},
              quizResults: [],
              assignments: [],
              loading: false
            });
            get().logAction("AUTH_SIGNUP_SUCCESS", `New student account: ${res.user.email}`);
            return res;
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("AUTH_SIGNUP_FAILED", err.message);
            throw err;
          }
        },

        logout: () => {
          const user = get().currentUser;
          localStorage.removeItem("elearning_auth_token");
          localStorage.removeItem("token");
          set({
            currentUser: null,
            token: null,
            enrolled: [],
            progress: {},
            completedLessons: {},
            certificates: {},
            quizResults: [],
            assignments: [],
            error: null
          });
          logger.auth("LOGOUT", user?.email || "Student", "Token Cleared");
          get().logAction("AUTH_LOGOUT", user ? `User logged out: ${user.email}` : "Logged out");
        },

        // Experiment 1a, b: Fetch courses using REST API
        fetchCourses: async (search = "", category = "All") => {
          logger.storeAction("FETCH_COURSES_DISPATCHED", { search, category });
          set({ loading: true, error: null });
          try {
            const data = await learningApi.getCourses(search, category);
            set({ courses: data, loading: false });
            get().logAction("FETCH_COURSES_SUCCESS", `Loaded ${data.length} courses (${category})`);
          } catch (err) {
            set({ loading: false, error: "Failed to fetch courses from REST API." });
            get().logAction("FETCH_COURSES_ERROR", err.message);
          }
        },

        // Experiment 3e: Retrieve student learning history using GET
        fetchUserData: async (email) => {
          if (!email) return;
          logger.storeAction("FETCH_USER_DATA_DISPATCHED", { email });
          set({ loading: true, error: null });
          try {
            const data = await learningApi.getLearningHistory(email);
            set({
              enrolled: data.enrolled || [],
              progress: data.progress || {},
              completedLessons: data.completedLessons || {},
              certificates: data.certificates || {},
              quizResults: data.quizResults || [],
              assignments: data.assignments || [],
              loading: false
            });
            get().logAction("FETCH_USER_DATA_SUCCESS", `Loaded learning history for ${email}`);
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("FETCH_USER_DATA_ERROR", err.message);
          }
        },

        // Experiment 3b: Course Enrollment using POST
        enrollCourse: async (courseId) => {
          const { currentUser, enrolled, courses } = get();
          if (!currentUser) throw new Error("Please log in to enroll in this course.");
          if (enrolled.includes(courseId)) throw new Error("Already enrolled in this course.");

          const course = courses.find((c) => c.id === courseId);
          logger.enroll(course?.name || "Course", courseId);

          set({ loading: true, error: null });
          try {
            const res = await learningApi.enrollCourse(currentUser.email, courseId);
            set({
              enrolled: res.enrolled,
              progress: res.progress,
              loading: false
            });
            get().logAction("ENROLL_COURSE_SUCCESS", `Enrolled in Course #${courseId}`);
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("ENROLL_ERROR", err.message);
            throw err;
          }
        },

        // Experiment 3f: Drop Course / Unenroll using DELETE
        unenrollCourse: async (courseId) => {
          const { currentUser } = get();
          if (!currentUser) throw new Error("Please log in first.");

          set({ loading: true, error: null });
          try {
            const res = await learningApi.unenrollCourse(currentUser.email, courseId);
            set((state) => {
              const newProgress = { ...state.progress };
              delete newProgress[courseId];
              const newLessons = { ...state.completedLessons };
              delete newLessons[courseId];
              const newCerts = { ...state.certificates };
              delete newCerts[courseId];

              return {
                enrolled: res.enrolled,
                progress: newProgress,
                completedLessons: newLessons,
                certificates: newCerts,
                loading: false
              };
            });
            get().logAction("UNENROLL_COURSE_SUCCESS", `Course #${courseId} dropped via DELETE`);
            return res;
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("UNENROLL_COURSE_ERROR", err.message);
            throw err;
          }
        },

        // Experiment 3c: Update learning progress using PUT/PATCH
        completeLesson: async (courseId, lessonId) => {
          const { currentUser, courses } = get();
          if (!currentUser) return;

          const course = courses.find((c) => c.id === courseId);
          const lesson = course?.lessons?.find((l) => l.id === lessonId);
          logger.lesson(course?.name || "Course", lessonId, lesson?.title || "Lesson");

          set({ loading: true, error: null });
          try {
            const res = await learningApi.updateProgress(currentUser.email, courseId, lessonId);
            set((state) => ({
              progress: { ...state.progress, [courseId]: res.progress },
              completedLessons: { ...state.completedLessons, [courseId]: res.completedLessons },
              certificates: res.certificates || state.certificates,
              loading: false
            }));
            get().logAction(
              "UPDATE_PROGRESS_SUCCESS",
              `Course #${courseId} progress: ${res.progress}%`
            );
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("UPDATE_PROGRESS_ERROR", err.message);
          }
        },

        // Experiment 3d: Submit Quiz data using POST
        submitQuizResult: async (quizResult) => {
          const { currentUser } = get();
          if (!currentUser) return;

          logger.quiz(quizResult.title, quizResult.score, quizResult.total);
          set({ loading: true, error: null });
          try {
            const res = await learningApi.submitQuiz(currentUser.email, quizResult);
            set({ quizResults: res.quizResults, loading: false });
            get().logAction("SUBMIT_QUIZ_SUCCESS", `Quiz "${quizResult.title}": ${quizResult.score}/${quizResult.total}`);
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("SUBMIT_QUIZ_ERROR", err.message);
          }
        },

        // Experiment 3d: Submit Practical Assignment data using POST
        submitAssignment: async (assignment) => {
          const { currentUser } = get();
          if (!currentUser) return;

          logger.click("Submit Assignment", assignment.title);
          set({ loading: true, error: null });
          try {
            const res = await learningApi.submitAssignment(currentUser.email, assignment);
            set({ assignments: res.assignments, loading: false });
            get().logAction("SUBMIT_ASSIGNMENT_SUCCESS", `Assignment "${assignment.title}" submitted`);
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("SUBMIT_ASSIGNMENT_ERROR", err.message);
          }
        },

        // Experiment 3g: Delete Assignment using DELETE
        deleteAssignment: async (title) => {
          const { currentUser } = get();
          if (!currentUser) return;

          set({ loading: true, error: null });
          try {
            const res = await learningApi.deleteAssignment(currentUser.email, title);
            set({ assignments: res.assignments, loading: false });
            get().logAction("DELETE_ASSIGNMENT_SUCCESS", `Assignment "${title}" deleted via DELETE`);
          } catch (err) {
            set({ loading: false, error: err.message });
            get().logAction("DELETE_ASSIGNMENT_ERROR", err.message);
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: "elearning-zustand-cache",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          token: state.token
        })
      }
    )
  )
);
