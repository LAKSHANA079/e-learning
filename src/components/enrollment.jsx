
export default function Enrollment({ enrolled, courses }) {
  const items = courses.filter(course => enrolled.includes(course.id));

  return (
    <section className="panel">
      <h2>My Enrolled Courses</h2>
      {items.length ? items.map(course => (
        <p key={course.id}>✓ {course.title}</p>
      )) : <p>No courses enrolled yet.</p>}
    </section>
  );
}
