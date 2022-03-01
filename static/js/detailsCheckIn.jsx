"use strict";

// comment body component with if session condition for edit and delete component
function CheckIn(props) {
  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to delete this check in?");
    if (!validate) {
      event.preventDefault();
    } else {
      deleteExistingCheckIn(props.check_in_id);
    }
  }

  // Process deletion
  function deleteExistingCheckIn(check_in_id) {
    fetch(`/delete-check-in/${check_in_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        // console.log(jsonResponse);
        props.getCheckIns();
      });
    });
  }

  return (
    <React.Fragment>
      <div className="card card-body ms-4 mb-1">
        <div className="clearfix">
          <div className="float-start">
            <small>
              {props.pets_on_hike.map((pet) => (
                <span
                  key={`pet-id-${pet.pet_id}-check-in-id-${props.check_in_id}`}
                >
                  <i className="bi bi-check"></i>&nbsp;
                  {pet.pet_name}&nbsp;
                </span>
              ))}
            </small>
          </div>

          <div className="d-flex float-end">
            <a
              href=""
              data-bs-toggle="modal"
              data-bs-target={`#modal-edit-check-in-${props.check_in_id}`}
              style={{ color: "rgb(44, 44, 44)" }}
            >
              <small>
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="edit check in"
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
              <small>
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="delete check in"
                  className="bi bi-x"
                ></i>
              </small>
            </button>
          </div>
        </div>
        <div>
          <small>
            <a className="link-dark" href={`/hikes/${props.hike_id}`}>
              {props.hike_name}
            </a>
            <br></br>
            {`Hiked on ${props.date_hiked} | ${props.miles_completed} miles`}
            {props.total_time !== null ? (
              <React.Fragment>&nbsp;| {props.total_time} hours</React.Fragment>
            ) : null}
            <br></br>
            {props.notes !== null && props.notes !== "" ? (
              <React.Fragment>Notes: {props.notes}</React.Fragment>
            ) : null}
          </small>
        </div>
      </div>
    </React.Fragment>
  );
}

