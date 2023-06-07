import { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import sessionReducer, { thunkGtSess } from "./store/session";

import Navigation from "./components/Navigation";
import ExploreGroupsPage from "./components/ExploreGroupsPage";
import GroupsPages from "./components/GroupsPages";
import HomePage from "./components/HomePage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkGtSess()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/groups">
            <ExploreGroupsPage />
          </Route>
          <Route path="/groups/:groupId">
            <GroupsPages />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
