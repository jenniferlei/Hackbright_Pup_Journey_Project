"use strict";

const stateOptions = ["California"]
const difficulties = ["easy", "moderate", "hard"]


function SearchOffCanvas(props) {
  const [state, setState] = React.useState("");
  const [cities, setCities] = React.useState("");
  const [areas, setAreas] = React.useState("");

  const setCityAreaOptions = (state) => {
    fetch(`/${state}/city_area.json`)
      .then(response => response.json())
      .then(jsonResponse => {
        const { cities, areas } = jsonResponse;
        setCities(cities)
        setAreas(areas)
      })
  }

  const handleStateUpdate = () => {
    setCityAreaOptions()
  }


  return (
    <React.Fragment>
      {/* Location Modal */}
      <div
        className="modal fade"
        id={`modal-add-hikes-${props.bookmarks_list_id}`}
        tabIndex="-1"
        aria-labelledby={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
              >
                Add Hikes
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="hikesInput">
                  Hikes
                </label>
                <div style={{ height: "50vh", overflow: "auto" }}>
                  {allHikesOptions !== ""
                    ? allHikesOptions.map((hikeOption) => (
                        <div
                          className="form-check"
                          key={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                            value={hikeOption.hike_id}
                            checked={hikeOption.select}
                            onChange={(event) => {
                              let checked = event.target.checked;
                              setAllHikesOptions(
                                allHikesOptions.map((data) => {
                                  if (hikeOption.hike_id === data.hike_id) {
                                    data.select = checked;
                                  }
                                  return data;
                                })
                              );
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                          >
                            {hikeOption.hike_name}
                          </label>
                        </div>
                      ))
                    : null}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-sm btn-outline-dark btn-block mt-4"
                  data-bs-dismiss="modal"
                  onClick={addHikesToBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block mt-4"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="Search" aria-labelledby="SearchLabel">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="SearchLabel">Search</h3>
          <div style="float:right">
            <small><a className="link-dark" href="/hikes">View all hikes</a></small>
          </div>

        </div>
        <div className="offcanvas-body" style="position:relative">
          <div style="padding:0.5em">
          <form method="GET" action="/hikes/advanced_search">
              <div className="form-floating row mt-2">
                <input id="search-keyword"
                        className="form-control"
                        type="text"
                        name="keyword"
                        placeholder="keyword"
                ></input>
                <label className="form-label" for="search-keyword"><small className="form-text text-muted">Keyword</small></label>
              </div>

              <div className="row mt-3"><label className="form-label">Difficulty</label></div>
              <div className="row">

                {difficulties.map((difficulty) => 
                {<div className="col" key={`difficulty-${difficulty}`}>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="difficulty" value="{{ difficulty }}" id="search-difficulty-{{ difficulty }}" />
                    <label className="form-check-label" for="search-difficulty-{{ difficulty }}">
                      {difficulty}
                    </label>
                  </div>
                </div>})}

              </div>

              <div className="row mt-3"><label className="form-label">Leash Rule</label></div>
              <div className="row">

                <div className="col">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="leash_rule" value="On leash" id="search-on-leash" />
                    <label className="form-check-label" for="search-on-leash">
                      on leash
                    </label>
                  </div>
                </div>

                <div className="col">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="leash_rule" value="Off leash" id="search-off-leash" />
                    <label className="form-check-label" for="search-off-leash">
                      off leash
                    </label>
                  </div>
                </div>

              </div>

              <div className="row mt-3"><label className="form-label">Length (Miles)</label></div>
              <div className="row g-2">
                
                <div className="form-floating col">
                  <input type="number"
                          step={0.1}
                          min={0}
                          name="length_min"
                          placeholder={0}
                          className="form-control input-sm"
                          id="search-length-min" />
                  <label className="form-label" for="search-length-min"><small className="form-text text-muted">min</small></label>
                </div>

                <div className="form-floating col">
                  <input type="number"
                          step={0.1}
                          min={0}
                          name="length_max"
                          placeholder={0}
                          className="form-control"
                          id="search-length-max" />
                  <label className="form-label" for="search-length-max"><small className="form-text text-muted">max</small></label>
                </div>
              </div>

              <div className="accordion accordion-flush" id="accordionSearchBar">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      <small>Filter by Location</small>
                    </button>
                  </h2>
                  <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <div className="form-floating row mt-2">
                        <select id="search-state"
                                className="form-select"
                                aria-label="search-state"
                                value={state}
                                onChange={handleStateUpdate}>
                          <option value="" selected></option>
                          {stateOptions.map((stateOption) => {<option value={`${stateOption}`} key={`state-${stateOption}`}>{stateOption}</option>})}
                        </select>
                        <label className="form-label" for="search-state">State</label>
                      </div>

                      <div className="row g-2 mt-2">
                        <div className="col">
                          <label className="form-label" for="search-city">City</label>
                          <select className="form-control choices-multiple" name="city" multiple>
                            { state !== null ? (<option value="{{ city }}">{{ city }}</option>) : null}
                          </select>
                        </div>
                        <div className="col">
                          <label className="form-label" for="search-area">Area</label>
                          <select className="form-control choices-multiple" name="area" multiple>
                            {% for area in areas|sort() %}
                            <option value="{{ area }}">{{ area }}</option>
                            {% endfor %}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                      <small>Filter by Parking</small>
                    </button>
                  </h2>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <div className="mt-3"><label className="form-label" for="search-parking">Parking</label></div>
                      <select className="form-control choices-multiple" name="parking" multiple>
                        {% for park in parking|sort() %}
                        <option value="{{ park }}">{{ park }}</option>
                        {% endfor %}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <button className="btn btn-sm btn-outline-dark btn-block mt-4" type="submit">Submit</button>
              </div>

            </form>
          </div>
          <button type="button" className="btn-close text-reset" style="bottom:1em; right:1em; position:absolute; float:right" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
      </div>
    </React.Fragment>
  );
}