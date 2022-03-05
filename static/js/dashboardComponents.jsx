"use strict";

const DashboardGraph = React.forwardRef((props, ref) => {
  const [mychart, setMyChart] = React.useState(null);

  React.useEffect(() => {
    initGraph();
  }, []);

  function initGraph() {
    fetch("/check-ins-by-pets.json")
      .then((response) => response.json())
      .then((responseJson) => {
        const { petCheckIns } = responseJson;

        const all_data = [];

        for (const petCheckIn of petCheckIns) {
          const label = petCheckIn.pet_name;
          const data = petCheckIn.data.map((checkIn) => ({
            x: checkIn.date_hiked,
            y: checkIn.miles_completed,
          }));

          const lineColor = randomColor();

          all_data.push({
            label: label,
            data: data,
            fill: false,
            lineTension: 0.4,
            radius: 6,
            borderColor: lineColor,
            backgroundColor: lineColor,
          });
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        const myLineChart = new Chart(
          document.querySelector("#check-in-graph"),
          {
            type: "line",
            data: {
              datasets: all_data,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: "bottom" },
              },

              scales: {
                x: {
                  type: "time",
                  min: new Date(year, month, 1, 0, 0),
                  max: new Date(year, month + 1, 1, 0, 0) - 1,
                  time: {
                    tooltipFormat: "LLLL dd", // Luxon format string
                    unit: "day",
                  },
                  display: true,
                  title: {
                    display: true,
                    text: "Date",
                  },
                },

                y: {
                  min: 0,
                  suggestedMax: 20,
                  display: true,
                  ticks: {
                    stepSize: 1,
                  },
                  title: {
                    display: true,
                    text: "Miles",
                  },
                },
              },
            },
          }
        );

        setMyChart(myLineChart);
      });
  }

  React.useImperativeHandle(ref, () => ({
    updateGraphData() {
      fetch("/check-ins-by-pets.json")
        .then((response) => response.json())
        .then((responseJson) => {
          const { petCheckIns } = responseJson;

          const all_data = [];

          for (const petCheckIn of petCheckIns) {
            const label = petCheckIn.pet_name;
            const data = petCheckIn.data.map((checkIn) => ({
              x: checkIn.date_hiked,
              y: checkIn.miles_completed,
            }));

            const lineColor = randomColor();

            all_data.push({
              label: label,
              data: data,
              fill: false,
              lineTension: 0.4,
              radius: 6,
              borderColor: lineColor,
              backgroundColor: lineColor,
            });
          }

          mychart.data.datasets = all_data;
          mychart.update();
        });
    },
    updateGraphView() {
      const view = document.querySelector(
        "input[name=chart-view]:checked"
      ).value;

      if (view === "chart-month-view") {
        const month =
          document.querySelector("select[name=chart-month-view-month]").value -
          1;
        const year = document.querySelector(
          "select[name=chart-month-view-year]"
        ).value;
        mychart.options.scales.x.min = new Date(year, month, 1, 0, 0);
        mychart.options.scales.x.max = new Date(year, month + 1, 1, 0, 0) - 1;
        mychart.update();
      } else {
        const year = document.querySelector(
          "select[name=chart-year-view-year]"
        ).value;
        mychart.options.scales.x.min = new Date(year, 0);
        mychart.options.scales.x.max = new Date(year, 11, 31);
        mychart.update();
      }
      props.updateGraphInfo();
    },
  }));
  return <canvas id="check-in-graph"></canvas>;
});

function FooterNavItemOffCanvas(props) {
  return (
    <li className="nav-item">
      <a
        className="nav-link"
        data-bs-toggle="offcanvas"
        href={`#${props.href}`}
        role="button"
        aria-controls={props.href}
        onClick={props.getFunction}
      >
        <small>
          <i
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={props.tooltip}
            className={props.icon}
          ></i>
          &nbsp;{props.name}
        </small>
      </a>
    </li>
  );
}

