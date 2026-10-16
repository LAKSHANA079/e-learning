
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <h2>EduLearn</h2>
      <nav>
        <NavLink to="/">Home</NavLink>{" "}
        <NavLink to="/courses">Courses</NavLink>{" "}
        <NavLink to="/learning">My Learning</NavLink>{" "}
        <NavLink to="/login">Login</NavLink>{" "}
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </header>
  );
}
