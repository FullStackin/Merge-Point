import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";

import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ExploreGroupPage from "./components/ExploreGroupPage";
import GroupPage from "./components/GroupPage";
import FindEventPage from "./components/FindEventPage";
import EventPage from "./components/EventPage";
import CreateGroupForm from "./components/CreateGroupForm";
import EditGroupForm from "./components/EditGroupForm";
import CreateEventForm from "./components/CreateEventForm";
import EditEventForm from "./components/EditEventForm";
// import Register from "./components/Register";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.getSessionThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          {/* <Route exact path="/register">
            <Register />
          </Route> */}
          <Route exact path="/groups">
            <ExploreGroupPage />
          </Route>
          <Route path="/groups/new">
            <CreateGroupForm />
          </Route>
          <Route path="/groups/:groupId/edit">
            <EditGroupForm />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <CreateEventForm />
          </Route>
          <Route path="/groups/:groupId">
            <GroupPage />
          </Route>
          <Route exact path="/events">
            <FindEventPage />
          </Route>
          <Route path="/events/:eventId/edit">
            <EditEventForm />
          </Route>
          <Route path="/events/:eventId">
            <EventPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
