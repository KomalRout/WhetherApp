import React from "react";

const App = () => {
  return (
    <div>
      <header>
        <h1>Weather Now</h1>
        <p>Units</p>
      </header>
      <main>
        <h1>How's the sky looking today?</h1>
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
