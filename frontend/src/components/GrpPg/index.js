import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import EvCrd from "../EventCard";
import CnFrmDelMod from "../ConfirmDeleteModal";
import OpenModalButton from "../OpenModalButton";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./GrpPg.css";

const GrpPg = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const groupData = useSelector((state) => state.groups.singleGroup);
  const eventsState = useSelector((state) => state.events.allEvents);
  const events = Object.values(eventsState);

  const sortedEvents = events.sort((a, b) => {
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
    dispatch(groupActions.thunkGetOneGroup(groupId));
    dispatch(eventActions.thunkGetGroupEvents(groupId));
  }, [dispatch, groupId]);

  if (!groupData.id || Number(groupData.id) !== Number(groupId)) return null;

  const images = groupData["GroupImages"];
  const previewImageUrl = images.find((img) => img.preview)?.url;

  const returnToGroups = () => {
    history.push("/groups");
  };

  const onClickJoin = () => {
    alert("Feature coming soon!");
  };

  const onClickCreate = () => {
    history.push(`/groups/${groupId}/events/new`);
  };

  const onClickEdit = () => {
    history.push(`/groups/${groupId}/edit`);
  };

  let availableButtons;
  if (user && groupData) {
    if (Number(user.id) === Number(groupData["Organizer"].id)) {
      availableButtons = [
        <button key={1} className="create-btn" onClick={onClickCreate}>
          Create Event
        </button>,
        <button key={2} className="edit-btn" onClick={onClickEdit}>
          Update Group
        </button>,
        <OpenModalButton
          buttonText="Delete Group"
          modalComponent={
            <CnFrmDelMod type="group" what={groupData} path="/groups" />
          }
        />,
      ];
    } else {
      availableButtons = [
        <button key={1} className="join-btn" onClick={onClickJoin}>
          Join this Group!
        </button>,
      ];
    }
  }

  return (
    groupData && (
      <div className="group-details-page">
        <div className="return-nav">
          <button className="return-btn" onClick={returnToGroups}>
            Return to Groups
          </button>
        </div>
        <div className="group-header">
          <img
            src="https://cdn.discordapp.com/attachments/1008571029804810332/1112799072840065055/Mercado_Bitcoin_people_representing_a_tech_community_in_with_ba_0838be62-0053-4e65-851a-6e17d549a3de.png"
            alt="Group Preview"
            className="group-image"
          />
          <div className="group-info">
            <h2 className="group-name">{groupData.name}</h2>
            <p className="group-location">
              {groupData.city}, {groupData.state}
            </p>
            <div className="group-membership">
              <p>{groupData.numMembers} Members</p>
              <p>&bull;</p>
              <p>{groupData.private ? "Private" : "Public"}</p>
            </div>
            <p>
              Organized by &nbsp;
              <span className="organizer">
                {groupData["Organizer"].firstName}{" "}
                {groupData["Organizer"].lastName}
              </span>
            </p>

            <button className="JoinTheGrp">Join this group</button>
          </div>
          <div className="group-actions">{availableButtons}</div>
        </div>
        <div className="group-body">
          <div className="organizer">
            <h3>Organizer</h3>
            <p>
              <span className="organizer-name">
                {groupData["Organizer"].firstName}{" "}
                {groupData["Organizer"].lastName}
              </span>
            </p>
          </div>
          <div className="group-about">
            <h3>About</h3>
            <p>{groupData.about}</p>
          </div>
          <div className="group-events">
            <h3>Events ({events.length})</h3>
            <div className="events-list">
              {events &&
                sortedEvents.map((event) => (
                  <EvCrd key={event.id} event={event} group={groupData} />
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GrpPg;
