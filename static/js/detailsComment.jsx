"use strict";

// comment body component with if session condition for edit and delete component
function Comment(props) {
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
        // console.log(jsonResponse);
        props.getComments();
      });
    });
  }

  return (
    <React.Fragment>
      <div className="card ms-4 mb-1">
        <div className="card-header">
          <div className="clearfix">
            <div className="float-start">
              {props.full_name}&nbsp;<i className="bi bi-chat-text"></i>
              &nbsp;
              <small>
                <a className="link-dark" href={`/hikes/${props.hike_id}`}>
                  {props.hike_name}
                </a>
              </small>
              <small className="text-muted">
                <br></br>
                posted {props.date_created}
                {props.edit == true ? (
                  <span> (edited {props.date_edited})</span>
                ) : null}
              </small>
            </div>

            {props.session_login === "True" &&
            Number(props.session_user_id) === Number(props.user_id) ? (
              <div className="d-flex float-end">
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

function EditComment(props) {
  // Process edit
  const [comment_body, setCommentBody] = React.useState(props.comment_body);

  function editExistingComment() {
    fetch(`/edit-comment/${props.comment_id}`, {
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
        // console.log(jsonResponse);
        props.getComments();
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
                <textarea
                  className="form-control"
                  name="body"
                  rows="3"
                  value={comment_body}
                  onChange={(event) => setCommentBody(event.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingComment}
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
    </React.Fragment>
  );
}

function AddComment(props) {
  const hike_id = document.querySelector("#hike_id").innerText;
  const add_comment_url = `/hikes/${hike_id}/add-comment`;
  const session_login = document.querySelector("#login").innerText;

  const [comment_body, setCommentBody] = React.useState("");

  // Add a POST request to hit the server /add-card endpoint and add a new card.

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
        const hike_name = commentAdded.hike.hike_name;
        const hike_id = commentAdded.hike_id;
        props.addComment(
          comment_id,
          comment_body,
          full_name,
          user_id,
          date_created,
          date_edited,
          edit,
          session_login,
          session_user_id,
          hike_name,
          hike_id
        );
        // console.log(jsonResponse);
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
              {session_login !== "True" ? (
                <div>Please log in to add a comment.</div>
              ) : (
                <div>
                  <div className="mb-3">
                    <textarea
                      name="body"
                      rows="3"
                      className="form-control"
                      placeholder="Enter your comment here"
                      value={comment_body}
                      onChange={(event) => setCommentBody(event.target.value)}
                      required
                    ></textarea>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// comment container component
const HikeDetailsCommentContainer = React.forwardRef((props, ref) => {
  const [comments, setComments] = React.useState([]);

  function addComment(
    comment_id,
    comment_body,
    full_name,
    user_id,
    date_created,
    date_edited,
    edit,
    session_login,
    session_user_id,
    hike_name,
    hike_id
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
      hike: { hike_name: hike_name },
      hike_id: hike_id,
    }; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
    const currentComments = [...comments]; // makes a copy of cards. similar to doing currentCards = cards[:] in Python
    // [...currentCards, newCard] is an array containing all elements in currentCards followed by newCard
    setComments([newComment, ...currentComments]);
  }

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
        session_user_id={Number(document.querySelector("#user_id").innerText)}
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
      <AddComment addComment={addComment} />
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
                      data-bs-target="#modal-add-comment"
                    >
                      add a comment
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
                      view all comments
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
            <div>Please log in to add a comment.</div>
          ) : null}
          <div>{allComments}</div>

          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "613px",
              bottom: "1em",
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
