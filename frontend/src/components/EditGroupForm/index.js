import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { thunkGetOneGroup } from "../../store/groups";
import CreateGroupForm from "../CreateGroupForm";

const EditGroupForm = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);
  const history = useHistory();

  const isCurrentGroup = Number(group.id) === Number(groupId);
  const isAuthorized = user.id === group.organizerId;

  useEffect(() => {
    if (!isCurrentGroup) {
      dispatch(thunkGetOneGroup(groupId));
    }
  }, [dispatch, groupId, isCurrentGroup]);

  if (!isAuthorized) history.push("/");

  return (
    <>
      {isAuthorized ? (
        isCurrentGroup && <CreateGroupForm group={group} isEditing={true} />
      ) : (
        <h2>Not Authorized</h2>
      )}
    </>
  );
};

export default EditGroupForm;
