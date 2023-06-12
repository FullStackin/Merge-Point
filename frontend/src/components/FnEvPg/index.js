import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import EvCrd from "../EventCard";
import * as eventActions from "../../store/events";
import ExpNav from "../ExpNav";

const FnEvPg = () => {
  const dispatch = useDispatch();
  const allEventsState = useSelector((state) => state.events.allEvents);
  const allEvents = Object.values(allEventsState);
  const sortedEvents = allEvents.sort((a, b) => {
    const startDateA = new Date(a.startDate).getTime();
    const startDateB = new Date(b.startDate).getTime();

    const now = new Date().getTime();
    if (startDateA > now && startDateB <= now) {
      return -1;
    } else if (startDateB > now && startDateA < now) {
      return 1;
    } else {
      return startDateA - startDateB;
    }
  });

  useEffect(() => {
    dispatch(eventActions.thunkGetAllEvents());
  }, [dispatch]);

  return (
    <>
      <ExpNav />
      <h2>MergePoint Events</h2>
      <div className="EvCrd-li">
        {allEvents &&
          sortedEvents.map((event) => <EvCrd key={event.id} event={event} />)}
      </div>
    </>
  );
};

export default FnEvPg;
