import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CourseDetail from "../components/coursedetail";

describe("CourseDetail Component (Experiment 1a)", () => {
  it("renders course details when a valid course ID is provided", () => {
    render(
      <MemoryRouter initialEntries={["/courses/1"]}>
        <Routes>
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cyber Security");
    expect(screen.getByText("Learn online security.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to my learning/i })).toBeInTheDocument();
  });

  it("renders not found message when an invalid course ID is accessed", () => {
    render(
      <MemoryRouter initialEntries={["/courses/999"]}>
        <Routes>
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Course not found");
    expect(screen.getByRole("link", { name: /back to courses/i })).toBeInTheDocument();
  });
});
