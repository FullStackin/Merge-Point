import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import EvCrd from "../EventCard";
import * as eventActions from "../../store/events";
import ExpNav from "../ExpNav";

const FnEvPg = () => {
  const dispatch = useDispatch();
  const allEventsState = useSelector((state) => state.events.allEvents);
  const allEvents = Object.values(allEventsState);

  useEffect(() => {
    dispatch(eventActions.thunkGetAllEvents());
  }, [dispatch]);

  return (
    <>
      <ExpNav />
      <h2>MergePoint Events In {"<site here>"}</h2>
      <div className="EvCrd-li">
        {allEvents &&
          allEvents.map((event) => <EvCrd key={event.id} event={event} />)}
      </div>
    </>
  );
};

export default FnEvPg;
