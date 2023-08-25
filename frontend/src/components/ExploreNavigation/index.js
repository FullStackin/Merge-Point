import { NavLink, useLocation } from "react-router-dom";
import "./ExploreNavigation.css";

const ExploreNavigation = () => {
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
      <ul className="ExploreNavigation_Li">
        <li>
          <NavLink to="/events" className="ExploreNavigation_Header">
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/groups" className="ExploreNavigation_Header">
            Groups
          </NavLink>
        </li>
      </ul>
      <p className="under-text">{pageTitle}</p>
    </nav>
  );
};

export default ExploreNavigation;
