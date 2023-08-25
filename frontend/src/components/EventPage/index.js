import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import CnFrmDelMod from "../ConfirmDeleteModal";
import "./EventPage.css";
import {
  faClock,
  faMapMarkerAlt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.session.user);
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);

  useEffect(() => {
    (async () => {
      const event = await dispatch(eventActions.thunkGetOneEvent(eventId));
      if (event.Group) dispatch(groupActions.thunkGetOneGroup(event.Group.id));
    })();
  }, [dispatch, eventId]);

  if (!event.id || !group.id || Number(event.id) !== Number(eventId))
    return null;

  const eventPreviewImageUrl = event["EventImages"].find(
    (img) => img.preview
  )?.url;
  const groupPreviewImageUrl = group["GroupImages"].find(
    (img) => img.preview
  )?.url;

  const onClickEdit = () => {
    history.push(`/events/${eventId}/edit`);
  };

  const returnToEvents = () => {
    history.push("/events");
  };

  return (
    event && (
      <div className="event-details-page">
        <div className="return-nav">
          <button className="return-button" onClick={returnToEvents}>
            Return Events
          </button>
        </div>
        <h2 className="event-details__name">{event.name}</h2>
        <p className="event-details__host">
          Hosted by&nbsp;
          <span className="organizer">
            {group["Organizer"].firstName}&nbsp;
            {group["Organizer"].lastName}
          </span>
        </p>
        <section className="event-details-header">
          <img
            src={eventPreviewImageUrl}
            className="event-details__image"
            alt="event"
          />
          <section className="event-details__about">
            <h2 className="gray-header">Details</h2>
            <p className="event-details__group-description">
              {event.description}
            </p>
          </section>
          <div className="event-details__group-info">
            <img
              src={groupPreviewImageUrl}
              className="event-details__group-image"
              alt="group"
            />
            <div className="event-details__group-details">
              <h3 className="event-details__group-name">{group.name}</h3>
              <p className="public-private">
                {group.private ? "Private" : "Public"}
              </p>
            </div>
          </div>
          <div className="event-details__event-info">
            <div className="event-details__date">
              <p>
                <FontAwesomeIcon icon={faClock} /> START
              </p>
              <p>{event.startDate}</p>
              <p>
                <FontAwesomeIcon icon={faClock} /> END
              </p>
              <p>{event.endDate}</p>
            </div>
            <div className="event-details__price">
              <FontAwesomeIcon icon={faMoneyBillWave} />{" "}
              {event.price > 0 ? event.price : "FREE"}
            </div>
            <div className="event-details__type">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {event.type}
            </div>
            <div className="event-details__actions">
              {user && user.id === group.organizerId && (
                <>
                  <button className="edit-event" onClick={onClickEdit}>
                    Update MergePoint
                  </button>
                  <OpenModalButton
                    buttonText="Delete MergePoint"
                    modalComponent={
                      <CnFrmDelMod
                        type="event"
                        what={event}
                        path={`/groups/${group.id}`}
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    )
  );
};

export default EventPage;
