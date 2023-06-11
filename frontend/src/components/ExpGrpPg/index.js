import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as groupActions from "../../store/groups";
import ExpNav from "../ExpNav";
import GrpCrd from "../GrpCrd";

const ExpGrpPg = () => {
  const dispatch = useDispatch();
  const allGroups = useSelector((state) => Object.values(state.groups.allGroups));

  useEffect(() => {
    dispatch(groupActions.thunkGetAllGroups());
  }, [dispatch]);

  const renderGroupCards = () => {
    return allGroups.map((group) => (
      <GrpCrd key={group.id} group={group} />
    ));
  };

  return (
    <>
      <ExpNav />
      <h2>Groups in MergePoint</h2>
      <div className="GrpCrd-Li">{renderGroupCards()}</div>
    </>
  );
};

export default ExpGrpPg;
