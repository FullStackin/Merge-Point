import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./CreateEventForm.css";

const CreateEventForm = ({ event, isEditting }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const group = useSelector((state) => state.groups.singleGroup);

  const [name, setName] = useState(event?.name || "");
  const [price, setPrice] = useState(event?.price.toString() || "");
  const [type, setType] = useState(event?.type || "");
  const [description, setDescription] = useState(event?.about || "");
  const [startDate, setStartDate] = useState(event?.startDate || "");
  const [endDate, setEndDate] = useState(event?.endDate || "");
  const [url, setUrl] = useState("");

  const [validationErrors, setValidationErrors] = useState({});

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

    if (!name) errors["name"] = "Name is required";
    if (!type) errors["type"] = "Type is required";
    if (!price) errors["price"] = "Price is required";
    if (!startDate) errors["startDate"] = "Start date is required";
    if (!endDate) errors["endDate"] = "End date is required";
    if (!isEditting && !url.match(/(\.png|\.jpg|\.jpeg)\s*$/))
      errors["url"] = "Preview image url must end with .png, .jpg, or .jpeg";
    if (!description || description.length < 30)
      errors["description"] = "Description needs 30 or more characters";
    if (description & (description.length > 1000))
      errors["description"] = "Description cannot exceed 1000 characters";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const eventData = {
      name,
      type,
      price: Number(price),
      startDate,
      endDate,
      description: description,
      previewImage: url,
      capacity: 100,
    };
    const eventImage = {
      url,
      preview: true,
    };

    let res = dispatch(eventActions.thunkCreateEvent(eventData, group.id)).then(
      async (res) => {
        console.log(res);
        if (res.errors) {
          setValidationErrors(res.errors);
        } else {
          if (!isEditting)
            dispatch(eventActions.thunkAddEventImage(eventImage, res.id));
          setValidationErrors({});
          history.push(`/events/${res.id}`);
        }
      }
    );
    console.log(validationErrors);
  };

  return (
    <div className="cep">
      <form className="cef" onSubmit={onSubmit}>
        <section>
          <h2 className="eft">Create a new event for {group.name}</h2>
          <p>What is the name of your event?</p>
          <input
            value={name}
            placeholder="Event Name"
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <p className="err">{validationErrors.name}</p>
          )}
        </section>

        <section>
          <p>Is this an in-person or online group?</p>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value={""} hidden disabled>
              (Select One)
            </option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {validationErrors.type && (
            <p className="error">{validationErrors.type}</p>
          )}

          <p>What is the price for your event?</p>
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
          <p>When does your event start?</p>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {validationErrors.startDate && (
            <p className="error">{validationErrors.startDate}</p>
          )}

          <p>When does your event end?</p>
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
              <p>Please add an image url for your event below:</p>
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

          <p>Please describe your event</p>
          <textarea
            value={description}
            placeholder="Please include at least 30 characters."
            rows="6"
            cols="40"
            onChange={(e) => setDescription(e.target.value)}
          />
          {validationErrors.description && (
            <p className="error">{validationErrors.description}</p>
          )}

          <button type="submit">Create Event</button>
        </section>
      </form>
    </div>
  );
};

export default CreateEventForm;
