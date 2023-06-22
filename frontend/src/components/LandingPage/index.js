import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import SignupFormModal from "../SignupFormModal/index";
import "../SignupFormModal/SignupForm.css";

const LandingPage = () => {
  const history = useHistory();
  const session = useSelector((state) => state.session);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const signupFormRef = useRef(null);

  const startGroupClassName =
    "nlp-card__title " + (session && session.user ? "" : "nlp-disabled-link");

  const handleJoinMergePoint = () => {
    setShowSignupForm(true);
    if (signupFormRef.current) {
      signupFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="nlp-wrapper">
        <article className="nlp-intro">
          <div className="nlp-intro__text">
            <h1 className="nlp-intro__title">
              MergePoint The Tech Community - Where Innovation Thrives!
            </h1>
            <p>
              MergePoint is a tech community where innovation thrives. It's a
              platform for tech enthusiasts, professionals, and innovators to
              collaborate, share knowledge, and spark creativity. Join us to
              connect, learn, and make a difference in the world of technology.
            </p>
          </div>
          <img
            src="https://cdn.discordapp.com/attachments/1108279175581794324/1116271314542547034/Group3.png"
            alt=""
            className="nlp-intro__image"
          />
        </article>
        <article className="nlp-about">
          <h2>How MergePoint Works</h2>
          <p>
            Discover your passions and dive into what interests you the most.
            Join groups or events that resonate with you, or create your own.
            The choice is yours to explore and ignite your enthusiasm.
          </p>
        </article>
        <article className="nlp-nav">
          <ul className="nlp-nav-list">
            <li className="nlp-nav-card">
              <img
                src="https://cdn.discordapp.com/attachments/1008571029804810332/1115928080343642112/dizzy_This_image_portrays_a_diverse_group_of_engineers_working__a85f3fdb-83e7-4bcc-8be2-60ec78285ba7.png"
                alt=""
                className="nlp-nav-card__image"
              />
              <h2
                className="nlp-nav-card__title"
                onClick={() => {
                  history.push("/groups");
                }}
              >
                See all groups
              </h2>
              <p className="nlp-nav-card__about">
                Discover a multitude of diverse groups tailored to various
                interests. From cutting-edge technologies to groundbreaking
                projects, find the perfect community to connect and thrive with.
              </p>
            </li>
            <li className="nlp-nav-card">
              <img
                src="https://cdn.discordapp.com/attachments/1052525626030047282/1089800013531598888/pimpmypartyin_event_ticket_icon_png_pixel_style_c5f13660-6d63-43d9-9974-36c785c230a8.png"
                alt=""
                className="nlp-nav-card__image"
              />
              <h2
                className="nlp-nav-card__title"
                onClick={() => {
                  history.push("/events");
                }}
              >
                Find a event
              </h2>
              <p className="nlp-nav-card__about">
                Experience a range of captivating events designed to inspire,
                educate, and foster collaboration. Discover a world of
                possibilities where you can participate, engage, and grow.
              </p>
            </li>
            <li className="nlp-nav-card">
              <img
                src="https://cdn.discordapp.com/attachments/1074456278891515904/1117549222024187995/World087_Create_a_photorealistic_depiction_of_a_labyrinth_with__847d1581-ea39-40c7-bdef-ebe13387b833.png"
                alt=""
                className="nlp-nav-card__image"
              />
              <h2
                className={startGroupClassName}
                onClick={() => {
                  history.push("/groups/new");
                }}
              >
                Start a new group
              </h2>
              <p className="nlp-nav-card__about">
                Become a trailblazer and create your own hub, centered around
                your unique interests and vision. Bring together a community of
                passionate individuals and embark on an exciting journey of
                exploration and innovation.
              </p>
            </li>
          </ul>
        </article>
        {!session.user && (
          <div className="nlp-join">
            <button onClick={handleJoinMergePoint} className="nlp-Button">
              Join MergePoint
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
