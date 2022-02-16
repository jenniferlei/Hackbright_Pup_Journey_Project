"use strict";

// comment body component with if session condition for edit and delete component
function Comment(props) {
  // Process edit
  const comment = `${props.comment_body}`;
  const [comment_body, setCommentBody] = React.useState(comment);

  function someFunction() {
    editExistingComment(props.comment_id);
  }

  function editExistingComment(comment_id) {
    fetch(`/edit-comment/${comment_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ comment_body }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.editComment();
      });
  }

  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to delete this comment?");
    if (!validate) {
      event.preventDefault();
    } else {
      deleteExistingComment(props.comment_id);
    }
  }

  // Process deletion
  function deleteExistingComment(comment_id) {
    fetch(`/delete-comment/${comment_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        console.log(jsonResponse);
        props.deleteComment();
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-edit-comment-${props.comment_id}`}
        tabIndex="-1"
        aria-labelledby={`modal-edit-comment-${props.comment_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-edit-comment-${props.comment_id}-label`}
              >
                Edit Comment
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
                  className="form-control"
                  name="body"
                  value={comment_body}
                  onChange={(event) => setCommentBody(event.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={someFunction}
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
              {props.full_name}&nbsp;
              <small className="text-muted">
                posted {props.date_created}
                {props.edit == true ? (
                  <span>&nbsp;(edited {props.date_edited})</span>
                ) : null}
              </small>
            </div>

            {props.session_login === "True" &&
            Number(props.session_user_id) === Number(props.user_id) ? (
              <div className="d-flex right">
                <a
                  href=""
                  data-bs-toggle="modal"
                  data-bs-target={`#modal-edit-comment-${props.comment_id}`}
                  style={{ color: "rgb(44, 44, 44)" }}
                >
                  <small>
                    <i
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="edit comment"
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
                    title="delete comment"
                    className="bi bi-x"
                  ></i>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card-body">{props.comment_body}</div>
      </div>
    </React.Fragment>
  );
}

function AddComment(props) {
  // You’ll need an AJAX POST request to submit data to the server.
  // In order to access the user’s form data, you’ll access the component’s state.
  // To get what is currently typed in the name field, you can use the state value name.
  // To get what is currently typed in the skill field, you can use the state value skill.
  // Remember, the back-end of this feature is already implemented for you. There is a route called /add-card.
  // Review it if you need help configuring your form data correctly.
  const hike_id = document.querySelector("#hike_id").innerText;
  const add_comment_url = `/hikes/${hike_id}/add-comment`;
  const [comment_body, setCommentBody] = React.useState("");

  // Add a POST request to hit the server /add-card endpoint and add a new card.
  // Make sure you pass in the data it is expecting. When this request finishes,
  // show an alert letting the user know they successfully added the card.
  function addNewComment() {
    fetch(add_comment_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ comment_body }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        const commentAdded = jsonResponse.commentAdded; // same as commentAdded = jsonResponse.commentAdded
        const comment_id = commentAdded.comment_id;
        const full_name = commentAdded.user.full_name;
        const user_id = commentAdded.user_id;
        const date_created = commentAdded.date_created;
        const date_edited = commentAdded.date_edited;
        const edit = commentAdded.edit;
        const session_login = jsonResponse.login;
        const session_user_id = commentAdded.user_id;
        props.addComment(
          comment_id,
          comment_body,
          full_name,
          user_id,
          date_created,
          date_edited,
          edit,
          session_login,
          session_user_id
        );
        console.log(jsonResponse);
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-comment"
        tabIndex="-1"
        aria-labelledby="modal-add-comment-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-comment-label">
                Add a Comment
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
                  name="body"
                  className="form-control"
                  placeholder="Enter your comment here"
                  value={comment_body}
                  onChange={(event) => setCommentBody(event.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={addNewComment}
                >
                  Submit
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
    </React.Fragment>
  );
}

// comment container component
function CommentContainer() {
  const [comments, setComments] = React.useState([]);

  // Now, we want to actually display the new card on the page.
  // However, displaying cards is handled by the parent component TradingCardContainer.
  // You will need to create a new function and pass it as a prop from TradingCardContainer
  // to AddTradingCard. This function should update the state of the TradingCardContainer component.
  // Passing a function may seem a little strange but this is a pretty common practice in React
  // when one component needs to update the state of another. It is known as “lifting state.”
  function addComment(
    comment_id,
    comment_body,
    full_name,
    user_id,
    date_created,
    date_edited,
    edit,
    session_login,
    session_user_id
  ) {
    const newComment = {
      comment_id: comment_id,
      body: comment_body,
      user: { full_name: full_name },
      user_id: user_id,
      date_created: date_created,
      date_edited: date_edited,
      edit: edit,
      session_login: session_login,
      session_user_id: session_user_id,
    }; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
    const currentComments = [...comments]; // makes a copy of cards. similar to doing currentCards = cards[:] in Python
    // [...currentCards, newCard] is an array containing all elements in currentCards followed by newCard
    setComments([newComment, ...currentComments]);
  }

  // Use getComments() to set comments to all current comments
  function editComment() {
    getComments();
  }

  // Use getComments() to set comments to all current comments
  function deleteComment() {
    getComments();
  }

  // We’re going to use a GET request to get our card data,
  // and then we’ll pass it to the setCards function to actually update the state of our component.
  // Let’s make an HTTP request to our server for the cards we should display.
  // To load initial data for a react component from the server, it’s typical to used a hook called useEffect.
  // This hook takes a function (a callback) as an argument, and it runs that function every time the component renders,
  // though we also have the ability to control when it happens if we want it to happen less often than that.
  const hike_id = document.querySelector("#hike_id").innerText;
  const hike_json_url = `/hikes/${hike_id}/comments.json`;

  function getComments() {
    fetch(hike_json_url)
      .then((response) => response.json())
      .then((data) => setComments(data.comments));
  }

  React.useEffect(() => {
    getComments();
  }, []);

  const allComments = [];

  // the following line will print out the value of cards
  // pay attention to what it is initially and what it is when the component re-renders
  console.log(`comments: `, comments);

  for (const currentComment of comments) {
    const date_edited = new Date(currentComment.date_edited);
    const date_edited_formatted = `${date_edited.toLocaleDateString()} ${date_edited.toLocaleTimeString()}`;
    const date_created = new Date(currentComment.date_created);
    const date_created_formatted = `${date_created.toLocaleDateString()} ${date_created.toLocaleTimeString()}`;

    allComments.push(
      <Comment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        session_login={document.querySelector("#login").innerText}
        session_user_id={Number(document.querySelector("#user_id").innerText)}
        deleteComment={deleteComment}
        editComment={editComment}
      />
    );
  }

  return (
    <React.Fragment>
      <AddComment addComment={addComment} />
      {allComments}
    </React.Fragment>
  );
}

ReactDOM.render(
  <CommentContainer />,
  document.getElementById("react-comment-container")
);
