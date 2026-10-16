
import { useState } from "react";

export default function Quiz() {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  function checkAnswer(e) {
    e.preventDefault();
    setResult(answer === "React" ? "Correct answer!" : "Try again!");
  }

  return (
    <section className="panel">
      <h2>Simple Quiz</h2>
      <p>Which library is used to build this interface?</p>
      <form onSubmit={checkAnswer}>
        <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
          <option value="">Select answer</option>
          <option>React</option>
          <option>Python</option>
          <option>Java</option>
        </select>
        <button>Submit</button>
      </form>
      <p>{result}</p>
    </section>
  );
}
