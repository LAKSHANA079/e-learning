import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Quiz from "../components/quiz";
import Assignment from "../components/assignment";

describe("Quiz and Assignment Interactions (Experiment 1e)", () => {
  describe("Quiz Component", () => {
    it("renders the quiz question and initial options", () => {
      render(<Quiz />);

      expect(screen.getByText("Simple Quiz")).toBeInTheDocument();
      expect(
        screen.getByText("Which library is used to build this interface?")
      ).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    it("evaluates wrong answer and shows 'Try again!'", () => {
      render(<Quiz />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "Python" } });

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      expect(screen.getByText("Try again!")).toBeInTheDocument();
    });

    it("evaluates correct answer ('React') and shows 'Correct answer!'", () => {
      render(<Quiz />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "React" } });

      const submitButton = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(submitButton);

      expect(screen.getByText("Correct answer!")).toBeInTheDocument();
    });
  });

  describe("Assignment Component", () => {
    it("renders assignment panel with default empty state", () => {
      render(<Assignment />);

      expect(screen.getByText("Assignments")).toBeInTheDocument();
      expect(screen.getByText("Assignment: No assignment entered")).toBeInTheDocument();
    });

    it("updates displayed assignment name as student types in input", () => {
      render(<Assignment />);

      const input = screen.getByPlaceholderText("Enter assignment name");
      fireEvent.change(input, { target: { value: "React Component Testing Lab" } });

      expect(
        screen.getByText("Assignment: React Component Testing Lab")
      ).toBeInTheDocument();
    });
  });
});
