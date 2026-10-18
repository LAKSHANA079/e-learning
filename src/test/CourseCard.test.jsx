import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "../components/coursecard";

describe("CourseCard Component (Experiment 1a, 1c)", () => {
  const mockCourse = {
    id: "c1",
    title: "Full Stack React Development",
    description: "Master React, Vite, and Modern JavaScript.",
    level: "Intermediate",
    duration: "10 hours",
    instructor: "Dr. Smith"
  };

  it("renders course details correctly including title, level, duration, and instructor", () => {
    render(
      <CourseCard
        course={mockCourse}
        onSelect={vi.fn()}
        enrolled={false}
        enrollCourse={vi.fn()}
      />
    );

    expect(screen.getByText("Full Stack React Development")).toBeInTheDocument();
    expect(screen.getByText("Master React, Vite, and Modern JavaScript.")).toBeInTheDocument();
    expect(screen.getByText(/Intermediate · 10 hours/)).toBeInTheDocument();
    expect(screen.getByText("Instructor: Dr. Smith")).toBeInTheDocument();
  });

  it("calls onSelect when 'View Details' button is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <CourseCard
        course={mockCourse}
        onSelect={handleSelect}
        enrolled={false}
        enrollCourse={vi.fn()}
      />
    );

    const viewButton = screen.getByRole("button", { name: /view details/i });
    fireEvent.click(viewButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockCourse);
  });

  it("shows 'Enroll Now' when course is not yet enrolled and triggers enrollCourse callback with course id", () => {
    const handleEnroll = vi.fn();
    render(
      <CourseCard
        course={mockCourse}
        onSelect={vi.fn()}
        enrolled={false}
        enrollCourse={handleEnroll}
      />
    );

    const enrollButton = screen.getByRole("button", { name: /enroll now/i });
    expect(enrollButton).toBeInTheDocument();

    fireEvent.click(enrollButton);
    expect(handleEnroll).toHaveBeenCalledTimes(1);
    expect(handleEnroll).toHaveBeenCalledWith("c1");
  });

  it("shows 'Enrolled ✓' when course is already enrolled", () => {
    render(
      <CourseCard
        course={mockCourse}
        onSelect={vi.fn()}
        enrolled={true}
        enrollCourse={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /enrolled ✓/i })).toBeInTheDocument();
  });
});
