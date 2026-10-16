
import { useParams, Link } from "react-router-dom";

const courses = [
  { id: "1", title: "Cyber Security", description: "Learn online security." },
  { id: "2", title: "React Basics", description: "Learn React components." },
  { id: "3", title: "Python Programming", description: "Learn Python basics." }
];

export default function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((item) => item.id === id);

  if (!course) return <main className="main"><h2>Course not found</h2><Link to="/courses">Back to Courses</Link></main>;

  return (
    <main className="main">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <Link to="/learning">Go to My Learning</Link>
    </main>
  );
}
