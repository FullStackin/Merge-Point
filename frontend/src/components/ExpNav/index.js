import { NavLink } from "react-router-dom";
import "./ExpNav.css";

const ExpNav = () => {
  return (
    <nav className="Exp-Nav">
      <ul className="ExpNav_Li">
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/groups">Groups</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ExpNav;
