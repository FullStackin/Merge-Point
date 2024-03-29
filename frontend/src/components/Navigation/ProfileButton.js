// ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const menuRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prevState) => !prevState);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.deleteSessionThunk());
    history.push("/");
  };

  const viewGroups = () => {
    closeMenu();
    history.push("/groups");
  };

  const viewEvents = () => {
    closeMenu();
    history.push("/events");
  };

  return (
    <div className="profile-container">
      <button className="profile-button" onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <div className="popup-overlay">
          <div className="popup-container" ref={menuRef}>
            <div className="popup-content">
              <div className="user-info">
                <p>Hello, {user.firstName}</p>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p>{user.email}</p>
              </div>
              <div className="buttons">
                <button className="custom-button" onClick={logout}>
                  Log Out
                </button>
                <button className="custom-button" onClick={viewGroups}>
                  View Groups
                </button>
                <button className="custom-button" onClick={viewEvents}>
                  View Events
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