function Footer(props) {
  const session_login = document.querySelector("#login").innerText;

  function doNothing() {}

  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-sm navbar-light bg-light fixed-bottom"
        style={{ border: "1px solid #ced4da" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <form method="GET" action="/hikes/search">
                <li className="nav-item d-flex">
                  <input
                    className="form-control me-2 input-sm"
                    type="search"
                    name="search_term"
                    placeholder="Search"
                    aria-label="Search"
                  ></input>
                  <button
                    className="btn btn-sm nav-link"
                    role="button"
                    type="submit"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="search"
                        className="bi bi-search"
                      ></i>
                    </small>
                  </button>
                </li>
              </form>
              <FooterNavItemOffCanvas
                name=""
                href="Search"
                tooltip="advanced search"
                icon="bi bi-sliders"
                getFunction={doNothing}
              />
            </ul>
            <div className="d-flex"></div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

const DashboardMainContainer = React.forwardRef((props, ref) => {
  const BookmarksListRef = React.useRef();
  const AddMultHikesToExistingListRef = React.useRef();
  const DashboardGraphRef = React.useRef();
  const [graphDisplay, setGraphDisplay] = React.useState(false);
  const [graphHeader, setGraphHeader] = React.useState("");
  const [graphCheckIns, setGraphCheckIns] = React.useState([]);
  const [graphCheckInsTotalMiles, setGraphCheckInsTotalMiles] =
    React.useState("");
  const [checkInsDisplay, setCheckInsDisplay] = React.useState(false);
  const [bookmarksDisplay, setBookmarksDisplay] = React.useState(false);

  const [checkIns, setCheckIns] = React.useState([]);
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  React.useEffect(() => {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
        const { checkIns } = data;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleString("default", { month: "long" });
        const startDate = new Date(year, month, 1, 0, 0);
        const endDate = new Date(year, month + 1, 1, 0, 0) - 1;

        let initCheckIns = [];
        for (const checkIn of checkIns) {
          const dateHiked = new Date(checkIn["date_hiked"]);
          if (dateHiked > startDate && dateHiked < endDate) {
            initCheckIns.push(checkIn);
          }
        }

        let initMiles = 0;

        let totalMiles = initCheckIns.reduce(function (
          previousValue,
          currentValue
        ) {
          return previousValue + currentValue.miles_completed;
        },
        initMiles);
        setGraphHeader(`${monthName} ${year}`);
        setGraphCheckIns(initCheckIns);
        setGraphCheckInsTotalMiles(totalMiles);
      });
  }, []);

  function refreshProfiles() {
    props.parentGetPetProfiles();
  }

  function getCheckIns() {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
      });
  }

  console.log("checkIns", checkIns);

  function getBookmarksLists() {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
      });
  }

  function updateGraphInfo() {
    const view = document.querySelector("input[name=chart-view]:checked").value;

    if (view === "chart-month-view") {
      const date = new Date(
        document.querySelector("select[name=chart-month-view-year]").value,
        document.querySelector("select[name=chart-month-view-month]").value - 1,
        1,
        0,
        0
      );
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const startDate = new Date(year, month, 1, 0, 0);
      const endDate = new Date(year, month + 1, 1, 0, 0) - 1;

      let graphCheckIns = [];
      for (const checkIn of checkIns) {
        const dateHiked = new Date(checkIn["date_hiked"]);
        if (dateHiked > startDate && dateHiked < endDate) {
          graphCheckIns.push(checkIn);
        }
      }

      let initMiles = 0;

      let totalMiles = graphCheckIns.reduce(function (
        previousValue,
        currentValue
      ) {
        return previousValue + currentValue.miles_completed;
      },
      initMiles);
      setGraphHeader(`${month} ${year}`);
      setGraphCheckIns(graphCheckIns);
      setGraphCheckInsTotalMiles(totalMiles);
    } else {
      const year = document.querySelector(
        "select[name=chart-year-view-year]"
      ).value;
      const startDate = new Date(year, 0);
      const endDate = new Date(year, 11, 31);

      let graphCheckIns = [];
      for (const checkIn of checkIns) {
        const dateHiked = new Date(checkIn["date_hiked"]);
        if (dateHiked > startDate && dateHiked < endDate) {
          graphCheckIns.push(checkIn);
        }
      }

      let initMiles = 0;

      let totalMiles = graphCheckIns.reduce(function (
        previousValue,
        currentValue
      ) {
        return previousValue + currentValue.miles_completed;
      },
      initMiles);
      setGraphHeader(`${year}`);
      setGraphCheckIns(graphCheckIns);
      setGraphCheckInsTotalMiles(totalMiles);
    }
  }

  function parentGetGraphData() {
    DashboardGraphRef.current.updateGraphData();
  }

  function parentUpdateGraphView() {
    DashboardGraphRef.current.updateGraphView();
  }

  function parentSetHikesOptionState() {
    AddMultHikesToExistingListRef.current.setHikesOptionsState();
  }

  React.useImperativeHandle(ref, () => ({
    displayMap() {
      setGraphDisplay(false);
      setCheckInsDisplay(false);
      setBookmarksDisplay(false);
      // getDashboardMap();
      document.getElementById("display-map").style.display = "block";
    },
    displayGraph() {
      setGraphDisplay(true);
      setCheckInsDisplay(false);
      setBookmarksDisplay(false);
      // getDashboardGraph();
      document.getElementById("display-map").style.display = "none";
    },
    displayCheckIns() {
      setGraphDisplay(false);
      setCheckInsDisplay(true);
      setBookmarksDisplay(false);
      getCheckIns();
      document.getElementById("display-map").style.display = "none";
    },
    displayBookmarks() {
      setGraphDisplay(false);
      setCheckInsDisplay(false);
      setBookmarksDisplay(true);
      getBookmarksLists();
      document.getElementById("display-map").style.display = "none";
    },
  }));

  const allCheckIns = [];
  const allEditCheckIns = [];

  const allBookmarksLists = [];
  const allRenameBookmarksLists = [];
  const allAddMultHikesToExistingList = [];

  let checkInsHikeCounts = [];

  for (const currentCheckIn of checkIns) {
    if (
      checkInsHikeCounts.some((hikeCount) => {
        return hikeCount["hike_id"] == currentCheckIn["hike_id"];
      })
    ) {
      // If yes! then increase the occurrence by 1
      checkInsHikeCounts.forEach((hikeCount) => {
        if (hikeCount["hike_id"] === currentCheckIn["hike_id"]) {
          hikeCount["occurrence"]++;
        }
      });
    } else {
      // If not! Then create a new object initialize
      // it with the present iteration key's value and
      // set the occurrence to 1
      let newHikeCountObj = {};
      newHikeCountObj["hike_id"] = currentCheckIn["hike_id"];
      newHikeCountObj["occurrence"] = 1;
      newHikeCountObj["hike_name"] = currentCheckIn["hike"]["hike_name"];
      checkInsHikeCounts.push(newHikeCountObj);
    }

    console.log("checkInsHikeCounts", checkInsHikeCounts);

    const date_hiked = new Date(currentCheckIn.date_hiked);
    const date_hiked_formatted = date_hiked.toLocaleDateString();

    allCheckIns.push(
      <CheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        hike_name={currentCheckIn.hike["hike_name"]}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
      />
    );
    allEditCheckIns.push(
      <EditCheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
      />
    );
  }

  for (const currentBookmarksList of bookmarksLists) {
    allBookmarksLists.push(
      <BookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        parentSetHikesOptionState={parentSetHikesOptionState}
        ref={BookmarksListRef}
      />
    );

    allAddMultHikesToExistingList.push(
      <AddMultHikesToExistingList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        ref={AddMultHikesToExistingListRef}
      />
    );

    allRenameBookmarksLists.push(
      <RenameBookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        getBookmarksLists={getBookmarksLists}
      />
    );
  }

  checkInsHikeCounts.sort((a, b) => {
    let fa = a.hike_name.toLowerCase(),
      fb = b.hike_name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  function viewMapForm() {
    if (document.getElementById("map-month-view").checked) {
      document.getElementById("map-show-month-view").style.display = "block";
      document.getElementById("map-show-year-view").style.display = "none";
    } else if (document.getElementById("map-year-view").checked) {
      document.getElementById("map-show-month-view").style.display = "none";
      document.getElementById("map-show-year-view").style.display = "block";
    }
  }

  function viewGraphForm() {
    if (document.getElementById("chart-month-view").checked) {
      document.getElementById("chart-show-month-view").style.display = "block";
      document.getElementById("chart-show-year-view").style.display = "none";
    } else if (document.getElementById("chart-year-view").checked) {
      document.getElementById("chart-show-month-view").style.display = "none";
      document.getElementById("chart-show-year-view").style.display = "block";
    }
  }

  return (
    <React.Fragment>
      <AddCheckIn
        getCheckIns={getCheckIns}
        refreshProfiles={refreshProfiles}
        parentGetGraphData={parentGetGraphData}
      />
      {allEditCheckIns}
      {allRenameBookmarksLists}
      {allAddMultHikesToExistingList}
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      <div className="dashboard-container d-flex flex-column flex-shrink-0">
        <div id="display-map">
          <div className="clearfix" style={{ width: "100%" }}>
            <h3 className="float-start" id="MapLabel">
              Where We've Been <i className="bi bi-map"></i>
            </h3>
            <div className="float-end">
              <a
                className="btn btn-sm dropdown-item"
                href=""
                data-bs-toggle="modal"
                data-bs-target="#modal-add-check-in"
              >
                <i className="bi bi-bookmark-star"></i> add a check in
              </a>
            </div>
          </div>

          <div
            className="card"
            style={{
              border: "0",
              width: "100%",
              height: "calc(100vh - 190px)",
            }}
          >
            <div className="row g-0" style={{ height: "100%" }}>
              <div className="col-md-6">
                <div id="dashboard-map" style={{ height: "100%" }}></div>
              </div>
              <div
                className="col-md-6"
                style={{ height: "100%", overflowY: "auto" }}
              >
                <div className="card-body">
                  {/* view by starts here */}

                  <div>
                    <div className="row">
                      <div className="d-flex">
                        View by&nbsp;&nbsp;
                        <input
                          type="radio"
                          className="btn-check"
                          name="map-view"
                          value="map-month-view"
                          id="map-month-view"
                          autocomplete="off"
                          onClick={viewMapForm}
                          checked
                        />
                        <label
                          className="btn btn-outline-dark btn-sm"
                          for="map-month-view"
                        >
                          month
                        </label>
                        &nbsp;
                        <input
                          type="radio"
                          className="btn-check"
                          name="map-view"
                          value="map-year-view"
                          id="map-year-view"
                          autocomplete="off"
                          onClick={viewMapForm}
                        />
                        <label
                          className="btn btn-outline-dark btn-sm"
                          for="map-year-view"
                        >
                          year
                        </label>
                      </div>
                    </div>
                    <div id="map-show-month-view" className="mt-1 map-form">
                      <div className="d-flex">
                        <div>
                          <select
                            className="form-select btn-sm"
                            name="map-month-view-month"
                            aria-label="map-month-view-select-month"
                          >
                            <option value={1}>Jan</option>
                            <option value={2}>Feb</option>
                            <option value={3}>Mar</option>
                            <option value={4}>Apr</option>
                            <option value={5}>May</option>
                            <option value={6}>Jun</option>
                            <option value={7}>Jul</option>
                            <option value={8}>Aug</option>
                            <option value={9}>Sep</option>
                            <option value={10}>Oct</option>
                            <option value={11}>Nov</option>
                            <option value={12}>Dec</option>
                          </select>
                        </div>
                        &nbsp;
                        <div>
                          <select
                            className="form-select btn-sm"
                            name="map-month-view-year"
                            aria-label="map-month-view-select-year"
                          >
                            <option value="2022">2022</option>
                          </select>
                        </div>
                        &nbsp;
                        <button
                          className="map-view-submit btn btn-sm btn-outline-dark"
                          type="submit"
                          name="view"
                          value="month"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                    <div
                      id="map-show-year-view"
                      className="mt-1 map-form"
                      style={{ display: "none" }}
                    >
                      <div className="d-flex">
                        <div>
                          <select
                            className="form-select btn-sm"
                            name="map-year-view-year"
                            aria-label="map-year-view-select-year"
                          >
                            <option value="2022">2022</option>
                          </select>
                        </div>
                        &nbsp;
                        <button
                          className="map-view-submit btn btn-sm btn-outline-dark"
                          type="submit"
                          name="view"
                          value="year"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* view by ends here */}
                  <h5 className="mt-4 card-title">Your Visited Hikes</h5>
                  <p className="card-text">
                    {checkInsHikeCounts.map((hikeCount) => (
                      <React.Fragment>
                        <br></br>
                        You hiked{" "}
                        <a href={`/hikes/${hikeCount.hike_id}`}>
                          {hikeCount.hike_name}
                        </a>{" "}
                        {hikeCount.occurrence}{" "}
                        {hikeCount.occurrence > 1 ? "times" : "time"}
                      </React.Fragment>
                    ))}
                  </p>
                  <p className="card-text">
                    TO DOS
                    <br></br>Need to refresh map and graph when
                    adding/editing/deleting check in
                    <br></br>Make react components more reusable
                    <br></br>Add some tests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {graphDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 className="float-start" id="GraphLabel">
                How Far We've Traveled&nbsp;🐾
              </h3>
              <div className="float-end">
                <a
                  className="btn btn-sm dropdown-item"
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#modal-add-check-in"
                >
                  <i className="bi bi-bookmark-star"></i> add a check in
                </a>
              </div>
            </div>

            <div
              className="card"
              style={{
                border: "0",
                width: "100%",
                height: "calc(100vh - 174px)",
              }}
            >
              <div className="row g-0" style={{ height: "100%" }}>
                <div className="col-md-8" style={{ height: "100%" }}>
                  {/* <canvas id="check-in-graph"></canvas> */}
                  <DashboardGraph
                    ref={DashboardGraphRef}
                    updateGraphInfo={updateGraphInfo}
                  />
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    {/* view by starts here */}

                    <div>
                      <div className="row">
                        <div className="d-flex">
                          View by&nbsp;&nbsp;
                          <input
                            type="radio"
                            className="btn-check"
                            name="chart-view"
                            value="chart-month-view"
                            id="chart-month-view"
                            autocomplete="off"
                            onClick={viewGraphForm}
                          />
                          <label
                            className="btn btn-outline-dark btn-sm"
                            for="chart-month-view"
                          >
                            month
                          </label>
                          &nbsp;
                          <input
                            type="radio"
                            className="btn-check"
                            name="chart-view"
                            value="chart-year-view"
                            id="chart-year-view"
                            autocomplete="off"
                            onClick={viewGraphForm}
                          />
                          <label
                            className="btn btn-outline-dark btn-sm"
                            for="chart-year-view"
                          >
                            year
                          </label>
                        </div>
                      </div>
                      <div
                        id="chart-show-month-view"
                        className="mt-1 chart-form"
                      >
                        <div className="d-flex">
                          <div>
                            <select
                              className="form-select btn-sm"
                              name="chart-month-view-month"
                              aria-label="chart-month-view-select-month"
                            >
                              <option value={1}>Jan</option>
                              <option value={2}>Feb</option>
                              <option value={3}>Mar</option>
                              <option value={4}>Apr</option>
                              <option value={5}>May</option>
                              <option value={6}>Jun</option>
                              <option value={7}>Jul</option>
                              <option value={8}>Aug</option>
                              <option value={9}>Sep</option>
                              <option value={10}>Oct</option>
                              <option value={11}>Nov</option>
                              <option value={12}>Dec</option>
                            </select>
                          </div>
                          &nbsp;
                          <div>
                            <select
                              className="form-select btn-sm"
                              name="chart-month-view-year"
                              aria-label="chart-month-view-select-year"
                            >
                              <option value="2022">2022</option>
                            </select>
                          </div>
                          &nbsp;
                          <button
                            className="chart-view-submit btn btn-sm btn-outline-dark"
                            type="submit"
                            name="view"
                            value="month"
                            onClick={parentUpdateGraphView}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                      <div
                        id="chart-show-year-view"
                        className="mt-1 chart-form"
                        style={{ display: "none" }}
                      >
                        <div className="d-flex">
                          <div>
                            <select
                              className="form-select btn-sm"
                              name="chart-year-view-year"
                              aria-label="chart-year-view-select-year"
                            >
                              <option value="2022">2022</option>
                            </select>
                          </div>
                          &nbsp;
                          <button
                            className="btn btn-sm btn-outline-dark"
                            type="submit"
                            name="view"
                            value="year"
                            onClick={parentUpdateGraphView}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* view by ends here */}
                    <h5 className="mt-4 card-title">{graphHeader}</h5>
                    <p className="card-text">
                      You have checked in to {graphCheckIns.length} hikes
                      <br></br>and walked {graphCheckInsTotalMiles} miles!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {checkInsDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 className="float-start" id="CheckInsLabel">
                Check Ins
              </h3>
              <div className="float-end">
                <a
                  className="btn btn-sm dropdown-item"
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#modal-add-check-in"
                >
                  <i className="bi bi-bookmark-star"></i> add a check in
                </a>
              </div>
            </div>

            <div style={{ height: "100%", overflowY: "auto" }}>
              <div>{allCheckIns}</div>
            </div>
          </React.Fragment>
        ) : null}
        {bookmarksDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 className="float-start" id="BookmarksLabel">
                Bookmarks
              </h3>
              <div className="float-end">
                <a
                  className="btn btn-sm dropdown-item"
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target="#modal-create-bookmarks-list"
                >
                  <i className="bi bi-bookmark-star"></i> create a list
                </a>
              </div>
            </div>

            <div style={{ height: "100%", overflowY: "auto" }}>
              <div>{allBookmarksLists}</div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
});

