import { useHistory } from "react-router-dom";
import "./GrpCrd.css";

const GrpCrd = ({ group }) => {
  const history = useHistory();

  const onClick = () => {
    history.push(`/groups/${group.id}`);
  };

  return (
    <article className="card" onClick={onClick}>
      <div className="card__img">
        <img src={group.previewImage} alt="" />
      </div>
      <header className="card__hdr">
        <h2 className="card__ttl">{group.name}</h2>
        <p className="card__loc">
          {group.city}, {group.state}
        </p>
      </header>
      <p className="card__abt">{group.about}</p>
      <footer className="card__ftr">
        <p>## Events</p>
        <p>&bull;</p>
        <p>{group.private ? "Private" : "Public"}</p>
      </footer>
    </article>
  );
};

export default GrpCrd;
