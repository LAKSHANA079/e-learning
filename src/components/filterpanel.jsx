
export default function FilterPanel({
  category, setCategory, level, setLevel,
  duration, setDuration, instructor, setInstructor
}) {
  return (
    <div className="filters">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option>Cyber Security</option>
        <option>Programming</option>
        <option>Web Development</option>
      </select>

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">All Levels</option>
        <option>Beginner</option>
        <option>Intermediate</option>
      </select>

      <select value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option value="">Any Duration</option>
        <option>Short</option>
        <option>Long</option>
      </select>

      <input placeholder="Instructor" value={instructor}
        onChange={(e) => setInstructor(e.target.value)} />
    </div>
  );
}
