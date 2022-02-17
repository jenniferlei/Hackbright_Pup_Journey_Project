"use strict";

// Add hike bookmark to existing bookmarks list OR new bookmarks list
// Delete or rename a bookmarks list
// Remove a hike from a bookmarks list

function HikeBookmark(props) {
  return <React.Fragment></React.Fragment>;
}

// comment body component with if session condition for edit and delete component
function BookmarkList(props) {
  // Process renaming bookmarks list name
  const [bookmarksListName, setBookmarksListName] = React.useState(
    props.bookmarks_list_name
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
      <div className="card mt-1">
        <div className="card-header">
          <div className="clearfix">
            <div className="left">
              <a
                className="btn btn-md accordion-button"
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
          <div>
            {allHikeBookmarks}
            {/* {% for hike in bookmarks_list.hikes|sort(attribute='hike_name') %}
                    <div className="row">
                        <div className="d-flex">
                        <form
                            action="/remove-hike"
                            method="POST">
                            <button
                            className="btn btn-sm"
                            style="padding:0"
                            type="submit"
                            name="delete"
                            value="{{ hike.hike_id }},{{ bookmarks_list.bookmarks_list_id }}"
                            onclick="return confirm('Do you want to remove this hike?');"
                            ><small>
                            <i data-bs-toggle="tooltip" data-bs-placement="right" title="remove from list" className="bi bi-x"></i>
                            </small></button>
                        </form>

                        &nbsp;&nbsp;&nbsp;

                        <a href="/hikes/{{ hike.hike_id }}" target="_blank">
                            {{ hike.hike_name }}
                        </a>
                        </div>
                    </div>
                    {% endfor %} */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function AddHikeToBookmarksList(props) {
  // option to add to existing bookmarks list OR create new list

  // For adding to new list

  const [bookmarksListName, setAllPetOptions] = React.useState("");

  // For adding to existing list
  const [allBookmarksListIdOptions, setAllBookmarksListIdOptions] =
    React.useState("");

  function getLists() {
    fetch("/user_bookmarks.json").then((response) =>
      response.json().then((jsonResponse) => {
        const { bookmarksLists } = jsonResponse;

        const allBookmarksListIdOptions = [];
        bookmarksLists.map((bookmarksList) => {
          allBookmarksListIdOptions.push({
            select: false,
            bookmarks_list_name: bookmarksList.bookmarks_list_name,
            bookmarks_list_id: bookmarksList.bookmarks_list_id,
          });
        });

        setAllBookmarksListIdOptions(allBookmarksListIdOptions);
      })
    );
  }

  React.useEffect(() => {
    getLists();
  }, []);

  //   // Validate form - need to make sure to validate each required item
  //   function validateCheckIn(evt) {
  //     const petCheckBoxes = document.querySelectorAll(
  //       "input[name=add-check-in-pet_id]"
  //     );
  //     let atLeastOneChecked = false;
  //     for (let i = 0; i < petCheckBoxes.length; i++) {
  //       if (petCheckBoxes[i].checked) {
  //         atLeastOneChecked = true;
  //         break;
  //       }
  //     }
  //     if (atLeastOneChecked === false) {
  //       alert("Please add a pet to the check in");
  //       evt.preventDefault();
  //     }

  //     addNewCheckIn();
  //   }
  // Add a POST request to hit the server /add-card endpoint and add a new card.
  // Make sure you pass in the data it is expecting. When this request finishes,
  // show an alert letting the user know they successfully added the card.
  const hike_id = document.querySelector("#hike_id").innerText;

  function addHikeToBookmarksList() {
    fetch(`/hikes/${hike_id}/add-hike-to-existing-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        allBookmarksListIdOptions,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.addHike();
        console.log(jsonResponse);
      });
    });
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
        props.addHike();
        console.log(jsonResponse);
      });
    });
  }

  console.log(allBookmarksListIdOptions);

  return <React.Fragment>
        <div className="modal fade" id="modal-add-bookmark" tabIndex="-1" aria-labelledby="modal-add-bookmark-label" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modal-add-bookmark-label">Bookmark this hike</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
 
                    <h4>Add to New Bookmark List</h4>

                    <div className="mb-3">
                        <input
                        type="text"
                        name="bookmarks_list_name"
                        className="form-control"
                        placeholder="Hikes I Want To Visit"
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <button
                        className="btn btn-sm btn-outline-dark btn-block"
                        type="submit"
                        name="hike_id"
                        value="{{ hike.hike_id }}"
                        data-bs-dismiss="modal"
                        >
                        Save
                        </button>
                    </div>

                    <h4>Add to Existing Bookmark List</h4>

                    <div className="mb-3">
                        <select name="bookmarks_list_id" className="form-control input-lg">
                        {allBookmarksListIdOptions.map((bookmarksListIdOption) => (
                        <option value={bookmarksListIdOption.bookmarks_list_id}>
                            {bookmarksListIdOption.bookmarks_list_name}
                        </option>))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <button
                        className="btn btn-sm btn-outline-dark btn-block"
                        type="submit"
                        name="hike_id"
                        value="{{ hike.hike_id }}"
                        data-bs-dismiss="modal"
                        >
                        Save
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary btn-block" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </React.Fragment>;
}

// comment container component
function BookmarksListContainer() {
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  // Now, we want to actually display the new card on the page.
  // However, displaying cards is handled by the parent component TradingCardContainer.
  // You will need to create a new function and pass it as a prop from TradingCardContainer
  // to AddTradingCard. This function should update the state of the TradingCardContainer component.
  // Passing a function may seem a little strange but this is a pretty common practice in React
  // when one component needs to update the state of another. It is known as “lifting state.”
  function addBookmarksList(
    bookmarks_list_id,
    bookmarks_list_name,
    hikes,
    user_id
  ) {
    const newBookmarksList = {
      bookmarks_list_id: bookmarks_list_id,
      bookmarks_list_name: bookmarks_list_name,
      hikes: hikes,
      user_id: user_id,
    }; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
    const currentBookmarksLists = [...bookmarksLists]; // makes a copy of cards. similar to doing currentCards = cards[:] in Python
    // [...currentCards, newCard] is an array containing all elements in currentCards followed by newCard
    setBookmarksLists([newBookmarksList, ...currentBookmarksLists]);
  }

  // Use getComments() to set comments to all current comments
  function editBookmarksList() {
    getCheckIns();
  }

  // Use getComments() to set comments to all current comments
  function deleteBookmarksList() {
    getCheckIns();
  }

  // We’re going to use a GET request to get our card data,
  // and then we’ll pass it to the setCards function to actually update the state of our component.
  // Let’s make an HTTP request to our server for the cards we should display.
  // To load initial data for a react component from the server, it’s typical to used a hook called useEffect.
  // This hook takes a function (a callback) as an argument, and it runs that function every time the component renders,
  // though we also have the ability to control when it happens if we want it to happen less often than that.
  const hike_id = document.querySelector("#hike_id").innerText;

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

  return (
    <React.Fragment>
      <AddBookmarksList addBookmarksList={addBookmarksList} />
      {allBookmarksLists}
    </React.Fragment>
  );
}

ReactDOM.render(
  <BookmarksContainer />,
  document.getElementById("react-bookmarks-container")
);

// <!-- Start Rename Bookmark Modal -->
//               <div className="modal fade" id="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}" tabindex="-1" aria-labelledby="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}-label" aria-hidden="true">
//                 <div className="modal-dialog">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title" id="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}-label">Rename Bookmark</h5>
//                       <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                     </div>
//                     <div className="modal-body">
//                       <form
//                         action="/edit-bookmarks-list"
//                         method="POST"
//                       >
//                         <div className="mb-3">
//                         <input
//                           type="text"
//                           name="bookmarks_list_name"
//                           className="form-control input-lg"
//                           value="{{ bookmarks_list.bookmarks_list_name }}"
//                           required
//                         />
//                       </div>

//                       <div className="modal-footer">
//                         <button className="btn btn-sm btn-outline-dark btn-block" type="submit" name="edit" value="{{ bookmarks_list.bookmarks_list_id }}">Save</button>
//                         <button type="button" className="btn btn-sm btn-secondary btn-block" data-bs-dismiss="modal">Close</button>
//                       </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <!-- End Rename Bookmark Modal -->
