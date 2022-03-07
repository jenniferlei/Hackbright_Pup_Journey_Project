"use strict";

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

const ViewMonthYear = (props) => {
  const [yearOptions, setYearOptions] = React.useState([]);
  const monthOptions = [
    { monthNum: 1, monthAbbr: "Jan" },
    { monthNum: 2, monthAbbr: "Feb" },
    { monthNum: 3, monthAbbr: "Mar" },
    { monthNum: 4, monthAbbr: "Apr" },
    { monthNum: 5, monthAbbr: "May" },
    { monthNum: 6, monthAbbr: "Jun" },
    { monthNum: 7, monthAbbr: "Jul" },
    { monthNum: 8, monthAbbr: "Aug" },
    { monthNum: 9, monthAbbr: "Sep" },
    { monthNum: 10, monthAbbr: "Oct" },
    { monthNum: 11, monthAbbr: "Dec" },
    { monthNum: 12, monthAbbr: "Nov" },
  ];

  React.useEffect(() => {
    getYearOptions();
  }, []);

  function getYearOptions() {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { checkIns } = jsonResponse;
        let years = [];
        for (const checkIn of checkIns) {
          const dateHiked = new Date(checkIn.date_hiked);
          const year = dateHiked.getFullYear();
          if (!years.includes(year)) {
            years.push(year);
          }
        }
        setYearOptions(years);
      });
  }

  function changeMonthYearForm() {
    if (document.getElementById(`${props.category}-month-view`).checked) {
      document.getElementById(
        `${props.category}-show-month-view`
      ).style.display = "block";
      document.getElementById(
        `${props.category}-show-year-view`
      ).style.display = "none";
    } else if (document.getElementById(`${props.category}-year-view`).checked) {
      document.getElementById(
        `${props.category}-show-month-view`
      ).style.display = "none";
      document.getElementById(
        `${props.category}-show-year-view`
      ).style.display = "block";
    }
  }

  return (
    <div>
      <div className="row">
        <div className="d-flex">
          View by&nbsp;&nbsp;
          <input
            type="radio"
            className="btn-check"
            name={`${props.category}-view`}
            value={`${props.category}-month-view`}
            id={`${props.category}-month-view`}
            autocomplete="off"
            onClick={changeMonthYearForm}
          />
          <label
            className="btn btn-outline-dark btn-sm"
            for={`${props.category}-month-view`}
          >
            month
          </label>
          &nbsp;
          <input
            type="radio"
            className="btn-check"
            name={`${props.category}-view`}
            value={`${props.category}-year-view`}
            id={`${props.category}-year-view`}
            autocomplete="off"
            onClick={changeMonthYearForm}
          />
          <label
            className="btn btn-outline-dark btn-sm"
            for={`${props.category}-year-view`}
          >
            year
          </label>
        </div>
      </div>
      <div
        id={`${props.category}-show-month-view`}
        className="mt-1 map-form"
        style={{ display: "none" }}
      >
        <div className="d-flex">
          <div>
            <select
              className="form-select btn-sm"
              name={`${props.category}-month-view-month`}
              aria-label={`${props.category}-month-view-select-month`}
            >
              {monthOptions.map((month) => (
                <option
                  key={`${props.category}-month-${month.monthNum}`}
                  value={month.monthNum}
                >
                  {month.monthAbbr}
                </option>
              ))}
            </select>
          </div>
          &nbsp;
          <div>
            <select
              className="form-select btn-sm"
              name={`${props.category}-month-view-year`}
              aria-label={`${props.category}-month-view-select-year`}
            >
              <option value="2022">2022</option>
            </select>
          </div>
          &nbsp;
          <button
            className={`${props.category}-view-submit btn btn-sm btn-outline-dark`}
            type="submit"
            name="view"
            value="month"
            onClick={props.getFunction}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        id={`${props.category}-show-year-view`}
        className="mt-1 map-form"
        style={{ display: "none" }}
      >
        <div className="d-flex">
          <div>
            <select
              className="form-select btn-sm"
              name={`${props.category}-year-view-year`}
              aria-label={`${props.category}-year-view-select-year`}
            >
              {yearOptions.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
          &nbsp;
          <button
            className={`${props.category}-view-submit btn btn-sm btn-outline-dark`}
            type="submit"
            name="view"
            value="year"
            onClick={props.getFunction}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardHeader = (props) => {
  return (
    <div className="clearfix" style={{ width: "100%" }}>
      <h3 className="float-start" id={props.headerLabel}>
        {props.title}
      </h3>
      <div className="float-end">
        <a
          className="btn btn-sm"
          href=""
          data-bs-toggle="modal"
          data-bs-target={props.modalTarget}
        >
          <i className={props.icon}></i> {props.modalText}
        </a>
      </div>
    </div>
  );
};

const DashboardMainContainer = React.forwardRef((props, ref) => {
  const BookmarksListRef = React.useRef();
  const AddMultHikesToExistingListRef = React.useRef();
  const DashboardGraphContainerRef = React.useRef();
  const DashboardMapRef = React.useRef();
  const [graphDisplay, setGraphDisplay] = React.useState(false);
  const [checkInsDisplay, setCheckInsDisplay] = React.useState(false);
  const [bookmarksDisplay, setBookmarksDisplay] = React.useState(false);

  const [checkIns, setCheckIns] = React.useState([]);
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  React.useEffect(() => {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
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

  function parentGetGraphData() {
    DashboardGraphContainerRef.current.updateGraphData();
  }

  function parentUpdateMapView() {}

  function parentAddMapHike(hikeId, hikeName, latitude, longitude) {
    DashboardMapRef.current.addMapHike(hikeId, hikeName, latitude, longitude);
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
        parentGetGraphData={parentGetGraphData}
        parentAddMapHike={parentAddMapHike}
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
          <DashboardHeader
            headerLabel="MapLabel"
            title="Where We've Been 🗺"
            modalTarget="#modal-add-check-in"
            icon="bi bi-check-circle"
            modalText="add a check in"
          />

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
                {/* <DashboardMap ref={DashboardMapRef} /> */}
                {/* <div id="dashboard-map" style={{ height: "100%" }}></div> */}
              </div>
              <div
                className="col-md-6"
                style={{ height: "100%", overflowY: "auto" }}
              >
                <div className="card-body">
                  <ViewMonthYear
                    category="map"
                    getFunction={parentUpdateMapView}
                  />
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
                </div>
              </div>
            </div>
          </div>
        </div>
        {graphDisplay === true ? (
          <React.Fragment>
            <DashboardHeader
              headerLabel="GraphLabel"
              title="How Far We've Traveled 🐾"
              modalTarget="#modal-add-check-in"
              icon="bi bi-check-circle"
              modalText="add a check in"
            />
            <DashboardGraphContainer ref={DashboardGraphContainerRef} />
          </React.Fragment>
        ) : null}
        {checkInsDisplay === true ? (
          <React.Fragment>
            <DashboardHeader
              headerLabel="CheckInsLabel"
              title="Check Ins"
              modalTarget="#modal-add-check-in"
              icon="bi bi-check-circle"
              modalText="add a check in"
            />

            <div style={{ height: "100%", overflowY: "auto" }}>
              <div>{allCheckIns}</div>
            </div>
          </React.Fragment>
        ) : null}
        {bookmarksDisplay === true ? (
          <React.Fragment>
            <DashboardHeader
              headerLabel="BookmarksLabel"
              title="Bookmarks"
              modalTarget="#modal-create-bookmarks-list"
              icon="bi bi-bookmark-star"
              modalText="create a list"
            />

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
