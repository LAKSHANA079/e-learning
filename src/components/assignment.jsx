
import { useState } from "react";

export default function Assignment() {
  const [task, setTask] = useState("");

  return (
    <section className="panel">
      <h2>Assignments</h2>
      <input value={task} onChange={(e) => setTask(e.target.value)}
        placeholder="Enter assignment name" />
      <p>Assignment: {task || "No assignment entered"}</p>
    </section>
  );
}
