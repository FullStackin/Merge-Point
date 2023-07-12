import { NavLink } from "react-router-dom";
import "./ExpNav.css";

const ExpNav = () => {
  return (
    <nav className="Exp-Nav">
      <ul className="ExpNav_Li">
        <li>
          <NavLink to="/events" className="ExpNav_Header">
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/groups" className="ExpNav_Header">
            Groups
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ExpNav;
