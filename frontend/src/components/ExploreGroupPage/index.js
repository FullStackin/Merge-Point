import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as groupActions from "../../store/groups";
import ExploreNavigation from "../ExploreNavigation";
import GroupCard from "../GroupCard";
import "./ExploreGroupPage.css";

const ExploreGroupPage = () => {
  const dispatch = useDispatch();
  const allGroups = useSelector((state) =>
    Object.values(state.groups.allGroups)
  );

  useEffect(() => {
    dispatch(groupActions.thunkGetAllGroups());
  }, [dispatch]);

  const renderGroupCards = () => {
    return allGroups.map((group) => <GroupCard key={group.id} group={group} />);
  };

  return (
    <div className="ExploreGroupPage">
      <ExploreNavigation />
      <div className="GroupCard-Li">{renderGroupCards()}</div>
    </div>
  );
};

export default ExploreGroupPage;
