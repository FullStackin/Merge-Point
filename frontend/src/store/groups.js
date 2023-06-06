import { csrfFetch } from "./csrf";
const FETCH_ALL_GROUPS = "groups/fetchAllGroups";
const FETCH_ONE_GROUP = "groups/fetchOneGroup";

const fetchAllGroups = (groups) => {
  return { type: FETCH_ALL_GROUPS, payload: groups };
};

const fetchOneGroup = (group) => {
  return { type: FETCH_ONE_GROUP, payload: group };
};

export const getAllGroupsThunk = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  const resBody = await response.json();
  if (response.ok) dispatch(fetchAllGroups(resBody["Groups"]));
  return resBody;
};

export const getOneGroupThunk = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(fetchOneGroup(resBody));
  return resBody;
};

export const createGroupThunk = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(fetchOneGroup(resBody));
  return resBody;
};

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALL_GROUPS: {
      return { ...state, allGroups: action.groups };
    }
    case FETCH_ONE_GROUP: {
      return { ...state, singleGroup: action.group };
    }
    default:
      return state;
  }
};
export default groupsReducer;
