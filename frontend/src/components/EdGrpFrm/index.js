import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { thunkGetOneGroup } from "../../store/groups";
import CrtGrpFrm from "../CrtGrpFrm";

const EdGrpFrm = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);

  const isCurrentGroup = Number(group.id) === Number(groupId);
  const isAuthorized = user.id === group.organizerId;

  useEffect(() => {
    if (!isCurrentGroup) {
      dispatch(thunkGetOneGroup(groupId));
    }
  }, [dispatch, groupId, isCurrentGroup]);

  return (
    <>
      {isAuthorized ? (
        isCurrentGroup && <CrtGrpFrm group={group} isEditing={true} />
      ) : (
        <h2>Not Authorized</h2>
      )}
    </>
  );
};

export default EdGrpFrm;
