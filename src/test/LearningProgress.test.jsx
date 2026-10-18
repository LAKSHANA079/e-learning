import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LearningDashboard from "../components/learningdashboard";
import { LearningProvider } from "../context/learningcontext";

describe("Learning Progress Updates (Experiment 1d)", () => {
  const sampleCourses = [
    { id: "c1", title: "Web Development Bootcamp" },
    { id: "c2", title: "Cyber Security Mastery" }
  ];

  it("renders zero progress and empty state when no courses are enrolled", () => {
    const mockContext = {
      enrolled: [],
      progress: {},
      overallProgress: 0,
      quizCompleted: false,
      assignmentDone: false,
      certificateEligible: false
    };

    render(
      <LearningProvider value={mockContext}>
        <LearningDashboard courses={sampleCourses} />
      </LearningProvider>
    );

    expect(screen.getByText("Learning Dashboard")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("No courses enrolled yet")).toBeInTheDocument();
  });

  it("renders enrolled courses and specific course progress percentages", () => {
    const mockContext = {
      enrolled: ["c1", "c2"],
      progress: { c1: 75, c2: 40 },
      overallProgress: 58,
      quizCompleted: true,
      assignmentDone: false,
      certificateEligible: false
    };

    render(
      <LearningProvider value={mockContext}>
        <LearningDashboard courses={sampleCourses} />
      </LearningProvider>
    );

    expect(screen.getByText("58%")).toBeInTheDocument();
    expect(screen.getByText("Web Development Bootcamp")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Cyber Security Mastery")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("updates learning activity indicators when quiz and assignment are completed", () => {
    const completedContext = {
      enrolled: ["c1"],
      progress: { c1: 100 },
      overallProgress: 100,
      quizCompleted: true,
      assignmentDone: true,
      certificateEligible: true
    };

    render(
      <LearningProvider value={completedContext}>
        <LearningDashboard courses={sampleCourses} />
      </LearningProvider>
    );

    expect(screen.getAllByText("✓ Completed").length).toBe(2);
    expect(screen.getByText("✓ Eligible")).toBeInTheDocument();
  });
});
