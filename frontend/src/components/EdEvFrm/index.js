import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { thunkGetOneEvent } from "../../store/events";
import { thunkGetOneGroup } from "../../store/groups";
import CrtEvFrm from "../CrtEvFrm";

const EdEvFrm = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);

  const isCurrentEvent = Number(event.id) === Number(eventId);
  const isCurrentGroup = Number(group.id) === Number(event?.Group?.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!isCurrentEvent) await dispatch(thunkGetOneEvent(eventId));

      if (!isCurrentGroup) dispatch(thunkGetOneGroup(event?.Group?.id));
    };

    fetchData();
  }, [dispatch, eventId, isCurrentEvent, isCurrentGroup, event?.Group?.id]);

  const isAuthorized = user.id === group?.organizerId;

  return (
    <>
      {isAuthorized ? (
        isCurrentEvent && <CrtEvFrm event={event} isEditing={true} />
      ) : (
        <h2>Not Authorized</h2>
      )}
    </>
  );
};

export default EdEvFrm;
