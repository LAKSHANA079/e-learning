
import { createContext, useContext, useState } from "react";

const LearningContext = createContext(null);

export function LearningProvider({ children, value }) {
  const [enrolled, setEnrolled] = useState([]);
  const [progress, setProgress] = useState({});

  function enroll(courseId) {
    setEnrolled((old) => (old.includes(courseId) ? old : [...old, courseId]));
  }

  function updateProgress(courseId, val) {
    setProgress((prev) => ({ ...prev, [courseId]: val }));
  }

  const defaultVal = {
    enrolled,
    enroll,
    progress,
    updateProgress,
    overallProgress: 0,
    quizCompleted: false,
    assignmentDone: false,
    certificateEligible: false
  };

  return (
    <LearningContext.Provider value={value !== undefined ? value : defaultVal}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  return ctx || {};
}

export const useLearningContext = useLearning;
