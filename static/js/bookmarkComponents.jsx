"use strict";

// Hikes in a Bookmarks List Component
function HikeBookmark(props) {
  // Check if user wants to delete hike from list or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to remove this hike from this list?");
    if (!validate) {
      event.preventDefault();
    } else {
      removeExistingHikeFromList();
    }
  }

  // Process deletion of a hike from a list if user confirms
  // Which will then run refreshLists() on parent component
  function removeExistingHikeFromList() {
    fetch(`/${props.bookmarks_list_id}/${props.hike_id}/remove-hike`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        props.refreshLists();
      });
  }

  return (
    <React.Fragment>
      <div className="row fw-300">
        <div className="clearfix">
          <div className="d-flex float-start">
            <button
              className="btn btn-sm"
              style={{ padding: 0 }}
              type="submit"
              onClick={deleteConfirm}
            >
              <small>
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="remove from list"
                  className="bi bi-x"
                ></i>
              </small>
            </button>
            &nbsp;&nbsp;
            <a className="link-dark" href={`/hikes/${props.hike_id}`}>
              {props.hike_name}
            </a>
          </div>
        </div>
      </div>
      <div className="row fw-300">
        <small>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.difficulty} | {props.miles} miles | {props.city}, {props.state}{" "}
          | {props.area} | {props.leash_rule} | {props.parking}
        </small>
      </div>
    </React.Fragment>
  );
}

