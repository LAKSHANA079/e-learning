
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="main">
      <h1>Welcome to EduLearn</h1>
      <p>Learn new skills through online courses.</p>
      <Link to="/courses">Explore Courses</Link>
    </main>
  );
}
