function FixedFooter(props) {
  return (
    <React.Fragment>
      <BookmarksListContainer />
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
                <li className="nav-item input-group">
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
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="offcanvas"
                  href="#Search"
                  role="button"
                  aria-controls="Search"
                >
                  <small>
                    <i
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="advanced search"
                      className="bi bi-sliders"
                    ></i>
                  </small>
                </a>
              </li>
            </ul>
            <div className="d-flex">
              <ul className="navbar-nav me-auto navbar-center">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="offcanvas"
                    href="#Profile"
                    role="button"
                    aria-controls="Profile"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="profile"
                        className="fa-solid fa-paw"
                      ></i>
                      &nbsp;Profile
                    </small>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="offcanvas"
                    href="#Bookmarks"
                    role="button"
                    aria-controls="Bookmarks"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="bookmarks"
                        className="bi bi-bookmark-star"
                      ></i>
                      &nbsp;Bookmarks
                    </small>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="offcanvas"
                    href="#CheckIns"
                    role="button"
                    aria-controls="CheckIns"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="check ins"
                        className="bi bi-check-circle"
                      ></i>
                      &nbsp;Check Ins
                    </small>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="offcanvas"
                    href="#Comments"
                    role="button"
                    aria-controls="Comments"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="comments"
                        className="bi bi-chat-text"
                      ></i>
                      &nbsp;Comments
                    </small>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

function Everything(props) {
  return (
    <React.Fragment>
      <PetProfileContainer />
      <BookmarksListContainer />
      <CheckInContainer />
      <CommentContainer />
      <FixedFooter />
    </React.Fragment>
  );
}

ReactDOM.render(<Everything />, document.getElementById("root"));
