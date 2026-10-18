import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Enrollment from "../components/enrollment";
import CourseCard from "../components/coursecard";

describe("Course Enrollment Functionality (Experiment 1c)", () => {
  const sampleCourses = [
    { id: "101", title: "React Fundamentals", description: "UI library", level: "Beginner", duration: "4h", instructor: "John" },
    { id: "102", title: "Node.js Backend", description: "Server-side JS", level: "Intermediate", duration: "6h", instructor: "Alice" }
  ];

  it("renders empty state message when no courses are enrolled", () => {
    render(<Enrollment enrolled={[]} courses={sampleCourses} />);

    expect(screen.getByText("My Enrolled Courses")).toBeInTheDocument();
    expect(screen.getByText("No courses enrolled yet.")).toBeInTheDocument();
  });

  it("renders list of enrolled courses when enrolled IDs are provided", () => {
    render(<Enrollment enrolled={["101"]} courses={sampleCourses} />);

    expect(screen.getByText(/✓ React Fundamentals/i)).toBeInTheDocument();
    expect(screen.queryByText(/✓ Node.js Backend/i)).not.toBeInTheDocument();
  });

  it("triggers enrollCourse action when student clicks enroll button on a course card", () => {
    const enrollHandler = vi.fn();
    render(
      <CourseCard
        course={sampleCourses[0]}
        onSelect={vi.fn()}
        enrolled={false}
        enrollCourse={enrollHandler}
      />
    );

    const button = screen.getByRole("button", { name: /enroll now/i });
    fireEvent.click(button);

    expect(enrollHandler).toHaveBeenCalledTimes(1);
    expect(enrollHandler).toHaveBeenCalledWith("101");
  });

  it("updates enrolled list dynamically when multiple courses are enrolled", () => {
    const { rerender } = render(<Enrollment enrolled={["101"]} courses={sampleCourses} />);
    expect(screen.getByText(/✓ React Fundamentals/i)).toBeInTheDocument();

    // Rerender with additional course enrolled
    rerender(<Enrollment enrolled={["101", "102"]} courses={sampleCourses} />);
    expect(screen.getByText(/✓ React Fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ Node.js Backend/i)).toBeInTheDocument();
  });
});
