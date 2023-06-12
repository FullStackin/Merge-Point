import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import CnFrmDelMod from "../ConfirmDeleteModal";
import "./EvPg.css";

const EvPg = () => {
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
  console.log(event.EventImages);
  const eventPreviewImageUrl = event["EventImages"].find(
    (img) => img.preview
  )?.url;
  console.log(eventPreviewImageUrl);
  const groupPreviewImageUrl = group["GroupImages"].find(
    (img) => img.preview
  )?.url;

  const onClickEdit = () => {
    history.push(`/events/${eventId}/edit`);
  };

  let actionButtons;

  if (user && user.id === group.organizerId) {
    actionButtons = [
      <button className="edit-event" onClick={onClickEdit}>
        Update MergePoint
      </button>,
      <OpenModalButton
        buttonText="Delete MergePoint"
        modalComponent={
          <CnFrmDelMod type="event" what={event} path={`/groups/${group.id}`} />
        }
      />,
    ];
  }

  const returnToEvents = () => {
    history.push("/events");
  };

  return (
    event && (
      <>
        <div className="event-details-page">
          <div className="return-nav">
            <button className="return-button" onClick={returnToEvents}>
              Return to All MergePoint events
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
              src="https://cdn.discordapp.com/attachments/1008571029804810332/1115851058305040475/chapmaster_lion_roaring_with_kings_crown_19141255-93c0-48e6-806f-ec479b3351cf.png"
              className="event-details__image"
              alt="event"
            />
            <div className="event-details__group-info">
              <img
                src="https://cdn.discordapp.com/attachments/1008571029804810332/1115851058305040475/chapmaster_lion_roaring_with_kings_crown_19141255-93c0-48e6-806f-ec479b3351cf.png"
                className="event-details__group-image"
                alt="group"
              />
              <div className="event-details__group-details">
                <h3 className="event-details__group-name">{group.name}</h3>
                <p>{group.private ? "Private" : "Public"}</p>
              </div>
            </div>

            <div className="event-details__event-info">
              <div className="event-details__date">
                <p>START</p>
                <p>{event.startDate}</p>
                <p>END</p>
                <p>{event.endDate}</p>
              </div>
              <div className="event-details__price">
                {event.price > 0 ? event.price : "FREE"}
              </div>
              <div className="event-details__type">{event.type}</div>
              {actionButtons}
            </div>
          </section>
          <section className="event-details__about">
            <h2>Details</h2>
            <p>{event.description}</p>
          </section>
        </div>
      </>
    )
  );
};

export default EvPg;
