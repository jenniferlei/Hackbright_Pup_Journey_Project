"use strict";

function SearchResult(props) {
  return (
    <React.Fragment>
      <li>
        <a className="link-dark" href={`/hikes/${props.hike_id}`}>
          {props.hike_name}
        </a>
        <br></br>
        <small>
          {props.difficulty} | {props.miles} miles | {props.city}, {props.state}{" "}
          | {props.area} | {props.leash_rule} | {props.parking}
        </small>
      </li>
    </React.Fragment>
  );
}

function SearchOffCanvas(props) {
  const stateOptions = ["California"];

  const [keyword, setKeyword] = React.useState("");
  const [difficultyOptions, setDifficultyOptions] = React.useState([
    { select: false, difficulty: "easy" },
    { select: false, difficulty: "moderate" },
    { select: false, difficulty: "hard" },
  ]);
  const [leashRuleChoice, setLeashRuleChoice] = React.useState([]);
  const [minLengthChoice, setMinLengthChoice] = React.useState("");
  const [maxLengthChoice, setMaxLengthChoice] = React.useState("");
  const [stateChoice, setStateChoice] = React.useState("");
  const [cityOptions, setCityOptions] = React.useState([]);
  const [areaOptions, setAreaOptions] = React.useState([]);
  const [parkingOptions, setParkingOptions] = React.useState([
    { select: false, parking: "Fee (Adventure Pass)" },
    { select: false, parking: "Fee (Lot/Area)" },
    { select: false, parking: "Free (Lot/Area) or Fee (Adventure Pass)" },
    { select: false, parking: "Free (Lot/Area)" },
    { select: false, parking: "Free (Road/Street)" },
    { select: false, parking: "Restricted" },
    {
      select: false,
      parking: "Weekend/Holiday Fee, Weekday Free (Lot/Area)",
    },
  ]);
  const [results, setResults] = React.useState("");

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

  // const zipcode = document.querySelector("#zipcode-field").value;
  // const urlRequest = `/hikes/advanced_search?keyword=${}&difficulty=${}&length_min=${}&length_max=${}&state=`;

  // fetch(urlRequest)
  //   .then((response) => response.json())
  //   .then((weather) => {
  //     document.querySelector("#weather-info").innerHTML = weather["forecast"];
  //   });

  // function searchResults() {
  //   fetch(
  //     `/hikes/advanced_search.json?keyword=${keyword}&difficulty=${difficultyOptions}&leash_rules=${leashRuleChoice}&length_min=${minLengthChoice}&length_max=${maxLengthChoice}&parking=${parkingOptions}&state=${stateChoice}&city=${cityOptions}&area=${areaOptions}`
  //   )
  //     .then((response) => {
  //       response.json();
  //     })
  //     .then((jsonResponse) => {
  //       const { results } = jsonResponse.results;
  //       setResults(results);
  //       console.log(results);
  //     });
  // }

  const allSearchResults = [];

  for (const currentResult of results) {
    allSearchResults.push(
      <SearchResult
        key={currentResult.hike_id}
        hike_id={currentResult.hike_id}
        hike_name={currentResult.hike_name}
        difficulty={currentResult.difficulty}
        miles={currentResult.miles}
        city={currentResult.city}
        state={currentResult.state}
        leash_rule={currentResult.leash_rule}
        parking={currentResult.parking}
      />
    );
  }

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
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="keyword"
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
                  <div
                    className="form-check col"
                    key={difficultyOption.difficulty}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={difficultyOption.difficulty}
                      value={difficultyOption.difficulty}
                      checked={difficultyOption.select}
                      onChange={(event) => {
                        let checked = event.target.checked;
                        setDifficultyOptions(
                          difficultyOptions.map((data) => {
                            if (
                              difficultyOption.difficulty === data.difficulty
                            ) {
                              data.select = checked;
                            }
                            return data;
                          })
                        );
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={difficultyOption.difficulty}
                    >
                      {difficultyOption.difficulty}
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

              {/* <div className="row mt-2"></div> */}
              <div className="row g-2 mt-2">
                <div className="col">
                  <label className="form-label">
                    <strong>Length (Miles)</strong>
                  </label>
                </div>
                <div className="form-floating col">
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    placeholder={0}
                    className="form-control input-sm"
                    id="search-length-min"
                    value={minLengthChoice}
                    onChange={(event) => setMinLengthChoice(event.target.value)}
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
                    placeholder={0}
                    className="form-control"
                    id="search-length-max"
                    value={maxLengthChoice}
                    onChange={(event) => setMaxLengthChoice(event.target.value)}
                  />
                  <label className="form-label" htmlFor="search-length-max">
                    <small className="form-text text-muted">max</small>
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <label className="form-label" htmlFor="search-parking">
                  Parking
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
                    <div className="form-check" key={parkingOption.parking}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={parkingOption.parking}
                        value={parkingOption.parking}
                        checked={parkingOption.select}
                        onChange={(event) => {
                          let checked = event.target.checked;
                          setParkingOptions(
                            parkingOptions.map((data) => {
                              if (parkingOption.parking === data.parking) {
                                data.select = checked;
                              }
                              return data;
                            })
                          );
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={parkingOption.parking}
                      >
                        {parkingOption.parking}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row mt-2">
                <label className="form-label">Location</label>
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
                      value={`${stateOption}`}
                      key={`state-${stateOption}`}
                    >
                      {stateOption}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor="search-state">
                  State
                </label>
              </div>

              <div className="row mt-2">
                <label className="form-label" htmlFor="search-city">
                  City
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
                              value={cityOption.city}
                              checked={cityOption.select}
                              onChange={(event) => {
                                let checked = event.target.checked;
                                setCityOptions(
                                  cityOptions.map((data) => {
                                    if (cityOption.city === data.city) {
                                      data.select = checked;
                                    }
                                    return data;
                                  })
                                );
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
                )}
              </div>
              <div className="row mt-2">
                <label className="form-label" htmlFor="search-area">
                  Area
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
                              value={areaOption.area}
                              checked={areaOption.select}
                              onChange={(event) => {
                                let checked = event.target.checked;
                                setAreaOptions(
                                  areaOptions.map((data) => {
                                    if (areaOption.area === data.area) {
                                      data.select = checked;
                                    }
                                    return data;
                                  })
                                );
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
                )}
              </div>

              <div className="row ms-1 me-1 mt-4">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="offcanvas"
                  onSubmit={searchResults}
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
