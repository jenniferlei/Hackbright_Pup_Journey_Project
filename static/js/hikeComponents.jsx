function HikeDetails(props) {
  const PetProfileContainerRef = React.useRef();
  const HikeDetailsBookmarksListContainerRef = React.useRef();
  const HikeDetailsCheckInContainerRef = React.useRef();
  const HikeDetailsCommentContainerRef = React.useRef();
  const AddHikeToNewOrExistingListRef = React.useRef();

  const hike_id = document.querySelector("#hike_id").innerText;

  const [hikeDetails, setHikeDetails] = React.useState("");

  function parentGetBookmarksLists() {
    HikeDetailsBookmarksListContainerRef.current.getBookmarksLists();
  }

  function parentSetListOptionsState() {
    AddHikeToNewOrExistingListRef.current.setListOptionsState();
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
      <div className="container-fluid">
        <div className="d-flex justify-content-start">
          <div className="card col mt-4" style={{ width: "100vw" }}>
            <div className="card-header">
              <div className="clearfix">
                <div className="float-start">
                  <h3 className="mt-1">{hikeDetails.hike_name}</h3>
                </div>
                <div className="d-flex float-end">
                  <div className="btn-group mt-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      actions <i className="bi bi-bookmark-star"></i>{" "}
                      <i className="bi bi-check-circle"></i>{" "}
                      <i className="bi bi-chat-text"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
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
                          data-bs-toggle="offcanvas"
                          href="#Bookmarks"
                          role="button"
                          aria-controls="Bookmarks"
                          onClick={() =>
                            HikeDetailsBookmarksListContainerRef.current.getHikeBookmarksLists()
                          }
                        >
                          <i className="bi bi-bookmark-star"></i> view bookmarks
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
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
                          data-bs-toggle="offcanvas"
                          href="#CheckIns"
                          role="button"
                          aria-controls="CheckIns"
                          onClick={() =>
                            HikeDetailsCheckInContainerRef.current.getHikeCheckIns()
                          }
                        >
                          <i className="bi bi-check-circle"></i> view check ins
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
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
                      <li>
                        <a
                          className="btn btn-sm dropdown-item"
                          data-bs-toggle="offcanvas"
                          href="#Comments"
                          role="button"
                          aria-controls="Comments"
                          onClick={() =>
                            HikeDetailsCommentContainerRef.current.getHikeComments()
                          }
                        >
                          <i className="bi bi-chat-text"></i> view comments
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-5">
                <div className="card-body">
                  {hikeDetails.description}
                  <br></br>
                  <ul className="no-bullets">
                    <li>
                      <strong>
                        <span id="area">Area:</span>
                      </strong>{" "}
                      {hikeDetails.area}, {hikeDetails.city},{" "}
                      {hikeDetails.state}
                    </li>
                    <li>
                      <strong>
                        <span id="difficulty">Difficulty:</span>
                      </strong>{" "}
                      {hikeDetails.difficulty}
                    </li>
                    <li>
                      <strong>
                        <span id="leash_rule">Leash Rule:</span>
                      </strong>{" "}
                      {hikeDetails.leash_rule}
                    </li>
                    <li>
                      <strong>
                        <span id="address">Address:</span>
                      </strong>{" "}
                      {hikeDetails.address}
                    </li>
                    <li>
                      <strong>
                        <span id="coordinates">Coordinates:</span>
                      </strong>{" "}
                      <span id="latitude">{hikeDetails.latitude}</span>,{" "}
                      <span id="longitude">{hikeDetails.longitude}</span>
                    </li>
                    <li>
                      <strong>
                        <span id="length">Length:</span>
                      </strong>{" "}
                      {hikeDetails.miles} {hikeDetails.path}
                    </li>
                    <li>
                      <strong>
                        <span id="parking">Parking:</span>
                      </strong>{" "}
                      {hikeDetails.parking}
                    </li>
                    <li>
                      <strong>
                        <span id="resources">Resources:</span>
                      </strong>
                      <br />
                      <a
                        className="link-dark"
                        href={hikeDetails.resources}
                        target="_blank"
                      >
                        {hikeDetails.resources}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-7">
                <div className="embed-google-map">
                  <iframe
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://maps.google.com/maps?q=${hikeDetails.latitude},${hikeDetails.longitude}&t=&zoom=11&maptype=roadmap&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                  {/* API MAP
                <iframe
                  width="500"
                  height="300"
                  frameBorder="0"
                  style="border:0"
                  src={`"https://www.google.com/maps/embed/v1/directions?key={{ GOOGLE_KEY }}&origin=Current+Location&destination=${hikeDetails.latitude},${hikeDetails.longitude}&center=${hikeDetails.latitude},${hikeDetails.longitude}&avoid=tolls&zoom=11"`}
                  allowfullscreen
                ></iframe> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    onClick={() =>
                      PetProfileContainerRef.current.getPetProfiles()
                    }
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
                    onClick={() =>
                      HikeDetailsBookmarksListContainerRef.current.getHikeBookmarksLists()
                    }
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
                    onClick={() =>
                      HikeDetailsCheckInContainerRef.current.getHikeCheckIns()
                    }
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
                    onClick={() =>
                      HikeDetailsCommentContainerRef.current.getHikeComments()
                    }
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

if (document.getElementById("hikeDetailsRoot") !== null) {
  ReactDOM.render(<HikeDetails />, document.getElementById("hikeDetailsRoot"));
}
