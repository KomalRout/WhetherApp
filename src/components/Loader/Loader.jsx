import "./circleLoader.css";
import loading from "/assets/images/icon-loading.svg";
const CircleLoader = () => {
  return (
    <img alt="loading" className="circle-loader-container" src={loading} />
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
