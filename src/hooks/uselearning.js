
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "edulearn-learning";

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function useLearning() {
  const [saved] = useState(loadSavedData);

  const [enrolled, setEnrolled] = useState(saved.enrolled || []);
  const [progress, setProgress] = useState(saved.progress || {});
  const [quizScore, setQuizScore] = useState(
    Number.isFinite(saved.quizScore) ? saved.quizScore : null
  );
  const [assignmentDone, setAssignmentDone] = useState(
    Boolean(saved.assignmentDone)
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          enrolled,
          progress,
          quizScore,
          assignmentDone
        })
      );
    } catch (error) {
      console.error("Could not save learning progress.", error);
    }
  }, [enrolled, progress, quizScore, assignmentDone]);

  const enrollCourse = useCallback((courseOrId) => {
    const id =
      typeof courseOrId === "object"
        ? courseOrId.id
        : courseOrId;

    if (id == null) return;

    setEnrolled((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }, []);

  const updateProgress = useCallback((id, value) => {
    setProgress((previous) => ({
      ...previous,
      [id]: Math.min(100, Math.max(0, Number(value) || 0))
    }));
  }, []);

  const completeLesson = useCallback((id) => {
    setProgress((previous) => ({
      ...previous,
      [id]: Math.min(100, (previous[id] || 0) + 25)
    }));
  }, []);

  const submitQuiz = useCallback((score) => {
    const numericScore = Number(score);

    if (Number.isFinite(numericScore)) {
      setQuizScore(numericScore);
    }
  }, []);

  const completeAssignment = useCallback(() => {
    setAssignmentDone(true);
  }, []);

  const overallProgress = useMemo(() => {
    if (enrolled.length === 0) return 0;

    const total = enrolled.reduce(
      (sum, id) => sum + (progress[id] || 0),
      0
    );

    return Math.round(total / enrolled.length);
  }, [enrolled, progress]);

  return {
    enrolled,
    progress,
    quizScore,
    assignmentDone,
    quizCompleted: quizScore !== null,
    overallProgress,
    certificateEligible: quizScore !== null && assignmentDone,
    enrollCourse,
    updateProgress,
    completeLesson,
    submitQuiz,
    completeAssignment
  };
}
