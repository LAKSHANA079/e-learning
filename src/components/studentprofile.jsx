
import { useState } from "react";

export default function StudentProfile() {
  const [name, setName] = useState("");

  return (
    <main className="main">
      <h2>Student Profile</h2>
      <input value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Enter student name" />
      <p>Student: {name || "Enter your name"}</p>
    </main>
  );
}
