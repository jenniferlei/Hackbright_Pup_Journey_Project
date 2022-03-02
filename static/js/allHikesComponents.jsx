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

  const PetProfileContainerRef = React.useRef();
  const HikeDetailsBookmarksListContainerRef = React.useRef();
  const HikeDetailsCheckInContainerRef = React.useRef();
  const HikeDetailsCommentContainerRef = React.useRef();

  function doNothing() {}

  function parentGetBookmarksLists() {
    if (session_login === "True") {
      HikeDetailsBookmarksListContainerRef.current.getBookmarksLists();
    }
  }

  function parentGetPetProfiles() {
    if (session_login === "True") {
      PetProfileContainerRef.current.getPetProfiles();
    }
  }

  function parentGetBookmarksLists() {
    if (session_login === "True") {
      HikeDetailsBookmarksListContainerRef.current.getBookmarksLists();
    }
  }

  function parentGetCheckIns() {
    if (session_login === "True") {
      HikeDetailsCheckInContainerRef.current.getCheckIns();
    }
  }

  function parentGetComments() {
    if (session_login === "True") {
      HikeDetailsCommentContainerRef.current.getComments();
    }
  }

  return (
    <React.Fragment>
      <SearchOffCanvas />
      <PetProfileContainer ref={PetProfileContainerRef} />
      <HikeDetailsBookmarksListContainer
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

ReactDOM.render(<Footer />, document.getElementById("root"));