function SideBarMenu(props) {
  return (
    <React.Fragment>
      <div className="side-bar-menu d-flex flex-column flex-shrink-0 bg-light">
        <a
          href="/"
          className="d-block p-3 link-dark text-decoration-none"
          title=""
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-original-title="Icon-only"
        >
          <svg className="bi" width="40" height="32"></svg>
          <span className="visually-hidden">Icon-only</span>
        </a>
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link  py-3 border-bottom"
              aria-current="page"
              title=""
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-original-title="Home"
            >
              <svg
                className="bi"
                width="24"
                height="24"
                role="img"
                aria-label="Home"
              ></svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="nav-link py-3 border-bottom"
              title="Where We've Been"
              data-bs-custom-className="custom-tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayMap}
            >
              <i className="bi bi-geo"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="nav-link py-3 border-bottom"
              title="How Far We've Traveled"
              data-bs-custom-className="custom-tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayGraph}
            >
              <i className="bi bi-graph-up"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="nav-link py-3 border-bottom"
              title="Check Ins"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayCheckIns}
            >
              <i className="bi bi-check-circle"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="nav-link py-3 border-bottom"
              title="Bookmarks"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              onClick={props.parentDisplayBookmarks}
            >
              <i className="bi bi-bookmark-star"></i>
            </a>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}

function DashboardEverythingContainer(props) {
  const DashboardMainContainerRef = React.useRef();
  const PetProfileContainerRef = React.useRef();

  function parentGetPetProfiles() {
    PetProfileContainerRef.current.getPetProfiles();
  }

  function parentDisplayMap() {
    DashboardMainContainerRef.current.displayMap();
  }
  function parentDisplayGraph() {
    DashboardMainContainerRef.current.displayGraph();
  }
  function parentDisplayCheckIns() {
    DashboardMainContainerRef.current.displayCheckIns();
  }
  function parentDisplayBookmarks() {
    DashboardMainContainerRef.current.displayBookmarks();
  }

  return (
    <React.Fragment>
      <DashboardMainContainer
        parentGetPetProfiles={parentGetPetProfiles}
        ref={DashboardMainContainerRef}
      />
      <SideBarMenu
        parentDisplayMap={parentDisplayMap}
        parentDisplayGraph={parentDisplayGraph}
        parentDisplayCheckIns={parentDisplayCheckIns}
        parentDisplayBookmarks={parentDisplayBookmarks}
      />
      <SearchOffCanvas />
      <PetProfileContainer ref={PetProfileContainerRef} />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(
  <DashboardEverythingContainer />,
  document.getElementById("root")
);
