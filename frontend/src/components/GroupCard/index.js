import { useHistory } from "react-router-dom";
import "./GroupCard.css";

const GroupCard = ({ group }) => {
  const history = useHistory();

  const onClick = () => {
    history.push(`/groups/${group.id}`);
  };

  return (
    <div className="card-container">
      <article className="card" onClick={onClick}>
        <div className="card__img">
          <img src={group.previewImage} alt={group.name} />
        </div>
        <header className="card__hdr">
          <h2 className="card__ttl">{group.name}</h2>
          <p className="card__loc">
            {group.city}, {group.state}
          </p>
        </header>
        <p className="card__abt">{group.about}</p>
        <footer className="card__ftr">
          <p>
            {group.events && group.events.length}{" "}
            {group.events && group.events.length === 1 ? "event" : "events"}
          </p>
          <p>&bull;</p>
          <p>{group.private ? "Private" : "Public"}</p>
        </footer>
      </article>
    </div>
  );
};

export default GroupCard;
