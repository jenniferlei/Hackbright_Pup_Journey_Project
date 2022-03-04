"use strict";

function DashboardMap(props) {}

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
  const [graphDisplay, setGraphDisplay] = React.useState(false);
  const [checkInsDisplay, setCheckInsDisplay] = React.useState(false);
  const [bookmarksDisplay, setBookmarksDisplay] = React.useState(false);

  const [checkIns, setCheckIns] = React.useState([]);
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  React.useEffect(() => {
    getCheckIns();
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
      getDashboardGraph();
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
  let initial_miles = 0;

  let total_miles = checkIns.reduce(function (previousValue, currentValue) {
    return previousValue + currentValue.miles_completed;
  }, initial_miles);

  // checkIns.forEach((checkIn) => {
  //   // Checking if there is any object in checkInsHikeCounts
  //   // which contains the key value
  //   if (
  //     checkInsHikeCounts.some((hikeCount) => {
  //       return hikeCount["hike_id"] == checkIn["hike_id"];
  //     })
  //   ) {
  //     // If yes! then increase the occurrence by 1
  //     checkInsHikeCounts.forEach((hikeCount) => {
  //       if (hikeCount["hike_id"] === checkIn["hike_id"]) {
  //         hikeCount["occurrence"]++;
  //       }
  //     });
  //   } else {
  //     // If not! Then create a new object initialize
  //     // it with the present iteration key's value and
  //     // set the occurrence to 1
  //     let newHikeCountObj = {};
  //     newHikeCountObj["hike_id"] = checkIn["hike_id"];
  //     newHikeCountObj["occurrence"] = 1;
  //     // newHikeCountObj["hike_name"] = checkIn["hike"]["hike_name"];
  //     checkInsHikeCounts.push(newHikeCountObj);
  //   }
  // });

  // console.log("checkInsHikeCounts", checkInsHikeCounts);

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

  return (
    <React.Fragment>
      <AddCheckIn getCheckIns={getCheckIns} refreshProfiles={refreshProfiles} />
      {allEditCheckIns}
      {allRenameBookmarksLists}
      {allAddMultHikesToExistingList}
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      <div className="dashboard-container d-flex flex-column flex-shrink-0">
        <div id="display-map">
          <div className="clearfix" style={{ width: "100%" }}>
            <h3 class="float-start" id="MapLabel">
              Where We've Been <i class="bi bi-map"></i>
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
            class="card"
            style={{
              border: "0",
              width: "100%",
              height: "calc(100vh - 190px)",
            }}
          >
            <div class="row g-0" style={{ height: "100%" }}>
              <div class="col-md-6">
                <div id="dashboard-map" style={{ height: "100%" }}></div>
              </div>
              <div class="col-md-6">
                <div class="card-body">
                  <h5 class="card-title">Your Visited Hikes</h5>
                  <p class="card-text">
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
                  <p class="card-text">
                    Add option to view by month, year, all time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {graphDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 class="float-start" id="GraphLabel">
                How Far We've Traveled&nbsp;🐾
              </h3>
              <div class="d-flex">
                View by&nbsp;&nbsp;
                <input
                  type="radio"
                  class="btn-check"
                  name="chart-view"
                  value="month-view"
                  id="month-view"
                  autocomplete="off"
                  checked
                />
                <label class="btn btn-outline-dark btn-sm" for="month-view">
                  month
                </label>
                &nbsp;
                <input
                  type="radio"
                  class="btn-check"
                  name="chart-view"
                  value="year-view"
                  id="year-view"
                  autocomplete="off"
                />
                <label class="btn btn-outline-dark btn-sm" for="year-view">
                  year
                </label>
                &nbsp;&nbsp;
                <div id="show-month-view" class="chart-form">
                  <div class="d-flex">
                    <select
                      class="form-select btn-sm"
                      name="month-view-month"
                      aria-label="month-view-select-month"
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
                    &nbsp;
                    <select
                      class="form-select btn-sm"
                      name="month-view-year"
                      aria-label="month-view-select-year"
                    >
                      <option value="2022">2022</option>
                    </select>
                    &nbsp;
                    <button
                      class="chart-view-submit btn btn-sm btn-outline-dark"
                      type="submit"
                      name="view"
                      value="month"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div id="show-year-view" class="chart-form">
                  <div class="d-flex">
                    <select
                      class="form-select btn-sm"
                      name="year-view-year"
                      aria-label="year-view-select-year"
                    >
                      <option value="2022">2022</option>
                    </select>
                    &nbsp;
                    <button
                      class="chart-view-submit btn btn-sm btn-outline-dark"
                      type="submit"
                      name="view"
                      value="year"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
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
              class="card"
              style={{
                border: "0",
                width: "100%",
                height: "calc(100vh - 174px)",
              }}
            >
              <div class="row g-0" style={{ height: "100%" }}>
                <div class="col-md-8" style={{ height: "100%" }}>
                  <canvas id="check-in-graph"></canvas>
                </div>
                <div class="col-md-4">
                  <div class="card-body">
                    <h5 class="card-title">Title TBD</h5>
                    <p class="card-text">
                      You have done {checkIns.length} hikes
                      <br></br>and walked {total_miles} miles!
                    </p>
                    <p class="card-text">Add option to view by month, year</p>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {checkInsDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 class="float-start" id="CheckInsLabel">
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

            <div>
              <div>{allCheckIns}</div>
            </div>
          </React.Fragment>
        ) : null}
        {bookmarksDisplay === true ? (
          <React.Fragment>
            <div className="clearfix" style={{ width: "100%" }}>
              <h3 class="float-start" id="BookmarksLabel">
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

            <div>
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
              data-bs-custom-class="custom-tooltip"
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
              data-bs-custom-class="custom-tooltip"
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
