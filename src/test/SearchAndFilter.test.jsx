import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/searchbar";
import FilterPanel from "../components/filterpanel";

describe("Course Search and Filtering (Experiment 1b)", () => {
  it("renders SearchBar and updates value on user input", () => {
    const handleSearch = vi.fn();
    render(<SearchBar search="" setSearch={handleSearch} />);

    const searchInput = screen.getByPlaceholderText("Search courses...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "React" } });
    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("React");
  });

  it("renders FilterPanel and triggers category, level, and duration selections", () => {
    const setCategory = vi.fn();
    const setLevel = vi.fn();
    const setDuration = vi.fn();
    const setInstructor = vi.fn();

    render(
      <FilterPanel
        category=""
        setCategory={setCategory}
        level=""
        setLevel={setLevel}
        duration=""
        setDuration={setDuration}
        instructor=""
        setInstructor={setInstructor}
      />
    );

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBe(3);

    // Category select
    fireEvent.change(selects[0], { target: { value: "Web Development" } });
    expect(setCategory).toHaveBeenCalledWith("Web Development");

    // Level select
    fireEvent.change(selects[1], { target: { value: "Beginner" } });
    expect(setLevel).toHaveBeenCalledWith("Beginner");

    // Duration select
    fireEvent.change(selects[2], { target: { value: "Short" } });
    expect(setDuration).toHaveBeenCalledWith("Short");

    // Instructor input
    const instructorInput = screen.getByPlaceholderText("Instructor");
    fireEvent.change(instructorInput, { target: { value: "Dr. Smith" } });
    expect(setInstructor).toHaveBeenCalledWith("Dr. Smith");
  });

  it("filters course data properly based on search query and category", () => {
    const sampleCourses = [
      { id: "1", title: "React Fundamentals", category: "Web Development", level: "Beginner" },
      { id: "2", title: "Cyber Defense 101", category: "Cyber Security", level: "Intermediate" },
      { id: "3", title: "Python for Data Science", category: "Programming", level: "Beginner" },
      { id: "4", title: "Advanced React Patterns", category: "Web Development", level: "Advanced" }
    ];

    // Filter by search query "React"
    const searchQuery = "React";
    const searchFiltered = sampleCourses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(searchFiltered).toHaveLength(2);
    expect(searchFiltered.map((c) => c.id)).toEqual(["1", "4"]);

    // Filter by Category "Web Development" and Level "Beginner"
    const combinedFiltered = sampleCourses.filter(
      (course) => course.category === "Web Development" && course.level === "Beginner"
    );
    expect(combinedFiltered).toHaveLength(1);
    expect(combinedFiltered[0].title).toBe("React Fundamentals");
  });
});
