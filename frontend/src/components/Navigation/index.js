// Navigation.js
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

  return (
    <nav className="mNav">
      <div className="nav-logo">
        <NavLink exact to="/">
          MergePoint
        </NavLink>
      </div>
      {isLoaded && (
        <ul>
          <li className="topPage">
            {sessionUser ? (
              <div className="right-group">
                <span onClick={clickNewGroup} className="startIt">Start a new group</span>
                <ProfileButton user={sessionUser} />
              </div>
            ) : (
              <div className="right-group">
                <OpenModalButton
                  className="login-li"
                  buttonText="Log In"
                  modalComponent={<LoginFormModal showDemoUser={false} />}
                />
                <OpenModalButton
                  className="signup-li"
                  buttonText="Sign Up"
                  modalComponent={<SignupFormModal />}
                />
              </div>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navigation;
