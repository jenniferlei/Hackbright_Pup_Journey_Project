"use strict";

// comment body component with if session condition for edit and delete component
function CheckIn(props) {
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
        props.editCheckIn();
      });
  }

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
        props.deleteCheckIn();
      });
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
                    <label htmlFor="pet_id" className="sr-only">
                      Add a Pet
                    </label>
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
                    <label htmlFor="pet_id" className="sr-only">
                      Remove a Pet
                    </label>
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
                <label htmlFor="date_hiked" className="sr-only">
                  Date Hiked
                </label>
                &nbsp;<small className="text-muted">*</small>
                <input
                  type="date"
                  value={dateHiked}
                  onChange={(event) => setDateHiked(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="miles_completed" className="sr-only">
                  Miles Completed
                </label>
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
                <label htmlFor="total_time" className="sr-only">
                  Total Time (Hours)
                </label>
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
                <label htmlFor="notes" className="sr-only">
                  Notes
                </label>
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

      <div className="card card-body mt-1">
        <div className="clearfix">
          <div className="float-start">
            🐾&nbsp;&nbsp;{" "}
            {props.pets_on_hike.map((pet) => `${pet.pet_name} | `)}
            {`hiked on ${props.date_hiked} | ${props.miles_completed} miles`}
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
        {props.total_time !== null ? (
          <div className="row">Total time: {props.total_time}</div>
        ) : null}
        {props.notes !== null && props.notes !== "" ? (
          <div className="row">Notes: {props.notes}</div>
        ) : null}
      </div>
    </React.Fragment>
  );
}

function AddCheckIn(props) {
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

  React.useEffect(() => {
    getPets();
  }, []);

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
        // const { checkInAdded } = jsonResponse; // same as checkInAdded = jsonResponse.checkInAdded
        // const hike_id = checkInAdded.hike_id;
        // const check_in_id = checkInAdded.check_in_id;
        // const date_hiked = checkInAdded.date_hiked;
        // const miles_completed = checkInAdded.miles_completed;
        // const total_time = checkInAdded.total_time;
        // const notes = checkInAdded.notes;
        // const pets_on_hike = checkInAdded.pets;
        // const pets_not_on_hike = checkInAdded.pets_not_on_hike;
        props
          .addCheckIn
          // hike_id,
          // check_in_id,
          // date_hiked,
          // miles_completed,
          // total_time,
          // notes
          // pets_on_hike,
          // pets_not_on_hike
          ();
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
              <div className="mb-3">
                <label className="sr-only">Pets</label>&nbsp;
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
                <label htmlFor="date_hiked" className="sr-only">
                  Date Hiked
                </label>
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
                <label htmlFor="miles_completed" className="sr-only">
                  Miles Completed
                </label>
                &nbsp;<small className="text-muted">*</small>
                <input
                  type="number"
                  step=".1"
                  min="0"
                  value={milesCompleted}
                  onChange={(event) => setMilesCompleted(event.target.value)}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="total_time" className="sr-only">
                  Total Time (Hours)
                </label>
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
                <label htmlFor="notesInput" className="sr-only">
                  Notes
                </label>
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
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// comment container component
function CheckInContainer() {
  const [checkIns, setCheckIns] = React.useState([]);

  // Now, we want to actually display the new card on the page.
  // However, displaying cards is handled by the parent component TradingCardContainer.
  // You will need to create a new function and pass it as a prop from TradingCardContainer
  // to AddTradingCard. This function should update the state of the TradingCardContainer component.
  // Passing a function may seem a little strange but this is a pretty common practice in React
  // when one component needs to update the state of another. It is known as “lifting state.”
  function addCheckIn() {
    getCheckIns();
  }

  // Use getComments() to set comments to all current comments
  function editCheckIn() {
    getCheckIns();
  }

  // Use getComments() to set comments to all current comments
  function deleteCheckIn() {
    getCheckIns();
  }

  // We’re going to use a GET request to get our card data,
  // and then we’ll pass it to the setCards function to actually update the state of our component.
  // Let’s make an HTTP request to our server for the cards we should display.
  // To load initial data for a react component from the server, it’s typical to used a hook called useEffect.
  // This hook takes a function (a callback) as an argument, and it runs that function every time the component renders,
  // though we also have the ability to control when it happens if we want it to happen less often than that.
  const hike_id = document.querySelector("#hike_id").innerText;

  function getCheckIns() {
    fetch(`/hikes/${hike_id}/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
      });
  }

  React.useEffect(() => {
    getCheckIns();
  }, []);

  const allCheckIns = [];

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
        deleteCheckIn={deleteCheckIn}
        editCheckIn={editCheckIn}
      />
    );
  }

  return (
    <React.Fragment>
      <AddCheckIn addCheckIn={addCheckIn} />
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
          <div style={{ padding: "0.5em" }}>
            These are the check ins for this hike:
            {allCheckIns}
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            style={{
              bottom: "1em",
              left: "1em",
              position: "absolute",
              float: "right",
            }}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </React.Fragment>
  );
}
