"use strict";

function SearchOffCanvas(props) {
  const stateOptions = ["California"];
  const parkingOptions = [
    "Fee (Adventure Pass)",
    "Fee (Lot/Area)",
    "Free (Lot/Area) or Fee (Adventure Pass)",
    "Free (Lot/Area)",
    "Free (Road/Street)",
    "Restricted",
    "Weekend/Holiday Fee, Weekday Free (Lot/Area)",
  ];
  const difficultyOptions = ["easy", "moderate", "hard"];

  const [stateChoice, setStateChoice] = React.useState("");
  const [cityOptions, setCityOptions] = React.useState([]);
  const [areaOptions, setAreaOptions] = React.useState([]);

  const setCityAreaOptions = (state) => {
    fetch(`/${state}/city_area.json`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { cities, areas } = jsonResponse;
        const allCityOptions = [];
        const allAreaOptions = [];

        cities.map((city) => {
          allCityOptions.push({
            select: false,
            city: city,
          });
        });

        areas.map((area) => {
          allAreaOptions.push({
            select: false,
            area: area,
          });
        });

        setCityOptions(allCityOptions);
        setAreaOptions(allAreaOptions);
      });
  };

  const handleStateLocationUpdate = (event) => {
    setStateChoice(event.target.value);
    if (event.target.value === "") {
      setCityOptions([]);
      setAreaOptions([]);
    } else {
      setCityAreaOptions(event.target.value);
    }
  };

  return (
    <React.Fragment>
      <div
        className="offcanvas offcanvas-start"
        style={{ width: "450px" }}
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Search"
        aria-labelledby="SearchLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="SearchLabel">
            Search Hikes
          </h3>
          <div className="float-end">
            <small>
              <a className="link-dark" href="/hikes">
                View all hikes
              </a>
            </small>
          </div>
        </div>
        <div className="offcanvas-body" style={{ position: "relative" }}>
          <div style={{ padding: "0.5em" }}>
            <form method="GET" action="/hikes/advanced_search">
              <div className="form-floating row ms-1 me-1">
                <input
                  id="search-keyword"
                  className="form-control"
                  type="text"
                  name="keyword"
                ></input>
                <label className="form-label" htmlFor="search-keyword">
                  <small className="form-text text-muted">Keyword</small>
                </label>
              </div>

              <div className="row mt-2">
                <div className="col">
                  <label className="form-label">
                    <strong>Difficulty</strong>
                  </label>
                </div>
                {difficultyOptions.map((difficultyOption) => (
                  <div className="form-check col" key={difficultyOption}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={difficultyOption}
                      name="difficulty"
                      value={difficultyOption}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={difficultyOption}
                    >
                      {difficultyOption}
                    </label>
                  </div>
                ))}
              </div>

              <div className="row mt-2">
                <div className="col">
                  <label className="form-label">
                    <strong>Leash Rule</strong>
                  </label>
                </div>
                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="leash_rules"
                      value="On leash"
                      id="search-on-leash"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="search-on-leash"
                    >
                      on leash
                    </label>
                  </div>
                </div>

                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="leash_rules"
                      value="Off leash"
                      id="search-off-leash"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="search-off-leash"
                    >
                      off leash
                    </label>
                  </div>
                </div>
              </div>

              <div className="row g-2 mt-2">
                <div className="col">
                  <label className="form-label">
                    <strong>Length</strong>
                  </label>
                  <br></br>
                  <strong>(Miles)</strong>
                </div>
                <div className="form-floating col">
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    className="form-control input-sm"
                    id="search-length-min"
                    name="length_min"
                  />
                  <label className="form-label" htmlFor="search-length-min">
                    <small className="form-text text-muted">min</small>
                  </label>
                </div>

                <div className="form-floating col">
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    className="form-control"
                    id="search-length-max"
                    name="length_max"
                  />
                  <label className="form-label" htmlFor="search-length-max">
                    <small className="form-text text-muted">max</small>
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <label className="form-label" htmlFor="search-parking">
                  <strong>Parking</strong>
                </label>
                <div
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "5px",
                    paddingLeft: "1em",
                    height: "10vh",
                    overflow: "auto",
                  }}
                >
                  {parkingOptions.map((parkingOption) => (
                    <div className="form-check" key={parkingOption}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="parking"
                        id={parkingOption}
                        value={parkingOption}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={parkingOption}
                      >
                        {parkingOption}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row mt-2">
                <label className="form-label">
                  <strong>Location</strong>
                </label>
              </div>
              <div className="form-floating row ms-1 me-1">
                <select
                  id="search-state"
                  className="form-select"
                  aria-label="search-state"
                  onChange={handleStateLocationUpdate}
                >
                  <option value=""></option>
                  {stateOptions.map((stateOption) => (
                    <option
                      name="state"
                      value={`${stateOption}`}
                      key={`state-${stateOption}`}
                    >
                      {stateOption}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor="search-state">
                  <strong>State</strong>
                </label>
              </div>

              <div className="row mt-2">
                <label className="form-label" htmlFor="search-city">
                  <strong>City</strong>
                </label>
                {cityOptions.length < 1 ? (
                  <small className="text-muted">
                    Select state to see all city options
                  </small>
                ) : (
                  <div
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "5px",
                      paddingLeft: "1em",
                      height: "10vh",
                      overflow: "auto",
                    }}
                  >
                    {cityOptions !== ""
                      ? cityOptions.map((cityOption) => (
                          <div className="form-check" key={cityOption.city}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={cityOption.city}
                              name="city"
                              value={cityOption.city}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={cityOption.city}
                            >
                              {cityOption.city}
                            </label>
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>
              <div className="row mt-2">
                <label className="form-label" htmlFor="search-area">
                  <strong>Area</strong>
                </label>
                {areaOptions.length < 1 ? (
                  <small className="text-muted">
                    Select state to see all area options
                  </small>
                ) : (
                  <div
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "5px",
                      paddingLeft: "1em",
                      height: "10vh",
                      overflow: "auto",
                    }}
                  >
                    {areaOptions !== ""
                      ? areaOptions.map((areaOption) => (
                          <div className="form-check" key={areaOption.area}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={areaOption.area}
                              name="area"
                              value={areaOption.area}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={areaOption.area}
                            >
                              {areaOption.area}
                            </label>
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>

              <div className="row ms-1 me-1 mt-4">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="offcanvas"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              left: "413px",
              bottom: "1em",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
