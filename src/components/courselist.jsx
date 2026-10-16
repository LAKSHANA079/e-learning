
export default function CourseList({ courses, onSelect }) {
  return (
    <div className="course-list">
      {courses.map((course) => (
        <div className="card" key={course.id}>
          <h3>{course.title}</h3>
          <p>Category: {course.category}</p>
          <p>Level: {course.level}</p>
          <p>Instructor: {course.instructor}</p>
          <button onClick={() => onSelect(course)}>
            View Course
          </button>
        </div>
      ))}
    </div>
  );
}
