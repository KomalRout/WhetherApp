import "./apiError.css";
const APIError = () => {
  const onRetryBtnClick = () => {
    window.location.reload(true);
  };
  return (
    <div className="error-container">
      <img className="error-img" src="assets/images/icon-error.svg" />
      <p className="title">Something went wrong</p>
      <p className="error-text">
        We couldn’t connect to the server (API error). Please try again in a few
        moments.
      </p>
      <button className="retry-btn" type="button" onClick={onRetryBtnClick}>
        <span>
          <img src="assets/images/icon-retry.svg" />
        </span>
        <span>Retry</span>
      </button>
    </div>
  );
};

export default APIError;
