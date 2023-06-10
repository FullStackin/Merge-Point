import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css";

const LandingPage = () => {
  const history = useHistory();
  const session = useSelector((state) => state.session);

  const startGroupClassName =
    "nlp-card__title " + (session && session.user ? "" : "nlp-disabled-link");

  return (
    <>
      <div className="nlp-wrapper">
        <article className="nlp-intro">
          <div className="nlp-intro__text">
            <h1 className="nlp-intro__title">
              MergePoint The Tech Community - Where Innovation Thrives!
            </h1>
            <p>
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
              test test test test test test test test test test test test test
            </p>
          </div>
          <img src="" alt="" className="nlp-intro__image" />
        </article>
        <article className="nlp-about">
          <h2>Start an Innovation Hub</h2>
          <p>
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
          </p>
        </article>
        <article className="nlp-nav">
          <ul className="nlp-nav-list">
            <li className="nlp-nav-card">
              <img src="" alt="" className="nlp-nav-card__image" />
              <h2
                className="nlp-nav-card__title"
                onClick={() => {
                  history.push("/groups");
                }}
              >
                See all Hub groups
              </h2>
              <p className="nlp-nav-card__about">
                test test test test test test test test test test test test test
                test test test test test test test test test test test
              </p>
            </li>
            <li className="nlp-nav-card">
              <img src="" alt="" className="nlp-nav-card__image" />
              <h2
                className="nlp-nav-card__title"
                onClick={() => {
                  history.push("/events");
                }}
              >
                Find a Hub event
              </h2>
              <p className="nlp-nav-card__about">
                test test test test test test test test test test test test test
                test test test test test test test test test test test
              </p>
            </li>
            <li className="nlp-nav-card">
              <img src="" alt="" className="nlp-nav-card__image" />
              <h2
                className={startGroupClassName}
                onClick={() => {
                  history.push("/groups/new");
                }}
              >
                Start a new Hub
              </h2>
              <p className="nlp-nav-card__about">
                test test test test test test test test test test test test test
                test test test test test test test test test test test
              </p>
            </li>
          </ul>
        </article>
        {!session.user && (
          <div className="nlp-join">
            <button>Join MergePoint</button>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
