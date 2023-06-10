import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";
import { Redirect } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);
  const { closeModal } = useModal();

  useEffect(() => {
    setIsEnabled(
      firstName &&
        lastName &&
        username &&
        username.length >= 4 &&
        password &&
        password.length >= 6 &&
        password === confirmPassword
    );
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const validateUsername = () => {
    const errors = { ...validationErrors };
    if (!username || username.length >= 4) errors["username"] = "";
    else errors["username"] = "Username must contain at least 4 characters";
    setValidationErrors(errors);
  };

  const validatePassword = () => {
    const errors = { ...validationErrors };
    if (!password || password.length >= 6) errors["password"] = "";
    else errors["password"] = "Password must contain at least 6 characters";
    setValidationErrors(errors);
  };

  const validateConfirmPassword = () => {
    const errors = { ...validationErrors };
    if (confirmPassword === password) errors["confirmPassword"] = "";
    else
      errors["confirmPassword"] =
        "Confirm Password field must be the same as the Password field";
    setValidationErrors(errors);
  };

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setValidationErrors({});
      return dispatch(
        sessionActions.createUserThunk({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setValidationErrors(data.errors);
          }
        });
    }
    return setValidationErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="sign-up-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {validationErrors.email && (
          <p className="error">{validationErrors.email}</p>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={(e) => validateUsername()}
          required
        />
        {validationErrors.username && (
          <p className="error">{validationErrors.username}</p>
        )}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {validationErrors.firstName && (
          <p className="error">{validationErrors.firstName}</p>
        )}
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {validationErrors.lastName && (
          <p className="error">{validationErrors.lastName}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validatePassword()}
          required
        />
        {validationErrors.password && (
          <p className="error">{validationErrors.password}</p>
        )}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={(e) => validateConfirmPassword()}
          required
        />
        {validationErrors.confirmPassword && (
          <p className="error">{validationErrors.confirmPassword}</p>
        )}
        <button type="submit" disabled={!isEnabled}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
