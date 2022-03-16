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
        <span className="flex-truncate-text">
          <small>{props.hike.area}</small>
        </span>
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

function TableHeader(props) {
  return (
    <React.Fragment>
      <th role="columnheader">
        <button
          type="button"
          className="btn btn-sm dropdown-toggle pb-0"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <h6
            style={{
              fontSize: ".875rem",
              display: "inline-block",
            }}
          >
            {props.header}
          </h6>
          &nbsp;
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <h6
              style={{
                padding: "0.25rem 1rem",
                fontSize: ".875rem",
              }}
            >
              Sort by {props.header}
            </h6>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a
              className="btn btn-sm dropdown-item"
              onClick={props.handleClickAsc}
            >
              sort ascending
            </a>
          </li>
          <li>
            <a
              className="btn btn-sm dropdown-item"
              onClick={props.handleClickDesc}
            >
              sort descending
            </a>
          </li>
        </ul>
      </th>
    </React.Fragment>
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
  const [keywordFilter, setKeywordFilter] = React.useState("");

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
    if (sortParam === "name-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.hike_name.localeCompare(b.hike_name);
        }),
      ]);
    } else if (sortParam === "name-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.hike_name.localeCompare(a.hike_name);
        }),
      ]);
    } else if (sortParam === "difficulty-asc") {
      const order = ["easy", "moderate", "hard"];
      searchHikes.forEach((hike) => {
        hike.sort_order = order.indexOf(hike.difficulty);
      });
      // console.log(
      //   "WATCH 4 ME",
      //   searchHikes.map((hike) => hike.sort_order)
      // );
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.sort_order - b.sort_order;
        }),
      ]);
    } else if (sortParam === "difficulty-desc") {
      const order = ["hard", "moderate", "easy"];
      searchHikes.forEach((hike) => {
        hike.sort_order = order.indexOf(hike.difficulty);
      });
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.sort_order - b.sort_order;
        }),
      ]);
    } else if (sortParam === "length-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.miles - b.miles;
        }),
      ]);
    } else if (sortParam === "length-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.miles - a.miles;
        }),
      ]);
    } else if (sortParam === "state-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.state.localeCompare(b.state);
        }),
      ]);
    } else if (sortParam === "state-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.state.localeCompare(a.state);
        }),
      ]);
    } else if (sortParam === "area-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.area.localeCompare(b.area);
        }),
      ]);
    } else if (sortParam === "area-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.area.localeCompare(a.area);
        }),
      ]);
    } else if (sortParam === "city-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.city.localeCompare(b.city);
        }),
      ]);
    } else if (sortParam === "city-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.city.localeCompare(a.city);
        }),
      ]);
    } else if (sortParam === "leashRule-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.leash_rule.localeCompare(b.leash_rule);
        }),
      ]);
    } else if (sortParam === "leashRule-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.leash_rule.localeCompare(a.leash_rule);
        }),
      ]);
    } else if (sortParam === "parking-asc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return a.parking.localeCompare(b.parking);
        }),
      ]);
    } else if (sortParam === "parking-desc") {
      setSearchHikes([
        ...searchHikes.sort((a, b) => {
          return b.parking.localeCompare(a.parking);
        }),
      ]);
    }
  }, [sortParam]);

  console.log(searchHikes);

  function getHikesByKeyword() {
    setSearchHikes([
      ...allHikes.filter((hike) =>
        hike.hike_name.toLowerCase().includes(keywordFilter.toLowerCase())
      ),
    ]);
  }

  function getFilteredHikes(url) {
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        const { hikes } = responseJson;
        setSearchHikes(hikes);
      });
  }

  const timestamp = Date.now();
  const allHikeRows = searchHikes.map((hike) => (
    <HikeTableRow hike={hike} key={`${timestamp}-${hike.hike_id}`} />
  ));

  console.log(
    allHikeRows.map((hike) => hike.props.hike.difficulty),
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
      <SearchOffCanvas getFilteredHikes={getFilteredHikes} />
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
                  <div className="d-flex">
                    <div className="input-group">
                      <input
                        className="form-control input-sm"
                        type="search"
                        name="search_term"
                        placeholder="Search by hike name"
                        aria-label="Search"
                        value={keywordFilter}
                        onChange={(event) =>
                          setKeywordFilter(event.target.value)
                        }
                      ></input>
                      <button
                        className="btn btn-sm me-2"
                        role="button"
                        style={{ border: "1px solid #ced4da" }}
                        onClick={getHikesByKeyword}
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
                    </div>
                  </div>
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
                      &nbsp; filter
                    </small>
                  </a>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="all-hikes-container">
                {/* {allHikeRows} */}
                {error ? (
                  <i>{error.message}</i>
                ) : !isLoaded ? (
                  <i className="mt-3">Loading...</i>
                ) : (
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <TableHeader
                          header={"Name"}
                          handleClickAsc={() => setSortParam("name-asc")}
                          handleClickDesc={() => setSortParam("name-desc")}
                        />
                        <TableHeader
                          header={"Difficulty"}
                          handleClickAsc={() => setSortParam("difficulty-asc")}
                          handleClickDesc={() =>
                            setSortParam("difficulty-desc")
                          }
                        />
                        <TableHeader
                          header={"Length"}
                          handleClickAsc={() => setSortParam("length-asc")}
                          handleClickDesc={() => setSortParam("length-desc")}
                        />
                        <TableHeader
                          header={"State"}
                          handleClickAsc={() => setSortParam("state-asc")}
                          handleClickDesc={() => setSortParam("state-desc")}
                        />
                        <TableHeader
                          header={"Area"}
                          handleClickAsc={() => setSortParam("area-asc")}
                          handleClickDesc={() => setSortParam("area-desc")}
                        />
                        <TableHeader
                          header={"City"}
                          handleClickAsc={() => setSortParam("city-asc")}
                          handleClickDesc={() => setSortParam("city-desc")}
                        />
                        <TableHeader
                          header={"Leash Rule"}
                          handleClickAsc={() => setSortParam("leashRule-asc")}
                          handleClickDesc={() => setSortParam("leashRule-desc")}
                        />
                        <TableHeader
                          header={"Parking"}
                          handleClickAsc={() => setSortParam("parking-asc")}
                          handleClickDesc={() => setSortParam("parking-desc")}
                        />
                      </tr>
                    </thead>
                    <tbody>{allHikeRows}</tbody>
                  </table>
                )}
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
            {/* <FooterSearchBar /> */}
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
