"use strict";


function SearchOffCanvas(props) {
  const [state, setState] = React.useState();
  


  return (
    <React.Fragment>
      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="Search" aria-labelledby="SearchLabel">
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

                {% for difficulty in ['easy', 'moderate', 'hard'] %}
                <div className="col">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="difficulty" value="{{ difficulty }}" id="search-difficulty-{{ difficulty }}" />
                    <label className="form-check-label" for="search-difficulty-{{ difficulty }}">
                      {{ difficulty }}
                    </label>
                  </div>
                </div>
                {% endfor %}

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
                    <input className="form-check-input" type="checkbox" name="leash_rule" value="Off leash" id="search-off-leash">
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
                          step=0
                          min=0
                          name="length_min"
                          placeholder=0
                          className="form-control input-sm"
                          id="search-length-min" />
                  <label className="form-label" for="search-length-min"><small className="form-text text-muted">min</small></label>
                </div>

                <div className="form-floating col">
                  <input type="number"
                          step=0
                          min=0
                          name="length_max"
                          placeholder=0
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
                                name="state"
                                aria-label="search-state">
                          <option value=""></option>
                          {% for state in states|sort() %}
                          <option value="{{ state }}">{{ state }}</option>
                          {% endfor %}
                        </select>
                        <label className="form-label" for="search-state">State</label>
                      </div>

                      <div className="row g-2 mt-2">
                        <div className="col">
                          <label className="form-label" for="search-city">City</label>
                          <select className="form-control choices-multiple" name="city" multiple>
                            {% for city in cities|sort() %}
                            <option value="{{ city }}">{{ city }}</option>
                            {% endfor %}
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