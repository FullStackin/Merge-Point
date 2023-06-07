import { thunkCrteSess, actionStNewSes } from "../../store/session";
import { useDispatch } from "react-redux";

const DummyUserButton = ({ onClick }) => {
  const dispatch = useDispatch();

  const logDummyUser = () => {
    dispatch(
      actionStNewSes.thunkCrteSess({
        credential: "firstUser",
        password: "password123",
      })
    );
    if (onClick) onClick();
  };

  return (
    <button type="submit" onClick={logDummyUser}>
      Dummy user Log in
    </button>
  );
};

export default DummyUserButton;
