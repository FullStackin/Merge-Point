import { useHistory } from "react-router-dom";
import "./EvCrd.css";

const EvCrd = ({ event, group }) => {
  const history = useHistory();

  const onClick = () => {
    history.push(`/events/${event.id}`);
  };

  return (
    <article className="evn_crd" onClick={onClick}>
      <div className="evn_crd_image">
        <img src={event.previewImage} alt="Event Preview" />
      </div>
      <header className="evn_crd_header">
        <p className="evn_crd_date">{event.startDate}</p>
        <h2 className="evn_crd_title">{event.name}</h2>
        <p className="evn_crd_location">
          {event.type === "In Person"
            ? `${event["Venue"]?.city || group?.city || "<city missing>"},
                ${event["Venue"]?.state || group?.state || "<state missing>"}`
            : "Online"}
        </p>
      </header>
      <p className="evnt-description">
        Test test test test Test test test test Test test test test Test test
        test test Test
      </p>
    </article>
  );
};

export default EvCrd;
