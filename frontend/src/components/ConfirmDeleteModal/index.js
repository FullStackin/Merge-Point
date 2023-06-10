import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./CnFrmDelMod.css";

const CnFrmDelMod = ({ what, type, path }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  let deleteThunk;
  switch (type) {
    case "group":
      deleteThunk = groupActions.thunkDeleteGroup;
      break;
    case "event":
      deleteThunk = eventActions.thunkDeleteEvent;
      break;
    default:
      break;
  }

  const onClickDelete = () => {
    dispatch(deleteThunk(what.id));
    closeModal();
    history.push(path);
  };

  return (
    <div className="CnFrmDelMod">
      <h2>
        Are you sure you want to delete
        <span className="DelN">{what.name}</span>?
      </h2>
      <button className="CnFrmDelbttn" onClick={onClickDelete}>
        Confirm delete
      </button>
      <button className="cancel-delete-button" onClick={closeModal}>
        Cancel
      </button>
    </div>
  );
};

export default CnFrmDelMod;
