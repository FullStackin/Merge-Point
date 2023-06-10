import { csrfFetch } from "./csrf";

const CREATE_SESSION = "session/POST_SESSION";
const GET_SESSION = "session/GET_SESSION";
const DELETE_SESSION = "session/DELETE_SESSION";
const CREATE_USER = "session/POST_USER";

const CreateSession = (user) => {
  return {
    type: CREATE_SESSION,
    user,
  };
};

const GetSession = (user) => {
  return {
    type: GET_SESSION,
    user,
  };
};

const DeleteSession = () => {
  return {
    type: DELETE_SESSION,
  };
};

const CreateUser = (user) => {
  return {
    type: CREATE_SESSION,
    user,
  };
};

export const createSessionThunk = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const resBody = await response.json();

  if (response.ok) dispatch(CreateSession(resBody.user));
  return resBody;
};

export const getSessionThunk = () => async (dispatch) => {
  const response = await fetch("/api/session");
  const resBody = await response.json();

  if (response.ok) dispatch(GetSession(resBody.user));
  return resBody;
};

export const deleteSessionThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "delete",
  });
  const resBody = await response.json();

  if (response.ok) dispatch(DeleteSession());
  return resBody;
};

export const createUserThunk = (user) => async (dispatch) => {
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
  const resBody = await response.json();
  console.log(resBody);
  if (response.ok) dispatch(CreateUser(resBody.user));
  return resBody;
};

// reducer

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SESSION: {
      return { ...state, user: action.user };
    }
    case GET_SESSION: {
      return { ...state, user: action.user };
    }
    case DELETE_SESSION: {
      return { ...initialState };
    }
    default:
      return state;
  }
};

export default sessionReducer;
