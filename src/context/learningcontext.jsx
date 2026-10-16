
import { createContext, useContext, useState } from "react";

const LearningContext = createContext();

export function LearningProvider({ children }) {
  const [enrolled, setEnrolled] = useState([]);

  function enroll(course) {
    setEnrolled((old) => [...old, course]);
  }

  return (
    <LearningContext.Provider value={{ enrolled, enroll }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
