import { csrfFetch } from "./csrf";

const FETCH_EVENTS = "events/FETCH_EVENTS";
const FETCH_EVENT = "events/FETCH_EVENT";

const actionFetchAllEvents = (events) => ({
  type: FETCH_EVENTS,
  events,
});

const actionFetchOneEvent = (event) => ({
  type: FETCH_EVENT,
  event,
});

export const fetchAllEventsThunk = () => async (dispatch) => {
  const response = await fetch("/api/events");
  const resBody = await response.json();
  if (response.ok) dispatch(actionFetchAllEvents(resBody["Events"]));
  return resBody;
};

export const thunkGtOneEvnt = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(actionFetchOneEvent(resBody));
  return resBody;
};

export const thunkGtGrpEvnts = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);
  const resBody = await response.json();
  if (response.ok) dispatch(actionFetchAllEvents(resBody["Events"]));
  return resBody;
};

// Initial state
const initialState = {
  allEvents: [],
  singleEvent: null,
};

// Reducer
const eventsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FETCH_EVENTS:
      newState = Object.assign({}, state);
      newState.allEvents = action.events;
      return newState;
    case FETCH_EVENT:
      newState = Object.assign({}, state);
      newState.singleEvent = action.event;
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
