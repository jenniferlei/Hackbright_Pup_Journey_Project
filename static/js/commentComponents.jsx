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

            {session_login === "True" &&
            Number(session_user_id) === Number(props.user_id) ? (
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
                  className="form-control"
                  name="body"
                  rows="3"
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
