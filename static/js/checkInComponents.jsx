"use strict";

const CheckIn = (props) => {
  const route = document.querySelector("title").innerHTML;

  // Check if user wants to delete or not
  const deleteConfirm = () => {
    const validate = confirm("Do you want to delete this check in?");
    if (validate) {
      deleteExistingCheckIn(props.check_in_id);
    }
  };

  // Process deletion
  const deleteExistingCheckIn = (check_in_id) => {
    fetch(`/delete-check-in/${check_in_id}`, {
      method: "DELETE",
    }).then((response) => {
      response.json().then((jsonResponse) => {
        // console.log(jsonResponse);
        props.getCheckIns();

        if (route === "Dashboard") {
          props.refreshProfiles();
          props.parentGetGraphData();
          props.parentGetMapData();
        }
      });
    });
  };

  return (
    <React.Fragment>
      <div className="card card-body ms-4 mb-1 fw-300">
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
              className="btn btn-sm btn-outline-dark edit-btn"
              data-bs-toggle="modal"
              data-bs-target={`#modal-edit-check-in-${props.check_in_id}`}
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
            &nbsp;
            <button
              className="btn btn-sm btn-outline-dark delete-btn"
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
        <div className="fw-300">
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
};

const EditCheckIn = (props) => {
  const route = document.querySelector("title").innerHTML;

  const [petHikeStatus, setPetHikeStatus] = React.useState([]);
  const [dateHiked, setDateHiked] = React.useState(
    moment(props.date_hiked).format("YYYY-MM-DD")
  );
  const [milesCompleted, setMilesCompleted] = React.useState(
    props.miles_completed
  );
  const [totalTime, setTotalTime] = React.useState(props.total_time);
  const [notes, setNotes] = React.useState(props.notes);

  // get the pets that are on the check in and not on the check in to set initial state of addPet and removePet
  const setPetStates = () => {
    fetch(`/check_in/${props.check_in_id}.json`).then((response) =>
      response.json().then((jsonResponse) => {
        const { checkIn } = jsonResponse;
        const petsOnHike = checkIn.pets;
        const petsNotOnHike = checkIn.pets_not_on_hike;

        const petHikeStatus = [];

        petsOnHike.map((pet) => {
          petHikeStatus.push({
            select: true,
            pet_name: pet.pet_name,
            pet_id: pet.pet_id,
          });
        });

        petsNotOnHike.map((pet) => {
          petHikeStatus.push({
            select: false,
            pet_name: pet.pet_name,
            pet_id: pet.pet_id,
          });
        });

        setPetHikeStatus(petHikeStatus);
      })
    );
  };

  React.useEffect(() => {
    setPetStates();
  }, []);

  const editExistingCheckIn = () => {
    fetch(`/edit-check-in/${props.check_in_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        petHikeStatus,
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
        if (route === "Dashboard") {
          props.refreshProfiles();
          props.parentGetGraphData();
          props.parentGetMapData();
        }
      });
  };
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
                <label htmlFor="petIdInput">Pets</label>
                {petHikeStatus.map((pet) => (
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
                        setPetHikeStatus(
                          petHikeStatus.map((data) => {
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
                <textarea
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
};

const AddCheckIn = (props) => {
  const route = document.querySelector("title").innerHTML;
  const session_login = document.querySelector("#login").innerText;

  const [allHikeOptions, setHikeOptions] = React.useState([]);
  const [hikeId, setHikeId] = React.useState("");
  const [allPetOptions, setAllPetOptions] = React.useState([]);
  const [dateHiked, setDateHiked] = React.useState("");
  const [milesCompleted, setMilesCompleted] = React.useState("");
  const [totalTime, setTotalTime] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const getHikeOptions = () => {
    fetch("/all_hikes.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { hikes } = jsonResponse;
        setHikeOptions(hikes);
      });
  };

  const getPets = () => {
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
  };

  if (session_login === "True") {
    React.useEffect(() => {
      getPets();
      getHikeOptions();
    }, []);
  }

  // Validate form - need to make sure to validate each required item
  const validateCheckIn = () => {
    const petCheckBoxes = document.querySelectorAll(
      "input[name=add-check-in-pet_id]"
    );

    const alertText = "Please complete the following:";
    const hikeAlert = "\n• select a hike";
    const petsAlert = "\n• select at least one pet";
    const dateHikedAlert = "\n• input date hiked";
    const milesCompletedAlert = "\n• input miles completed";

    let atLeastOneChecked = false;
    for (let i = 0; i < petCheckBoxes.length; i++) {
      if (petCheckBoxes[i].checked) {
        atLeastOneChecked = true;
        break;
      }
    }

    if (
      hikeId === "" ||
      atLeastOneChecked === false ||
      dateHiked === "" ||
      milesCompleted === ""
    ) {
      let completeAlertText = [alertText];
      if (hikeId === "") {
        completeAlertText.push(hikeAlert);
      }
      if (atLeastOneChecked === false) {
        completeAlertText.push(petsAlert);
      }
      if (dateHiked === "") {
        completeAlertText.push(dateHikedAlert);
      }
      if (milesCompleted === "") {
        completeAlertText.push(milesCompletedAlert);
      }
      alert(completeAlertText.join(""));
    } else {
      addNewCheckIn();
    }
  };

  const addNewCheckIn = () => {
    fetch("/add-check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        hikeId,
        allPetOptions, // this will return a list of dictionary objects
        dateHiked,
        milesCompleted,
        totalTime,
        notes,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.getCheckIns();
        if (route === "Dashboard") {
          props.refreshProfiles();
          props.parentGetGraphData();
          props.parentGetMapData();
        }
        // console.log(jsonResponse);
      });
    });
  };

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
                Check in to a hike
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
                <div className="fw-300">Please log in to add a check in.</div>
              ) : (
                <div>
                  <div className="mb-3">
                    <label>Hike</label>&nbsp;
                    <small className="text-muted">*</small>
                    <select
                      id="hike-check-in"
                      name="hike-check-in"
                      className="form-select"
                      aria-label="hike-check-in"
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
                      name="date-hiked"
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
                      name="miles-completed"
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
};

const AddHikeCheckIn = (props) => {
  const session_login = document.querySelector("#login").innerText;

  const [allPetOptions, setAllPetOptions] = React.useState([]);
  const [dateHiked, setDateHiked] = React.useState("");
  const [milesCompleted, setMilesCompleted] = React.useState("");
  const [totalTime, setTotalTime] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const getPets = () => {
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
  };

  if (session_login === "True") {
    React.useEffect(() => {
      getPets();
    }, []);
  }

  // Validate form - need to make sure to validate each required item
  const validateCheckIn = () => {
    const petCheckBoxes = document.querySelectorAll(
      "input[name=add-check-in-pet_id]"
    );

    const alertText = "Please complete the following:";
    const petsAlert = "\n• select at least one pet";
    const dateHikedAlert = "\n• input date hiked";
    const milesCompletedAlert = "\n• input miles completed";

    let atLeastOneChecked = false;
    for (let i = 0; i < petCheckBoxes.length; i++) {
      if (petCheckBoxes[i].checked) {
        atLeastOneChecked = true;
        break;
      }
    }

    if (
      atLeastOneChecked === false ||
      dateHiked === "" ||
      milesCompleted === ""
    ) {
      let completeAlertText = [alertText];
      if (atLeastOneChecked === false) {
        completeAlertText.push(petsAlert);
      }
      if (dateHiked === "") {
        completeAlertText.push(dateHikedAlert);
      }
      if (milesCompleted === "") {
        completeAlertText.push(milesCompletedAlert);
      }
      alert(completeAlertText.join(""));
    } else {
      addNewCheckIn();
    }
  };

  const hike_id = document.querySelector("#hike_id").innerText;

  const addNewCheckIn = () => {
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
  };

  // console.log(allPetOptions);

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-hike-check-in"
        tabIndex="-1"
        aria-labelledby="modal-add-hike-check-in-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-hike-check-in-label">
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
                <div className="fw-300">Please log in to add a check in.</div>
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
};
