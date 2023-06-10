import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as groupActions from "../../store/groups";
import "./CrtGrpFrm.css";

const CrtGrpFrm = ({ group, isEditting }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [city, setCity] = useState(group?.city || "");
  const [state, setState] = useState(group?.state || "");
  const [name, setName] = useState(group?.name || "");
  const [about, setAbout] = useState(group?.about || "");
  const [type, setType] = useState(group?.type || "");
  const [isPrivate, setIsPrivate] = useState(isEditting ? group.private : true);
  const image = group?.GroupImages?.find((img) => img.preview);
  const [url, setUrl] = useState(image?.url || "");

  const [validationErrors, setValidationErrors] = useState({});

  const validateInput = () => {
    setValidationErrors({});

    if (!city) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        city: "City is required",
      }));
    }
    if (!state) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        state: "State is required",
      }));
    }
    if (!name) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        name: "Name is required",
      }));
    }
    if (!type) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        type: "type is required",
      }));
    }
    if (!url) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        url: "Preview image url is required",
      }));
    }
    if (!about) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        about: "Description is required",
      }));
    }
    if (about && about.length < 50) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        about: "Description must be more than 50 characters",
      }));
    }

    if (!isPrivate) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        private: "Privacy is required",
      }));
    }
    if (!url.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
      setValidationErrors((prevErr) => ({
        ...prevErr,
        url: "Preview image url must end with .png, .jpg, or .jpeg",
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    validateInput();
    console.log(validationErrors, "validation errors");

    if (Object.keys(validationErrors).length > 0) return;
    console.log("entering");

    const groupData = {
      id: isEditting ? group.id : undefined,
      name,
      city,
      state,
      about,
      type,
      previewImage: url,
      private: isPrivate,
    };
    const groupImage = {
      id: isEditting ? image?.id : undefined,
      url,
      preview: true,
    };

    // dispatch(
    //   isEditting
    // ? groupActions.thunkUpdateGroup(groupData)
    //     : groupActions.thunkCreateGroup(groupData)
    // )
    dispatch(groupActions.thunkCreateGroup(groupData))
      .then(async (group) => {
        if (url !== image?.url)
          await dispatch(
            isEditting
              ? groupActions.thunkUpdateGroupImage(groupImage, group.id)
              : groupActions.thunkAddGroupImage(groupImage, group.id)
          );
        history.push(`/groups/${group.id}`);
      })
      .catch(async (res) => {
        const resBody = await res.json();
        setValidationErrors(resBody.errors);
      });
  };

  return (
    <div>
      <form className="CGF" onSubmit={onSubmit}>
        <section>
          <p>Start Organizing MergePoints!</p>
        </section>
        <section>
          <h3>Lets set your MergePoint's location.</h3>
          <p>
            MergePoint merges locally, in person and online. We'll connect you
            with people in your area, and more will join you online.
          </p>
          <div className="location-inputs">
            <div>
              <input
                value={city}
                type="text"
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
              />
              {/* {validationErrors.city && (
                <p className="error">{validationErrors.city}</p>
              )} */}
            </div>
            <div>
              <input
                value={state}
                type="text"
                placeholder="STATE"
                onChange={(e) => setState(e.target.value)}
              />
              {/* {validationErrors.state && (
                <p className="error">{validationErrors.state}</p>
              )} */}
            </div>
          </div>
        </section>
        <section>
          <h3>What is the name of your MergePoint?</h3>
          <p>
            Choose a name that will give people a clear idea of what the
            MergePoint is all about.
          </p>
          <input
            value={name}
            type="text"
            placeholder="MergePoint Name"
            onChange={(e) => {
              setName(e.target.value);
              console.log("name", name);
            }}
          />
          {/* {validationErrors.name && (
            <p className="error">{validationErrors.name}</p>
          )} */}
        </section>
        <section>
          <h3>Please add a about of this MergePoint event:</h3>
          <p>
            People will see this when we promote your MergePoint, but you'll be
            able to add to it later, too. Here are some recommended topics to
            cover that will help people visiting your MergePoint's page.
          </p>
          <ol>
            <li>Whats your favorite Technology Stack?</li>
            <li>in office work? hybrid? or fully remote?</li>
            <li>Whats your tech setup look like?</li>
            <li>how many open Source projects have you worked on?</li>
            <li>Why did you choose a career in tech?</li>
          </ol>
          <textarea
            value={about}
            placeholder="About us..."
            rows="6"
            cols="40"
            onChange={(e) => setAbout(e.target.value)}
          />

          {/* {validationErrors.about && (
            <p className="error">{validationErrors.about}</p>
          )} */}
        </section>
        <section>
          <p>Is this an online or in-person MergePoint?</p>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value={""} hidden disabled>
              (Select One)
            </option>
            <option value="In Person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {/* {validationErrors.type && (
            <p className="error">{validationErrors.type}</p>
          )} */}
          <p>Is this MergePoint public or private?</p>
          <div>
            <fieldset>
              <label htmlFor="public">Public</label>
              <input
                type="radio"
                id="public"
                checked={isPrivate}
                name="public"
                value={true}
                onChange={(e) => {
                  setIsPrivate(true);
                  console.log(e.target.value, "public");
                }}
              />
              <label htmlFor="private">Private</label>
              <input
                type="radio"
                id="private"
                checked={!isPrivate}
                name="private"
                value={false}
                onChange={(e) => {
                  setIsPrivate(false);
                  console.log(e.target.value, "private");
                }}
              />
            </fieldset>
          </div>
          {/* {validationErrors.private && (
            <p className="error">{validationErrors.private}</p>
          )} */}
          <p>Please add an image url for your MergePoint</p>
          <input
            value={url}
            type="text"
            placeholder="image url"
            onChange={(e) => setUrl(e.target.value)}
          />
          {/* {validationErrors.url && (
            <p className="error">{validationErrors.url}</p>
          )} */}
        </section>
        <section>
          <button type="submit">
            {(isEditting ? "Update" : "Create") + " MergePoint"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default CrtGrpFrm;
