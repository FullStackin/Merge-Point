import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_ONE_GROUP = "groups/GET_ONE_GROUP";
const CREATE_GROUP = "groups/CREATE_GROUP";
const ADD_GROUP_IMAGE = "groups/ADD_GROUP_IMAGE";
const DELETE_GROUP = "groups/DELETE_GROUP";

const actionGetAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups,
  };
};

const actionGetOneGroup = (group) => {
  return {
    type: GET_ONE_GROUP,
    group,
  };
};

const actionCreateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group,
  };
};

const actionDeleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId,
  };
};

const actionAddGroupImage = (groupImage) => {
  return {
    type: ADD_GROUP_IMAGE,
    groupImage,
  };
};

const actionUpdateGroup = (updatedGroup) => {
  return {
    type: "UPDATE_GROUP",
    group: updatedGroup,
  };
};

export const thunkGetAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  const resBody = await response.json();

  const groups = {};
  resBody["Groups"].forEach((group) => (groups[group.id] = group));

  if (response.ok) dispatch(actionGetAllGroups(groups));
  return resBody;
};

export const thunkGetOneGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(actionGetOneGroup(resBody));
  return resBody;
};

export const thunkCreateGroup = (group) => async (dispatch) => {
  console.log("at create group thunk", group);

  try {
    const response = await csrfFetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    });
    const resBody = await response.json();
    console.log("BODDIED", resBody);
    if (!response.ok) {
      const error = await response.json();
      console.error("Error response from server:", error);
      return error;
    }

    console.log(resBody);
    dispatch(actionCreateGroup(resBody));
    return resBody;
  } catch (error) {
    console.log("Error occurred while making request:", error);
    const e = await error.json();
    return e;
  }
};

export const thunkUpdateGroup = (groupId, payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const resBody = await response.json();
  if (response.ok) {
    dispatch(actionUpdateGroup(resBody));
  }
  return resBody;
};

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  const resBody = await response.json();
  if (response.ok) dispatch(actionDeleteGroup(groupId));
  return resBody;
};

export const thunkAddGroupImage = (groupImage, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: JSON.stringify(groupImage),
  });
  const resBody = await response.json();
  if (response.ok) dispatch(actionAddGroupImage(groupImage));
  return resBody;
};

export const thunkUpdateGroupImage =
  (groupImage, groupId) => async (dispatch) => {
    await csrfFetch(`/api/group-images/${groupImage.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(groupImage),
    });

    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(groupImage),
    });
    const resBody = await response.json();
    if (response.ok) dispatch(actionAddGroupImage(groupImage));
    return resBody;
  };

const initialState = { allGroups: {}, singleGroup: {} };

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_GROUPS: {
      console.log(action.groups);
      return { ...state, allGroups: action.groups };
    }
    case GET_ONE_GROUP: {
      return { ...state, singleGroup: action.group };
    }
    case CREATE_GROUP: {
      const allGroups = {
        ...state.allGroups,
        [action.group.id]: action.group,
      };
      const singleGroup = {
        ...action.group,
        Organizer: { id: action.group.organizerId },
        GroupImages: [],
      };
      return { ...state, allGroups, singleGroup };
    }
    case DELETE_GROUP: {
      const allGroups = { ...state.allGroups };
      delete allGroups[action.groupId];
      return { allGroups, singleGroup: {} };
    }
    case ADD_GROUP_IMAGE: {
      const singleGroup = {
        ...state.singleGroup,
        GroupImages: [action.groupImage],
      };
      return { ...state, singleGroup };
    }
    default:
      return state;
  }
};

export default groupsReducer;
