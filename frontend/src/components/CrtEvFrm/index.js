import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./CrtEvFrm.css";

const CrtEvFrm = ({ event, isEditting }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const group = useSelector((state) => state.groups.singleGroup);

  const [name, setName] = useState(event?.name || "");
  const [price, setPrice] = useState(event?.price.toString() || "");
  const [type, setType] = useState(event?.type || "");
  const [description, setDescription] = useState(event?.description || "");
  const [startDate, setStartDate] = useState(event?.startDate || "");
  const [endDate, setEndDate] = useState(event?.endDate || "");
  const [url, setUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(isEditting ? group.private : "");

  const [validationErrors, setValidationErrors] = useState({});
  console.log(groupId);
  
  useEffect(() => {
    if (
      (isEditting && group && Number(group.id) === Number(event["Group"].id)) ||
      (group && Number(group.id) === Number(groupId))
    )
      return;
    if (groupId) {
      dispatch(groupActions.thunkGetOneGroup(groupId));
    }
  }, []);

  if (!group.id) return null;

  const validateInput = () => {
    const errors = {};

    setName(name.trim());
    setPrice(price.trim());
    setDescription(description.trim());
    setUrl(url.trim());

    if (!name) errors["name"] = "Name is required";
    if (!type) errors["type"] = "Type is required";
    if (
      isPrivate !== true &&
      isPrivate !== false &&
      isPrivate !== "true" &&
      isPrivate !== "false"
    )
      errors["private"] = "Privacy is required";
    if (!price) errors["price"] = "Price is required";
    if (!startDate) errors["startDate"] = "Start date is required";
    if (!endDate) errors["endDate"] = "End date is required";
    if (!isEditting && !url.match(/(\.png|\.jpg|\.jpeg)\s*$/))
      errors["url"] = "Preview image url must end with .png, .jpg, or .jpeg";
    if (!description || description.length < 30)
      errors["description"] = "About length needs to be 30 characters or more";
    if (description & (description.length > 1000))
      errors["description"] = "About cannot exceed 500 characters";

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const eventData = {
      id: isEditting ? event.id : undefined,
      name,
      type,
      price,
      startDate,
      endDate,
      description: description,
      private: isPrivate,
      previewImage: url,
      capacity: 100,
    };
    const eventImage = {
      url,
      preview: true,
    };

    dispatch(
      isEditting
        ? eventActions.thunkUpdateEvent(eventData)
        : eventActions.thunkCreateEvent(eventData, group.id)
    )
      .then(async (event) => {
        if (!isEditting)
          dispatch(eventActions.thunkAddEventImage(eventImage, event.id));
        history.push(`/events/${event.id}`);
      })
      .catch(async (res) => {
        const resBody = await res.json();
        setValidationErrors(resBody.errors);
      });
  };

  const returnToGroup = () => {
    history.push(`/groups/${group.id}`);
  };

  const returnToEvent = () => {
    history.push(`/events/${event.id}`);
  };

  if (!group) return null;

  return (
    <div className="cep">
      <div className="rn">
        <button
          className="rb"
          onClick={isEditting ? returnToEvent : returnToGroup}
        >
          Return to {isEditting ? "Event" : "Group"}
        </button>
      </div>
      <form className="cef" onSubmit={onSubmit}>
        <section>
          <h2 className="eft">Start a MergePoint for {group.name}</h2>
          <p>What is the name of this MergePoint event?</p>
          <input
            value={name}
            placeholder="MergePoint Name"
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <p className="err">{validationErrors.name}</p>
          )}
        </section>

        <section>
          <p>Is this an in person or an online event?</p>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value={""} hidden disabled>
              (Select One)
            </option>
            <option value="In Person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {validationErrors.type && (
            <p className="error">{validationErrors.type}</p>
          )}

          <p>Is this event public or private?</p>
          <select
            value={isPrivate}
            onChange={(e) => setIsPrivate(e.target.value)}
          >
            <option value={""} hidden disabled>
              (Select One)
            </option>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
          {validationErrors.private && (
            <p className="error">{validationErrors.private}</p>
          )}

          <p>What is the price for this MergePoint event?</p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="price-input"
          />
          {validationErrors.price && (
            <p className="error">{validationErrors.price}</p>
          )}
        </section>

        <section>
          <p>When will this MergePoint event start?</p>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {validationErrors.startDate && (
            <p className="error">{validationErrors.startDate}</p>
          )}

          <p>When will this MergePoint event end?</p>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {validationErrors.endDate && (
            <p className="error">{validationErrors.endDate}</p>
          )}
        </section>

        <section>
          {!isEditting && (
            <>
              <p>Please add an image url for this event:</p>
              <input
                type="text"
                value={url}
                placeholder="Image URL"
                onChange={(e) => setUrl(e.target.value)}
              />
              {validationErrors.url && (
                <p className="error">{validationErrors.url}</p>
              )}
            </>
          )}

          <p>Please add a description of this event:</p>
          <textarea
            value={description}
            placeholder="About MergePoint..."
            rows="6"
            cols="40"
            onChange={(e) => setDescription(e.target.value)}
          />
          {validationErrors.description && (
            <p className="error">{validationErrors.description}</p>
          )}

          <button type="submit">
            {isEditting ? "Update MergePoint" : "Create MergePoint"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default CrtEvFrm;
