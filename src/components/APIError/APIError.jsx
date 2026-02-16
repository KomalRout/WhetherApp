import "./apiError.css";
import error from "/assets/images/icon-error.svg";
import retry from "/assets/images/icon-retry.svg";

const APIError = () => {
  const onRetryBtnClick = () => {
    window.location.reload(true);
  };
  return (
    <div className="error-container" role="error alert">
      <img className="error-img" src={error} alt="error" />
      <p className="title" aria-label="Something went wrong">
        Something went wrong
      </p>
      <p
        className="error-text"
        aria-label={`We couldn’t connect to the server (API error). Please try again in a few
        moments`}
      >
        We couldn’t connect to the server (API error). Please try again in a few
        moments.
      </p>
      <button className="retry-btn" type="button" onClick={onRetryBtnClick}>
        <span>
          <img src={retry} alt="retry" />
        </span>
        <span>Retry</span>
      </button>
    </div>
  );
};

export default APIError;
