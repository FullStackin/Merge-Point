import { NavLink, useLocation } from "react-router-dom";
import "./ExpNav.css";

const ExpNav = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  let pageTitle;
  if (currentPage === "/events") {
    pageTitle = "Events in MergePoint";
  } else if (currentPage === "/groups") {
    pageTitle = "Groups in MergePoint";
  }

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
      <p className="under-text">{pageTitle}</p>
    </nav>
  );
};

export default ExpNav;
