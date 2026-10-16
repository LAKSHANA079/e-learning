
export default function CourseCard({
  course, onSelect, enrolled, enrollCourse
}) {
  return (
    <article className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>{course.level} · {course.duration}</p>
      <p>Instructor: {course.instructor}</p>
      <button onClick={() => onSelect(course)}>
        View Details
      </button>
      <button onClick={() => enrollCourse(course.id)}>
        {enrolled ? "Enrolled ✓" : "Enroll Now"}
      </button>
    </article>
  );
}
