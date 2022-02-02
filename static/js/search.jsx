'use strict';

// Need to add server.py function to fetch json data of pet profiles
// then fetch the data and add each pet profile
// make sure to only call the relevant user_id


function SearchSideBar(props) {
  return (
    <React.Fragment>
    <h2>Search</h2>

    <form method="GET" action="/hikes/search">
      <div className="row">
        <label className="form-label" for="search-keyword">Search Keyword</label>
        <input id="search-keyword"
                className="form-control"
                type="text"
                name="keyword"
        ></input>
      </div>

      <div className="row">
        <label className="form-label" for="search-difficulty">Difficulty</label>
        <select id="search-difficulty"
                className="form-control"
                name="difficulty">
          <option value=""></option>
          <option value="easy">easy</option>
          <option value="moderate">moderate</option>
          <option value="difficult">difficult</option>
        </select>
      </div>

      <div className="row">
        <label className="form-label" for="search-leash-rule">Leash Rule</label>
        <select id="search-leash-rule"
                className="form-control"
                name="leash_rule">
          <option value=""></option>
          <option value="on leash">on leash</option>
          <option value="off leash">off leash</option>
        </select>
      </div>

      <div className="row">
        <label className="form-label" for="search-area">Area</label>
        <select id="search-area"
                className="form-control"
                name="area">
          <option value=""></option>
          {% for area in areas|sort() %}
          <option value="{{ area }}">{{ area }}</option>
          {% endfor %}
        </select>
      </div>

      <div className="row">
        <div className="col">
          <label className="form-label" for="search-state">State</label>
          <select id="search-state"
                  className="form-control"
                  name="state">
            <option value=""></option>
            {% for state in states|sort() %}
            <option value="{{ state }}">{{ state }}</option>
            {% endfor %}
          </select>
        </div>

        <div className="col">
          <label className="form-label" for="search-city">City</label>
          <select id="search-state"
                  className="form-control"
                  name="city">
            <option value=""></option>
            {% for city in cities|sort() %}
            <option value="{{ city }}">{{ city }}</option>
            {% endfor %}
          </select>
        </div>
      </div>


      <div className="row">Length (Miles)</div>
      <div className="row">
        
        <div className="col">
          <label className="form-label" for="search-length-min"><small className="form-text text-muted">min</small></label>
          <input type="number"
                  step=0
                  min=0
                  name="length_min"
                  className="form-control">
        </div>

        <div className="col">
          <label className="form-label" for="search-length-max"><small className="form-text text-muted">max</small></label>
          <input type="number"
                  step=0
                  min=0
                  name="length_max"
                  className="form-control">
        </div>
      </div>

      <div className="row">
        <label className="form-label" for="search-parking">Parking</label>
        <select id="search-parking"
                className="form-control"
                name="parking">
          <option value=""></option>
          {% for park in parking|sort() %}
          <option value="{{ park }}">{{ park }}</option>
          {% endfor %}
        </select>
      </div>

      <div className="row">
        <button className="btn btn-sm btn-primary btn-block mt-4" type="submit">Submit</button>
      </div>

    </form>

    </React.Fragment>
  );
}

ReactDOM.render(<SearchSideBar />, document.getElementById('search-side-bar'));
