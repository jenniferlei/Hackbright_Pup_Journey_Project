"use strict";

function SideBarMenu(props) {
  return (
    <React.Fragment>
      <div
        className="d-flex flex-column flex-shrink-0 bg-light"
        style={{ width: "4.5rem", height: "100%" }}
      >
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
              style={{ whiteSpace: "nowrap" }}
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
      <PetProfileContainer />
      <SideBarMenu />
      <SearchOffCanvas />
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
            <div className="d-flex"></div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

ReactDOM.render(<Footer />, document.getElementById("root"));