function EditCheckIn(props) {
  // Process edit

  const [addPet, setAddPet] = React.useState([]);
  const [removePet, setRemovePet] = React.useState([]);
  const [dateHiked, setDateHiked] = React.useState("");
  const [milesCompleted, setMilesCompleted] = React.useState("");
  const [totalTime, setTotalTime] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // get the pets that are on the check in and not on the check in to set initial state of addPet and removePet
  function setPetStates() {
    fetch(`/check_in/${props.check_in_id}.json`).then((response) =>
      response.json().then((jsonResponse) => {
        const { checkIn } = jsonResponse;
        const pets_on_hike = checkIn.pets;
        const pets_not_on_hike = checkIn.pets_not_on_hike;

        const addPet = [];
        const removePet = [];

        pets_on_hike.map((pet) => {
          removePet.push({
            select: false,
            pet_name: pet.pet_name,
            pet_id: pet.pet_id,
          });
        });

        pets_not_on_hike.map((pet) => {
          addPet.push({
            select: false,
            pet_name: pet.pet_name,
            pet_id: pet.pet_id,
          });
        });

        setAddPet(addPet);
        setRemovePet(removePet);
      })
    );
  }

  React.useEffect(() => {
    setPetStates();
  }, []);

  // console.log(addPet);
  // console.log(removePet);

  function editExistingCheckIn() {
    fetch(`/edit-check-in/${props.check_in_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        addPet, // this will return a list of dictionary objects
        removePet, // this will return a list of dictionary objects
        dateHiked,
        milesCompleted,
        totalTime,
        notes,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((jsonResponse) => {
        // console.log(jsonResponse);
        props.getCheckIns();
        setPetStates();
      });
  }
  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-edit-check-in-${props.check_in_id}`}
        tabIndex="-1"
        aria-labelledby={`modal-edit-check-in-${props.check_in_id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-edit-check-in-${props.check_in_id}-label`}
              >
                Edit check in to this hike
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
                <div className="row">
                  <div className="col">
                    <label htmlFor="petIdInput">Add a Pet</label>
                    {addPet.map((pet) => (
                      <div
                        className="form-check"
                        key={`add-${props.check_in_id}-${pet.pet_id}`}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={pet.pet_id}
                          id={`add-to-check-in-${props.check_in_id}-${pet.pet_id}`}
                          checked={pet.select}
                          onChange={(event) => {
                            let checked = event.target.checked;
                            setAddPet(
                              addPet.map((data) => {
                                if (pet.pet_id === data.pet_id) {
                                  data.select = checked;
                                }
                                return data;
                              })
                            );
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`add-to-check-in-${pet.pet_id}`}
                        >
                          {pet.pet_name}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="col">
                    <label htmlFor="pet_id">Remove a Pet</label>
                    {removePet.map((pet) => (
                      <div
                        className="form-check"
                        key={`remove-${props.check_in_id}-${pet.pet_id}`}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={pet.pet_id}
                          id={`remove-from-check-in-${pet.pet_id}`}
                          checked={pet.select}
                          onChange={(event) => {
                            let checked = event.target.checked;
                            setRemovePet(
                              removePet.map((data) => {
                                if (pet.pet_id === data.pet_id) {
                                  data.select = checked;
                                }
                                return data;
                              })
                            );
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`remove-from-check-in-${pet.pet_id}`}
                        >
                          {pet.pet_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="dateHikedInput">Date Hiked</label>
                &nbsp;<small className="text-muted">*</small>
                <input
                  type="date"
                  value={dateHiked}
                  onChange={(event) => setDateHiked(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="milesCompletedInput">Miles Completed</label>
                &nbsp;<small className="text-muted">*</small>
                <input
                  type="number"
                  step=".1"
                  min="0"
                  value={milesCompleted}
                  onChange={(event) => setMilesCompleted(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="totalTimeInput">Total Time (Hours)</label>
                <input
                  type="number"
                  step=".1"
                  min="0"
                  value={totalTime}
                  onChange={(event) => setTotalTime(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="notesInput">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={editExistingCheckIn}
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

function AddCheckIn(props) {
  const session_login = document.querySelector("#login").innerText;

  const [allPetOptions, setAllPetOptions] = React.useState([]);
  const [dateHiked, setDateHiked] = React.useState("");
  const [milesCompleted, setMilesCompleted] = React.useState("");
  const [totalTime, setTotalTime] = React.useState("");
  const [notes, setNotes] = React.useState("");

  function getPets() {
    fetch("/pets.json").then((response) =>
      response.json().then((jsonResponse) => {
        const { petProfiles } = jsonResponse;

        const allPetOptions = [];
        petProfiles.map((pet) => {
          allPetOptions.push({
            select: false,
            pet_name: pet.pet_name,
            pet_id: pet.pet_id,
          });
        });

        setAllPetOptions(allPetOptions);
      })
    );
  }

  if (session_login === "True") {
    React.useEffect(() => {
      getPets();
    }, []);
  }

  // Validate form - need to make sure to validate each required item
  function validateCheckIn(evt) {
    const petCheckBoxes = document.querySelectorAll(
      "input[name=add-check-in-pet_id]"
    );
    let atLeastOneChecked = false;
    for (let i = 0; i < petCheckBoxes.length; i++) {
      if (petCheckBoxes[i].checked) {
        atLeastOneChecked = true;
        break;
      }
    }
    if (atLeastOneChecked === false) {
      alert("Please add a pet to the check in");
      evt.preventDefault();
    }

    addNewCheckIn();
  }
  // Add a POST request to hit the server /add-card endpoint and add a new card.
  // Make sure you pass in the data it is expecting. When this request finishes,
  // show an alert letting the user know they successfully added the card.
  const hike_id = document.querySelector("#hike_id").innerText;

  function addNewCheckIn() {
    fetch(`/hikes/${hike_id}/add-check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        allPetOptions, // this will return a list of dictionary objects
        dateHiked,
        milesCompleted,
        totalTime,
        notes,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.getCheckIns();
        // console.log(jsonResponse);
      });
    });
  }

  // console.log(allPetOptions);

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-check-in"
        tabIndex="-1"
        aria-labelledby="modal-add-check-in-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-check-in-label">
                Check in to this hike
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
                <div>Please log in to add a check in.</div>
              ) : (
                <div>
                  <div className="mb-3">
                    <label>Pets</label>&nbsp;
                    <small className="text-muted">*</small>
                    {allPetOptions.map((pet) => (
                      <div
                        className="form-check"
                        key={`check-in-${pet.pet_id}`}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="add-check-in-pet_id"
                          value={pet.pet_id}
                          id={`check-in-${pet.pet_id}`}
                          checked={pet.select}
                          onChange={(event) => {
                            let checked = event.target.checked;
                            setAllPetOptions(
                              allPetOptions.map((data) => {
                                if (pet.pet_id === data.pet_id) {
                                  data.select = checked;
                                }
                                return data;
                              })
                            );
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`check-in-${pet.pet_id}`}
                        >
                          {pet.pet_name}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="dateHikedInput">Date Hiked</label>
                    &nbsp;<small className="text-muted">*</small>
                    <input
                      type="date"
                      value={dateHiked}
                      onChange={(event) => setDateHiked(event.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="milesCompletedInput">Miles Completed</label>
                    &nbsp;<small className="text-muted">*</small>
                    <input
                      type="number"
                      step=".1"
                      min="0"
                      value={milesCompleted}
                      onChange={(event) =>
                        setMilesCompleted(event.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="totalTimeInput">Total Time (Hours)</label>
                    <input
                      type="number"
                      step=".1"
                      min="0"
                      value={totalTime}
                      onChange={(event) => setTotalTime(event.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notesInput">Notes</label>
                    <textarea
                      id="notesInput"
                      rows="3"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-sm btn-outline-dark btn-block"
                      type="submit"
                      data-bs-dismiss="modal"
                      onClick={validateCheckIn}
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
                    <a
                      className="btn btn-sm dropdown-item"
                      href=""
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-check-in"
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
          <div className="ms-4">
            You have this hike on the following check ins:
          </div>
        ) : null}
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
