import { csrfFetch } from "./csrf";

// Action types
const START_NEW_SESSION = "session/START_NEW_SESSION";
const FETCH_SESSION = "session/FETCH_SESSION";
const END_SESSION = "session/END_SESSION";
const REGISTER_USER = "session/REGISTER_USER";

// Action creators
const startNewSession = (user) => ({
  type: START_NEW_SESSION,
  user,
});

const fetchSession = (user) => ({
  type: FETCH_SESSION,
  user,
});

const endSession = () => ({
  type: END_SESSION,
});

const registerUser = (user) => ({
  type: REGISTER_USER,
  user,
});

export const createSessionThunk = (user) => async (dispatch) => {
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
      dispatch(startNewSession(responseData));
    }

    return responseData;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

export const getSessionThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/session");
    const { user: responseData } = await response.json();

    if (response.ok) {
      dispatch(fetchSession(responseData));
    }

    return responseData;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    throw error;
  }
};

export const deleteSessionThunk = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session", {
      method: "delete",
    });
    const responseData = await response.json();

    if (response.ok) {
      dispatch(endSession());
    }

    return responseData;
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw error;
  }
};

export const registerUserThunk = (user) => async (dispatch) => {
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
      dispatch(startNewSession(responseData));
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
  switch (action.type) {
    case START_NEW_SESSION:
      return {
        ...state,
        user: action.user,
      };
    case FETCH_SESSION:
      return {
        ...state,
        user: action.user,
      };
    case END_SESSION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default sessionReducer;
