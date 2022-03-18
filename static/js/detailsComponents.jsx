"use strict";

// Hike Details Comment container component
const HikeDetailsCommentContainer = React.forwardRef((props, ref) => {
  const [comments, setComments] = React.useState([]);

  const hike_id = document.querySelector("#hike_id").innerText;

  React.useEffect(() => {
    getComments();
  }, []);

  const [commentsHeader, setCommentsHeader] = React.useState(
    "Comments For This Hike"
  );

  function getComments() {
    if (
      document.querySelector("#CommentsLabel").innerText ===
      "Comments For This Hike"
    ) {
      getHikeComments();
    } else if (
      document.querySelector("#CommentsLabel").innerText ===
      "Your Comments for All Hikes"
    ) {
      getUserComments();
    }
  }

  function getHikeComments() {
    fetch(`/hikes/${hike_id}/comments.json`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
        setCommentsHeader("Comments For This Hike");
      });
  }

  function getUserComments() {
    fetch(`/user_comments.json`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
        setCommentsHeader("Your Comments for All Hikes");
      });
  }

  React.useImperativeHandle(ref, () => ({
    getHikeComments() {
      fetch(`/hikes/${hike_id}/comments.json`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setCommentsHeader("Comments For This Hike");
        });
    },
  }));

  const allComments = [];
  const allEditComments = [];

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

  const session_login = document.querySelector("#login").innerText;

  return (
    <React.Fragment>
      <AddComment getComments={getComments} />
      <AddHikeComment getComments={getComments} />
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
            {commentsHeader}
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
                      data-bs-target="#modal-add-hike-comment"
                    >
                      add a comment for this hike
                    </a>
                  </li>
                </ul>
              </div>
              &nbsp;&nbsp;
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  view <i className="bi bi-eye"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getUserComments}
                    >
                      view all your comments
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getHikeComments}
                    >
                      view comments for this hike
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to add a comment.</div>
          ) : null}
          <div>{allComments}</div>

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

