import React from "react";

const App = () => {
  return (
    <div>
      <header>
        <p className="logo-text">Weather Now</p>
        <select name="Unit" id="unit-select">
          <option>Switch to Imperial/Metric</option>
        </select>
      </header>
      <main>
        <p>How's the sky looking today?</p>
        <div className="search-bar">
          <input placeholder="Search"></input>
          <button>Search</button>
        </div>
      </main>
      <section>
        <div className="banner">Berlin, Germany</div>
        <div className="characteristics">
          <p>Feels Like</p>
          <p>Humidity</p>
          <p>Wind</p>
          <p>Precipitation</p>
        </div>
        <p>Daily Forcast</p>
        <div>{/* Future daily forecast components will go here */}</div>
      </section>
      <aside></aside>
    </div>
  );
};

export default App;
