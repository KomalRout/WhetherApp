import "./circleLoader.css";

const CircleLoader = () => {
  return (
    <img
      className="circle-loader-container"
      src="public/assets/images/icon-loading.svg"
    />
  );
};

const LinearLoader = () => {
  return (
    <div className="linear-loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export { CircleLoader, LinearLoader };