const DetailsAddHikeToNewOrExistingList = React.forwardRef((props, ref) => {
  const hike_id = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

  // For adding to existing list
  const [allBookmarksListOptions, setAllBookmarksListOptions] =
    React.useState("");
  const [isLoading, setLoading] = React.useState(true);

  if (session_login === "True") {
    React.useEffect(() => {
      setListOptionsState();
    }, [isLoading]);
  }

  function setListOptionsState() {
    fetch("/user_bookmarks_lists.json").then((response) =>
      response.json().then((jsonResponse) => {
        const bookmarksLists = jsonResponse.bookmarksLists;
        const allListOptions = [];

        bookmarksLists.map((bookmarksList) => {
          let hikeOnList = false;
          for (const hike of bookmarksList.hikes) {
            if (hike.hike_id === Number(hike_id)) {
              hikeOnList = true;
            }
          }

          if (hikeOnList) {
            allListOptions.push({
              select: true,
              bookmarks_list_name: bookmarksList.bookmarks_list_name,
              bookmarks_list_id: bookmarksList.bookmarks_list_id,
            });
          } else {
            allListOptions.push({
              select: false,
              bookmarks_list_name: bookmarksList.bookmarks_list_name,
              bookmarks_list_id: bookmarksList.bookmarks_list_id,
            });
          }
        });
        const copyAllListOptions = allListOptions.slice();
        setAllBookmarksListOptions(copyAllListOptions);
        console.log("allListOptions", copyAllListOptions);
        setLoading(false);
      })
    );
  }

  // Access setListOptionsState function from HikeDetailsBookmarksListContainer component
  React.useImperativeHandle(ref, () => ({
    setListOptionsState() {
      if (session_login === "True") {
        fetch("/user_bookmarks_lists.json").then((response) =>
          response.json().then((jsonResponse) => {
            const bookmarksLists = jsonResponse.bookmarksLists;
            const allListOptions = [];

            bookmarksLists.map((bookmarksList) => {
              let hikeOnList = false;
              for (const hike of bookmarksList.hikes) {
                if (hike.hike_id === Number(hike_id)) {
                  hikeOnList = true;
                }
              }

              if (hikeOnList) {
                allListOptions.push({
                  select: true,
                  bookmarks_list_name: bookmarksList.bookmarks_list_name,
                  bookmarks_list_id: bookmarksList.bookmarks_list_id,
                });
              } else {
                allListOptions.push({
                  select: false,
                  bookmarks_list_name: bookmarksList.bookmarks_list_name,
                  bookmarks_list_id: bookmarksList.bookmarks_list_id,
                });
              }
            });
            const copyAllListOptions = allListOptions.slice();
            setAllBookmarksListOptions(copyAllListOptions);
            console.log("allListOptions", copyAllListOptions);
            setLoading(false);
          })
        );
      }
    },
  }));

  function addHikeExistingBookmarksList() {
    fetch(`/hikes/${hike_id}/add-hike-to-existing-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        allBookmarksListOptions, // returns list of objects
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.parentGetBookmarksLists();
        console.log(jsonResponse);
      });
    });
  }

  // For adding to new list
  const [bookmarksListName, setBookmarksListName] = React.useState("");

  // Validate form - need to make sure to validate each required item
  function validateBookmarksList() {
    const alertText = "Please complete the following:\n• input list name";

    if (bookmarksListName === "") {
      alert(alertText);
    } else {
      addHikeNewBookmarksList();
    }
  }

  function addHikeNewBookmarksList() {
    fetch(`/hikes/${hike_id}/add-hike-to-new-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.parentGetBookmarksLists();
        console.log(jsonResponse);
      });
    });
  }
  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-bookmark"
        tabIndex="-1"
        aria-labelledby="modal-add-bookmark-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-bookmark-label">
                Bookmark this hike
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {session_login !== "True" ? (
                <div className="fw-300">Please log in to add a bookmark.</div>
              ) : (
                <div>
                  <h4>Add to New Bookmark List</h4>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="bookmarks-list-name"
                      placeholder="Hikes I Want To Visit"
                      value={bookmarksListName}
                      onChange={(event) =>
                        setBookmarksListName(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={validateBookmarksList}
                    >
                      Save
                    </button>
                  </div>

                  <h4>Add to Existing Bookmark List</h4>

                  <div className="mb-3">
                    {allBookmarksListOptions !== ""
                      ? allBookmarksListOptions.map((bookmarksListOption) => (
                          <div
                            className="form-check"
                            key={`${hike_id}-${bookmarksListOption.bookmarks_list_id}`}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`add-hike-${bookmarksListOption.bookmarks_list_id}`}
                              value={bookmarksListOption.bookmarks_list_id}
                              checked={bookmarksListOption.select}
                              onChange={(event) => {
                                event.stopPropagation();
                                let checked = event.target.checked;
                                setAllBookmarksListOptions(
                                  allBookmarksListOptions.map((data) => {
                                    if (
                                      bookmarksListOption.bookmarks_list_id ===
                                      data.bookmarks_list_id
                                    ) {
                                      data.select = checked;
                                    }
                                    return data;
                                  })
                                );
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`add-hike-${bookmarksListOption.bookmarks_list_id}`}
                            >
                              {bookmarksListOption.bookmarks_list_name}
                            </label>
                          </div>
                        ))
                      : null}
                  </div>

                  <div className="mb-3">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={addHikeExistingBookmarksList}
                    >
                      Save
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary btn-block"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

// Hike Details container component
const HikeDetailsCheckInContainer = React.forwardRef((props, ref) => {
  const session_login = document.querySelector("#login").innerText;
  const hike_id = document.querySelector("#hike_id").innerText;

  const [checkIns, setCheckIns] = React.useState([]);
  const [checkInsHeader, setCheckInsHeader] = React.useState(
    "Check Ins For This Hike"
  );

  function getCheckIns() {
    if (
      document.querySelector("#CheckInsLabel").innerText ===
      "Check Ins For This Hike"
    ) {
      getHikeCheckIns();
    } else if (
      document.querySelector("#CheckInsLabel").innerText === "All Check Ins"
    ) {
      getUserCheckIns();
    }
  }

  function getHikeCheckIns() {
    fetch(`/hikes/${hike_id}/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
        setCheckInsHeader("Check Ins For This Hike");
      });
  }

  function getUserCheckIns() {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
        setCheckInsHeader("All Check Ins");
      });
  }

  React.useImperativeHandle(ref, () => ({
    getHikeCheckIns() {
      if (session_login === "True") {
        fetch(`/hikes/${hike_id}/user_check_ins.json`)
          .then((response) => response.json())
          .then((data) => {
            setCheckIns(data.checkIns);
            setCheckInsHeader("Check Ins For This Hike");
          });
      }
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
      <AddHikeCheckIn getCheckIns={getCheckIns} />
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
            {checkInsHeader}
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
                    <li>
                      <a
                        className="btn btn-sm dropdown-item"
                        href=""
                        data-bs-toggle="modal"
                        data-bs-target="#modal-add-check-in"
                      >
                        check in to a hike
                      </a>
                    </li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-hike-check-in"
                    >
                      check in to this hike
                    </a>
                  </li>
                </ul>
              </div>
              &nbsp;&nbsp;
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  view <i className="bi bi-eye"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getUserCheckIns}
                    >
                      view all check ins
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getHikeCheckIns}
                    >
                      view check ins for this hike
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {session_login === "True" &&
        checkInsHeader === "Check Ins For This Hike" ? (
          <div className="ms-4 fw-300">
            You have this hike on the following check ins:
          </div>
        ) : null}
        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to add a check in.</div>
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

// Bookmarks Lists Container Component
const HikeDetailsBookmarksListContainer = React.forwardRef((props, ref) => {
  const hike_id = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

  const AddMultHikesToExistingListRef = React.useRef();
  const BookmarksListRef = React.useRef();

  // Set States
  const [bookmarksLists, setBookmarksLists] = React.useState([]);
  const [bookmarksListsHeader, setBookmarksListsHeader] = React.useState(
    "Bookmarks For This Hike"
  );

  function getBookmarksLists() {
    if (
      document.querySelector("#BookmarksLabel").innerText ===
      "Bookmarks For This Hike"
    ) {
      getHikeBookmarksLists();
    } else if (
      document.querySelector("#BookmarksLabel").innerText === "All Bookmarks"
    ) {
      getUserBookmarksLists();
    }
  }

  function getHikeBookmarksLists() {
    fetch(`/hikes/${hike_id}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
        setBookmarksListsHeader("Bookmarks For This Hike");
      });
  }

  function getUserBookmarksLists() {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
        setBookmarksListsHeader("All Bookmarks");
      });
  }

  // Access getHikeBookmarksLists function from Footer component
  React.useImperativeHandle(ref, () => ({
    getHikeBookmarksLists() {
      if (session_login === "True") {
        fetch(`/hikes/${hike_id}/bookmarks.json`)
          .then((response) => response.json())
          .then((data) => {
            setBookmarksLists(data.bookmarksLists);
            setBookmarksListsHeader("Bookmarks For This Hike");
          });
      }
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
        parentSetHikesOptionState={parentSetHikesOptionState}
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
            {bookmarksListsHeader}
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
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-bookmark"
                      onClick={props.parentSetListOptionsState}
                    >
                      bookmark this hike
                    </a>
                  </li>
                </ul>
              </div>
              &nbsp;&nbsp;
              <div className="btn-group mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  view <i className="bi bi-eye"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getUserBookmarksLists}
                    >
                      view all lists
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn btn-sm dropdown-item"
                      onClick={getHikeBookmarksLists}
                    >
                      view lists for this hike
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {session_login === "True" &&
        bookmarksListsHeader === "Bookmarks For This Hike" ? (
          <div className="ms-4 fw-300">
            You have this hike on the following lists:
          </div>
        ) : null}
        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to add a bookmark.</div>
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

function HikeDetails(props) {
  const PetProfileContainerRef = React.useRef();
  const HikeDetailsBookmarksListContainerRef = React.useRef();
  const HikeDetailsCheckInContainerRef = React.useRef();
  const HikeDetailsCommentContainerRef = React.useRef();
  const DetailsAddHikeToNewOrExistingListRef = React.useRef();

  const hike_id = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

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
      DetailsAddHikeToNewOrExistingListRef.current.setListOptionsState();
    }
  }

  return (
    <React.Fragment>
      <SearchOffCanvas />
      <DetailsAddHikeToNewOrExistingList
        ref={DetailsAddHikeToNewOrExistingListRef}
        parentGetBookmarksLists={parentGetBookmarksLists}
      />
      <PetProfileContainer ref={PetProfileContainerRef} />
      <HikeDetailsBookmarksListContainer
        parentSetListOptionsState={parentSetListOptionsState}
        ref={HikeDetailsBookmarksListContainerRef}
      />
      <HikeDetailsCheckInContainer ref={HikeDetailsCheckInContainerRef} />
      <HikeDetailsCommentContainer ref={HikeDetailsCommentContainerRef} />
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
                <li className="nav-item">
                  <div className="dropup">
                    <a
                      href=""
                      className="btn nav-link fw-300"
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
                            DetailsAddHikeToNewOrExistingListRef.current.setListOptionsState()
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
                          data-bs-target="#modal-add-hike-check-in"
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
                          data-bs-target="#modal-add-hike-comment"
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
