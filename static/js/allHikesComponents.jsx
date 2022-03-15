"use strict";

// All Hikes Check In container component
const AllHikesCheckInContainer = React.forwardRef((props, ref) => {
  const session_login = document.querySelector("#login").innerText;

  const [checkIns, setCheckIns] = React.useState([]);

  function getCheckIns() {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
      });
  }

  React.useImperativeHandle(ref, () => ({
    getCheckIns() {
      fetch(`/user_check_ins.json`)
        .then((response) => response.json())
        .then((data) => {
          setCheckIns(data.checkIns);
        });
    },
  }));

  const allCheckIns = [];
  const allEditCheckIns = [];

  // the following line will print out the value of cards
  // pay attention to what it is initially and what it is when the component re-renders
  // console.log(`checkIns: `, checkIns);

  for (const currentCheckIn of checkIns) {
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
      />
    );
  }

  return (
    <React.Fragment>
      <AddCheckIn getCheckIns={getCheckIns} />
      {allEditCheckIns}
      <div
        className="offcanvas offcanvas-end"
        style={{ width: "650px" }}
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="CheckIns"
        aria-labelledby="CheckInsLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="CheckInsLabel">
            All Check Ins
          </h3>
          {session_login === "True" ? (
            <div className="d-flex float-end">
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  actions <i className="bi bi-check-circle"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-check-in"
                    >
                      add a check in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div>Please log in to add a check in.</div>
          ) : (
            <div>{allCheckIns}</div>
          )}

          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "613px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

// All Hikes Comment container component
const AllHikesCommentContainer = React.forwardRef((props, ref) => {
  const session_login = document.querySelector("#login").innerText;
  const [comments, setComments] = React.useState([]);

  if (session_login === "True") {
    React.useEffect(() => {
      getComments();
    }, []);
  }

  function getComments() {
    fetch(`/user_comments.json`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
      });
  }

  React.useImperativeHandle(ref, () => ({
    getComments() {
      fetch(`/user_comments.json`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
        });
    },
  }));

  const allComments = [];
  const allEditComments = [];

  // the following line will print out the value of cards
  // pay attention to what it is initially and what it is when the component re-renders
  // console.log(`comments: `, comments);

  for (const currentComment of comments) {
    const date_edited = new Date(currentComment.date_edited);
    const date_edited_formatted = `${date_edited.toLocaleDateString()} ${date_edited.toLocaleTimeString()}`;
    const date_created = new Date(currentComment.date_created);
    const date_created_formatted = `${date_created.toLocaleDateString()} ${date_created.toLocaleTimeString()}`;

    allComments.push(
      <Comment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        hike_name={currentComment.hike.hike_name}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        session_login={document.querySelector("#login").innerText}
        getComments={getComments}
      />
    );

    allEditComments.push(
      <EditComment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        getComments={getComments}
      />
    );
  }

  return (
    <React.Fragment>
      <AddComment getComments={getComments} />
      {allEditComments}
      <div
        className="offcanvas offcanvas-end"
        style={{ width: "650px" }}
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Comments"
        aria-labelledby="CommentsLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="CommentsLabel">
            Your Comments For All Hikes
          </h3>
          {session_login === "True" ? (
            <div className="d-flex float-end">
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  actions <i className="bi bi-chat-text"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-comment"
                    >
                      add a comment
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div>Please log in to view your comments.</div>
          ) : (
            <div>{allComments}</div>
          )}

          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "613px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

// Bookmarks Lists Container Component
const AllHikesBookmarksListContainer = React.forwardRef((props, ref) => {
  const session_login = document.querySelector("#login").innerText;

  const AddMultHikesToExistingListRef = React.useRef();
  const BookmarksListRef = React.useRef();

  // Set States
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

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

  const timestamp = Date.now();

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
        key={`${timestamp}-${currentBookmarksList.bookmarks_list_id}`}
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
      <div
        className="offcanvas offcanvas-end"
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Bookmarks"
        aria-labelledby="BookmarksLabel"
        style={{ width: "790px" }}
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="BookmarksLabel">
            All Bookmarks
          </h3>
          {session_login === "True" ? (
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
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div>Please log in to add a bookmark.</div>
          ) : (
            <div>{allBookmarksLists}</div>
          )}
          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "757px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

function HikeTableRow(props) {
  return (
    <tr>
      <td>
        <span
          className="d-inline-block text-truncate"
          style={{ minWidth: 0, maxWidth: "400px" }}
        >
          <a className="link-dark" href={`/hikes/${props.hike.hike_id}`}>
            <small>{props.hike.hike_name}</small>
          </a>
        </span>
      </td>
      <td>
        <small>{props.hike.difficulty}</small>
      </td>
      <td>
        <small>{props.hike.miles} miles</small>
      </td>
      <td>
        <small>{props.hike.state}</small>
      </td>
      <td>
        <small>{props.hike.area}</small>
      </td>
      <td>
        <small>{props.hike.city}</small>
      </td>
      <td>
        <small>{props.hike.leash_rule}</small>
      </td>
      <td>
        <span
          className="d-inline-block text-truncate"
          style={{ maxWidth: "130px" }}
        >
          <small>{props.hike.parking}</small>
        </span>
      </td>
    </tr>
  );
}

function AllHikesContainer(props) {
  const session_login = document.querySelector("#login").innerText;

  const PetProfileContainerRef = React.useRef();
  const AllHikesBookmarksListContainerRef = React.useRef();
  const AllHikesCheckInContainerRef = React.useRef();
  const AllHikesCommentContainerRef = React.useRef();

  const [allHikes, setAllHikes] = React.useState([]);
  const [searchHikes, setSearchHikes] = React.useState([]);
  const [sortParam, setSortParam] = React.useState("");

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    getSearchHikes();
  }, []);

  function getSearchHikes() {
    fetch("/all_hikes.json")
      .then((response) => response.json())
      .then(
        (responseJson) => {
          setIsLoaded(true);
          setAllHikes(responseJson.hikes);
          setSearchHikes(responseJson.hikes);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }

  React.useEffect(() => {
    console.log(sortParam);
    if (sortParam === "name") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.hike_name.toLowerCase(),
            fb = b.hike_name.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "difficulty") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.difficulty.toLowerCase(),
            fb = b.difficulty.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "length") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.miles - b.miles;
        }),
      ]);
    } else if (sortParam === "area") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.area.toLowerCase(),
            fb = b.area.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "city") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.city.toLowerCase(),
            fb = b.city.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "leashRule") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.leash_rule.toLowerCase(),
            fb = b.leash_rule.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "parking") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.parking.toLowerCase(),
            fb = b.parking.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    }
  }, [sortParam]);

  console.log(searchHikes);

  // function sortHikesByName() {
  //   console.log(searchHikes);
  //   const sortedHikes = searchHikes.sort((a, b) => {
  //     let fa = a.difficulty.toLowerCase(),
  //       fb = b.difficulty.toLowerCase();
  //     return fa === fb ? 0 : fa < fb ? -1 : 1;
  //   });

  //   setSearchHikes(sortedHikes);

  //   console.log(sortedHikes);
  // }

  function sortHikesByDifficulty() {
    setSearchHikes([
      ...searchHikes.sort((a, b) => {
        let fa = a.difficulty.toLowerCase(),
          fb = b.difficulty.toLowerCase();
        return fa === fb ? 0 : fa < fb ? -1 : 1;
      }),
    ]);
  }

  // function sortHikesByLength() {
  //   console.log(searchHikes);
  //   const sortedHikes = searchHikes.sort((a, b) => {
  //     return a.miles - b.miles;
  //   });
  //   setSearchHikes(sortedHikes);
  // }

  function sortHikes() {
    console.log(sortParam);
    if (sortParam === "name") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.hike_name.toLowerCase(),
            fb = b.hike_name.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "difficulty") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.difficulty.toLowerCase(),
            fb = b.difficulty.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "area") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.area.toLowerCase(),
            fb = b.area.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "city") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.city.toLowerCase(),
            fb = b.city.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "leashRule") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.leash_rule.toLowerCase(),
            fb = b.leash_rule.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    } else if (sortParam === "parking") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          let fa = a.parking.toLowerCase(),
            fb = b.parking.toLowerCase();
          return fa === fb ? 0 : fa < fb ? -1 : 1;
        }),
      ]);
    }
  }

  function getFilteredHikes() {}

  const timestamp = new Date();

  const allHikeRows = searchHikes.map((hike) => (
    <HikeTableRow hike={hike} key={`${timestamp}-${hike}`} />
  ));

  console.log(
    allHikeRows.map((hike) => hike.props),
    "ALL HIKE ROWS"
  );

  function parentGetBookmarksLists() {
    if (session_login === "True") {
      AllHikesBookmarksListContainerRef.current.getBookmarksLists();
    }
  }
  function parentGetPetProfiles() {
    if (session_login === "True") {
      PetProfileContainerRef.current.getPetProfiles();
    }
  }
  function parentGetCheckIns() {
    if (session_login === "True") {
      AllHikesCheckInContainerRef.current.getCheckIns();
    }
  }
  function parentGetComments() {
    if (session_login === "True") {
      AllHikesCommentContainerRef.current.getComments();
    }
  }

  return (
    <React.Fragment>
      <SearchOffCanvas />
      <PetProfileContainer ref={PetProfileContainerRef} />
      <AllHikesBookmarksListContainer ref={AllHikesBookmarksListContainerRef} />
      <AllHikesCheckInContainer ref={AllHikesCheckInContainerRef} />
      <AllHikesCommentContainer ref={AllHikesCommentContainerRef} />

      <div className="container-fluid">
        <div className="d-flex justify-content-start">
          <div className="card col mt-3" style={{ width: "100vw" }}>
            <div className="card-header pb-0">
              <div className="clearfix">
                <div className="d-flex float-start mt-1">
                  <h3>Hikes</h3>
                </div>
                <div className="d-flex float-end">
                  <form method="GET" action="/hikes/search" className="d-flex">
                    <input
                      className="form-control me-2 input-sm"
                      type="search"
                      name="search_term"
                      placeholder="Search hikes"
                      aria-label="Search"
                    ></input>
                    <button
                      className="btn btn-sm me-2"
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
                  </form>
                  <a
                    className="btn btn-sm mt-1"
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
                  <button
                    type="button"
                    className="btn btn-sm dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="sort"
                        className="bi bi-sort-down"
                      ></i>
                      &nbsp; sort
                    </small>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("name")}
                      >
                        by name
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => {
                          setSortParam("difficulty");
                          sortHikes;
                        }}
                        // onClick={() => setSortParam("difficulty")}
                      >
                        by difficulty
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("length")}
                      >
                        by length
                      </a>
                    </li>

                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("area")}
                      >
                        by area
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("city")}
                      >
                        by city
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("leashRule")}
                      >
                        by leash rule
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        onClick={() => setSortParam("parking")}
                      >
                        by parking
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="all-hikes-container">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th role="columnheader">
                        <small>Name</small>
                      </th>
                      <th role="columnheader">
                        <small>Difficulty</small>
                      </th>
                      <th role="columnheader">
                        <small>Length</small>
                      </th>
                      <th role="columnheader">
                        <small>State</small>
                      </th>
                      <th role="columnheader">
                        <small>Area</small>
                      </th>
                      <th role="columnheader">
                        <small>City</small>
                      </th>
                      <th role="columnheader">
                        <small>Leash rule</small>
                      </th>
                      <th role="columnheader">
                        <small>Parking</small>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHikeRows}
                    {/* {error ? (
                      <i>{error.message}</i>
                    ) : !isLoaded ? (
                      <i>Loading...</i>
                    ) : (
                      <React.Fragment>{allHikeRows}</React.Fragment>
                    )} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="footer-menu navbar navbar-expand-sm navbar-light bg-light fixed-bottom">
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
              <FooterSearchBar />
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

ReactDOM.render(<AllHikesContainer />, document.getElementById("root"));
