import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const clickNewGroup = () => {
    history.push("/groups/new");
  };

  let sessionLinks;
  let sessionClassName = "session-li";
  if (sessionUser) {
    sessionLinks = (
      <li className={sessionClassName}>
        <button onClick={clickNewGroup}>Start a MergePoint</button>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className={sessionClassName}>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal showDemoUser={false} />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <nav className="mNav">
      <ul>
        <li className="nav-logo">
          <NavLink exact to="/">
            MergePoint
          </NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </nav>
  );
}

export default Navigation;
