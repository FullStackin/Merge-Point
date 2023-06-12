import { useHistory } from "react-router-dom";
import "./GrpCrd.css";

const GrpCrd = ({ group }) => {
  const history = useHistory();

  const onClick = () => {
    history.push(`/groups/${group.id}`);
  };

  return (
    <div className="card-container">
      <article className="card" onClick={onClick}>
        <div className="card__img">
          <img
            src="https://cdn.discordapp.com/attachments/953413775149633536/1117620194467123320/watchesandmore_In_the_depths_of_the_Matrix_a_bustling_city_stre_b1fce0d1-ee70-40bf-af88-f6e2ad457523.png"
            alt=""
          />
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

export default GrpCrd;