// Bookmarks List Component
const BookmarksList = React.forwardRef((props, ref) => {
  const hike_id = document.querySelector("#hike_id");
  // Make an array of HikeBookmark Components (hikes on each bookmarks list)
  const allHikeBookmarks = [];

  // the following line will print out the hikes
  // console.log(`hikes: `, hikes);

  for (const currentHike of props.hikes) {
    allHikeBookmarks.push(
      <HikeBookmark
        key={currentHike.hike_id}
        area={currentHike.area}
        city={currentHike.city}
        difficulty={currentHike.difficulty}
        hike_id={currentHike.hike_id}
        bookmarks_list_id={props.bookmarks_list_id}
        hike_name={currentHike.hike_name}
        leash_rule={currentHike.leash_rule}
        miles={currentHike.miles}
        parking={currentHike.parking}
        state={currentHike.state}
        refreshLists={refreshLists}
      />
    );
  }

  // this is a prop on removeExistingHikeFromList (to process deletion of a hike from a list)
  // props.getBookmarksLists will run the function on parent component (gets most up to date lists)
  function refreshLists() {
    props.getBookmarksLists();
    // props.parentUpdateHikeOptionsSet();
  }

  // Check if user wants to delete existing bookmarks list or not
  function deleteConfirm() {
    const validate = confirm("Do you want to delete this list?");
    if (validate) {
      deleteExistingBookmarksList();
    }
  }

  // Process deletion of a bookmarks list and all its hikes
  // props.getBookmarksLists will run the function on parent component (gets most up to date lists)
  function deleteExistingBookmarksList() {
    fetch(`/delete-bookmarks-list/${props.bookmarks_list_id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();

        if (hike_id !== null) {
          props.parentSetListOptionsState();
        }
      });
  }

  return (
    <React.Fragment>
      <div className="card mb-1">
        <div className="card-header">
          <div className="clearfix">
            <div className="float-start">
              <a
                className="btn btn-sm"
                data-bs-toggle="collapse"
                href={`#collapse-bookmarks-${props.bookmarks_list_id}`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapse-bookmarks-${props.bookmarks_list_id}`}
              >
                {props.bookmarks_list_name}{" "}
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="view all hikes in list"
                  className="bi bi-caret-down"
                ></i>
              </a>
            </div>

            <div className="d-flex float-end">
              <label className="sr-only">Add To List</label>
              <button
                className="btn btn-sm btn-outline-dark delete-btn"
                data-bs-toggle="modal"
                data-bs-target={`#modal-add-hikes-${props.bookmarks_list_id}`}
              >
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="add hikes to list"
                  className="bi bi-plus"
                  onClick={props.parentSetHikesOptionState}
                ></i>
              </button>
              &nbsp;
              <label className="sr-only">Rename List</label>
              <button
                className="btn btn-sm btn-outline-dark edit-btn"
                data-bs-toggle="modal"
                data-bs-target={`#modal-rename-bookmark-${props.bookmarks_list_id}`}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="rename list"
                    className="bi bi-pencil"
                  ></i>
                </small>
              </button>
              &nbsp;
              <label className="sr-only">Delete List</label>
              <button
                className="btn btn-sm btn-outline-dark delete-btn"
                type="submit"
                onClick={deleteConfirm}
              >
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="delete list"
                  className="bi bi-x"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="collapse card-body"
          id={`collapse-bookmarks-${props.bookmarks_list_id}`}
        >
          <div>{allHikeBookmarks}</div>
        </div>
      </div>
    </React.Fragment>
  );
});

function RenameBookmarksList(props) {
  const hike_id = document.querySelector("#hike_id");
  // Process renaming bookmarks list name
  const [bookmarksListName, setBookmarksListName] = React.useState(
    `${props.bookmarks_list_name}`
  );

  function editExistingBookmarksList() {
    fetch(`/edit-bookmarks-list/${props.bookmarks_list_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();
        if (hike_id !== null) {
          props.parentSetListOptionsState();
        }
      });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-rename-bookmark-${props.bookmarks_list_id}`}
        tabIndex="-1"
        aria-labelledby={`modal-rename-bookmark-${props.bookmarks_list_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-rename-bookmark-${props.bookmarks_list_id}-label`}
              >
                Rename List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body fw-300">
              <div className="mb-3">
                <label htmlFor="bookmarksListNameInput">List Name</label>
                <input
                  type="text"
                  className="form-control fw-300"
                  value={bookmarksListName}
                  onChange={(event) => setBookmarksListName(event.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block fw-300"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block fw-300"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function CreateBookmarksList(props) {
  const hike_id = document.querySelector("#hike_id");

  // Process creating a new bookmarks list
  const [bookmarksListName, setBookmarksListName] = React.useState("");

  // Validate form - need to make sure to validate each required item
  function validateBookmarksList() {
    const alertText = "Please complete the following:\n• input list name";

    if (bookmarksListName === "") {
      alert(alertText);
    } else {
      createNewBookmarksList();
    }
  }

  function createNewBookmarksList() {
    fetch("/create-bookmarks-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bookmarksListName,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getBookmarksLists();
        if (hike_id !== null) {
          props.parentSetListOptionsState();
        }
      });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={"modal-create-bookmarks-list"}
        tabIndex="-1"
        aria-labelledby={"modal-create-bookmarks-list-label"}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={"modal-create-bookmarks-list-label"}
              >
                Create List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body fw-300">
              <div className="mb-3">
                <label htmlFor="bookmarksListNameInput">List Name</label>
                <input
                  type="text"
                  className="form-control fw-300"
                  name="bookmarks-list-name"
                  placeholder="Hikes I Want To Visit"
                  value={bookmarksListName}
                  onChange={(event) => setBookmarksListName(event.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block fw-300"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={validateBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block fw-300"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const AddMultHikesToExistingList = React.forwardRef((props, ref) => {
  const session_login = document.querySelector("#login").innerText;

  // Set Hike options
  const [allHikesOptions, setAllHikesOptions] = React.useState("");

  React.useEffect(() => {
    setHikesOptionsState();
  }, []);

  function setHikesOptionsState() {
    fetch("/all_hikes.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { hikes } = jsonResponse;
        const allHikeOptions = [];

        hikes.map((responseHike) => {
          if (
            props.hikes.some((hike) => hike.hike_id === responseHike.hike_id)
          ) {
            allHikeOptions.push({
              select: true,
              hike_name: responseHike.hike_name,
              hike_id: responseHike.hike_id,
            });
          } else {
            allHikeOptions.push({
              select: false,
              hike_name: responseHike.hike_name,
              hike_id: responseHike.hike_id,
            });
          }
        });
        setAllHikesOptions(allHikeOptions);
      });
  }

  function addHikesToBookmarksList() {
    fetch(`/${props.bookmarks_list_id}/add-hikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        allHikesOptions, // returns list of objects
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.getBookmarksLists();
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-add-hikes-${props.bookmarks_list_id}`}
        tabIndex="-1"
        aria-labelledby={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`#modal-add-hikes-${props.bookmarks_list_id}-label`}
              >
                Add Hikes
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="hikesInput">
                  Hikes
                </label>
                <div style={{ height: "50vh", overflow: "auto" }}>
                  {allHikesOptions !== ""
                    ? allHikesOptions.map((hikeOption) => (
                        <div
                          className="form-check"
                          key={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                            value={hikeOption.hike_id}
                            checked={hikeOption.select}
                            onChange={(event) => {
                              let checked = event.target.checked;
                              setAllHikesOptions(
                                allHikesOptions.map((data) => {
                                  if (hikeOption.hike_id === data.hike_id) {
                                    data.select = checked;
                                  }
                                  return data;
                                })
                              );
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`add-hike-${hikeOption.hike_id}-to-list-${props.bookmarks_list_id}`}
                          >
                            {hikeOption.hike_name}
                          </label>
                        </div>
                      ))
                    : null}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-sm btn-outline-dark btn-block mt-4"
                  data-bs-dismiss="modal"
                  onClick={addHikesToBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block mt-4"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
