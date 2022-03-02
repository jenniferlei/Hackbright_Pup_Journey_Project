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

            {props.session_login === "True" ? (
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

// comment container component
const HikeDetailsCommentContainer = React.forwardRef((props, ref) => {
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
