import { csrfFetch } from "./csrf";

// Action types
const START_SESSION = "session/START_SESSION";
const FETCH_SESSION = "session/FETCH_SESSION";
const END_SESSION = "session/END_SESSION";
const REGISTER_USER = "session/REGISTER_USER";

export const actionStNewSes = (user) => ({
  type: START_SESSION,
  user,
});

const actionFetchSes = (user) => ({
  type: FETCH_SESSION,
  user,
});

const actionEndSes = () => ({
  type: END_SESSION,
});

const actionRegiUser = (user) => ({
  type: REGISTER_USER,
  user,
});

export const thunkCrteSess = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const { user: responseData } = await response.json();

    if (response.ok) {
      dispatch(actionStNewSes(responseData));
    }

    return responseData;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

export const thunkGtSess = () => async (dispatch) => {
  try {
    const response = await fetch("/api/session");
    const { user: responseData } = await response.json();

    if (response.ok) {
      dispatch(actionFetchSes(responseData));
    }

    return responseData;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    throw error;
  }
};

export const thunkDtSess = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session", {
      method: "delete",
    });
    const responseData = await response.json();

    if (response.ok) {
      dispatch(actionEndSes());
    }

    return responseData;
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw error;
  }
};

export const thunkRegUsr = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/users", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const { user: responseData } = await response.json();

    if (response.ok) {
      dispatch(actionRegiUser(responseData));
    }

    return responseData;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// Initial state
const initialState = {
  user: null,
};

// Reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case START_SESSION:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case FETCH_SESSION:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case END_SESSION:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case REGISTER_USER:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
