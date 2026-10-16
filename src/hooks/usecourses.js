
import { useMemo, useRef, useState } from "react";

const courses = [
  { id: "1", title: "Cyber Security", category: "Cyber Security", level: "Beginner", duration: "Short", instructor: "Arun" },
  { id: "2", title: "React Basics", category: "Web Development", level: "Beginner", duration: "Short", instructor: "Priya" },
  { id: "3", title: "Python Programming", category: "Programming", level: "Intermediate", duration: "Long", instructor: "Kumar" }
];

export default function useCourses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");
  const searchRef = useRef(null);

  const filteredCourses = useMemo(() => courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()) &&
    (!category || course.category === category) &&
    (!level || course.level === level) &&
    (!duration || course.duration === duration) &&
    course.instructor.toLowerCase().includes(instructor.toLowerCase())
  ), [search, category, level, duration, instructor]);

  return {
    search, setSearch, category, setCategory,
    level, setLevel, duration, setDuration,
    instructor, setInstructor, filteredCourses, searchRef
  };
}
