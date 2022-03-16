"use strict";

function SearchOffCanvas(props) {
  const stateOptions = ["California", "Oregon", "Washington"];

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
    setStateFilter(event.target.value);
    if (event.target.value === "") {
      setCityOptions([]);
      setAreaOptions([]);
    } else {
      setCityAreaOptions(event.target.value);
    }
  };

  // http://localhost:5000/hikes/advanced_search?
  // keyword=a&difficulty=easy&difficulty=moderate&difficulty=hard
  // &length-min=0&length-max=2&state=Oregon&area=Central+Oregon
  // &city=Bend
  const [keyword, setKeyword] = React.useState("");
  const [difficulties, setDifficulties] = React.useState([]);
  const [leashRules, setLeashRules] = React.useState([]);
  const [areas, setAreas] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [stateFilter, setStateFilter] = React.useState("");
  const [lengthMin, setLengthMin] = React.useState("");
  const [lengthMax, setLengthMax] = React.useState("");
  const [parking, setParking] = React.useState([]);

  const getFilterQuery = () => {
    const queries = ["/hikes/advanced_search?"];
    if (keyword) {
      queries.push(`keyword=${keyword}`);
    }
    if (difficulties.length > 0) {
      difficulties.map((difficulty) =>
        queries.push(`difficulty=${difficulty}`)
      );
    }
    if (leashRules.length > 0) {
      leashRules.map((leashRule) => {
        queries.push(
          `leash_rule=${encodeURIComponent(
            leashRule[0].toUpperCase() + leashRule.slice(1)
          )}`
        );
      });
    }
    if (areas.length > 0) {
      areas.map((area) => {
        queries.push(`area=${encodeURIComponent(area)}`);
      });
    }
    if (cities.length > 0) {
      cities.map((city) => {
        queries.push(`city=${encodeURIComponent(city)}`);
      });
    }
    if (stateFilter) {
      queries.push(`state=${stateFilter}`);
    }
    if (lengthMin) {
      queries.push(`length_min=${lengthMin}`);
    }
    if (lengthMax) {
      queries.push(`length_max=${lengthMax}`);
    }
    if (parking.length > 0) {
      parking.map((parkOption) => {
        queries.push(`parking=${encodeURIComponent(parkOption)}`);
      });
    }
    const queriesUrl = queries.reduce(
      (text, value, i, array) => text + (i > 1 ? "&" : "") + value
    );
    console.log(queriesUrl, "queriesUrl");
    props.getFilteredHikes(queriesUrl);
  };

  console.log(keyword, "keyword");
  console.log(difficulties, "difficulties");
  console.log(leashRules, "leashRules");
  console.log(areas, "areas");
  console.log(cities, "cities");
  console.log(parking, "parking");
  console.log(stateFilter, "stateFilter");

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
            <div className="row">
              <div className="d-flex">
                <div className="col-2">
                  <label className="mt-2" htmlFor="search-keyword">
                    <strong>Keyword</strong>
                  </label>
                </div>
                <div className="col ms-1 me-1">
                  <input
                    id="search-keyword"
                    className="form-control"
                    type="text"
                    name="keyword"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    style={{ width: "20.5em" }}
                  ></input>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-2">
                <label className="form-label mt-1">
                  <strong>Difficulty</strong>
                </label>
              </div>
              <div className="col">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Difficulty checkbox toggle button group"
                >
                  {["easy", "moderate", "hard"].map((difficultyOption) => (
                    <React.Fragment>
                      <input
                        type="checkbox"
                        className="btn-check"
                        name="difficulty"
                        id={difficultyOption}
                        value={difficultyOption}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setDifficulties([
                              ...difficulties,
                              event.target.value,
                            ]);
                          } else {
                            setDifficulties([
                              ...difficulties.filter(
                                (difficulty) =>
                                  difficulty !== event.target.value
                              ),
                            ]);
                          }
                        }}
                        autocomplete="off"
                      />
                      <label
                        className="btn btn-sm btn-outline-dark"
                        style={{ border: "1px solid #ced4da" }}
                        htmlFor={difficultyOption}
                      >
                        {difficultyOption}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="row mt-1 g-2">
              <div className="col-2" style={{ verticalAlign: "middle" }}>
                <label className="form-label mt-1">
                  <strong>Length (miles)</strong>
                </label>
              </div>
              <div className="form-floating col">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className="form-control input-sm"
                  id={`search-length-min`}
                  name={`length-min`}
                  value={lengthMin}
                  onChange={(event) => setLengthMin(event.target.value)}
                />
                <label className="form-label" htmlFor={`search-length-min`}>
                  <small className="form-text text-muted">min</small>
                </label>
              </div>
              <div className="form-floating col">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className="form-control input-sm"
                  id={`search-length-max`}
                  name={`length-max`}
                  value={lengthMax}
                  onChange={(event) => setLengthMax(event.target.value)}
                />
                <label className="form-label" htmlFor={`search-length-max`}>
                  <small className="form-text text-muted">max</small>
                </label>
              </div>
            </div>

            <div className="mt-2 d-flex">
              <div className="col-2">
                <label for="search-state" className="mt-2 me-2">
                  <strong>State</strong>
                </label>
              </div>
              <div className="col">
                <select
                  id="search-state"
                  className="form-select"
                  aria-label="search-state"
                  name="state"
                  onChange={handleStateLocationUpdate}
                >
                  <option value=""></option>
                  {stateOptions.map((stateOption) => (
                    <option
                      value={`${stateOption}`}
                      key={`state-${stateOption}`}
                    >
                      {stateOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mt-2">
              {areaOptions.length < 1 ? (
                <div className="d-flex">
                  <div className="col-2">
                    <strong>Area</strong>
                  </div>
                  <div className="col">
                    <small className="text-muted">
                      Select state to see all area options
                    </small>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <label className="form-label" htmlFor="search-area">
                    <strong>Area</strong>
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
                    {areaOptions !== ""
                      ? areaOptions.map((areaOption) => (
                          <div className="form-check" key={areaOption.area}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={areaOption.area}
                              name="area"
                              value={areaOption.area}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setAreas([...areas, event.target.value]);
                                } else {
                                  setAreas([
                                    ...areas.filter(
                                      (area) => area !== event.target.value
                                    ),
                                  ]);
                                }
                              }}
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
                </React.Fragment>
              )}
            </div>
            <div className="row mt-2">
              {cityOptions.length < 1 ? (
                <div className="d-flex">
                  <div className="col-2">
                    <strong>City</strong>
                  </div>
                  <div className="col">
                    <small className="text-muted">
                      Select state to see all city options
                    </small>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <label className="form-label" htmlFor="search-city">
                    <strong>City</strong>
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
                    {cityOptions !== ""
                      ? cityOptions.map((cityOption) => (
                          <div className="form-check" key={cityOption.city}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={cityOption.city}
                              name="city"
                              value={cityOption.city}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setCities([...cities, event.target.value]);
                                } else {
                                  setCities([
                                    ...cities.filter(
                                      (city) => city !== event.target.value
                                    ),
                                  ]);
                                }
                              }}
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
                </React.Fragment>
              )}
            </div>

            <div className="row mt-2">
              <div className="col-2">
                <label className="form-label mt-1">
                  <strong>Leash</strong>
                </label>
              </div>
              <div className="col">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Leash rule checkbox toggle button group"
                >
                  {["on", "off"].map((param) => (
                    <React.Fragment>
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={`search-${param}-leash`}
                        value={`${param} leash`}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setLeashRules([...leashRules, event.target.value]);
                          } else {
                            setLeashRules([
                              ...leashRules.filter(
                                (leashRule) => leashRule !== event.target.value
                              ),
                            ]);
                          }
                        }}
                        autocomplete="off"
                      />
                      <label
                        className="btn btn-sm btn-outline-dark"
                        style={{ border: "1px solid #ced4da" }}
                        htmlFor={`search-${param}-leash`}
                      >
                        {param} leash
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-2">
                <label className="form-label mt-1">
                  <strong>Parking</strong>
                </label>
              </div>
              <div className="col">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Parking checkbox toggle button group"
                >
                  {["free", "fee"].map((param) => (
                    <React.Fragment>
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={`search-${param}-parking`}
                        autocomplete="off"
                        value={param}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setParking([...parking, event.target.value]);
                          } else {
                            setParking([
                              ...parking.filter(
                                (parkingOption) =>
                                  parkingOption !== event.target.value
                              ),
                            ]);
                          }
                        }}
                      />
                      <label
                        className="btn btn-sm btn-outline-dark"
                        style={{ border: "1px solid #ced4da" }}
                        htmlFor={`search-${param}-parking`}
                      >
                        {param}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="row ms-1 me-1 mt-4">
              <button
                className="btn btn-sm btn-outline-dark btn-block"
                data-bs-dismiss="offcanvas"
                onClick={getFilterQuery}
              >
                Submit
              </button>
            </div>
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
