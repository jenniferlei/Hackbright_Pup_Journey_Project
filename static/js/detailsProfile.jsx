"use strict";

// comment body component with if session condition for edit and delete component
function PetProfile(props) {
  // Check if user wants to delete or not
  function deleteConfirm(event) {
    const validate = confirm("Do you want to delete this pet profile?");
    if (!validate) {
      event.preventDefault();
    } else {
      deleteExistingPetProfile();
    }
  }

  // Process deletion
  function deleteExistingPetProfile() {
    fetch(`/delete-check-in/${props.pet_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        // console.log(jsonResponse);
        props.refreshPets();
      });
    });
  }

  return (
    <React.Fragment>
      <div className="card mb-3" style={{ maxWidth: "540px" }}>
        <div className="row g-0">
          <div className="col-md-4">
            {props.pet_imgURL !== null ? (
              <div>
                <img
                  src={props.pet_imgURL}
                  alt="profile"
                  class="pet-profile-img"
                  id={`pet-img-${props.pet_id}`}
                />
              </div>
            ) : null}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div class="clearfix">
                <h5 className="card-title float-start">{props.pet_name}</h5>
                <div className="d-flex float-end">
                  <a
                    href=""
                    data-bs-toggle="modal"
                    data-bs-target="#modal-edit-{{ pet.pet_id }}"
                    style={{ color: "rgb(44, 44, 44)" }}
                  >
                    <small>
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="edit pet profile"
                        className="bi bi-pencil"
                      ></i>
                    </small>
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <form action="/delete-pet" method="POST">
                    <button
                      className="btn btn-sm"
                      style={{ padding: "0" }}
                      type="submit"
                      onClick={deleteConfirm}
                    >
                      <i
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="delete pet profile"
                        className="bi bi-x"
                      ></i>
                    </button>
                  </form>
                </div>
              </div>
              <p className="card-text">
                {props.breed !== null &&
                props.breed !== "" &&
                props.breed != "None" ? (
                  <div>
                    <small>{props.breed}</small>
                  </div>
                ) : null}

                {props.gender !== null && props.gender !== "" ? (
                  <div>
                    <small>{props.gender}</small>
                  </div>
                ) : null}

                {props.birthday !== null && props.birthday !== "" ? (
                  <div>
                    🎂&nbsp;&nbsp;<small>{props.birthday}</small>
                  </div>
                ) : null}

                {/* {% if pet.check_ins != [] %}
                  <div><small>I've done {{ pet.check_ins|length }} {% if pet.check_ins|length > 1 %} hikes{% else %} hike{% endif %}</small></div>
                  <div><small>and walked {{ pet.check_ins|sum(attribute="miles_completed") }} {% if pet.check_ins|sum(attribute="miles_completed") > 1 %} miles{% else %} mile{% endif %}!</small></div>
                  {% endif %} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function EditPetProfile(props) {
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

  function editExistingPetProfile() {
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
        props.refreshCheckIns();
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
                    <label htmlFor="pet_id">Add a Pet</label>
                    {addPet.map((pet) => (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={pet.pet_id}
                          id={`add-to-check-in-${pet.pet_id}`}
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
                      <div className="form-check">
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
                <label htmlFor="date_hiked">Date Hiked</label>
                &nbsp;<small className="text-muted">*</small>
                <input
                  type="date"
                  value={dateHiked}
                  onChange={(event) => setDateHiked(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="miles_completed">Miles Completed</label>
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
                <label htmlFor="total_time">Total Time (Hours)</label>
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
                <label htmlFor="notes">Notes</label>
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
        const { pets } = jsonResponse;

        const allPetOptions = [];
        pets.map((pet) => {
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
        props.refreshCheckIns();
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
                      <div className="form-check">
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
                    <label htmlFor="date_hiked">Date Hiked</label>
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
                    <label htmlFor="miles_completed">Miles Completed</label>
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
                    <label htmlFor="total_time">Total Time (Hours)</label>
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
                    <input
                      id="notesInput"
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
function CheckInContainer() {
  const [checkIns, setCheckIns] = React.useState([]);

  function refreshCheckIns() {
    getCheckIns();
  }

  const session_login = document.querySelector("#login").innerText;
  const hike_id = document.querySelector("#hike_id").innerText;

  function getCheckIns() {
    fetch(`/hikes/${hike_id}/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
      });
  }

  if (session_login === "True") {
    React.useEffect(() => {
      getCheckIns();
    }, []);
  }

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
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        refreshCheckIns={refreshCheckIns}
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
        refreshCheckIns={refreshCheckIns}
      />
    );
  }

  return (
    <React.Fragment>
      <AddCheckIn refreshCheckIns={refreshCheckIns} />
      {allEditCheckIns}
      <div
        className="offcanvas offcanvas-end"
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="CheckIns"
        aria-labelledby="CheckInsLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="CheckInsLabel">
            Check Ins
          </h3>
          View All
        </div>
        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div>Please log in to add a check in.</div>
          ) : (
            <div>
              <a
                className="btn btn-sm"
                href=""
                data-bs-toggle="modal"
                data-bs-target="#modal-add-check-in"
              >
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="add a check in"
                  className="bi bi-check-circle"
                ></i>{" "}
                add a check in
              </a>
              <div style={{ padding: "0.5em" }}>
                These are the check ins for this hike:
                {allCheckIns}
              </div>
            </div>
          )}
          <div
            class="offcanvas-footer"
            style={{
              position: "fixed",
              right: "355px",
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
}