import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);
  const { closeModal } = useModal();
  const [isDemoUserClicked, setIsDemoUserClicked] = useState(false);

  useEffect(() => {
    setIsEnabled(credential.length >= 4 && password.length >= 6);
  }, [credential, password]);

  if (sessionUser) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (isDemoUserClicked) {
      await logInDemoUser();
    } else {
      await logIn();
    }
  };

  const logIn = async () => {
    try {
      await dispatch(
        sessionActions.createSessionThunk({ credential, password })
      );
      closeModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("An error occurred while logging in:", error);
      }
    }
  };

  const logInDemoUser = async () => {
    try {
      await dispatch(
        sessionActions.createSessionThunk({
          credential: process.env.REACT_APP_CREDENTIAL,
          password: process.env.REACT_APP_PASSWORD,
        })
      );
      closeModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error(
          "An error occurred while logging in as a demo user:",
          error
        );
      }
    }
  };

  const handleDemoUserClick = () => {
    dispatch(
      sessionActions.createSessionThunk({
        credential: "Demo@gmail.com",
        password: "password",
      })
    );
  };

  const handleModalClose = () => {
    setIsDemoUserClicked(false);
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      {validationErrors.credential && (
        <p className="error">{validationErrors.credential}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={!isEnabled}>
          {isDemoUserClicked ? "Log In as Demo User" : "Log In"}
        </button>
        {isDemoUserClicked && (
          <button type="button" onClick={handleModalClose}>
            Close Demo User
          </button>
        )}
        {!isDemoUserClicked && (
          <button type="button" onClick={handleDemoUserClick}>
            Log In as Demo User
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginFormModal;
