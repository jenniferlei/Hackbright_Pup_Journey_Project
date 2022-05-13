"use strict";

// comment body component with if session condition for edit and delete component
function Comment(props) {
  const session_login = document.querySelector("#login").innerText;
  const session_user_id = document.querySelector("#user_id").innerText;

  // Check if user wants to delete or not
  function deleteConfirm() {
    const validate = confirm("Do you want to delete this comment?");
    if (validate) {
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
          <div className="flex-truncate-text fw-300">
            {props.full_name}&nbsp;&nbsp;<i className="bi bi-chat-text"></i>
            &nbsp;&nbsp;
            <small>
              <a className="link-dark" href={`/hikes/${props.hike_id}`}>
                {props.hike_name}
              </a>
            </small>
          </div>

          <div className="clearfix fw-300">
            <div className="float-start">
              <small className="text-muted">
                posted {props.date_created}
                {props.edit == true ? (
                  <span> (edited {props.date_edited})</span>
                ) : null}
              </small>
            </div>

            {session_login === "True" &&
            Number(session_user_id) === Number(props.user_id) ? (
              <div className="d-flex float-end">
                <a
                  href=""
                  className="btn btn-sm btn-outline-dark edit-btn"
                  data-bs-toggle="modal"
                  data-bs-target={`#modal-edit-comment-${props.comment_id}`}
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
                &nbsp;
                <button
                  className="btn btn-sm btn-outline-dark delete-btn"
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

        <div className="card-body fw-300">{props.comment_body}</div>
      </div>
    </React.Fragment>
  );
}

function EditComment(props) {
  // Process edit
  const [commentBody, setCommentBody] = React.useState(props.comment_body);

  function editExistingComment() {
    fetch(`/edit-comment/${props.comment_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ commentBody }),
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
                  className="form-control fw-300"
                  name="body"
                  rows="3"
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block fw-300"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingComment}
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

// Add Hike Comment
function AddHikeComment(props) {
  const hikeId = document.querySelector("#hike_id").innerText;
  const session_login = document.querySelector("#login").innerText;

  const [commentBody, setCommentBody] = React.useState("");

  function validateComment() {
    const alertText = "Please complete the following:\n• input comment";

    if (commentBody === "") {
      alert(alertText);
    } else {
      addNewComment();
    }
  }

  function addNewComment() {
    fetch("/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ hikeId, commentBody }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.getComments();
        // console.log(jsonResponse);
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-hike-comment"
        tabIndex="-1"
        aria-labelledby="modal-add-hike-comment-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-hike-comment-label">
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
                <div className="fw-300">Please log in to add a comment.</div>
              ) : (
                <div>
                  <div className="mb-3">
                    <textarea
                      name="body"
                      rows="3"
                      className="form-control"
                      placeholder="Enter your comment here"
                      value={commentBody}
                      onChange={(event) => setCommentBody(event.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={validateComment}
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

// Add Hike Comment
function AddComment(props) {
  const session_login = document.querySelector("#login").innerText;

  const [allHikeOptions, setHikeOptions] = React.useState([]);
  const [commentBody, setCommentBody] = React.useState("");
  const [hikeId, setHikeId] = React.useState("");

  function getHikeOptions() {
    fetch("/all_hikes.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { hikes } = jsonResponse;
        setHikeOptions(hikes);
      });
  }

  if (session_login === "True") {
    React.useEffect(() => {
      getHikeOptions();
    }, []);
  }

  // Validate form - need to make sure to validate each required item
  function validateComment() {
    const alertText = "Please complete the following:";
    const hikeAlert = "\n• select a hike";
    const commentAlert = "\n• input comment";

    if (hikeId === "" || commentBody === "") {
      let completeAlertText = [alertText];
      if (hikeId === "") {
        completeAlertText.push(hikeAlert);
      }
      if (commentBody === "") {
        completeAlertText.push(commentAlert);
      }
      alert(completeAlertText.join(""));
    } else {
      addNewComment();
    }
  }

  function addNewComment() {
    fetch("/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ hikeId, commentBody }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.getComments();
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
                <div className="fw-300">Please log in to add a comment.</div>
              ) : (
                <div>
                  <div className="mb-3">
                    <label>Hike</label>&nbsp;
                    <small className="text-muted">*</small>
                    <select
                      id="hike-comment"
                      name="hike-comment"
                      className="form-select"
                      aria-label="hike-comment"
                      onChange={(event) => setHikeId(event.target.value)}
                    >
                      <option value=""></option>
                      {allHikeOptions.map((hike) => (
                        <option value={hike.hike_id} key={hike.hike_id}>
                          {hike.hike_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="body"
                      rows="3"
                      className="form-control"
                      placeholder="Enter your comment here"
                      value={commentBody}
                      onChange={(event) => setCommentBody(event.target.value)}
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={validateComment}
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
