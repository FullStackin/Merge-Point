import { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";

import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ExpGrpPg from "./components/ExpGrpPg";
import GrpPg from "./components/GrpPg";
import FnEvPg from "./components/FnEvPg";
import EvPg from "./components/EvPg";
import CrtGrpFrm from "./components/CrtGrpFrm";
import EdGrpFrm from "./components/EdGrpFrm";
import CrtEvFrm from "./components/CrtEvFrm";
import EdEvFrm from "./components/EdEvFrm";

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
          <Route exact path="/groups">
            <ExpGrpPg />
          </Route>
          <Route path="/groups/new">
            <CrtGrpFrm />
          </Route>
          <Route path="/groups/:groupId/edit">
            <EdGrpFrm />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <CrtEvFrm />
          </Route>
          <Route path="/groups/:groupId">
            <GrpPg />
          </Route>
          <Route exact path="/events">
            <FnEvPg />
          </Route>
          <Route path="/events/:eventId/edit">
            <EdEvFrm />
          </Route>
          <Route path="/events/:eventId">
            <EvPg />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
