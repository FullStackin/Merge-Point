import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_ONE_EVENT = "events/GET_ONE_EVENT";
const CREATE_EVENT = "events/CREATE_EVENT";
const DELETE_EVENT = "events/DELETE_EVENT";
const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";

const actionGetAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events,
  };
};

const actionGetOneEvent = (event) => {
  return {
    type: GET_ONE_EVENT,
    event,
  };
};

const actionCreateEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

const actionDeleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId,
  };
};

const actionAddEventImage = (eventImage) => {
  return {
    type: ADD_EVENT_IMAGE,
    eventImage: eventImage,
  };
};

export const thunkGetAllEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");
  const resBody = await response.json();

  const events = {};
  if (resBody.Events)
    resBody.Events.forEach((event) => (events[event.id] = event));

  if (response.ok) dispatch(actionGetAllEvents(resBody["Events"]));
  return resBody;
};

export const thunkGetOneEvent = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(actionGetOneEvent(resBody));
  return resBody;
};

export const thunkGetGroupEvents = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);
  const resBody = await response.json();
  if (response.ok) dispatch(actionGetAllEvents(resBody["Events"]));
  return resBody;
};

export const thunkCreateEvent = (event, groupId) => async (dispatch) => {
  console.log("at create event funk");

  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    const resBody = await response.json();
    console.log("BODDIED", resBody);
    if (!response.ok) {
      const error = await response.json();
      console.error("Error response from server:", error);
      return error;
    }

    console.log(resBody);
    dispatch(actionCreateEvent(resBody));
    return resBody;
  } catch (error) {
    console.log("Error occurred while making request:", error);
    const e = await error.json();
    return e;
  }
};

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  const resBody = await response.json();
  if (response.ok) dispatch(actionDeleteEvent(eventId));
  return resBody;
};

export const thunkUpdateEvent = (event) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${event.id}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
  const resBody = await response.json();
  if (response.ok) dispatch(actionCreateEvent(resBody));
  return resBody;
};

export const thunkAddEventImage = (eventImage, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    body: JSON.stringify(eventImage),
  });
  const resBody = await response.json();
  if (response.ok) dispatch(actionAddEventImage(eventImage));
  return resBody;
};

const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS: {
      return { ...state, allEvents: action.events };
    }
    case GET_ONE_EVENT: {
      return { ...state, singleEvent: action.event };
    }
    case CREATE_EVENT: {
      const allEvents = {
        ...state.allEvents,
        [action.event.id]: action.event,
      };
      const singleEvent = {
        ...action.event,
        EventImages: [],
      };
      return { ...state, allEvents, singleEvent };
    }
    case ADD_EVENT_IMAGE: {
      const singleEvent = {
        ...state.singleEvent,
        EventImages: [action.eventImage],
      };
      return { ...state, singleEvent };
    }
    default:
      return state;
  }
};

export default eventsReducer;
