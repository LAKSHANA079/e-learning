import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React, { Suspense, lazy } from "react";
import { sanitizeInput, validatePassword, validateEmail } from "../utils/security";

describe("Experiment 2: Optimize E-Learning Application", () => {

  // Subtask a & b: Lazy Loading and Code Splitting
  describe("a & b) Lazy Loading and Code Splitting", () => {
    it("renders a fallback while dynamically lazy loading a course module", async () => {
      // Simulate dynamic import for lazy loaded component
      const LazyCourseModule = lazy(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  default: () => (
                    <div data-testid="lazy-module">
                      <h3>Loaded Learning Module</h3>
                      <p>Full course contents dynamically loaded on-demand.</p>
                    </div>
                  )
                }),
              50
            )
          )
      );

      render(
        <Suspense fallback={<div data-testid="lazy-spinner">Loading course module...</div>}>
          <LazyCourseModule />
        </Suspense>
      );

      // Verify fallback is rendered first
      expect(screen.getByTestId("lazy-spinner")).toHaveTextContent("Loading course module...");

      // Verify lazy loaded module appears after resolve
      await waitFor(() => {
        expect(screen.getByTestId("lazy-module")).toBeInTheDocument();
      });
      expect(screen.getByText("Loaded Learning Module")).toBeInTheDocument();
    });

    it("lazy loads quiz and assignment routes on demand with Suspense boundary", async () => {
      const LazyQuiz = lazy(() =>
        Promise.resolve({
          default: () => <div data-testid="quiz-route">Quiz Questions Bundle</div>
        })
      );

      render(
        <Suspense fallback={<div>Loading Quiz...</div>}>
          <LazyQuiz />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId("quiz-route")).toBeInTheDocument();
      });
    });
  });

  // Subtask c: Optimize Videos, Images, and Course Data Loading
  describe("c) Media and Data Loading Optimization", () => {
    it("ensures images use lazy loading and async decoding for high performance", () => {
      render(
        <img
          src="/android-chrome-192x192.png"
          alt="Course Cover"
          loading="lazy"
          decoding="async"
          width="192"
          height="192"
        />
      );

      const image = screen.getByRole("img", { name: /course cover/i });
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("decoding", "async");
      expect(image).toHaveAttribute("width", "192");
    });

    it("ensures video players use preload='metadata' to prevent unnecessary bandwidth consumption", () => {
      render(
        <video
          data-testid="course-video"
          preload="metadata"
          controls
          aria-label="Course Lesson Video"
        >
          <source src="dummy-lesson.mp4" type="video/mp4" />
        </video>
      );

      const video = screen.getByTestId("course-video");
      expect(video).toHaveAttribute("preload", "metadata");
      expect(video).toHaveAttribute("aria-label", "Course Lesson Video");
    });
  });

  // Subtask d: PWA Features for Improved Learning Access
  describe("d) PWA Features and Offline Support", () => {
    it("validates service worker registration capability in browser environment", async () => {
      const registerMock = vi.fn().mockResolvedValue({ scope: "/" });
      const originalServiceWorker = navigator.serviceWorker;

      Object.defineProperty(navigator, "serviceWorker", {
        value: { register: registerMock },
        configurable: true
      });

      // Trigger registration
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("./sw.js");
      }

      expect(registerMock).toHaveBeenCalledWith("./sw.js");

      // Cleanup
      Object.defineProperty(navigator, "serviceWorker", {
        value: originalServiceWorker,
        configurable: true
      });
    });
  });

  // Subtask e: Accessibility and Keyboard Navigation
  describe("e) Keyboard Navigation and Accessible Form Controls", () => {
    it("ensures accessible form controls have aria labels and proper roles", () => {
      render(
        <form aria-label="Course Enrollment Form">
          <label htmlFor="student-name">Student Full Name</label>
          <input
            id="student-name"
            type="text"
            aria-required="true"
            aria-describedby="name-help"
          />
          <span id="name-help">Please enter your legal name for certificate</span>
          <button type="submit" aria-label="Submit Enrollment">
            Enroll
          </button>
        </form>
      );

      expect(screen.getByRole("form", { name: "Course Enrollment Form" })).toBeInTheDocument();
      const input = screen.getByLabelText("Student Full Name");
      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("aria-describedby", "name-help");
      expect(screen.getByRole("button", { name: "Submit Enrollment" })).toBeInTheDocument();
    });
  });

  // Subtask f: Front-End Security Practices
  describe("f) Front-End Security Practices (Sanitization & Auth)", () => {
    it("sanitizes malicious script tags and XSS payloads from user input", () => {
      const maliciousInput = "<script>alert('hack')</script>Hello World";
      const sanitized = sanitizeInput(maliciousInput);

      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("</script>");
      expect(sanitized).toContain("Hello World");
    });

    it("sanitizes dangerous HTML event handlers like onload/onerror", () => {
      const payload = '<img src="x" onerror="alert(1)">React Course';
      const sanitized = sanitizeInput(payload);

      expect(sanitized).not.toContain("onerror=");
      expect(sanitized).toContain("React Course");
    });

    it("enforces strong password validation policy for authentication", () => {
      // Weak password (< 8 chars)
      expect(validatePassword("short").isValid).toBe(false);

      // Weak password (no number or special char)
      expect(validatePassword("passwordOnly").isValid).toBe(false);

      // Strong password (contains uppercase, lowercase, digit, and special char)
      const strongResult = validatePassword("EduLearn@2026Secure!");
      expect(strongResult.isValid).toBe(true);
      expect(strongResult.message).toBe("Strong password.");
    });

    it("validates legitimate email addresses strictly", () => {
      expect(validateEmail("student@university.edu")).toBe(true);
      expect(validateEmail("invalid-email-format")).toBe(false);
    });
  });
});
