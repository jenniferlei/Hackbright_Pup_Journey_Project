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

function HikeDetails(props) {
  const PetProfileContainerRef = React.useRef();
  const HikeDetailsBookmarksListContainerRef = React.useRef();
  const HikeDetailsCheckInContainerRef = React.useRef();
  const HikeDetailsCommentContainerRef = React.useRef();
  const AddHikeToNewOrExistingListRef = React.useRef();

  const hike_id = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

  const [hikeDetails, setHikeDetails] = React.useState("");

  function doNothing() {}

  function parentGetBookmarksLists() {
    if (session_login === "True") {
      HikeDetailsBookmarksListContainerRef.current.getHikeBookmarksLists();
    }
  }

  function parentGetPetProfiles() {
    if (session_login === "True") {
      PetProfileContainerRef.current.getPetProfiles();
    }
  }

  function parentGetCheckIns() {
    if (session_login === "True") {
      HikeDetailsCheckInContainerRef.current.getHikeCheckIns();
    }
  }

  function parentGetComments() {
    if (session_login === "True") {
      HikeDetailsCommentContainerRef.current.getHikeComments();
    }
  }

  function parentSetListOptionsState() {
    if (session_login === "True") {
      AddHikeToNewOrExistingListRef.current.setListOptionsState();
    }
  }

  // Get all hikes for the bookmarks list
  function getHikeDetails() {
    fetch(`/hikes/${hike_id}.json`)
      .then((response) => response.json())
      .then((data) => {
        setHikeDetails(data.hike);
      });
  }

  React.useEffect(() => {
    getHikeDetails();
  }, []);

  return (
    <React.Fragment>
      <SearchOffCanvas />
      <AddHikeToNewOrExistingList
        ref={AddHikeToNewOrExistingListRef}
        parentGetBookmarksLists={parentGetBookmarksLists}
      />
      <PetProfileContainer ref={PetProfileContainerRef} />
      <HikeDetailsBookmarksListContainer
        parentSetListOptionsState={parentSetListOptionsState}
        ref={HikeDetailsBookmarksListContainerRef}
      />
      <HikeDetailsCheckInContainer ref={HikeDetailsCheckInContainerRef} />
      <HikeDetailsCommentContainer ref={HikeDetailsCommentContainerRef} />
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
            <div className="d-flex">
              <ul className="navbar-nav me-auto navbar-center">
                <li className="nav-item">
                  <div className="dropup">
                    <a
                      href=""
                      className="btn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <small>
                        <i className="bi bi-chevron-double-up"></i>
                        &nbsp;Quick Actions
                      </small>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="btn btn-sm dropdown-item"
                          href=""
                          data-bs-toggle="modal"
                          data-bs-target="#modal-add-bookmark"
                          onClick={() =>
                            AddHikeToNewOrExistingListRef.current.setListOptionsState()
                          }
                        >
                          <i className="bi bi-bookmark-star"></i> bookmark this
                          hike
                        </a>
                      </li>
                      <li>
                        <a
                          className="btn btn-sm dropdown-item"
                          href=""
                          data-bs-toggle="modal"
                          data-bs-target="#modal-add-check-in"
                          // onClick = {}
                        >
                          <i className="bi bi-check-circle"></i> check in to
                          this hike
                        </a>
                      </li>
                      <li>
                        <a
                          className="btn btn-sm dropdown-item"
                          href=""
                          data-bs-toggle="modal"
                          data-bs-target="#modal-add-comment"
                        >
                          <i className="bi bi-chat-text"></i> comment this hike
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <FooterNavItemOffCanvas
                  name="Profile"
                  href="Profile"
                  tooltip="profile"
                  icon="fa-solid fa-paw"
                  getFunction={parentGetPetProfiles}
                />
                <FooterNavItemOffCanvas
                  name="Bookmarks"
                  href="Bookmarks"
                  tooltip="bookmarks"
                  icon="bi bi-bookmark-star"
                  getFunction={parentGetBookmarksLists}
                />
                <FooterNavItemOffCanvas
                  name="Check Ins"
                  href="CheckIns"
                  tooltip="check ins"
                  icon="bi bi-check-circle"
                  getFunction={parentGetCheckIns}
                />
                <FooterNavItemOffCanvas
                  name="Comments"
                  href="Comments"
                  tooltip="comments"
                  icon="bi bi-chat-text"
                  getFunction={parentGetComments}
                />
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

ReactDOM.render(<HikeDetails />, document.getElementById("hikeDetailsRoot"));
