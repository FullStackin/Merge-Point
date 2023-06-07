import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import DummyUserButton from "../DummyUser/index";
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
        <button onClick={clickNewGroup}>Start A Merge Point</button>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className={sessionClassName}>
        <DummyUserButton />
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <nav className="main_nav">
      <ul>
        <li className="nav_logo">
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
