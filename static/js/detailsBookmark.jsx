"use strict";

// Hikes in a Bookmarks List Component
function HikeBookmark(props) {
  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to remove this hike from this list?");
    if (!validate) {
      event.preventDefault();
    } else {
      removeExistingHikeFromList();
    }
  }

  // Process deletion
  function removeExistingHikeFromList() {
    fetch(`/${props.bookmarks_list_id}/${props.hike_id}/remove-hike`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        props.removeHike();
      });
    });
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="d-flex">
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
          &nbsp;&nbsp;&nbsp;
          <a href={`/hikes/${props.hike_id}`} target="_blank">
            {props.hike_name}
          </a>
        </div>
      </div>
      <div class="row">
        <small>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {props.difficulty} | {props.miles} miles | {props.city}, {props.state}{" "}
          | {props.area} | {props.leash_rule} | {props.parking}
        </small>
      </div>
    </React.Fragment>
  );
}

// Bookmarks List Component
function BookmarksList(props) {
  const [hikes, setHikes] = React.useState([]);

  // Get all hikes for the bookmarks list
  function getHikes() {
    fetch(`/${props.bookmarks_list_id}/hikes.json`)
      .then((response) => response.json())
      .then((data) => {
        setHikes(data.bookmarksLists.hikes);
      });
  }

  // Initial render of all hikes in the bookmarks list
  React.useEffect(() => {
    getHikes();
  }, []);

  // When all hikes are set, make an array of HikeBookmark Components
  const allHikeBookmarks = [];

  // the following line will print out the hikes
  // pay attention to what it is initially and what it is when the component re-renders
  console.log(`hikes: `, hikes);

  for (const currentHike of hikes) {
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
        removeHike={removeHike}
        // addHikeExistingList={addHikeExistingList}
      />
    );
  }

  // Use getHikes() to set hikes when a hike is removed
  function removeHike() {
    getHikes();
  }

  // // Use getHikes() to set hikes when a hike is added to the list
  // function addHikeExistingList() {
  //   getHikes();
  // }

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
        props.editBookmarksList();
      });
  }

  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to delete this list?");
    if (!validate) {
      event.preventDefault();
    } else {
      deleteExistingBookmarksList();
    }
  }

  // Process deletion
  function deleteExistingBookmarksList() {
    fetch(`/delete-bookmarks-list/${props.bookmarks_list_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        props.deleteBookmarksList();
      });
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
                Rename Bookmark
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
                <input
                  type="text"
                  name="bookmarks_list_name"
                  className="form-control input-lg"
                  value={bookmarksListName}
                  onChange={(event) => setBookmarksListName(event.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingBookmarksList}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-1">
        <div className="card-header">
          <div className="clearfix">
            <div className="left">
              <a
                className="btn btn-md"
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

            <div className="d-flex right">
              <a
                href=""
                data-bs-toggle="modal"
                data-bs-target={`#modal-rename-bookmark-${props.bookmarks_list_id}`}
                style={{ color: "rgb(44, 44, 44)" }}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="rename list"
                    className="bi bi-pencil"
                  ></i>
                </small>
              </a>
              &nbsp;&nbsp;&nbsp;
              <button
                className="btn btn-sm"
                style={{ padding: 0 }}
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
}

// Bookmarks Lists Container Component
function BookmarksListContainer() {
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  function getBookmarksLists() {
    fetch(`/hikes/${hike_id}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
      });
  }

  React.useEffect(() => {
    getBookmarksLists();
  }, []);

  const hike_id = document.querySelector("#hike_id").innerText;

  const allBookmarksLists = [];

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
        deleteBookmarksList={deleteBookmarksList}
        editBookmarksList={editBookmarksList}
      />
    );
  }
  // function addHikeNewList(
  //   bookmarks_list_id,
  //   bookmarks_list_name,
  //   hikes,
  //   user_id
  // ) {
  //   const newBookmarksList = {
  //     bookmarks_list_id: bookmarks_list_id,
  //     bookmarks_list_name: bookmarks_list_name,
  //     hikes: hikes,
  //     user_id: user_id,
  //   }; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
  //   const currentBookmarksLists = [...bookmarksLists]; // makes a copy of cards. similar to doing currentCards = cards[:] in Python
  //   // [...currentCards, newCard] is an array containing all elements in currentCards followed by newCard
  //   setBookmarksLists([newBookmarksList, ...currentBookmarksLists]);
  // }

  // Use getBookmarksLists() to set bookmarks lists when a list is renamed
  function editBookmarksList() {
    getBookmarksLists();
  }

  // Use getBookmarksLists() to set bookmarks lists when a list is removed
  function deleteBookmarksList() {
    getBookmarksLists();
  }

  return (
    <React.Fragment>
      {/* <AddHikeToBookmarksList addHikeNewList={addHikeNewList} /> */}
      {allBookmarksLists}
    </React.Fragment>
  );
}

ReactDOM.render(
  <BookmarksListContainer />,
  document.getElementById("react-bookmarks-container")
);
