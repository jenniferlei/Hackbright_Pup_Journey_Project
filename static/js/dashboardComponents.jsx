"use strict";

// Bookmarks Lists Container Component
const DashboardBookmarksListContainer = React.forwardRef((props, ref) => {
  const AddMultHikesToExistingListRef = React.useRef();
  const BookmarksListRef = React.useRef();

  // Set States
  const [bookmarksLists, setBookmarksLists] = React.useState(
    props.bookmarksLists
  );

  function getBookmarksLists() {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
      });
  }

  // Access getHikeBookmarksLists function from Footer component
  React.useImperativeHandle(ref, () => ({
    getBookmarksLists() {
      fetch("/user_bookmarks_lists.json")
        .then((response) => response.json())
        .then((data) => {
          setBookmarksLists(data.bookmarksLists);
        });
    },
  }));

  function parentSetHikesOptionState() {
    AddMultHikesToExistingListRef.current.setHikesOptionsState();
  }

  const allBookmarksLists = [];
  const allRenameBookmarksLists = [];
  const allAddMultHikesToExistingList = [];

  // the following line will print out the value of cards
  // pay attention to what it is initially and what it is when the component re-renders
  console.log(`bookmarksLists: `, bookmarksLists);

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

  return (
    <React.Fragment>
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      {allRenameBookmarksLists}
      {allAddMultHikesToExistingList}

      <div style={{ width: "100%", height: "100%" }}>
        <div className="title">
          <h3 id="BookmarksLabel">All Bookmarks</h3>
          <div className="d-flex float-end">
            <div className="btn-group mt-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-dark dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                actions <i className="bi bi-bookmark-star"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    className="btn btn-sm dropdown-item"
                    href=""
                    data-bs-toggle="modal"
                    data-bs-target="#modal-create-bookmarks-list"
                  >
                    create a list
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div>{allBookmarksLists}</div>
        </div>
      </div>
    </React.Fragment>
  );
});

const DashboardMainContainer = React.forwardRef((props, ref) => {
  const DashboardBookmarksListContainerRef = React.useRef();
  const [mapDisplay, setMapDisplay] = React.useState(true);
  const [graphDisplay, setGraphDisplay] = React.useState(false);
  const [checkInsDisplay, setCheckInsDisplay] = React.useState(false);
  const [bookmarksDisplay, setBookmarksDisplay] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    getMap() {
      setMapDisplay(true);
      setGraphDisplay(false);
      setCheckInsDisplay(false);
      setBookmarksDisplay(false);
    },
  }));

  React.useImperativeHandle(ref, () => ({
    getGraph() {
      setMapDisplay(false);
      setGraphDisplay(true);
      setCheckInsDisplay(false);
      setBookmarksDisplay(false);
    },
  }));

  React.useImperativeHandle(ref, () => ({
    getCheckIns() {
      setMapDisplay(false);
      setGraphDisplay(false);
      setCheckInsDisplay(true);
      setBookmarksDisplay(false);
    },
  }));

  React.useImperativeHandle(ref, () => ({
    getBookmarks() {
      setMapDisplay(false);
      setGraphDisplay(false);
      setCheckInsDisplay(false);
      setBookmarksDisplay(true);
    },
  }));

  return (
    <React.Fragment>
      <div className="dashboard-container d-flex flex-column flex-shrink-0">
        {mapDisplay === true ? null : null}
        {graphDisplay === true ? null : null}
        {checkInsDisplay === true ? null : null}
        {bookmarksDisplay === true ? (
          <DashboardBookmarksListContainer
            ref={DashboardBookmarksListContainerRef}
          />
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
              className="nav-link active py-3 border-bottom"
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
              onClick={props.parentGetMap}
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
              onClick={props.parentGetGraph}
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
              onClick={props.parentGetCheckIns}
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
              onClick={props.parentGetBookmarks}
            >
              <i className="bi bi-bookmark-star"></i>
            </a>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}

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
      <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-bottom">
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

function DashboardEverythingContainer(props) {
  const DashboardMainContainerRef = React.useRef();
  function parentGetMap() {
    DashboardMainContainerRef.current.getMap();
  }
  function parentGetGraph() {
    DashboardMainContainerRef.current.getGraph();
  }
  function parentGetCheckIns() {
    DashboardMainContainerRef.current.getCheckIns();
  }
  function parentGetBookmarks() {
    DashboardMainContainerRef.current.getBookmarks();
    React.useEffect(() => {
      butWHYISNTTHISWORKINGgetBookmarksLists();
    }, []);
  }

  // Set States
  const [notWorkingbookmarksLists, setnotWorkingBookmarksLists] =
    React.useState([]);

  function butWHYISNTTHISWORKINGgetBookmarksLists() {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setnotWorkingBookmarksLists(data.bookmarksLists);
        console.log("ME TOO bookmarksLists", notWorkingbookmarksLists);
      });
  }

  console.log("LOOK OUT FOR ME bookmarksLists", notWorkingbookmarksLists);

  return (
    <React.Fragment>
      <DashboardMainContainer ref={DashboardMainContainerRef} />
      <SideBarMenu
        parentGetMap={parentGetMap}
        parentGetGraph={parentGetGraph}
        parentGetCheckIns={parentGetCheckIns}
        parentGetBookmarks={parentGetBookmarks}
      />
      <SearchOffCanvas />
      <PetProfileContainer />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(
  <DashboardEverythingContainer />,
  document.getElementById("root")
);
